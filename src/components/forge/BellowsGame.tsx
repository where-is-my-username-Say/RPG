import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';

interface BellowsGameProps {
    onComplete: (score: number) => void;
}

export function BellowsGame({ onComplete }: BellowsGameProps) {
    const [heat, setHeat] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [inZoneTime, setInZoneTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    // Target Zone: 70-90%
    const TARGET_MIN = 70;
    const TARGET_MAX = 90;

    useEffect(() => {
        // Start game countdown
        setIsActive(true);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    clearInterval(timer);
                    setIsActive(false);
                    return 0;
                }
                return prev - 0.1;
            });
        }, 100);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!isActive) {
            if (timeLeft <= 0) {
                // Determine score based on how well they kept it in zone
                // Max possible score is 100
                // Scoring Time: 6s. Tick rate: 50ms (20/s). Max ticks: 120.
                const score = Math.min(100, Math.floor((inZoneTime / 110) * 100)); // normalized (using 110 to be slightly forgiving)
                onComplete(score);
            }
            return;
        }

        const decay = setInterval(() => {
            setHeat(h => Math.max(0, h - 1.5)); // Decay rate

            // GRACE PERIOD: First 4 seconds (10s -> 6s) don't count for quality
            // This gives time to reach the green zone.
            if (timeLeft <= 6) {
                if (heat >= TARGET_MIN && heat <= TARGET_MAX) {
                    setInZoneTime(t => t + 1);
                }
            }
        }, 50);

        return () => clearInterval(decay);
    }, [isActive, timeLeft, heat]);

    const pump = () => {
        if (!isActive) return;
        setHeat(h => Math.min(100, h + 8)); // Pump amount
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md mx-auto p-6 bg-black/50 rounded-xl border border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-bold text-cyber-cyan tracking-widest">PHASE 1: HEATING</h3>
            <p className="text-xs text-gray-400">Repeatedly click PUMP to keep heat in the GREEN ZONE!</p>

            <div className="w-full h-64 bg-black/60 rounded-lg relative overflow-hidden flex flex-col justify-end border-2 border-white/20">
                {/* Target Zone Indicator */}
                <div
                    className="absolute w-full bg-green-500/20 border-y border-green-500/50 z-0"
                    style={{
                        bottom: `${TARGET_MIN}%`,
                        height: `${TARGET_MAX - TARGET_MIN}%`
                    }}
                >
                    <div className="text-green-500 text-[10px] absolute right-1 top-1 font-bold">OPTIMAL TEMP</div>
                </div>

                {/* Heat Bar */}
                <motion.div
                    className="w-full bg-gradient-to-t from-orange-600 via-red-500 to-yellow-400"
                    animate={{ height: `${heat}%` }}
                    transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
                />
            </div>

            <div className="w-full flex justify-between items-center font-mono">
                <div className="text-xl font-bold text-white">{timeLeft.toFixed(1)}s</div>
                <div className={`${heat >= TARGET_MIN && heat <= TARGET_MAX ? 'text-green-500 animate-pulse' : 'text-red-500'}`}>
                    TEMP: {Math.round(heat)}°C
                </div>
            </div>

            <Button
                variant="primary"
                size="lg"
                className="w-full h-16 text-2xl font-black active:scale-95 transition-transform"
                onClick={pump}
            >
                🔥 PUMP BELLOWS
            </Button>
        </div>
    );
}
