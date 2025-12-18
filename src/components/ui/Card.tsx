import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    onClick?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    layoutId?: string;
    isSelected?: boolean;
    className?: string;
}

export function Card({ children, onClick, onMouseEnter, onMouseLeave, layoutId, isSelected = false, className = '' }: CardProps) {
    return (
        <motion.div
            layoutId={layoutId}
            whileHover={{ scale: onClick ? 1.05 : 1, y: onClick ? -5 : 0 }}
            whileTap={{ scale: onClick ? 0.95 : 1 }}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`
        bg-cyber-dark/60 backdrop-blur-sm
        border-2 transition-all duration-300
        rounded-lg p-4
        ${isSelected
                    ? 'border-cyber-cyan shadow-[0_0_30px_rgba(0,240,255,0.5)]'
                    : 'border-cyber-cyan/20 hover:border-cyber-cyan/50'
                }
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}
