import { motion } from 'framer-motion';
import type { CombatEnemy } from '../../types';

interface EnemyCardProps {
    enemy: CombatEnemy;
    hp: number;
    maxHp: number;
    isAttacking?: boolean;
    isHit?: boolean;
}

export function EnemyCard({ enemy, hp, maxHp, isAttacking, isHit }: EnemyCardProps) {
    const hpPercent = (hp / maxHp) * 100;

    return (
        <div className="relative w-full max-w-md mx-auto aspect-square md:aspect-[4/3] flex items-center justify-center">
            {/* Holographic Frame */}
            <div className="absolute inset-0 border-2 border-cyber-cyan/30 rounded-lg clip-path-cyber" />
            <div className="absolute inset-0 bg-cyber-cyan/5 backdrop-blur-sm rounded-lg" />

            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan" />

            {/* Scan Line Animation */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-cyber-pink/50 shadow-[0_0_10px_rgba(255,0,128,0.5)] z-10 pointer-events-none"
            />

            {/* Main Content */}
            <motion.div
                animate={
                    isHit ? { x: [-10, 10, -5, 5, 0], filter: 'brightness(2) hue-rotate(90deg)' } :
                        isAttacking ? { scale: [1, 1.2, 1], z: 50 } :
                            { y: [0, -10, 0] }
                }
                transition={{ duration: isHit ? 0.3 : isAttacking ? 0.5 : 4, repeat: isHit || isAttacking ? 0 : Infinity }}
                className="relative z-20 w-3/4 h-3/4 flex items-center justify-center"
            >
                {enemy.image ? (
                    <img
                        src={enemy.image}
                        alt={enemy.name}
                        className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    />
                ) : (
                    <div className="text-8xl md:text-9xl drop-shadow-cyber animate-pulse">
                        {enemy.id === 'rogue_ai' ? '🤖' : enemy.id === 'gang_leader' ? '💀' : '👾'}
                    </div>
                )}
            </motion.div>

            {/* Stats Overlay */}
            <div className="absolute bottom-4 left-4 right-4 space-y-2">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-xs text-cyber-cyan font-mono tracking-widest">TARGET DETECTED</div>
                        <div className="text-xl font-bold text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
                            {enemy.name}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-cyber-pink font-mono mb-1">THREAT LEVEL {enemy.level}</div>
                        <div className="flex gap-2 text-[10px] font-mono text-gray-300">
                            <span className="bg-black/40 px-1 border border-white/10">ATK {enemy.attack}</span>
                            <span className="bg-black/40 px-1 border border-white/10">DEF {enemy.defense}</span>
                        </div>
                    </div>
                </div>

                {/* HP Bar */}
                <div className="h-4 bg-black/60 border border-white/10 rounded-sm overflow-hidden relative">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-pink to-red-600"
                        initial={{ width: '100%' }}
                        animate={{ width: `${hpPercent}%` }}
                        transition={{ duration: 0.3 }}
                    />
                    {/* Glitch Overlay on Bar */}
                    <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-20 pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white tracking-widest drop-shadow-md">
                        {hp} / {maxHp}
                    </div>
                </div>
            </div>

            {/* Intent Indicator (Placeholder logic for now) */}
            <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4"
            >
                {isAttacking && (
                    <div className="px-2 py-1 bg-red-500/20 border border-red-500 text-red-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                        ⚠️ ASSAULT IMMINENT
                    </div>
                )}
            </motion.div>
        </div>
    );
}
