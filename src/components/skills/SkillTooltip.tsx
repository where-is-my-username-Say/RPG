import React from 'react';
import type { Skill } from '../../types';
import { motion } from 'framer-motion';

interface SkillTooltipProps {
    skill: Skill;
    currentRank: number;
    position: { x: number; y: number };
}

export const SkillTooltip: React.FC<SkillTooltipProps> = ({ skill, currentRank, position }) => {
    // Calculate current stats for display if needed
    // For now, rely on description. Later we can parse effects.

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className="fixed z-50 w-64 p-4 pointer-events-none bg-black/90 border border-cyber-cyan/50 text-cyan-50 rounded-lg shadow-[0_0_20px_rgba(0,243,255,0.2)] backdrop-blur-sm"
            style={{
                left: position.x + 20,
                top: position.y - 20
            }}
        >
            <div className="flex justify-between items-start mb-2 border-b border-white/10 pb-2">
                <h3 className="font-bold text-lg text-cyber-cyan">{skill.name}</h3>
                <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-white/70 uppercase tracking-wider">
                    {skill.type}
                </span>
            </div>

            <div className="space-y-2 text-sm">
                <div>
                    <span className="text-gray-400">Rank:</span> <span className="text-white">{currentRank} / {skill.maxRank}</span>
                </div>

                {skill.type === 'active' && (
                    <div className="flex gap-3 text-xs text-gray-400">
                        <span>⚡ {skill.energyCost} Energy</span>
                        <span>⏳ {skill.cooldown} Turn CD</span>
                    </div>
                )}

                <p className="text-gray-300 italic my-2">
                    {skill.description}
                </p>

                {/* Requirements Display could go here if we passed them in */}

                {currentRank < skill.maxRank && currentRank > 0 && (
                    <div className="text-xs text-cyber-green mt-2 pt-2 border-t border-white/10">
                        Next Rank: Effect increases
                    </div>
                )}

                {skill.requirements && (
                    <div className="text-xs text-gray-500 mt-2">
                        Requires: {skill.requirements.level ? `Lvl ${skill.requirements.level}` : ''}
                        {skill.requirements.skillId ? `Skill Pre-req` : ''}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
