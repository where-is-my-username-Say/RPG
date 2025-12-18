import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { CLASSES } from '../../data/classes';
import { VictoryScreen } from './VictoryScreen';
import { DynamicBackground } from '../cyber/DynamicBackground';
import type { CombatEnemy, Skill } from '../../types';
import { ALL_SKILLS } from '../../data/skills';
import { EnemyCard } from './EnemyCard';

interface CombatArenaProps {
    enemy: CombatEnemy;
    onVictory: (rewards: { xp: number; gold: number; items?: string[] }) => void;
    onDefeat: () => void;
}

export function CombatArena({ enemy, onVictory, onDefeat }: CombatArenaProps) {
    const { player } = useGameStore();
    const [playerHP, setPlayerHP] = useState(100);
    const [enemyHP, setEnemyHP] = useState(enemy.maxHp);
    const [turn, setTurn] = useState<'player' | 'enemy'>('player');

    const [combatLog, setCombatLog] = useState<string[]>([]);
    const [damagePopup, setDamagePopup] = useState<{ amount: number; type: 'damage' | 'heal' | 'crit'; x: number; y: number } | null>(null);
    const [screenShake, setScreenShake] = useState(false);
    const [glowEffect, setGlowEffect] = useState<'player' | 'enemy' | null>(null);
    const [showVictory, setShowVictory] = useState(false);
    const [victoryRewards, setVictoryRewards] = useState<{ xp: number; gold: number } | null>(null);
    const [isProcessingTurn, setIsProcessingTurn] = useState(false);

    if (!player) return null;

    const classData = CLASSES[player.classId];
    const maxPlayerHP = classData.baseStats.hp;

    // Helper to get skill value logic
    const getSkillValue = useCallback((skill: Skill, type: 'damage' | 'heal'): number => {
        let total = 0;
        skill.effects.forEach(effect => {
            // Handle simple damage/heal types
            if (effect.type === type) {
                total += effect.value;
            }
            // Handle potentially mixed types/stats later
        });
        return total;
    }, []);

    const addLog = (message: string) => {
        setCombatLog(prev => [...prev.slice(-4), message]);
    };

    const showDamage = (amount: number, type: 'damage' | 'heal' | 'crit', target: 'player' | 'enemy') => {
        const x = target === 'player' ? 25 : 75;
        const y = 40 + Math.random() * 20;
        setDamagePopup({ amount, type, x, y });
        setTimeout(() => setDamagePopup(null), 1000);
    };

    const triggerAnim = (target: 'player' | 'enemy') => {
        setGlowEffect(target);
        setTimeout(() => setGlowEffect(null), 500);
        if (target === 'enemy') setScreenShake(prev => !prev); // Toggle to trigger anim
        setTimeout(() => setScreenShake(false), 300);
    };


    // VICTORY / DEFEAT CHECK
    useEffect(() => {
        if (enemyHP <= 0 && !showVictory) {
            const goldReward = Math.floor(Math.random() * (enemy.lootTable.gold.max - enemy.lootTable.gold.min) + enemy.lootTable.gold.min);
            const rewards = {
                xp: enemy.lootTable.xp,
                gold: goldReward
            };
            setVictoryRewards(rewards);
            setShowVictory(true);
            setIsProcessingTurn(false);
            return;
        }
        if (playerHP <= 0) {
            // Delay defeat slightly
            const timer = setTimeout(() => {
                setIsProcessingTurn(false);
                onDefeat();
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [enemyHP, playerHP, enemy.lootTable, onDefeat, showVictory]);


    // ENEMY TURN AUTOMATION
    useEffect(() => {
        if (turn === 'enemy' && enemyHP > 0 && playerHP > 0 && !isProcessingTurn) {
            setIsProcessingTurn(true);

            // Artificial Delay for "thinking"
            setTimeout(() => {
                triggerAnim('enemy');
                const enemySkill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
                const damage = getSkillValue(enemySkill, 'damage');

                // Apply damage
                // Defense calculation: Flat reduction for now
                const actualDamage = Math.max(1, damage - Math.floor(classData.baseStats.defense * 0.5));

                setPlayerHP(prev => Math.max(0, prev - actualDamage));
                showDamage(actualDamage, 'damage', 'player');
                addLog(`${enemy.name} used ${enemySkill.name}! ${actualDamage} damage!`);

                // Pass turn back
                setTimeout(() => {
                    setTurn('player');
                    setIsProcessingTurn(false);
                }, 1500);

            }, 1000);
        }
    }, [turn, enemyHP, playerHP, enemy.skills, enemy.name, classData.baseStats.defense, getSkillValue, isProcessingTurn]);


    // PLAYER ATTACK HANDLER
    const handlePlayerAttack = (skill: Skill) => {
        if (turn !== 'player' || isProcessingTurn) return;
        setIsProcessingTurn(true);
        triggerAnim('player');

        // Execute attack after animation delay
        setTimeout(() => {
            let damage = getSkillValue(skill, 'damage');
            const heal = getSkillValue(skill, 'heal');

            // Get player stats for crit calculation
            const { getPlayerStats } = useGameStore.getState();
            const playerStats = getPlayerStats();

            // DAMAGE FORMULA: Skill Base + Player Attack Stat
            // This ensures weapons and levels actually increase damage
            if (damage > 0) {
                damage += (playerStats.attack || 0);
            }

            const isCrit = Math.random() < (playerStats.critChance / 100);

            if (isCrit && damage > 0) damage = Math.floor(damage * 1.5);

            if (damage > 0) {
                const actualDamage = Math.max(1, damage - Math.floor(enemy.defense * 0.5));
                setEnemyHP(prev => Math.max(0, prev - actualDamage));
                showDamage(actualDamage, isCrit ? 'crit' : 'damage', 'enemy');
                addLog(`${player.username} used ${skill.name}! ${actualDamage} damage!${isCrit ? ' CRITICAL!' : ''}`);
            }

            if (heal > 0) {
                setPlayerHP(prev => Math.min(maxPlayerHP, prev + heal));
                showDamage(heal, 'heal', 'player');
                addLog(`${player.username} used ${skill.name}! Healed ${heal} HP!`);
            }

            // End turn if enemy survives
            // The useEffect for Victory will catch if enemyHP <= 0
            // But state update is async.
            // We can safely assume if enemy is not dead, we switch turn.
            // Wait, we need to know the NEW enemy HP.
            // But we don't have it here easily due to closure.
            // But the Victory useEffect handles the WIN scenario.
            // If we switch turn to 'enemy', and enemy is dead, the enemy turn useEffect checks 'enemyHP > 0'.
            // So it is safe to just switch turn.

            setTimeout(() => {
                setTurn('enemy');
                setIsProcessingTurn(false);
            }, 1000);

        }, 500);
    };

    const handleVictoryContinue = () => {
        if (victoryRewards) onVictory(victoryRewards);
    };

    if (showVictory && victoryRewards) {
        return <VictoryScreen rewards={victoryRewards} onContinue={handleVictoryContinue} />;
    }

    // Combine base class skills with unlocked skills
    // We filter unique skills by ID to avoid duplicates if base class has them
    const learnedSkillIds = Object.keys(player.skills || {});

    // Get definitions for learned skills
    const unlockedSkills: Skill[] = [];
    const classSkillTrees = ALL_SKILLS[player.classId as keyof typeof ALL_SKILLS];

    if (classSkillTrees) {
        Object.values(classSkillTrees).forEach((tree: any) => {
            tree.skills.forEach((s: Skill) => {
                // If we have learned this skill (rank > 0) AND it is active
                if (learnedSkillIds.includes(s.id) && (player.skills![s.id] || 0) > 0 && s.type === 'active') {
                    unlockedSkills.push(s);
                }
            });
        });
    }

    // Merge default class skills + unlocked skills
    const allAvailableSkills = [...classData.skills, ...unlockedSkills];
    // Filter generic duplicates (by ID)
    const uniqueSkillsMap = new Map();
    allAvailableSkills.forEach(s => {
        if (s.type === 'active') uniqueSkillsMap.set(s.id, s);
    });

    const activeSkills = Array.from(uniqueSkillsMap.values());

    return (
        <div className="relative w-full h-full overflow-y-auto bg-cyber-darker">
            <DynamicBackground />

            {/* Combat Arena */}
            <motion.div
                animate={screenShake ? { x: [-5, 5, -5, 5, 0] } : {}}
                transition={{ duration: 0.3 }}
                className="relative z-10 h-full flex flex-col"
            >
                {/* Top Bar - Enemy */}
                <div className="p-6">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="max-w-md ml-auto"
                    >
                        <div className="flex items-center gap-4 mb-2">
                            <div className="text-right flex-1">
                                <div className="text-cyber-pink font-bold text-xl">{enemy.name}</div>
                                <div className="text-gray-400 text-sm font-mono">LVL {enemy.level}</div>
                            </div>
                            <div className="text-6xl">{enemy.id === 'rogue_ai' ? '🤖' : enemy.id === 'gang_leader' ? '💀' : '👾'}</div>
                        </div>
                        <div className="relative h-4 bg-cyber-darker rounded-full overflow-hidden border border-cyber-pink/30">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-pink to-red-500"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(enemyHP / enemy.maxHp) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg">
                                {enemyHP} / {enemy.maxHp}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Center - Combat Zone */}
                {/* Center - Combat Zone */}
                <div className="flex-1 flex items-center justify-between px-4 md:px-12 relative min-h-[250px]">
                    {/* Player */}
                    <motion.div
                        className="relative"
                        animate={glowEffect === 'player' ? { scale: 1.1, filter: 'brightness(1.5)' } : { scale: 1, filter: 'brightness(1)' }}
                    >
                        <div className="text-6xl md:text-9xl drop-shadow-2xl">{classData.icon}</div>
                        {turn === 'player' && !isProcessingTurn && (
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity }} className="absolute -top-8 left-1/2 -translate-x-1/2 text-cyber-cyan text-sm font-bold">YOUR TURN</motion.div>
                        )}
                        {/* Player HP Bar */}
                        <div className="mt-4 relative h-4 bg-cyber-darker rounded-full overflow-hidden border border-cyber-cyan/30 w-32 md:w-48 mx-auto">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-cyan to-blue-500"
                                initial={{ width: '100%' }}
                                animate={{ width: `${(playerHP / maxPlayerHP) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-lg z-10">
                                {playerHP} / {maxPlayerHP}
                            </div>
                        </div>
                    </motion.div>

                    {/* VS */}
                    <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink opacity-50">VS</div>

                    {/* Enemy */}
                    <div className="flex-1 flex items-center justify-center p-6 pb-20">
                        <EnemyCard
                            enemy={enemy}
                            hp={enemyHP}
                            maxHp={enemy.maxHp}
                            isAttacking={glowEffect === 'enemy'}
                            isHit={false} // Would need new state for 'hit reaction' logic, relying on screenShake/glow for now?
                        // Actually let's use screenShake to trigger hit visual in the card 
                        />
                    </div>
                </div>

                {/* Bottom Bar - Player Controls */}
                <div className="p-4 md:p-6 bg-black/40 backdrop-blur-xl border-t border-white/10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-cyber-cyan/20 flex items-center justify-center border border-white/10">
                                <span className="text-2xl">{classData.icon}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="text-white font-bold">{player.username}</div>
                                    <div className="text-xs text-gray-400 font-mono">{Math.floor(playerHP)} / {maxPlayerHP}</div>
                                </div>
                                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-500"
                                        initial={{ width: '100%' }}
                                        animate={{ width: `${(playerHP / maxPlayerHP) * 100}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                            {activeSkills.map((skill) => {
                                const dmg = getSkillValue(skill, 'damage');
                                const heal = getSkillValue(skill, 'heal');
                                return (
                                    <motion.button
                                        key={skill.id}
                                        whileHover={turn === 'player' && !isProcessingTurn ? { scale: 1.02, borderColor: '#00f0ff' } : {}}
                                        whileTap={turn === 'player' && !isProcessingTurn ? { scale: 0.98 } : {}}
                                        onClick={() => handlePlayerAttack(skill)}
                                        disabled={turn !== 'player' || isProcessingTurn}
                                        className={`
                                            p-3 rounded border-2 text-left transition-colors relative overflow-hidden
                                            ${turn === 'player' && !isProcessingTurn ? 'bg-black/60 border-white/10 hover:bg-cyber-cyan/10' : 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'}
                                         `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{skill.icon}</span>
                                            <div>
                                                <div className="font-bold text-sm text-white">{skill.name}</div>
                                                <div className="text-xs text-cyber-yellow font-mono">
                                                    {dmg > 0 ? `${dmg} DMG` : heal > 0 ? `${heal} HEAL` : 'BUFF'}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Log */}
                        <div className="mt-4 h-24 overflow-y-auto font-mono text-xs text-gray-400 bg-black/50 p-2 rounded border border-white/5">
                            {combatLog.map((l, i) => <div key={i}>&gt; {l}</div>)}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Damage Popups */}
            <AnimatePresence>
                {damagePopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -100, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        className={`absolute font-black text-4xl z-50 drop-shadow-[0_0_10px_rgba(0,0,0,1)] ${damagePopup.type === 'heal' ? 'text-green-400' : 'text-red-500'}`}
                        style={{ left: `${damagePopup.x}%`, top: `${damagePopup.y}%` }}
                    >
                        {damagePopup.amount}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
