import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import type { GameView } from '../../types';

interface NavItem {
    id: GameView;
    label: string;
    icon: string;
    glowColor: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'MAIN_HUB', label: 'HUB', icon: '🏠', glowColor: 'rgba(0, 240, 255, 0.5)' },
    { id: 'MINING', label: 'MINE', icon: '⛏️', glowColor: 'rgba(0, 240, 255, 0.5)' },
    { id: 'FORGING', label: 'FORGE', icon: '⚒️', glowColor: 'rgba(255, 190, 11, 0.5)' },
    { id: 'INVENTORY', label: 'INVENTORY', icon: '🎒', glowColor: 'rgba(176, 38, 255, 0.5)' },
    { id: 'SKILLS', label: 'SKILLS', icon: '🧠', glowColor: 'rgba(50, 255, 50, 0.5)' },
];

export function NavigationBar() {
    const { currentView, setView } = useGameStore();
    const [isMinimized, setIsMinimized] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col items-center justify-end pointer-events-none pb-4">

            {/* Control Arrow (Separate from main bar to allow independent interaction) */}
            <div className="pointer-events-auto z-[101] mb-1">
                <motion.button
                    onClick={() => setIsMinimized(!isMinimized)}
                    whileHover={{ scale: 1.2, color: '#00f0ff' }}
                    whileTap={{ scale: 0.9 }}
                    animate={{
                        rotate: isMinimized ? 180 : 0,
                        y: isMinimized ? 0 : 0
                    }}
                    className="w-10 h-6 flex items-center justify-center bg-black/60 border border-white/20 backdrop-blur-md rounded-t-lg text-white hover:text-cyber-cyan transition-colors"
                >
                    <span className="text-xs">▼</span>
                </motion.button>
            </div>

            <AnimatePresence>
                {!isMinimized && (
                    <motion.nav
                        initial={{ y: 100, opacity: 0, scale: 0.9 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 100, opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto"
                    >
                        <div className="max-w-7xl mx-auto px-4">
                            <div className="bg-black/80 backdrop-blur-xl border-2 border-white/10 rounded-2xl p-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                                <div className="flex items-center justify-around gap-2">
                                    {NAV_ITEMS.map((item) => {
                                        const isActive = currentView === item.id;

                                        return (
                                            <motion.button
                                                key={item.id}
                                                onClick={() => setView(item.id)}
                                                whileHover={{ scale: 1.1, y: -4 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`
                                                    relative flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-xl
                                                    transition-all duration-300 min-w-[80px]
                                                    ${isActive
                                                        ? 'bg-cyber-cyan/20 border-2 border-cyber-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                                                        : 'bg-transparent border-2 border-transparent hover:bg-white/5'
                                                    }
                                                `}
                                                style={{
                                                    boxShadow: isActive ? `0 0 20px ${item.glowColor}` : 'none'
                                                }}
                                            >
                                                {/* Icon */}
                                                <motion.div
                                                    animate={{
                                                        scale: isActive ? [1, 1.2, 1] : 1,
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: isActive ? Infinity : 0,
                                                        ease: "easeInOut"
                                                    }}
                                                    className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                >
                                                    {item.icon}
                                                </motion.div>

                                                {/* Label */}
                                                <span className={`
                                                    text-[10px] font-bold tracking-wider uppercase font-mono
                                                    ${isActive ? 'text-cyber-cyan' : 'text-gray-400'}
                                                `}>
                                                    {item.label}
                                                </span>

                                                {/* Active indicator */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyber-cyan"
                                                        style={{
                                                            boxShadow: `0 0 10px ${item.glowColor}`
                                                        }}
                                                    />
                                                )}

                                                {/* Hover glow effect */}
                                                {!isActive && (
                                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-cyber-cyan/0 to-cyber-cyan/0 hover:from-cyber-cyan/5 hover:to-cyber-cyan/10 transition-all duration-300" />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </div>
    );
}
