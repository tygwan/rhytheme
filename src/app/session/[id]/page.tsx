'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import BeatSequencer from '@/components/BeatSequencer';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const AVATARS = ['🎹', '🎸', '🥁', '🎷', '🎺', '🎻', '🎤', '🎧'];

export default function SessionRoom() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const { socket, isConnected } = useSocket(sessionId);
    const { user, accessToken, isAuthenticated } = useAuth();
    const [grid, setGrid] = useState<boolean[][] | null>(null);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [trackTitle, setTrackTitle] = useState('');
    const [trackDescription, setTrackDescription] = useState('');
    const [saveError, setSaveError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Real Queue State
    const [queue, setQueue] = useState<{ id: string; name: string; avatar: string }[]>([]);
    const [currentTurnId, setCurrentTurnId] = useState<string | null>(null);

    const [timeLeft, setTimeLeft] = useState(30);

    // Derived state
    const isMyTurn = socket?.id === currentTurnId;
    const isInQueue = queue.some(u => u.id === socket?.id);

    // Handle incoming updates
    useEffect(() => {
        if (!socket) return;

        socket.on('beat-update', (newGrid: boolean[][]) => {
            setGrid(newGrid);
        });

        socket.on('queue-update', ({ queue, currentTurn }) => {
            console.log('Queue update:', queue, currentTurn);
            setQueue(queue);
            setCurrentTurnId(currentTurn);
            // Reset timer if turn changed (simplified logic)
            setTimeLeft(30);
        });

        return () => {
            socket.off('beat-update');
            socket.off('queue-update');
        };
    }, [socket]);

    // Handle local beat changes
    const handleBeatChange = useCallback((newGrid: boolean[][]) => {
        if (socket && isMyTurn) {
            socket.emit('beat-update', { sessionId, grid: newGrid });
        }
        setGrid(newGrid);
    }, [socket, sessionId, isMyTurn]);

    // Timer simulation (only visual for now)
    useEffect(() => {
        if (!currentTurnId) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [currentTurnId]);

    const handleJoinQueue = () => {
        if (!socket) return;
        const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
        const randomName = `User ${Math.floor(Math.random() * 1000)}`;
        socket.emit('join-queue', { sessionId, name: randomName, avatar: randomAvatar });
    };

    const handleFinishTurn = () => {
        if (!socket) return;
        socket.emit('finish-turn', sessionId);
    };

    const handleSaveTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaveError('');

        if (!trackTitle.trim()) {
            setSaveError('Title is required');
            return;
        }

        if (!grid) {
            setSaveError('No beat data to save');
            return;
        }

        if (!isAuthenticated || !accessToken) {
            setSaveError('You must be logged in to save tracks');
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(`${API_URL}/api/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    title: trackTitle,
                    description: trackDescription || undefined,
                    sessionId,
                    beatData: grid,
                    isPublic: true,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error?.message || 'Failed to save track');
            }

            const data = await response.json();
            setShowSaveModal(false);
            setTrackTitle('');
            setTrackDescription('');

            // Redirect to gallery to view the saved track
            router.push('/gallery');
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : 'Failed to save track');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white flex flex-col">
            {/* Header */}
            <header className="h-16 border-b border-white/10 bg-neutral-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-neutral-400 hover:text-white transition-colors">
                        &larr; Exit
                    </Link>
                    <h1 className="text-lg font-bold">
                        Session <span className="text-purple-500">#{sessionId}</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </span>
                        {isConnected ? (
                            <span className="text-xs text-green-500 font-mono">Connected</span>
                        ) : (
                            <span className="text-xs text-red-500 font-mono">Disconnected</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {queue.slice(0, 4).map((u, i) => (
                            <div key={u.id} className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xs">
                                {u.avatar}
                            </div>
                        ))}
                    </div>
                    {isAuthenticated && grid && (
                        <button
                            onClick={() => setShowSaveModal(true)}
                            className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-colors"
                        >
                            Save Track
                        </button>
                    )}
                    <button className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-neutral-200 transition-colors">
                        Share
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Queue & Chat */}
                <aside className="w-80 border-r border-white/10 bg-neutral-900/30 flex flex-col hidden lg:flex">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Queue ({queue.length})</h2>
                        <div className="space-y-3">
                            {queue.length === 0 && (
                                <div className="text-center py-8 text-neutral-500 text-sm">
                                    Queue is empty.<br />Be the first to join!
                                </div>
                            )}
                            {queue.map((user, index) => {
                                const isCurrentTurn = user.id === currentTurnId;
                                return (
                                    <div
                                        key={user.id}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isCurrentTurn
                                                ? 'bg-purple-500/10 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                : 'bg-neutral-800/50 border-transparent'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-lg">
                                            {user.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className={`font-medium ${isCurrentTurn ? 'text-purple-400' : 'text-neutral-300'}`}>
                                                    {user.name} {user.id === socket?.id && '(You)'}
                                                </span>
                                                {isCurrentTurn && (
                                                    <span className="text-xs font-mono text-purple-400 animate-pulse">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            {isCurrentTurn && (
                                                <div className="w-full h-1 bg-neutral-700 rounded-full mt-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: "100%" }}
                                                        animate={{ width: "0%" }}
                                                        transition={{ duration: 30, ease: "linear" }}
                                                        className="h-full bg-purple-500"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs font-mono text-neutral-500">
                                            #{index + 1}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {!isInQueue && (
                            <button
                                onClick={handleJoinQueue}
                                className="w-full mt-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Join Queue
                            </button>
                        )}
                    </div>

                    <div className="flex-1 p-4">
                        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">Activity</h2>
                        <div className="space-y-4 text-sm text-neutral-400">
                            <p><span className="text-purple-400">User 1</span> added a Kick beat.</p>
                            <p><span className="text-blue-400">User 2</span> changed BPM to 128.</p>
                            <p><span className="text-green-400">User 3</span> joined the session.</p>
                        </div>
                    </div>
                </aside>

                {/* Main Content - Sequencer */}
                <div className="flex-1 relative flex flex-col">
                    {/* Turn Notification Overlay */}
                    <AnimatePresence>
                        {isMyTurn && (
                            <motion.div
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -50, opacity: 0 }}
                                className="absolute top-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-full bg-purple-500 text-white font-bold shadow-lg flex items-center gap-3"
                            >
                                <span className="animate-pulse">🔴 It's Your Turn!</span>
                                <span className="font-mono bg-black/20 px-2 py-0.5 rounded">{timeLeft}s</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
                        <BeatSequencer
                            isReadOnly={!isMyTurn}
                            onBeatChange={handleBeatChange}
                        />
                    </div>

                    {/* Bottom Controls for Mobile/Tablet */}
                    <div className="lg:hidden p-4 border-t border-white/10 bg-neutral-900">
                        <button
                            onClick={handleJoinQueue}
                            className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold"
                        >
                            {isInQueue ? (isMyTurn ? "Finish Turn" : "Waiting...") : "Join Queue"}
                        </button>
                    </div>

                    {/* Turn Action Bar */}
                    {isMyTurn && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                            <button
                                onClick={handleFinishTurn}
                                className="px-8 py-3 rounded-full bg-green-500 hover:bg-green-400 text-black font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105"
                            >
                                Commit Changes & Finish Turn
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Save Track Modal */}
            {showSaveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold text-white mb-6">Save Track to Gallery</h2>

                        <form onSubmit={handleSaveTrack} className="space-y-4">
                            {saveError && (
                                <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                    {saveError}
                                </div>
                            )}

                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                    Track Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    value={trackTitle}
                                    onChange={(e) => setTrackTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="My Awesome Beat"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    value={trackDescription}
                                    onChange={(e) => setTrackDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Describe your track..."
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowSaveModal(false);
                                        setSaveError('');
                                    }}
                                    className="flex-1 py-3 px-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save Track'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
