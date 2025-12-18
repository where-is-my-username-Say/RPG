import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Panel, Button } from './ui';
import { useGameStore } from '../store/gameStore';
// import { supabase } from '../lib/supabase'; // Removed unused import

interface SettingsModalProps {
    onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
    const { resetAccount, deleteAccount } = useGameStore();
    const [volume, setVolume] = useState(80);
    const [sfx, setSfx] = useState(100);
    const [graphics, setGraphics] = useState('HIGH');

    // Reset Data State
    const [confirmReset, setConfirmReset] = useState(false);
    const [resetTimer, setResetTimer] = useState(3);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (confirmReset && resetTimer > 0) {
            interval = setInterval(() => {
                setResetTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [confirmReset, resetTimer]);

    // handleResetAccount logic is now in store (resetAccount)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-2xl"
            >
                <Panel title="SYSTEM CONFIGURATION" glowColor="cyan">
                    <div className="space-y-8 p-4">

                        {/* Audio Settings */}
                        <div className="space-y-4">
                            <h3 className="text-cyber-cyan font-bold tracking-widest border-b border-white/10 pb-2">AUDIO PROTOCOLS</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">MASTER VOLUME</span>
                                        <span className="text-white font-mono">{volume}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={volume}
                                        onChange={(e) => setVolume(Number(e.target.value))}
                                        className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">SFX VOLUME</span>
                                        <span className="text-white font-mono">{sfx}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={sfx}
                                        onChange={(e) => setSfx(Number(e.target.value))}
                                        className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-cyber-purple"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Graphics Settings */}
                        <div className="space-y-4">
                            <h3 className="text-cyber-cyan font-bold tracking-widest border-b border-white/10 pb-2">VISUAL FIDELITY</h3>
                            <div className="flex gap-4">
                                {['LOW', 'MED', 'HIGH', 'ULTRA'].map(opt => (
                                    <button
                                        key={opt}
                                        onClick={() => setGraphics(opt)}
                                        className={`flex-1 py-2 rounded font-bold transition-all ${graphics === opt ? 'bg-cyber-cyan text-black shadow-[0_0_15px_rgba(0,240,255,0.5)]' : 'bg-black/40 text-gray-500 hover:bg-white/10'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* DANGER ZONE */}
                        <div className="pt-8 border-t border-red-500/30">
                            <h3 className="text-red-500 font-black tracking-widest mb-4 flex items-center gap-2">
                                ⚠️ DANGER ZONE
                            </h3>

                            {!confirmReset ? (
                                <Button
                                    variant="danger"
                                    className="w-full py-4 text-xl font-bold tracking-widest"
                                    onClick={() => {
                                        setConfirmReset(true);
                                        setResetTimer(3);
                                    }}
                                >
                                    RESET ACCOUNT
                                </Button>
                            ) : (
                                <div className="space-y-4 animate-pulse bg-red-900/20 p-4 rounded border border-red-500">
                                    <div className="text-center text-red-500 font-bold text-xl">
                                        WARNING: IRREVERSIBLE ACTION
                                    </div>
                                    <p className="text-center text-gray-300 text-sm">
                                        All progress, items, and stats will be permanently wiped from the server.
                                    </p>
                                    <div className="flex gap-4">
                                        <Button
                                            variant="secondary"
                                            className="flex-1"
                                            onClick={() => setConfirmReset(false)}
                                        >
                                            CANCEL
                                        </Button>
                                        <Button
                                            variant="danger"
                                            className="flex-1 font-bold"
                                            disabled={resetTimer > 0 || isResetting}
                                            onClick={() => {
                                                setIsResetting(true);
                                                resetAccount();
                                            }}
                                        >
                                            {isResetting ? 'WIPING DATA...' : resetTimer > 0 ? `CONFIRM IN ${resetTimer}s` : 'I AM SURE - WIPE ALL DATA'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* DELETE ACCOUNT */}
                            <div className="mt-8 pt-8 border-t border-red-900/50">
                                <h3 className="text-red-700 font-black tracking-widest mb-4 flex items-center gap-2 text-sm opacity-70">
                                    ☢️ PERMANENT DELETION
                                </h3>
                                <Button
                                    variant="secondary"
                                    className="w-full py-2 text-xs font-mono text-gray-500 hover:text-red-500 border-gray-800 hover:border-red-900"
                                    onClick={() => {
                                        if (confirm("Are you absolutely sure? This will delete your account permanently. This cannot be undone.")) {
                                            deleteAccount();
                                        }
                                    }}
                                >
                                    DELETE ACCOUNT FOREVER
                                </Button>
                            </div>

                        </div>

                    </div>
                </Panel>
            </motion.div>
        </motion.div>
    );
}
