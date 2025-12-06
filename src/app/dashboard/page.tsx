'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Session {
    id: string;
    title: string;
    maxUsers: number;
    isActive: boolean;
    isPublic: boolean;
    creatorId: string;
    participants: string[];
    createdAt: string;
    updatedAt: string;
    creator: {
        id: string;
        username: string;
    };
    _count: {
        tracks: number;
    };
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, accessToken, isLoading, isAuthenticated } = useAuth();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newSessionTitle, setNewSessionTitle] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [maxUsers, setMaxUsers] = useState(8);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isLoading, isAuthenticated, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchSessions();
        }
    }, [isAuthenticated]);

    const fetchSessions = async () => {
        try {
            const response = await fetch(`${API_URL}/api/sessions`, {
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            });

            if (response.ok) {
                const data = await response.json();
                setSessions(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        } finally {
            setLoadingSessions(false);
        }
    };

    const handleCreateSession = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newSessionTitle.trim()) {
            setError('Title is required');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/sessions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    title: newSessionTitle,
                    isPublic,
                    maxUsers,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error?.message || 'Failed to create session');
            }

            const data = await response.json();
            setShowCreateModal(false);
            setNewSessionTitle('');
            setIsPublic(true);
            setMaxUsers(8);
            router.push(`/session/${data.data.id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create session');
        }
    };

    const handleJoinSession = async (sessionId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/sessions/${sessionId}/join`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to join session');
            }

            router.push(`/session/${sessionId}`);
        } catch (err) {
            console.error('Failed to join session:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 px-4 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {user?.username}!</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                            Create Session
                        </button>
                        <Link
                            href="/gallery"
                            className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                        >
                            Gallery
                        </Link>
                    </div>
                </div>

                {/* Sessions Grid */}
                {loadingSessions ? (
                    <div className="text-center text-white">Loading sessions...</div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No sessions yet</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="text-purple-400 hover:text-purple-300"
                        >
                            Create your first session
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all cursor-pointer"
                                onClick={() => router.push(`/session/${session.id}`)}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-xl font-bold text-white">{session.title}</h3>
                                    {session.isPublic ? (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
                                            Public
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded">
                                            Private
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-400">
                                    <p>Created by: {session.creator.username}</p>
                                    <p>
                                        Participants: {session.participants.length}/{session.maxUsers}
                                    </p>
                                    <p>Tracks: {session._count.tracks}</p>
                                    <p>Status: {session.isActive ? 'Active' : 'Inactive'}</p>
                                </div>

                                <div className="mt-4">
                                    {session.participants.includes(user?.id || '') ? (
                                        <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                                            Continue
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleJoinSession(session.id);
                                            }}
                                            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                        >
                                            Join Session
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Session Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md w-full">
                            <h2 className="text-2xl font-bold text-white mb-6">Create New Session</h2>

                            <form onSubmit={handleCreateSession} className="space-y-4">
                                {error && (
                                    <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                                        Session Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={newSessionTitle}
                                        onChange={(e) => setNewSessionTitle(e.target.value)}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="My Awesome Beat Session"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-300 mb-2">
                                        Max Users
                                    </label>
                                    <input
                                        id="maxUsers"
                                        type="number"
                                        min="2"
                                        max="8"
                                        value={maxUsers}
                                        onChange={(e) => setMaxUsers(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="isPublic"
                                        type="checkbox"
                                        checked={isPublic}
                                        onChange={(e) => setIsPublic(e.target.checked)}
                                        className="w-4 h-4 text-purple-600 bg-white/5 border-white/10 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="isPublic" className="ml-2 text-sm text-gray-300">
                                        Make this session public
                                    </label>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setError('');
                                        }}
                                        className="flex-1 py-3 px-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
