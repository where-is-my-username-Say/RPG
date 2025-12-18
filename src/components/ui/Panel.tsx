import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface PanelProps {
    children: ReactNode;
    title?: string;
    className?: string;
    glowColor?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'orange';
}

export function Panel({ children, title, className = '', glowColor = 'cyan' }: PanelProps) {
    const glowColors = {
        cyan: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
        purple: 'shadow-[0_0_20px_rgba(176,38,255,0.3)]',
        pink: 'shadow-[0_0_20px_rgba(255,0,110,0.3)]',
        yellow: 'shadow-[0_0_20px_rgba(255,190,11,0.3)]',
        orange: 'shadow-[0_0_20px_rgba(249,115,22,0.3)]'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`
        bg-cyber-darker/60 backdrop-blur-xl
        border border-white/10
        rounded-xl
        flex flex-col
        ${glowColors[glowColor]}
        ${className}
      `}
        >
            {title && (
                <div className="border-b border-cyber-cyan/30 px-4 py-3 shrink-0">
                    <h3 className="text-cyber-cyan font-bold uppercase tracking-widest text-sm">
                        {title}
                    </h3>
                </div>
            )}
            <div className="p-4 flex-1 min-h-0">
                {children}
            </div>
        </motion.div>
    );
}
