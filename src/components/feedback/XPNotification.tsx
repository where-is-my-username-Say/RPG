import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface XPNotificationProps {
    amount: number;
    onComplete?: () => void;
}

export function XPNotification({ amount, onComplete }: XPNotificationProps) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onComplete?.();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    // Determine color based on amount
    const getColor = () => {
        if (amount >= 1000) return 'from-cyber-purple via-cyber-pink to-cyber-yellow';
        if (amount >= 500) return 'from-cyber-cyan via-cyber-purple to-cyber-cyan';
        if (amount >= 100) return 'from-cyber-cyan to-cyber-purple';
        return 'from-white to-cyber-cyan';
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.5 }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        y: [50, -20, -40, -100],
                        scale: [0.5, 1.2, 1, 0.8],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none"
                >
                    <div className="relative">
                        {/* Glow effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`absolute inset-0 blur-2xl bg-gradient-to-r ${getColor()}`}
                        />

                        {/* Main content */}
                        <div className="relative bg-black/80 backdrop-blur-xl border-2 border-cyber-cyan rounded-2xl px-8 py-4 shadow-[0_0_40px_rgba(0,240,255,0.6)]">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 2, ease: "linear" }}
                                    className="text-4xl filter drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                                >
                                    ⭐
                                </motion.div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">
                                        Experience Gained
                                    </span>
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.3, 1] }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className={`text-4xl font-black bg-gradient-to-r ${getColor()} bg-clip-text text-transparent`}
                                        style={{
                                            filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.8))'
                                        }}
                                    >
                                        +{amount.toLocaleString()} XP
                                    </motion.span>
                                </div>
                            </div>
                        </div>

                        {/* Particle effects */}
                        {Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    opacity: 1,
                                    x: 0,
                                    y: 0,
                                    scale: 1
                                }}
                                animate={{
                                    opacity: [1, 0],
                                    x: Math.cos((i / 8) * Math.PI * 2) * 100,
                                    y: Math.sin((i / 8) * Math.PI * 2) * 100,
                                    scale: [1, 0]
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: 0.5,
                                    ease: "easeOut"
                                }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-cyber-cyan rounded-full"
                                style={{
                                    boxShadow: '0 0 10px rgba(0,240,255,1)'
                                }}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook to manage XP notifications
export function useXPNotifications() {
    const [notifications, setNotifications] = useState<Array<{ id: string; amount: number }>>([]);

    const showXPGain = (amount: number) => {
        const id = `${Date.now()}-${Math.random()}`;
        setNotifications(prev => [...prev, { id, amount }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return {
        showXPGain,
        XPNotificationsRenderer: () => (
            <>
                {notifications.map((notif, index) => (
                    <div
                        key={notif.id}
                        style={{
                            position: 'fixed',
                            top: `${50 + index * 10}%`,
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 100 + index,
                        }}
                    >
                        <XPNotification
                            amount={notif.amount}
                            onComplete={() => removeNotification(notif.id)}
                        />
                    </div>
                ))}
            </>
        )
    };
}
