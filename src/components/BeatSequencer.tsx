'use client';

import { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { motion } from 'framer-motion';

// Instrument Types
type InstrumentType = 'Kick' | 'Snare' | 'HiHat' | 'Clap' | 'Tom' | 'Synth' | 'Bass' | 'Perc';

interface BeatSequencerProps {
    initialBpm?: number;
    onBeatChange?: (grid: boolean[][]) => void;
    isReadOnly?: boolean;
}

const INSTRUMENTS: InstrumentType[] = ['Kick', 'Snare', 'HiHat', 'Clap', 'Tom', 'Synth', 'Bass', 'Perc'];
const STEPS = 16;

export default function BeatSequencer({
    initialBpm = 120,
    onBeatChange,
    isReadOnly = false
}: BeatSequencerProps) {
    // State
    const [grid, setGrid] = useState<boolean[][]>(
        Array(INSTRUMENTS.length).fill(null).map(() => Array(STEPS).fill(false))
    );
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [bpm, setBpm] = useState(initialBpm);
    const [isLoaded, setIsLoaded] = useState(false);

    // Refs for Tone.js objects
    const players = useRef<any[]>([]);
    const sequencer = useRef<Tone.Sequence | null>(null);

    // Initialize Audio Engine
    useEffect(() => {
        const loadAudio = async () => {
            // Initialize Synths for Drum Sounds
            // Kick
            const kick = new Tone.MembraneSynth({
                pitchDecay: 0.05,
                octaves: 10,
                oscillator: { type: "sine" },
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4, attackCurve: "exponential" }
            }).toDestination();

            // Snare (NoiseSynth for snappy sound)
            const snare = new Tone.NoiseSynth({
                noise: { type: "white" },
                envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
            }).toDestination();

            // HiHat (MetalSynth for metallic sound)
            const hihat = new Tone.MetalSynth({
                envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
                harmonicity: 5.1,
                modulationIndex: 32,
                resonance: 4000,
                octaves: 1.5
            }).toDestination();
            hihat.volume.value = -10;

            // Clap (Simulated with NoiseSynth)
            const clap = new Tone.NoiseSynth({
                noise: { type: "pink" },
                envelope: { attack: 0.001, decay: 0.3, sustain: 0 }
            }).toDestination();

            // Tom (MembraneSynth for deep tom sound)
            const tom = new Tone.MembraneSynth({
                pitchDecay: 0.08,
                octaves: 4,
                oscillator: { type: "sine" },
                envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
            }).toDestination();

            // Synth (Simple PolySynth)
            const synth = new Tone.PolySynth(Tone.Synth).toDestination();
            synth.volume.value = -10;

            // Bass (MonoSynth)
            const bass = new Tone.MonoSynth({
                oscillator: { type: "square" },
                envelope: { attack: 0.1 }
            }).toDestination();
            bass.volume.value = -10;

            // Perc (MetalSynth)
            const perc = new Tone.MetalSynth().toDestination();
            perc.volume.value = -20;

            players.current = [kick, snare, hihat, clap, tom, synth, bass, perc];
            setIsLoaded(true);
        };

        loadAudio();

        return () => {
            // Cleanup
            if (sequencer.current) sequencer.current.dispose();
            players.current.forEach(p => p.dispose());
        };
    }, []);

    // Setup Sequencer Loop
    useEffect(() => {
        if (!isLoaded) return;

        // Create a loop that updates the UI and triggers sounds
        sequencer.current = new Tone.Sequence((time, step) => {
            setCurrentStep(step);

            // Trigger sounds for active cells in this step
            grid.forEach((row, rowIndex) => {
                if (row[step]) {
                    const instrument = players.current[rowIndex];

                    // Trigger specific notes for tonal instruments
                    switch (rowIndex) {
                        case 0: // Kick
                            instrument.triggerAttackRelease("C1", "8n", time);
                            break;
                        case 1: // Snare
                            instrument.triggerAttackRelease("8n", time);
                            break;
                        case 2: // HiHat
                            instrument.triggerAttackRelease("32n", time, 0.3);
                            break;
                        case 3: // Clap
                            instrument.triggerAttackRelease("8n", time);
                            break;
                        case 4: // Tom
                            instrument.triggerAttackRelease("G2", "8n", time);
                            break;
                        case 5: // Synth
                            instrument.triggerAttackRelease(["C4", "E4", "G4"], "8n", time);
                            break;
                        case 6: // Bass
                            instrument.triggerAttackRelease("C2", "8n", time);
                            break;
                        case 7: // Perc
                            instrument.triggerAttackRelease("16n", time);
                            break;
                    }
                }
            });
        }, [...Array(STEPS).keys()], "16n").start(0);

        Tone.Transport.bpm.value = bpm;

        return () => {
            if (sequencer.current) sequencer.current.dispose();
        };
    }, [isLoaded, grid, bpm]);

    // Handle Play/Stop
    const togglePlay = async () => {
        if (!isLoaded) return;

        if (Tone.context.state !== 'running') {
            await Tone.start();
        }

        if (isPlaying) {
            Tone.Transport.stop();
            setCurrentStep(0);
        } else {
            Tone.Transport.start();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle Cell Click
    const toggleCell = (row: number, col: number) => {
        if (isReadOnly) return;

        const newGrid = [...grid];
        newGrid[row][col] = !newGrid[row][col];
        setGrid(newGrid);

        if (onBeatChange) {
            onBeatChange(newGrid);
        }
    };

    // Handle Clear
    const clearGrid = () => {
        if (isReadOnly) return;
        const newGrid = Array(INSTRUMENTS.length).fill(null).map(() => Array(STEPS).fill(false));
        setGrid(newGrid);
        if (onBeatChange) onBeatChange(newGrid);
    };

    return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-neutral-900/50 rounded-3xl border border-white/10 backdrop-blur-sm">
        {/* Controls Header */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
                <button
                    onClick={togglePlay}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isPlaying
                        ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20'
                        : 'bg-green-500 hover:bg-green-400 shadow-green-500/20'
                        } text-white shadow-lg`}
                >
                    {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                        <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>

                <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider">Tempo</span>
                    <div className="flex items-center gap-2">
                        <input
                            type="range"
                            min="60"
                            max="180"
                            value={bpm}
                            onChange={(e) => setBpm(Number(e.target.value))}
                            className="w-32 accent-purple-500 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xl font-bold font-mono w-12 text-right">{bpm}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={clearGrid}
                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                >
                    Clear
                </button>
            </div>
        </div>

        {/* Sequencer Grid */}
        <div className="relative overflow-x-auto pb-4">
            <div className="min-w-[800px]">
                {/* Step Indicators */}
                <div className="flex mb-2 ml-24">
                    {[...Array(STEPS)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-1 mx-[2px] rounded-full transition-colors ${currentStep === i ? 'bg-purple-500' : 'bg-neutral-800'
                                }`}
                        />
                    ))}
                </div>

                {/* Instrument Rows */}
                <div className="flex flex-col gap-2">
                    {INSTRUMENTS.map((instrument, rowIndex) => (
                        <div key={instrument} className="flex items-center gap-4">
                            {/* Instrument Label */}
                            <div className="w-20 text-right text-sm font-medium text-neutral-400">
                                {instrument}
                            </div>

                            {/* Beat Cells */}
                            <div className="flex-1 flex gap-1">
                                {grid[rowIndex].map((isActive, colIndex) => (
                                    <motion.button
                                        key={`${rowIndex}-${colIndex}`}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleCell(rowIndex, colIndex)}
                                        className={`
                        flex-1 aspect-[3/4] rounded-md transition-all duration-100
                        ${isActive
                                                ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                                : 'bg-neutral-800 hover:bg-neutral-700'
                                            }
                        ${currentStep === colIndex ? 'brightness-125 ring-1 ring-white/20' : ''}
                        ${colIndex % 4 === 0 ? 'ml-1' : ''} // Visual grouping
                      `}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
}
