import { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Panel, ProgressBar, NavigationBar, EnergyIndicator, EnergyCostBadge } from './ui';
import { useGameStore } from '../store/gameStore';
import { useUIStore } from '../store/uiStore';
import { CLASSES } from '../data/classes';
import { DAILY_CONTRACTS } from '../data/dailyContent';
import { CombatModal } from './combat/CombatModal';
import { getRandomEnemy } from '../data/enemies';
import type { CombatEnemy } from '../types';
import { supabase } from '../lib/supabase';
import { SocialOverlay } from './social/SocialOverlay';
import { SettingsModal } from './SettingsModal';
import { DynamicBackground } from './cyber/DynamicBackground';
// useAutoSave removed (Global in App.tsx)
import { LevelUpModal } from './feedback/LevelUpModal';
import { useRef } from 'react';
import { WorldNewsPanel } from './WorldNewsPanel';

export function MainHub() {
    const { player, updateEnergy, gainXP, gainGold, consumeEnergy } = useGameStore();
    const { addToast } = useUIStore();
    const [showSocial, setShowSocial] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [selectedContract, setSelectedContract] = useState<string | null>(null);
    const [inCombat, setInCombat] = useState(false);
    const [currentEnemy, setCurrentEnemy] = useState<CombatEnemy | null>(null);

    // Update energy on mount and periodically
    useEffect(() => {
        updateEnergy();
        const interval = setInterval(updateEnergy, 60000); // Every minute
        return () => clearInterval(interval);
    }, [updateEnergy]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload(); // Force reload to clear state cleanly
    };

    // Start contract combat
    const handleStartContract = (contractId: string) => {
        const contract = DAILY_CONTRACTS.find(c => c.id === contractId);
        if (!contract || !player) return;

        // Check energy
        if (!consumeEnergy(contract.energyCost)) {
            addToast('Not enough energy!', 'warning');
            return;
        }

        // Generate enemy based on difficulty
        const enemy = getRandomEnemy(contract.difficulty);
        setCurrentEnemy(enemy);
        setInCombat(true);
    };

    // Handle victory
    const handleVictory = (rewards: { xp: number; gold: number }) => {
        let totalXP = rewards.xp;
        let totalGold = rewards.gold;

        // Add Contract Rewards if active
        if (selectedContract) {
            const contract = DAILY_CONTRACTS.find(c => c.id === selectedContract);
            if (contract) {
                const contractXP = contract.rewards.find(r => r.type === 'XP')?.amount || 0;
                const contractGold = contract.rewards.find(r => r.type === 'GOLD')?.amount || 0;

                totalXP += contractXP;
                totalGold += contractGold;

                addToast(`Contract Complete! +${contractXP} XP, +${contractGold} Gold`, 'success');
            }
        }

        gainXP(totalXP);
        gainGold(totalGold);
        setInCombat(false);
        setCurrentEnemy(null);
        setSelectedContract(null);
    };

    // Handle defeat
    const handleDefeat = () => {
        setInCombat(false);
        setCurrentEnemy(null);
        setSelectedContract(null);
    };

    if (!player) return null;

    const classData = CLASSES[player.classId] || {
        name: 'Unknown Class',
        icon: '❓',
        baseStats: { hp: 100, attack: 10, defense: 0, speed: 10 },
        description: 'Class data not found',
        skills: []
    };

    const { hp: totalHP, attack: totalATK, defense: totalDEF } = useGameStore(useShallow(state => state.getPlayerStats()));

    // Level Up Check
    const [showLevelUp, setShowLevelUp] = useState(false);
    const prevLevelRef = useRef(player.level);

    useEffect(() => {
        if (player.level > prevLevelRef.current) {
            setShowLevelUp(true);
            addToast('Level Up! HP & Energy Fully Restored!', 'success');
        }
        prevLevelRef.current = player.level;
    }, [player.level]);

    return (
        <div className="relative min-h-[100dvh] p-6 pb-32">
            <DynamicBackground />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 mb-6"
            >
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                            CYBER MERCENARY
                        </h1>
                        <p className="text-gray-400 font-mono text-sm max-w-md">
                            Welcome back, <span className="text-white font-bold">{player.username}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4 bg-black/40 p-2 rounded-lg border border-white/5 backdrop-blur-md">
                                <div className="text-right px-2">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Credits</div>
                                    <div className="text-xl font-bold text-cyber-yellow">{player.gold.toLocaleString()} ₵</div>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-right px-2">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-wider flex justify-end gap-1">
                                        Energy
                                        {player.energy < player.maxEnergy && (
                                            <span className="text-green-500 animate-pulse">⚡ RECHARGING</span>
                                        )}
                                    </div>
                                    <div className="text-xl font-bold text-cyber-cyan">{player.energy}/{player.maxEnergy}</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => setShowSocial(true)}>
                                    COMMUNITY
                                </Button>
                                <Button variant="primary" size="sm" onClick={() => setShowSettings(true)}>
                                    ⚙️ SETTINGS
                                </Button>
                                <Button variant="danger" size="sm" onClick={handleSignOut}>
                                    SIGN OUT
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Grid */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Player Info */}
                <div className="space-y-6">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Panel title="OPERATIVE STATUS" glowColor="cyan">
                            <div className="text-center mb-6 relative">
                                <div className="absolute inset-0 bg-cyber-cyan/5 blur-2xl rounded-full" />
                                <div className="text-7xl mb-2 relative drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">{classData.icon}</div>
                                <div className="text-2xl font-bold text-white relative">{classData.name}</div>
                                <div className="text-xs text-cyber-cyan font-mono tracking-widest uppercase">{player.reputationTier.replace('_', ' ')}</div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1 font-mono">
                                        <span className="text-gray-400">SYNC LEVEL</span>
                                        <span className="text-cyber-purple font-bold">{player.level}</span>
                                    </div>
                                    <ProgressBar current={player.xp} max={player.xpToNext} color="purple" showValues={false} />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                                    <div className="bg-black/40 border border-white/5 p-2 rounded text-center">
                                        <div className="text-gray-500 mb-1">HP</div>
                                        <div className="text-white font-bold text-lg">
                                            {totalHP} <span className="text-gray-500 text-[10px]">/ {totalHP}</span>
                                        </div>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 p-2 rounded text-center">
                                        <div className="text-gray-500 mb-1">ATK</div>
                                        <div className="text-white font-bold text-lg">{totalATK}</div>
                                    </div>
                                    <div className="bg-black/40 border border-white/5 p-2 rounded text-center">
                                        <div className="text-gray-500 mb-1">DEF</div>
                                        <div className="text-white font-bold text-lg">{totalDEF}</div>
                                    </div>
                                </div>

                                <div>
                                    <EnergyIndicator
                                        current={player.energy}
                                        max={player.maxEnergy}
                                        lastUpdate={player.lastEnergyUpdate}
                                    />
                                </div>
                            </div>
                        </Panel>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <WorldNewsPanel />
                    </motion.div>
                </div>

                {/* Middle & Right Column - Contracts & Map */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 6, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Panel title="AVAILABLE CONTRACTS" glowColor="yellow">
                            <div className="space-y-4">
                                {DAILY_CONTRACTS.map((contract) => (
                                    <motion.div
                                        key={contract.id}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        className={`
                    relative overflow-hidden
                    bg-black/40 backdrop-blur-sm border rounded-lg p-5 cursor-pointer transition-all duration-300
                    ${selectedContract === contract.id
                                                ? 'border-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.2)] bg-cyber-cyan/10'
                                                : 'border-white/10 hover:border-cyber-cyan/50 hover:bg-white/5'
                                            }
                  `}
                                        onClick={() => setSelectedContract(contract.id)}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{contract.title}</h3>
                                                <p className="text-sm text-gray-400 max-w-lg">{contract.description}</p>
                                            </div>
                                            <div className={`
                      px-3 py-1 rounded text-xs font-bold tracking-wider border
                      ${contract.difficulty === 'EASY' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                                    contract.difficulty === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                                        'bg-red-500/10 text-red-400 border-red-500/30'}
                    `}>
                                                {contract.difficulty}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 text-xs font-mono mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">REWARD:</span>
                                                <span className="text-cyber-yellow font-bold">+{contract.rewards.find(r => r.type === 'XP')?.amount} XP</span>
                                                <span className="text-cyber-yellow font-bold">+{contract.rewards.find(r => r.type === 'GOLD')?.amount} ₵</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">COST:</span>
                                                <span className="text-cyber-cyan font-bold">{contract.energyCost} E</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-500">TIME:</span>
                                                <span className="text-gray-300">{contract.timeLimit}m</span>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {selectedContract === contract.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4 border-t border-white/10">
                                                        <div className="space-y-3 mb-6">
                                                            <div className="text-xs text-cyber-cyan font-bold tracking-widest uppercase">Mission Objectives</div>
                                                            {contract.objectives.map((obj, i) => (
                                                                <div key={i} className="flex items-center gap-2 text-sm font-mono text-gray-300 bg-black/30 p-2 rounded border border-white/5">
                                                                    <span className="text-cyber-cyan">►</span>
                                                                    <span>{obj.type}:</span>
                                                                    <span className="text-white font-bold">{obj.target}</span>
                                                                    <span className="text-gray-500">x{obj.count}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="relative">
                                                            <EnergyCostBadge
                                                                cost={contract.energyCost}
                                                                currentEnergy={player.energy}
                                                                position="top-right"
                                                                size="lg"
                                                            />
                                                            <Button
                                                                variant="primary"
                                                                size="lg"
                                                                disabled={player.energy < contract.energyCost}
                                                                className="w-full shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleStartContract(contract.id);
                                                                }}
                                                            >
                                                                {player.energy < contract.energyCost ? 'INSUFFICIENT ENERGY RESERVES' : 'ACCEPT CONTRACT'}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        </Panel>
                    </motion.div>
                </div>
            </div>

            {/* Social Overlay */}
            <AnimatePresence>
                {showSocial && (
                    <SocialOverlay onClose={() => setShowSocial(false)} />
                )}
            </AnimatePresence>

            {/* LevelUp Modal */}
            <AnimatePresence>
                {showLevelUp && (
                    <LevelUpModal
                        newLevel={player.level}
                        statIncreases={{
                            hp: Math.floor(classData.baseStats.hp * 0.1),
                            attack: Math.floor(classData.baseStats.attack * 0.1),
                            defense: Math.floor(classData.baseStats.defense * 0.1)
                        }}
                        onClose={() => setShowLevelUp(false)}
                    />
                )}
            </AnimatePresence>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <SettingsModal onClose={() => setShowSettings(false)} />
                )}
            </AnimatePresence>

            {/* Combat Modal Overlay */}
            <AnimatePresence>
                {inCombat && currentEnemy && (
                    <CombatModal
                        enemy={currentEnemy}
                        onVictory={handleVictory}
                        onDefeat={handleDefeat}
                    />
                )}
            </AnimatePresence>

            {/* Navigation Bar */}
            {!showSocial && <NavigationBar />}
        </div>
    );
}
