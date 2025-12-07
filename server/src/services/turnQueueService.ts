import { Redis } from 'ioredis';

export interface QueueUser {
    id: string;
    name: string;
    avatar: string;
}

export interface SessionTurnState {
    queue: QueueUser[];
    currentTurn: string | null;
    turnStartTime: number | null;
    beatData: boolean[][];
}

export class TurnQueueService {
    private redis: Redis;
    private readonly TURN_TIMEOUT = 30 * 1000; // 30 seconds

    constructor(redis: Redis) {
        this.redis = redis;
    }

    private getSessionKey(sessionId: string): string {
        return `session:${sessionId}:state`;
    }

    async getSessionState(sessionId: string): Promise<SessionTurnState | null> {
        const data = await this.redis.get(this.getSessionKey(sessionId));
        if (!data) return null;
        return JSON.parse(data);
    }

    async initializeSession(sessionId: string): Promise<SessionTurnState> {
        const state: SessionTurnState = {
            queue: [],
            currentTurn: null,
            turnStartTime: null,
            beatData: Array(8).fill(null).map(() => Array(16).fill(false)),
        };
        await this.setSessionState(sessionId, state);
        return state;
    }

    async setSessionState(sessionId: string, state: SessionTurnState): Promise<void> {
        await this.redis.set(
            this.getSessionKey(sessionId),
            JSON.stringify(state),
            'EX',
            60 * 60 * 24 // Expire after 24 hours
        );
    }

    async joinQueue(
        sessionId: string,
        user: QueueUser
    ): Promise<SessionTurnState> {
        let state = await this.getSessionState(sessionId);
        if (!state) {
            state = await this.initializeSession(sessionId);
        }

        // Check if already in queue
        if (state.queue.find(u => u.id === user.id)) {
            return state;
        }

        // Add to queue
        state.queue.push(user);

        // If no one has turn, give it to this user
        if (!state.currentTurn) {
            state.currentTurn = user.id;
            state.turnStartTime = Date.now();
        }

        await this.setSessionState(sessionId, state);
        return state;
    }

    async leaveQueue(
        sessionId: string,
        userId: string
    ): Promise<SessionTurnState | null> {
        const state = await this.getSessionState(sessionId);
        if (!state) return null;

        // Remove from queue
        state.queue = state.queue.filter(u => u.id !== userId);

        // If current user had the turn, pass it to next
        if (state.currentTurn === userId) {
            const nextUser = state.queue[0];
            if (nextUser) {
                state.currentTurn = nextUser.id;
                state.turnStartTime = Date.now();
            } else {
                state.currentTurn = null;
                state.turnStartTime = null;
            }
        }

        await this.setSessionState(sessionId, state);
        return state;
    }

    async finishTurn(sessionId: string, userId: string): Promise<SessionTurnState | null> {
        const state = await this.getSessionState(sessionId);
        if (!state || state.currentTurn !== userId) return null;

        // Move current user to end of queue (round-robin)
        const currentUser = state.queue.find(u => u.id === userId);
        if (currentUser) {
            state.queue = state.queue.filter(u => u.id !== userId);
            state.queue.push(currentUser);
        }

        // Give turn to next person
        const nextUser = state.queue[0];
        if (nextUser) {
            state.currentTurn = nextUser.id;
            state.turnStartTime = Date.now();
        } else {
            state.currentTurn = null;
            state.turnStartTime = null;
        }

        await this.setSessionState(sessionId, state);
        return state;
    }

    async updateBeatData(
        sessionId: string,
        userId: string,
        beatData: boolean[][]
    ): Promise<{ success: boolean; state: SessionTurnState | null }> {
        const state = await this.getSessionState(sessionId);
        if (!state) {
            return { success: false, state: null };
        }

        // Validate that it's this user's turn
        if (state.currentTurn !== userId) {
            return { success: false, state };
        }

        // Update beat data
        state.beatData = beatData;
        await this.setSessionState(sessionId, state);

        return { success: true, state };
    }

    async checkTurnTimeout(sessionId: string): Promise<{
        timedOut: boolean;
        state: SessionTurnState | null;
    }> {
        const state = await this.getSessionState(sessionId);
        if (!state || !state.currentTurn || !state.turnStartTime) {
            return { timedOut: false, state };
        }

        const elapsed = Date.now() - state.turnStartTime;
        if (elapsed >= this.TURN_TIMEOUT) {
            // Timeout occurred, force finish turn
            const newState = await this.finishTurn(sessionId, state.currentTurn);
            return { timedOut: true, state: newState };
        }

        return { timedOut: false, state };
    }

    async getTurnTimeRemaining(sessionId: string): Promise<number> {
        const state = await this.getSessionState(sessionId);
        if (!state || !state.turnStartTime) return 0;

        const elapsed = Date.now() - state.turnStartTime;
        const remaining = Math.max(0, this.TURN_TIMEOUT - elapsed);
        return Math.ceil(remaining / 1000); // Return seconds
    }
}
