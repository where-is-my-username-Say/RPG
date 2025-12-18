import { motion } from 'framer-motion';

interface ProgressBarProps {
    current: number;
    max: number;
    color?: 'cyan' | 'purple' | 'pink' | 'yellow' | 'green' | 'red';
    label?: string;
    showValues?: boolean;
}

export function ProgressBar({
    current,
    max,
    color = 'cyan',
    label,
    showValues = true
}: ProgressBarProps) {
    const percentage = Math.min(100, (current / max) * 100);

    const colors = {
        cyan: 'bg-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]',
        purple: 'bg-cyber-purple shadow-[0_0_10px_rgba(176,38,255,0.8)]',
        pink: 'bg-cyber-pink shadow-[0_0_10px_rgba(255,0,110,0.8)]',
        yellow: 'bg-cyber-yellow shadow-[0_0_10px_rgba(255,190,11,0.8)]',
        green: 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]',
        red: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
    };

    return (
        <div className="space-y-1">
            {(label || showValues) && (
                <div className="flex justify-between text-xs font-mono">
                    {label && <span className="text-gray-400 uppercase">{label}</span>}
                    {showValues && <span className="text-white">{Math.ceil(current)} / {max}</span>}
                </div>
            )}
            <div className="h-2 bg-cyber-darker border border-white/10 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full ${colors[color]}`}
                />
            </div>
        </div>
    );
}
