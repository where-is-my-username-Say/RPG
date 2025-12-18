import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui';

interface HammerGameProps {
    onComplete: (score: number) => void;
}

export function HammerGame({ onComplete }: HammerGameProps) {
    const [round, setRound] = useState(1);
    // UI State
    const [scaleState, setScaleState] = useState(2.0);
    const [isActive, setIsActive] = useState(false);
    const [feedback, setFeedback] = useState<{ text: string, color: string } | null>(null);
    const [scores, setScores] = useState<number[]>([]);

    // Game Logic State (Refs for speed/sync)
    const scaleRef = useRef(2.0);
    const requestRef = useRef<number>(0);
    const isActiveRef = useRef(false);

    // Config
    const TOTAL_ROUNDS = 5;
    const TARGET_SCALE = 0.5; // The "Sweet spot" size

    useEffect(() => {
        startRound();
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    useEffect(() => {
        if (scores.length === TOTAL_ROUNDS) {
            // Calculate final average score
            const average = Math.floor(scores.reduce((a, b) => a + b, 0) / TOTAL_ROUNDS);
            setTimeout(() => onComplete(average), 1500);
        } else if (scores.length > 0 && scores.length < TOTAL_ROUNDS) {
            // Next round delay
            setRound(r => r + 1);
            setTimeout(() => startRound(), 1000);
        }
    }, [scores]);

    const startRound = () => {
        scaleRef.current = 2.0;
        setScaleState(2.0);

        setFeedback(null);
        isActiveRef.current = true;
        setIsActive(true);

        animate(performance.now());
    };

    const animate = (_time: number) => {
        if (!isActiveRef.current) return;

        // Update logic
        scaleRef.current -= 0.015;

        // Check miss condition
        if (scaleRef.current <= 0.2) {
            scaleRef.current = 0.2;
            handleHit(true); // Force miss
            return;
        }

        // Sync to UI
        setScaleState(scaleRef.current);

        requestRef.current = requestAnimationFrame(animate);
    };

    const handleHit = (forcedMiss = false) => {
        if (!isActiveRef.current) return;

        isActiveRef.current = false;
        setIsActive(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);

        let score = 0;
        let text = "MISS";
        let color = "text-red-500";

        if (!forcedMiss) {
            const currentScale = scaleRef.current;
            const diff = Math.abs(currentScale - TARGET_SCALE);

            // Allow 0.1 variance for "perfect", 0.3 for "good"
            // Start subtracting score after 0.05 diff

            if (diff < 0.1) {
                score = 100;
                text = "PERFECT!";
                color = "text-cyber-yellow";
            } else if (diff < 0.2) {
                score = 75;
                text = "GOOD";
                color = "text-green-500";
            } else if (diff < 0.35) {
                score = 40;
                text = "OKAY";
                color = "text-blue-500";
            } else {
                score = 0;
                text = "MISS"; // Too early/late
            }
        }

        setFeedback({ text, color });
        setScores(prev => [...prev, score]);
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto p-6 bg-black/50 rounded-xl border border-white/10 backdrop-blur-md min-h-[400px]">
            <h3 className="text-xl font-bold text-cyber-purple tracking-widest">PHASE 2: SHAPING</h3>
            <p className="text-xs text-gray-400">Tap HAMMER when ring matches the WHITE CIRCLE!</p>

            <div className="text-sm font-mono text-gray-300">STRIKE {round} / {TOTAL_ROUNDS}</div>

            <div
                className="w-64 h-64 relative flex items-center justify-center cursor-pointer select-none touch-none"
                onPointerDown={(e) => {
                    e.preventDefault(); // Prevent double firing on some touch devices
                    handleHit();
                }}
            >
                {/* Target Circle (Static) */}
                <div
                    className="absolute border-4 border-white/30 rounded-full box-border"
                    style={{
                        width: 200 * TARGET_SCALE,
                        height: 200 * TARGET_SCALE
                    }}
                />

                {/* Shrinking Circle (Dynamic) */}
                {isActive && (
                    <div
                        className="absolute border-4 border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.5)] rounded-full box-border"
                        style={{
                            width: 200 * scaleState,
                            height: 200 * scaleState
                        }}
                    />
                )}

                {/* Feedback Text */}
                <AnimatePresence>
                    {feedback && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            className={`absolute text-4xl font-black ${feedback.color} drop-shadow-lg z-10 pointer-events-none`}
                        >
                            {feedback.text}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Center Anvil Icon */}
                <div className="text-6xl opacity-20 pointer-events-none">🔨</div>
            </div>

            <Button
                variant="primary"
                size="lg"
                className="w-full text-xl font-bold"
                onClick={() => handleHit()}
                disabled={!isActive}
            >
                HAMMER STRIKE
            </Button>
        </div>
    );
}
