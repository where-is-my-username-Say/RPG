import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ALL_SKILLS } from '../../data/skills';
import { SkillNode } from './SkillNode';
import { SkillTooltip } from './SkillTooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui'; // Assuming Button is exported from ui

export const SkillTree: React.FC = () => {
    const { player, allocateSkillPoint, resetSkillTree } = useGameStore();
    const [activeTree, setActiveTree] = useState<'tree1' | 'tree2' | 'tree3'>('tree1');
    const [hoveredSkill, setHoveredSkill] = useState<{ id: string; x: number; y: number } | null>(null);

    if (!player) return null;

    const classSkills = ALL_SKILLS[player.classId];
    if (!classSkills) return <div>Class data not found</div>;

    const currentTreeDefinition = classSkills[activeTree];
    const playerSkills = player.skills || {};

    // Group skills by tier for layout
    const skillsByTier: Record<number, any[]> = {};
    currentTreeDefinition.skills.forEach(skill => {
        if (!skillsByTier[skill.tier]) skillsByTier[skill.tier] = [];
        skillsByTier[skill.tier].push(skill);
    });

    const tiers = Object.keys(skillsByTier).map(Number).sort((a, b) => a - b);

    // Helper to check requirements
    const checkRequirements = (skill: any) => {
        if (skill.tier === 1) return true;
        if (skill.requirements) {
            // Check Level
            if (skill.requirements.level && player.level < skill.requirements.level) return false;
            // Check Skill Prereq
            if (skill.requirements.skillId) {
                const reqRank = playerSkills[skill.requirements.skillId] || 0;
                // Default req rank is 3 if not specified? 
                // In data we specified `skillRank: 3`
                if (reqRank < (skill.requirements.skillRank || 1)) return false;
            }
        }
        return true;
    };

    const handleSkillClick = (skill: any) => {
        const currentRank = playerSkills[skill.id] || 0;
        const isUnlocked = checkRequirements(skill);

        if (isUnlocked && currentRank < skill.maxRank && player.skillPoints > 0) {
            allocateSkillPoint(skill.id);
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/60 backdrop-blur-md rounded-xl border border-white/5 overflow-hidden">
            {/* Header / Stats */}
            <div className="p-4 flex justify-between items-center bg-black/40 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple">
                        NEURAL INTERFACE
                    </h2>
                    <div className="px-4 py-1 bg-cyber-gold/20 border border-cyber-gold/50 rounded text-cyber-gold font-bold animate-pulse-slow">
                        POINTS AVAILABLE: {player.skillPoints}
                    </div>
                </div>
                <div className="text-sm text-gray-400">
                    Level {player.level} {classSkills[activeTree].name}
                </div>

                {/* Reset Button placeholder */}
                <button
                    onClick={() => resetSkillTree(activeTree)}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                >
                    Reset Tree
                </button>
            </div>

            {/* Tree Navigation Tabs */}
            <div className="flex border-b border-white/10">
                {(['tree1', 'tree2', 'tree3'] as const).map((treeKey) => (
                    <button
                        key={treeKey}
                        onClick={() => setActiveTree(treeKey)}
                        className={`flex-1 py-3 text-sm font-bold tracking-wider transition-colors relative ${activeTree === treeKey
                                ? 'text-cyber-cyan bg-cyber-cyan/10'
                                : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {classSkills[treeKey].icon} {classSkills[treeKey].name}
                        {activeTree === treeKey && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyber-cyan shadow-[0_0_10px_cyan]"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tree Content Area */}
            <div className="flex-1 overflow-y-auto p-8 relative min-h-[500px]">
                {/* Decorative Background Lines could go here */}

                <div className="flex flex-col items-center gap-12">
                    {tiers.map(tier => (
                        <div key={tier} className="flex gap-16 relative">
                            {/* Tier Label (Optional) */}
                            <div className="absolute -left-20 top-1/2 -translate-y-1/2 text-xs text-gray-700 font-mono">
                                TIER {tier}
                            </div>

                            {skillsByTier[tier].map(skill => {
                                const currentRank = playerSkills[skill.id] || 0;
                                const isUnlocked = checkRequirements(skill);
                                let status: 'locked' | 'available' | 'learned' | 'maxed' = 'locked';

                                if (currentRank >= skill.maxRank) status = 'maxed';
                                else if (currentRank > 0) status = 'learned';
                                else if (isUnlocked) status = 'available';

                                return (
                                    <SkillNode
                                        key={skill.id}
                                        skill={skill}
                                        currentRank={currentRank}
                                        status={status}
                                        onClick={() => handleSkillClick(skill)}
                                        onMouseEnter={(e) => {
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setHoveredSkill({ id: skill.id, x: rect.right, y: rect.top });
                                        }}
                                        onMouseLeave={() => setHoveredSkill(null)}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Tooltip Portal */}
            <AnimatePresence>
                {hoveredSkill && (
                    (() => {
                        // Find skill data for tooltip
                        const skill = currentTreeDefinition.skills.find(s => s.id === hoveredSkill.id);
                        if (!skill) return null;
                        const rank = playerSkills[skill.id] || 0;

                        return (
                            <SkillTooltip
                                key="tooltip"
                                skill={skill}
                                currentRank={rank}
                                position={{ x: hoveredSkill.x, y: hoveredSkill.y }}
                            />
                        );
                    })()
                )}
            </AnimatePresence>
        </div>
    );
};
