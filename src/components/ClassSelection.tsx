import { useState } from 'react';
import { Button } from './ui';
import { CLASSES } from '../data/classes';
import type { CharacterClassId } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicBackground } from './cyber/DynamicBackground';

interface ClassSelectionProps {
    onSelect: (classId: CharacterClassId) => void;
}

const SPRING_TRANSITION = { type: 'spring' as const, stiffness: 200, damping: 25 };

export function ClassSelection({ onSelect }: ClassSelectionProps) {
    const [selectedClass, setSelectedClass] = useState<CharacterClassId | null>(null);

    return (
        <div className="min-h-screen bg-cyber-darker relative overflow-y-auto pb-8 perspective-1000">
            <DynamicBackground />

            <div className="relative z-10 w-full max-w-6xl mx-auto p-4 md:p-8 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={SPRING_TRANSITION}
                    className="text-center mb-8 md:mb-12 mt-4"
                >
                    <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink mb-2 md:mb-4">
                        SELECT YOUR CLASS
                    </h1>
                    <p className="text-gray-400 font-mono text-sm">
                        Choose your combat specialization
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!selectedClass ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 w-full"
                        >
                            {(Object.keys(CLASSES) as CharacterClassId[]).map((classId, index) => {
                                const cls = CLASSES[classId];
                                return (
                                    <motion.div
                                        key={classId}
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            translateY: [0, -10, 0]
                                        }}
                                        transition={{
                                            opacity: { delay: index * 0.1 },
                                            translateY: {
                                                duration: 3 + index * 0.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }
                                        }}
                                        onClick={() => setSelectedClass(classId)}
                                        className="cursor-pointer group perspective-1000"
                                    >
                                        <div className="relative h-64 md:h-80 bg-cyber-dark/40 backdrop-blur-md border border-cyber-cyan/30 rounded-xl p-6 transition-all duration-300 group-hover:border-cyber-cyan group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] flex flex-col items-center justify-center text-center gap-4">
                                            <div className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                                                {cls.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{cls.name}</h3>
                                                <div className="w-12 h-1 bg-cyber-cyan mx-auto rounded-full opacity-50" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono text-gray-400 mt-2">
                                                <div>HP <span className="text-cyber-cyan">{cls.baseStats.hp}</span></div>
                                                <div>DEF <span className="text-cyber-purple">{cls.baseStats.defense}</span></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selected"
                            className="w-full max-w-2xl perspective-1000"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                initial={{ rotateY: 90 }}
                                animate={{ rotateY: 0 }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                className="relative bg-cyber-dark/90 backdrop-blur-xl border-2 border-cyber-cyan rounded-2xl p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)]"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-2xl pointer-events-none" />

                                <div className="relative z-10 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                    <Button variant="secondary" size="sm" onClick={() => setSelectedClass(null)}>
                                        ← BACK
                                    </Button>
                                    <div className="text-6xl animate-pulse-slow filter drop-shadow-[0_0_20px_rgba(0,240,255,0.5)]">
                                        {CLASSES[selectedClass].icon}
                                    </div>


                                    <div className="space-y-8 relative z-10 mt-6">
                                        <div className="text-center">
                                            <h3 className="text-4xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white mb-2">
                                                {CLASSES[selectedClass].name}
                                            </h3>
                                            <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
                                                {CLASSES[selectedClass].description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4">
                                            {[
                                                { label: 'HP', value: CLASSES[selectedClass].baseStats.hp, color: 'text-green-400' },
                                                { label: 'ATK', value: CLASSES[selectedClass].baseStats.attack, color: 'text-red-400' },
                                                { label: 'DEF', value: CLASSES[selectedClass].baseStats.defense, color: 'text-blue-400' },
                                                { label: 'SPD', value: CLASSES[selectedClass].baseStats.speed, color: 'text-yellow-400' }
                                            ].map((stat) => (
                                                <div key={stat.label} className="bg-black/40 border border-white/10 rounded-lg p-3 text-center">
                                                    <div className="text-gray-500 text-xs font-bold tracking-widest mb-1">{stat.label}</div>
                                                    <div className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div>
                                            <h4 className="flex items-center gap-2 text-cyber-cyan text-sm font-bold uppercase tracking-widest mb-4">
                                                <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-ping" />
                                                COMBAT PROTOCOLS
                                                <span className="flex-1 h-px bg-cyber-cyan/30" />
                                            </h4>
                                            <div className="grid gap-3">
                                                {CLASSES[selectedClass].skills.map((skill) => (
                                                    <motion.div
                                                        key={skill.id}
                                                        whileHover={{ x: 10, backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                                                        className="bg-white/5 border border-white/5 rounded-r-xl p-4 flex items-center gap-4 transition-colors"
                                                    >
                                                        <div className="text-3xl filter drop-shadow-[0_0_5px_currentColor] text-cyber-purple">
                                                            {skill.icon}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <div className="font-bold text-white">{skill.name}</div>
                                                                <div className="text-cyber-yellow text-xs font-mono border border-cyber-yellow/30 px-2 py-0.5 rounded">
                                                                    {skill.energyCost} EP
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-gray-400">{skill.description}</div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            variant="primary"
                                            size="lg"
                                            className="w-full h-16 text-lg tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                                            onClick={() => onSelect(selectedClass)}
                                        >
                                            I N I T I A L I Z E _ L I N K
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
