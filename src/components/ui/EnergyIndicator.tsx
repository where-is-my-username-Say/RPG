import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProgressBar } from './ProgressBar';

interface EnergyIndicatorProps {
    current: number;
    max: number;
    lastUpdate: Date;
    compact?: boolean;
}

export function EnergyIndicator({ current, max, lastUpdate, compact = false }: EnergyIndicatorProps) {
    const [timeToFull, setTimeToFull] = useState<string>('');

    useEffect(() => {
        const calculateTimeToFull = () => {
            if (current >= max) {
                setTimeToFull('FULL');
                return;
            }

            const energyNeeded = max - current;
            const minutesNeeded = energyNeeded * 6; // 1 energy per 6 minutes

            // Calculate time elapsed since last update
            const now = new Date();
            const lastUpdateTime = new Date(lastUpdate);
            const minutesSinceUpdate = Math.floor((now.getTime() - lastUpdateTime.getTime()) / 60000);

            // Adjust for energy that should have regenerated
            const adjustedMinutes = Math.max(0, minutesNeeded - minutesSinceUpdate);

            if (adjustedMinutes === 0) {
                setTimeToFull('FULL');
                return;
            }

            const hours = Math.floor(adjustedMinutes / 60);
            const minutes = adjustedMinutes % 60;

            if (hours > 0) {
                setTimeToFull(`${hours}h ${minutes}m`);
            } else {
                setTimeToFull(`${minutes}m`);
            }
        };

        calculateTimeToFull();
        const interval = setInterval(calculateTimeToFull, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, [current, max, lastUpdate]);

    const isLow = current < max * 0.2;

    if (compact) {
        return (
            <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg border border-white/5">
                <motion.div
                    animate={isLow ? { opacity: [1, 0.5, 1] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-xl"
                >
                    ⚡
                </motion.div>
                <div className="flex flex-col">
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">Energy</div>
                    <div className={`text-sm font-bold ${isLow ? 'text-red-400' : 'text-cyber-cyan'}`}>
                        {current}/{max}
                    </div>
                </div>
                {timeToFull !== 'FULL' && (
                    <div className="text-[10px] text-gray-500 font-mono">
                        +1 in {timeToFull}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Energy Bar with Segments */}
            <div className="relative">
                <ProgressBar
                    current={current}
                    max={max}
                    color="cyan"
                    label="ENERGY RESERVES"
                    showValues={true}
                />

                {/* Pulse effect when low */}
                {isLow && (
                    <motion.div
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500 rounded-lg pointer-events-none"
                    />
                )}
            </div>

            {/* Time to Full */}
            <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400">
                    Recharge: 1 energy / 6 min
                </span>
                {timeToFull !== 'FULL' ? (
                    <motion.span
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-cyber-cyan font-bold bg-black/40 px-2 py-1 rounded border border-cyber-cyan/30"
                    >
                        Full in: {timeToFull}
                    </motion.span>
                ) : (
                    <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-green-400 font-bold bg-black/40 px-2 py-1 rounded border border-green-400/30"
                    >
                        ⚡ FULL CHARGE
                    </motion.span>
                )}
            </div>

            {/* Visual Energy Segments */}
            <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => {
                    const segmentValue = (i + 1) * (max / 10);
                    const isFilled = current >= segmentValue;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className={`
                                flex-1 h-1 rounded-full transition-all duration-300
                                ${isFilled
                                    ? 'bg-cyber-cyan shadow-[0_0_4px_rgba(0,240,255,0.6)]'
                                    : 'bg-white/10'
                                }
                            `}
                        />
                    );
                })}
            </div>
        </div>
    );
}
