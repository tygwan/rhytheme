'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Track {
    id: string;
    title: string;
    description: string | null;
    sessionId: string;
    audioUrl: string | null;
    beatData: boolean[][];
    creatorId: string;
    likes: number;
    plays: number;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    creator: {
        id: string;
        username: string;
    };
    session: {
        id: string;
        title: string;
    };
}

export default function GalleryPage() {
    const router = useRouter();
    const { user, accessToken } = useAuth();
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<'createdAt' | 'likes' | 'plays'>('createdAt');

    useEffect(() => {
        fetchTracks();
    }, [sortBy]);

    const fetchTracks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tracks?orderBy=${sortBy}&isPublic=true`, {
                headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
            });

            if (response.ok) {
                const data = await response.json();
                setTracks(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch tracks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (trackId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const response = await fetch(`${API_URL}/api/tracks/${trackId}/like`, {
                method: 'POST',
            });

            if (response.ok) {
                const data = await response.json();
                setTracks((prev) =>
                    prev.map((track) => (track.id === trackId ? data.data : track))
                );
            }
        } catch (err) {
            console.error('Failed to like track:', err);
        }
    };

    const handlePlay = async (trackId: string) => {
        try {
            await fetch(`${API_URL}/api/tracks/${trackId}/play`, {
                method: 'POST',
            });

            setTracks((prev) =>
                prev.map((track) =>
                    track.id === trackId ? { ...track, plays: track.plays + 1 } : track
                )
            );
        } catch (err) {
            console.error('Failed to increment play count:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-blue-900 px-4 py-12">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Gallery</h1>
                        <p className="text-gray-400">Explore tracks created by the community</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 bg-white/10 backdrop-blur-lg text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex items-center gap-4">
                    <span className="text-gray-400">Sort by:</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSortBy('createdAt')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                sortBy === 'createdAt'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                        >
                            Recent
                        </button>
                        <button
                            onClick={() => setSortBy('likes')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                sortBy === 'likes'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                        >
                            Most Liked
                        </button>
                        <button
                            onClick={() => setSortBy('plays')}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                sortBy === 'plays'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                            }`}
                        >
                            Most Played
                        </button>
                    </div>
                </div>

                {/* Tracks Grid */}
                {loading ? (
                    <div className="text-center text-white">Loading tracks...</div>
                ) : tracks.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 mb-4">No tracks yet</p>
                        <Link
                            href="/dashboard"
                            className="text-purple-400 hover:text-purple-300"
                        >
                            Create your first track
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tracks.map((track) => (
                            <div
                                key={track.id}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/20 transition-all"
                            >
                                {/* Beat Pattern Visualization */}
                                <div className="mb-4 bg-black/30 rounded-lg p-4">
                                    <div className="grid grid-cols-16 gap-1">
                                        {track.beatData.map((row, rowIdx) =>
                                            row.map((beat, colIdx) => (
                                                <div
                                                    key={`${rowIdx}-${colIdx}`}
                                                    className={`w-2 h-2 rounded-sm ${
                                                        beat ? 'bg-purple-500' : 'bg-white/10'
                                                    }`}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Track Info */}
                                <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                                {track.description && (
                                    <p className="text-sm text-gray-400 mb-3">{track.description}</p>
                                )}

                                <div className="space-y-1 text-sm text-gray-400 mb-4">
                                    <p>By: {track.creator.username}</p>
                                    <p>Session: {track.session.title}</p>
                                    <p>Created: {new Date(track.createdAt).toLocaleDateString()}</p>
                                </div>

                                {/* Stats & Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <span>❤️</span>
                                            <span className="text-gray-400">{track.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>▶️</span>
                                            <span className="text-gray-400">{track.plays}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleLike(track.id, e)}
                                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-all text-sm"
                                        >
                                            Like
                                        </button>
                                        <button
                                            onClick={() => {
                                                handlePlay(track.id);
                                                router.push(`/session/${track.sessionId}`);
                                            }}
                                            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all text-sm"
                                        >
                                            Play
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
