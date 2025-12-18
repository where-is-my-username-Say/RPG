import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMiningStore, type MiningCell } from '../../store/miningStore';

export function MiningGrid() {
    const { grid, initGrid, handleCellClick, miningMessage } = useMiningStore();

    useEffect(() => {
        initGrid();
    }, [initGrid]);

    if (!grid || grid.length === 0) return <div className="text-white animate-pulse">Scanning Sector...</div>;

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 h-6 text-cyber-cyan font-mono text-sm tracking-wider">
                {miningMessage || "SYSTEM READY"}
            </div>

            <div className="grid grid-cols-8 gap-2 p-4 bg-black/40 border border-white/10 rounded-lg backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {grid.map((cell) => (
                    <Cell key={cell.id} cell={cell} onClick={() => handleCellClick(cell.x, cell.y)} />
                ))}
            </div>

            <div className="mt-4 text-xs text-gray-500 font-mono">
                GRID STATUS: 8x8 SECTOR // DEPTH: SURFACE
            </div>
        </div>
    );
}

function Cell({ cell, onClick }: { cell: MiningCell; onClick: () => void }) {
    // Visuals based on state
    // Hidden: Gray/Black Pattern
    // Revealed Empty: Dark Gray flat
    // Revealed Ore: Colored Glow

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 
                rounded cursor-pointer relative overflow-hidden
                flex items-center justify-center
                transition-colors duration-300
                ${!cell.isRevealed
                    ? 'bg-slate-800 border border-white/5 hover:border-cyber-cyan/30'
                    : cell.content
                        ? 'bg-slate-900 border border-white/10' // customized by inline style for ore
                        : 'bg-black/20 border border-white/5 opacity-50'
                }
            `}
            style={
                cell.isRevealed && cell.content
                    ? { boxShadow: `inset 0 0 15px ${cell.content.color}40`, borderColor: cell.content.color }
                    : {}
            }
        >
            {!cell.isRevealed && (
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700 via-transparent to-transparent bg-[length:4px_4px]" />
            )}

            <AnimatePresence>
                {cell.isRevealed && cell.content && cell.health > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-2xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                    >
                        {/* Placeholder Icon or Real Icon */}
                        💎
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Health Bar for rocks/ores */}
            {cell.isRevealed && cell.health < cell.maxHealth && cell.health > 0 && (
                <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-red-500"
                        initial={{ width: '100%' }}
                        animate={{ width: `${(cell.health / cell.maxHealth) * 100}%` }}
                    />
                </div>
            )}

            {/* Cleared State */}
            {cell.isRevealed && cell.health <= 0 && !cell.content && (
                <div className="text-gray-700 text-xs">
                    x
                </div>
            )}
        </motion.div>
    );
}
