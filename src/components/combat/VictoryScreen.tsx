import { motion } from 'framer-motion';
import { Button } from '../ui';

interface VictoryScreenProps {
    rewards: {
        xp: number;
        gold: number;
        items?: string[];
    };
    onContinue: () => void;
}

export function VictoryScreen({ rewards, onContinue }: VictoryScreenProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
        >
            <motion.div
                initial={{ scale: 0.5, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                className="text-center space-y-8"
            >
                {/* VICTORY Text */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        textShadow: [
                            '0 0 20px rgba(0,240,255,0.5)',
                            '0 0 40px rgba(0,240,255,1)',
                            '0 0 20px rgba(0,240,255,0.5)'
                        ]
                    }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
                >
                    VICTORY
                </motion.div>

                {/* Rewards */}
                <div className="space-y-6">
                    <div className="text-cyber-cyan text-2xl font-bold uppercase tracking-widest">
                        MISSION COMPLETE
                    </div>

                    <div className="flex gap-8 justify-center">
                        {/* XP Reward */}
                        <motion.div
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-cyber-dark/80 border-2 border-cyber-purple rounded-lg p-6 min-w-[200px]"
                        >
                            <div className="text-6xl mb-2">⚡</div>
                            <div className="text-cyber-purple text-4xl font-black">+{rewards.xp}</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Experience</div>
                        </motion.div>

                        {/* Gold Reward */}
                        <motion.div
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-cyber-dark/80 border-2 border-cyber-yellow rounded-lg p-6 min-w-[200px]"
                        >
                            <div className="text-6xl mb-2">💰</div>
                            <div className="text-cyber-yellow text-4xl font-black">+{rewards.gold} ₵</div>
                            <div className="text-gray-400 text-sm uppercase tracking-wider">Credits</div>
                        </motion.div>
                    </div>

                    {/* Items (if any) */}
                    {rewards.items && rewards.items.length > 0 && (
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-2"
                        >
                            <div className="text-cyber-cyan text-sm uppercase tracking-wider">Loot Acquired</div>
                            <div className="flex gap-3 justify-center">
                                {rewards.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-cyber-darker border border-cyber-cyan/30 rounded px-4 py-2 text-sm font-mono text-white"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Continue Button */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={onContinue}
                        className="px-12"
                    >
                        CONTINUE
                    </Button>
                </motion.div>

                {/* Particle Effects */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: 0,
                            y: 0,
                            opacity: 1,
                            scale: 1
                        }}
                        animate={{
                            x: (Math.random() - 0.5) * 1000,
                            y: (Math.random() - 0.5) * 1000,
                            opacity: 0,
                            scale: 0
                        }}
                        transition={{
                            duration: 2,
                            delay: Math.random() * 0.5,
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-cyber-cyan"
                        style={{
                            boxShadow: '0 0 10px rgba(0,240,255,1)'
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
