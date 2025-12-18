import React from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '../../types';

interface SkillNodeProps {
    skill: Skill;
    currentRank: number;
    status: 'locked' | 'available' | 'learned' | 'maxed';
    onClick: () => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: () => void;
}

export const SkillNode: React.FC<SkillNodeProps> = ({
    skill,
    currentRank,
    status,
    onClick,
    onMouseEnter,
    onMouseLeave
}) => {
    // Visual styles based on status
    const getStyles = () => {
        switch (status) {
            case 'maxed':
                return 'border-cyber-purple bg-cyber-purple/20 shadow-[0_0_15px_rgba(176,38,255,0.6)] text-cyber-purple';
            case 'learned':
                return 'border-cyber-green bg-cyber-green/20 shadow-[0_0_10px_rgba(50,255,50,0.4)] text-cyber-green';
            case 'available':
                return 'border-cyber-cyan bg-cyber-cyan/10 shadow-[0_0_10px_rgba(0,243,255,0.4)] text-cyber-cyan hover:bg-cyber-cyan/20 cursor-pointer animate-pulse-slow';
            case 'locked':
            default:
                return 'border-gray-700 bg-black/40 text-gray-600 grayscale opacity-70 cursor-not-allowed';
        }
    };

    return (
        <motion.div
            className={`relative w-16 h-16 border-2 transform rotate-45 flex items-center justify-center m-4 transition-all duration-300 ${getStyles()}`}
            whileHover={status !== 'locked' ? { scale: 1.1, rotate: 45 } : { rotate: 45 }}
            whileTap={status === 'available' ? { scale: 0.95, rotate: 45 } : { rotate: 45 }}
            onClick={status !== 'locked' ? onClick : undefined}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Icon Content (Counter-rotated to appear straight) */}
            <div className={`transform -rotate-45 text-2xl flex flex-col items-center justify-center w-full h-full`}>
                <span>{skill.icon}</span>

                {/* Rank Indicator */}
                <div className="absolute -bottom-5 text-[10px] font-bold tracking-wider bg-black/80 px-1 rounded border border-current">
                    {currentRank}/{skill.maxRank}
                </div>
            </div>

            {/* Connecting Lines Placeholder (Handled by parent usually, but could be nodes) */}
        </motion.div>
    );
};
