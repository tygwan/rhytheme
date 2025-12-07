'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function AuthCallbackContent() {
    const router = useRouter();

    useEffect(() => {
        // Check if user cookie exists (set by backend)
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const userCookie = getCookie('user');

        if (userCookie) {
            // Tokens are stored in httpOnly cookies, user info is readable
            try {
                const user = JSON.parse(decodeURIComponent(userCookie));
                console.log('User authenticated:', user.email);

                // Redirect to dashboard
                router.push('/dashboard');
            } catch (error) {
                console.error('Failed to parse user cookie:', error);
                router.push('/login');
            }
        } else {
            // If no user cookie, redirect to login
            setTimeout(() => router.push('/login'), 2000);
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-white text-lg">로그인 중...</p>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return <AuthCallbackContent />;
}
