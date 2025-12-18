import { motion } from 'framer-motion';
import { CombatArena } from './CombatArena';
import type { CombatEnemy } from '../../types';

interface CombatModalProps {
    enemy: CombatEnemy;
    onVictory: (rewards: { xp: number; gold: number; items?: string[] }) => void;
    onDefeat: () => void;
}

export function CombatModal({ enemy, onVictory, onDefeat }: CombatModalProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 md:p-6"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full h-full max-w-[1600px] border border-cyber-cyan/30 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative bg-cyber-darker"
            >
                {/* Close/Flee button could go here provided from outside or inside arena */}
                <CombatArena enemy={enemy} onVictory={onVictory} onDefeat={onDefeat} />
            </motion.div>
        </motion.div>
    );
}
