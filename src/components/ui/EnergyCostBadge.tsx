import { motion } from 'framer-motion';

interface EnergyCostBadgeProps {
    cost: number;
    currentEnergy: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    size?: 'sm' | 'md' | 'lg';
}

export function EnergyCostBadge({
    cost,
    currentEnergy,
    position = 'top-right',
    size = 'md'
}: EnergyCostBadgeProps) {
    const hasEnough = currentEnergy >= cost;

    const positions = {
        'top-right': 'top-2 right-2',
        'top-left': 'top-2 left-2',
        'bottom-right': 'bottom-2 right-2',
        'bottom-left': 'bottom-2 left-2',
    };

    const sizes = {
        sm: 'text-[10px] px-2 py-1',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
    };

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            className={`
                absolute ${positions[position]} ${sizes[size]}
                flex items-center gap-1 rounded-full font-bold font-mono
                border-2 backdrop-blur-sm z-10
                ${hasEnough
                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                }
            `}
        >
            <span className="text-sm">⚡</span>
            <span>{cost}</span>

            {/* Pulse animation when insufficient */}
            {!hasEnough && (
                <motion.div
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-red-500 rounded-full"
                />
            )}
        </motion.div>
    );
}
