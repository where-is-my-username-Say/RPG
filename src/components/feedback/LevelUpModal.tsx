import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useEffect, useState } from 'react';

interface LevelUpModalProps {
    newLevel: number;
    statIncreases?: {
        hp?: number;
        attack?: number;
        defense?: number;
        speed?: number;
    };
    skillPointsGained?: number;
    onClose: () => void;
}

export function LevelUpModal({
    newLevel,
    statIncreases = {},
    skillPointsGained = 1,
    onClose
}: LevelUpModalProps) {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Delay content reveal for dramatic effect
        const timer = setTimeout(() => setShowContent(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl"
            >
                {/* Animated background effects */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Radial gradient pulse */}
                    <motion.div
                        animate={{
                            scale: [1, 2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-cyber-cyan/30 via-cyber-purple/20 to-transparent rounded-full blur-3xl"
                    />

                    {/* Particle effects */}
                    {Array.from({ length: 50 }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: '50vw',
                                y: '50vh',
                                opacity: 0,
                                scale: 0
                            }}
                            animate={{
                                x: `${Math.random() * 100}vw`,
                                y: `${Math.random() * 100}vh`,
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                delay: Math.random() * 0.5,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 3
                            }}
                            className="absolute w-1 h-1 bg-cyber-cyan rounded-full"
                            style={{
                                boxShadow: '0 0 10px rgba(0,240,255,1)'
                            }}
                        />
                    ))}
                </div>

                {/* Main content */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="relative z-10 max-w-2xl w-full mx-4"
                >
                    <div className="bg-gradient-to-br from-black/90 via-cyber-dark/90 to-black/90 backdrop-blur-2xl border-4 border-cyber-cyan rounded-3xl p-12 shadow-[0_0_100px_rgba(0,240,255,0.5)]">
                        {/* Level Up Header */}
                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mb-8"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-8xl mb-4 filter drop-shadow-[0_0_30px_rgba(0,240,255,1)]"
                            >
                                🎉
                            </motion.div>

                            <h2 className="text-2xl font-bold text-cyber-cyan uppercase tracking-widest mb-2 font-mono">
                                LEVEL UP!
                            </h2>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    delay: 0.8,
                                    type: "spring",
                                    stiffness: 300
                                }}
                                className="relative inline-block"
                            >
                                <motion.div
                                    animate={{
                                        opacity: [0.5, 1, 0.5],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink blur-2xl"
                                />
                                <div className="relative text-9xl font-black bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
                                    {newLevel}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Stat Increases */}
                        <AnimatePresence>
                            {showContent && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="space-y-6 mb-8"
                                >
                                    {/* Stats Grid */}
                                    {Object.keys(statIncreases).length > 0 && (
                                        <div>
                                            <h3 className="text-sm text-gray-400 uppercase tracking-widest mb-3 font-mono text-center">
                                                Stat Increases
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {Object.entries(statIncreases).map(([stat, value], index) => (
                                                    value && value > 0 ? (
                                                        <motion.div
                                                            key={stat}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 1.2 + index * 0.1 }}
                                                            className="bg-black/40 border-2 border-cyber-cyan/30 rounded-xl p-4 text-center"
                                                        >
                                                            <div className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-mono">
                                                                {stat}
                                                            </div>
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: [0, 1.3, 1] }}
                                                                transition={{ delay: 1.3 + index * 0.1 }}
                                                                className="text-3xl font-bold text-green-400"
                                                            >
                                                                +{value}
                                                            </motion.div>
                                                        </motion.div>
                                                    ) : null
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Skill Points */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 1.5 }}
                                        className="bg-gradient-to-r from-cyber-purple/20 to-cyber-pink/20 border-2 border-cyber-purple rounded-xl p-6 text-center"
                                    >
                                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-2 font-mono">
                                            Skill Points Gained
                                        </div>
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="text-6xl font-black bg-gradient-to-r from-cyber-purple to-cyber-pink bg-clip-text text-transparent"
                                        >
                                            +{skillPointsGained}
                                        </motion.div>
                                    </motion.div>

                                    {/* Bonus Message */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.8 }}
                                        className="text-center"
                                    >
                                        <p className="text-cyber-cyan font-mono text-sm">
                                            ⚡ Energy fully restored!
                                        </p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Continue Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2 }}
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={onClose}
                                className="w-full text-xl tracking-widest shadow-[0_0_40px_rgba(0,240,255,0.6)]"
                            >
                                CONTINUE
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
