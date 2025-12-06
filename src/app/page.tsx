import Link from 'next/link';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tighter">
            Rhythme<span className="text-purple-500">.</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-neutral-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Gallery
            </Link>
            <Link href="https://github.com/tygwan/rhytheme" target="_blank" className="hover:text-white transition-colors">
              GitHub
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-neutral-950 to-neutral-950" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-purple-400 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Live Collaboration Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Let the Rhythm <br />
            <span className="text-purple-500">Lead You</span> Together.
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create music collaboratively in real-time. Join a session, wait for your turn,
            and add your beat to the collective rhythm.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/25">
              Start New Session
            </button>
            <button className="px-8 py-4 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-white font-medium transition-all">
              Browse Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Active Sessions Grid */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold mb-2">Live Sessions</h2>
              <p className="text-neutral-400">Join an active room and start making beats.</p>
            </div>
            <Link href="/sessions" className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              View all &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mock Session Cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-purple-500/30 transition-all hover:bg-neutral-900">
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-neutral-500 font-mono">4/8</span>
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  Lo-Fi Chill Beats #{i}
                </h3>
                <p className="text-sm text-neutral-400 mb-6 line-clamp-2">
                  Relaxing vibes only. 90 BPM. Piano and soft drums.
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((u) => (
                      <div key={u} className="w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-900 flex items-center justify-center text-xs text-neutral-500">
                        U{u}
                      </div>
                    ))}
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors">
                    Join Queue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-neutral-900/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-6 text-2xl">
                🎮
              </div>
              <h3 className="text-lg font-bold mb-3">Turn-Based</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                No chaos. Add your beats when it's your turn.
                Respect the rhythm and the queue.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-6 text-2xl">
                🎹
              </div>
              <h3 className="text-lg font-bold mb-3">Web Sequencer</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Powerful 16-step sequencer with 8 instruments.
                Built right into your browser.
              </p>
            </div>
            <div>
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-6 text-2xl">
                🌍
              </div>
              <h3 className="text-lg font-bold mb-3">Global Stage</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Save your collaborative tracks to the gallery
                and share them with the world.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
