import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Button, Panel, NavigationBar } from '../ui';
import { DynamicBackground } from '../cyber/DynamicBackground';
import type { InventoryItem } from '../../types';

export function InventoryView() {
    const { player, equipItem, unequipItem, sellItem } = useGameStore();
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

    if (!player) return null;

    const inventory = player.inventory || [];
    const equipment = player.equipment || {};

    const handleEquip = (item: InventoryItem) => {
        equipItem(item);
        setSelectedItem(null);
    };

    const handleSell = (item: InventoryItem) => {
        sellItem(item.itemId, item.quantity);
        setSelectedItem(null);
    };

    const handleUnequip = (slot: 'helmet' | 'chest' | 'legs' | 'weapon') => {
        unequipItem(slot);
    };

    // Calculate Stats
    // FIX: Don't call getPlayerStats() in selector - causes infinite loop!
    const getPlayerStats = useGameStore(state => state.getPlayerStats);
    const playerStats = getPlayerStats();

    const totalDefense = playerStats.defense;
    const totalDamage = playerStats.attack;
    const totalCrit = playerStats.critChance;

    return (
        <div className="relative min-h-[100dvh] text-white select-none bg-black font-mono pb-32">
            <DynamicBackground />

            {/* Header */}
            <div className="relative z-10 p-6 flex justify-between items-center border-b border-white/10 bg-black/60 backdrop-blur-md">
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple tracking-[0.2em] uppercase">
                    Cyber Armory
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">Balance</div>
                    <div className="text-xl font-bold text-cyber-yellow">{player.gold.toLocaleString()} ₵</div>
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 pb-20">

                {/* LEFT: EQUIPMENT LOADOUT */}
                <Panel title="ACTIVE OPERATIVE LOADOUT" glowColor="purple" className="flex flex-col items-center justify-center relative">
                    <div className="relative w-full max-w-md aspect-[4/5] md:aspect-[3/4] bg-cyber-darker/50 rounded-xl border border-cyber-purple/20 flex items-center justify-center relative overflow-hidden group">
                        {/* Content... */}
                        {/* Glowing Grid Background */}
                        <div className="absolute inset-0"
                            style={{
                                backgroundImage: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%), linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)',
                                backgroundSize: '100% 100%, 20px 20px, 20px 20px'
                            }}
                        />

                        {/* Silhouette */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                            <div className="text-[150px] md:text-[250px] animate-pulse-slow">👤</div>
                        </div>

                        {/* Equipment Slots */}
                        <div className="grid grid-cols-3 grid-rows-4 gap-2 md:gap-4 w-full h-full p-4 md:p-8 relative z-10">

                            {/* Helmet */}
                            <div className="col-start-2 row-start-1 flex justify-center">
                                <EquipmentSlot
                                    type="HELMET"
                                    item={equipment.helmet}
                                    onClick={() => equipment.helmet && handleUnequip('helmet')}
                                />
                            </div>

                            {/* Weapon */}
                            <div className="col-start-1 row-start-2 flex justify-center items-center">
                                <EquipmentSlot
                                    type="WEAPON"
                                    item={equipment.weapon}
                                    onClick={() => equipment.weapon && handleUnequip('weapon')}
                                />
                            </div>

                            {/* Chest */}
                            <div className="col-start-2 row-start-2 flex justify-center items-center">
                                <EquipmentSlot
                                    type="CHEST"
                                    item={equipment.chest}
                                    onClick={() => equipment.chest && handleUnequip('chest')}
                                />
                            </div>

                            {/* Legs */}
                            <div className="col-start-2 row-start-3 flex justify-center">
                                <EquipmentSlot
                                    type="LEGS"
                                    item={equipment.legs}
                                    onClick={() => equipment.legs && handleUnequip('legs')}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Stats Display */}
                    <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-md">
                        <StatBox label="DEFENSE" value={totalDefense} color="text-blue-400" />
                        <StatBox label="DAMAGE" value={totalDamage} color="text-red-400" />
                        <StatBox label="CRITICAL" value={totalCrit} suffix="%" color="text-yellow-400" />
                    </div>
                </Panel>

                {/* RIGHT: INVENTORY GRID */}
                <Panel title="STORAGE MATRIX" glowColor="cyan" className="flex flex-col relative h-auto min-h-[500px]">
                    <div className="grid grid-cols-5 md:grid-cols-6 gap-3 content-start p-2">
                        {inventory.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                whileHover={{ scale: 1.05, borderColor: '#00f0ff', backgroundColor: 'rgba(0, 240, 255, 0.1)' }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    aspect-square bg-black/40 border border-white/5 rounded-lg cursor-pointer 
                                    flex flex-col items-center justify-center relative group transition-colors
                                    ${selectedItem?.id === item.id ? 'border-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)] bg-cyber-cyan/10' : ''}
                                `}
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="text-3xl mb-1 filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{item.icon || '📦'}</div>
                                <div className="absolute bottom-1 w-full text-[9px] text-gray-400 text-center leading-none px-1 truncate">{item.name || item.itemId}</div>
                                <div className="absolute top-1 right-1 text-[9px] text-cyber-yellow font-bold">{item.quantity > 1 ? item.quantity : ''}</div>

                                {item.rarity && (
                                    <div className={`absolute inset-0 border-2 rounded-lg pointer-events-none opacity-40 ${getRarityColor(item.rarity)}`} />
                                )}
                            </motion.div>
                        ))}
                        {/* Empty Slots */}
                        {Array.from({ length: Math.max(0, 30 - inventory.length) }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-black/20 border border-white/5 rounded-lg opacity-30" />
                        ))}
                    </div>

                    {/* Item Detail Modal / Overlay */}
                    <AnimatePresence>
                        {selectedItem && (
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 100, opacity: 0 }}
                                className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-cyber-cyan/30 p-6 pb-24 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] z-50"
                            >
                                <div className="flex gap-6">
                                    <div className="w-24 h-24 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center text-6xl shadow-inner">
                                        {selectedItem.icon || '📦'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-white tracking-wide">{selectedItem.name}</h3>
                                                <div className="text-xs text-cyber-purple font-mono uppercase tracking-widest">{selectedItem.subtype || 'MATERIAL'}</div>
                                            </div>
                                            {selectedItem.rarity && (
                                                <span className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border bg-black/50 ${getRarityColor(selectedItem.rarity)}`}>
                                                    {selectedItem.rarity}
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-sm text-gray-400 mb-4 font-light leading-relaxed">
                                            {selectedItem.description || "No data available."}
                                            {selectedItem.stats && (
                                                <div className="mt-4 bg-black/40 p-3 rounded border border-white/10 space-y-2">
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 border-b border-white/5 pb-1">Stat Analysis</div>

                                                    {/* Stat Comparison Helper */}
                                                    {[
                                                        { label: 'DEF', key: 'defense', val: selectedItem.stats.defense, color: 'text-blue-400' },
                                                        { label: 'ATK', key: 'attack', val: selectedItem.stats.attack, color: 'text-red-400' },
                                                        { label: 'CRIT', key: 'critChance', val: selectedItem.stats.critChance, color: 'text-yellow-400' }
                                                    ].map(stat => {
                                                        if (!stat.val) return null;

                                                        // Find currently equipped item for this slot to compare
                                                        let equippedVal = 0;
                                                        if (selectedItem.type === 'WEAPON' && equipment.weapon?.stats) equippedVal = (equipment.weapon.stats as any)[stat.key] || 0;
                                                        if (selectedItem.subtype?.includes('HELMET') && equipment.helmet?.stats) equippedVal = (equipment.helmet.stats as any)[stat.key] || 0;
                                                        if (selectedItem.subtype?.includes('CHEST') && equipment.chest?.stats) equippedVal = (equipment.chest.stats as any)[stat.key] || 0;
                                                        if (selectedItem.subtype?.includes('LEGS') && equipment.legs?.stats) equippedVal = (equipment.legs.stats as any)[stat.key] || 0;

                                                        const diff = stat.val - equippedVal;
                                                        const diffColor = diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500';
                                                        const diffIcon = diff > 0 ? '▲' : diff < 0 ? '▼' : '-';

                                                        return (
                                                            <div key={stat.label} className="flex justify-between items-center text-xs font-mono">
                                                                <span className="text-gray-400">{stat.label}</span>
                                                                <div className="flex gap-2">
                                                                    <span className={`font-bold ${stat.color}`}>+{stat.val}</span>
                                                                    {equippedVal > 0 && (
                                                                        <span className={`${diffColor} text-[10px]`}>
                                                                            {diffIcon} {Math.abs(diff)}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            {selectedItem.type === 'ARMOR' || selectedItem.type === 'WEAPON' ? (
                                                <Button
                                                    variant="primary"
                                                    className="flex-1 bg-cyber-cyan hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                                                    onClick={() => handleEquip(selectedItem)}
                                                >
                                                    EQUIP SYSTEM
                                                </Button>
                                            ) : null}

                                            <Button
                                                variant="danger"
                                                className="flex-1 border-red-500/50 hover:bg-red-500/10 text-red-400"
                                                onClick={() => handleSell(selectedItem)}
                                            >
                                                SELL ({((selectedItem.value || 10) * selectedItem.quantity).toLocaleString()} ₵)
                                            </Button>

                                            <Button variant="secondary" onClick={() => setSelectedItem(null)}>
                                                CLOSE
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Panel>
            </div>

            {/* Navigation Bar */}
            <NavigationBar />
        </div>
    );
}

function EquipmentSlot({ type, item, onClick }: { type: string, item?: InventoryItem, onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`
                w-24 h-24 rounded-lg flex flex-col items-center justify-center relative transition-all duration-300
                ${item
                    ? `bg-cyber-dark/80 border-2 ${getRarityColor(item.rarity || 'COMMON')} cursor-pointer hover:scale-105 shadow-[0_0_15px_rgba(0,0,0,0.5)]`
                    : 'bg-black/20 border border-dashed border-white/10 opacity-50'}
            `}
        >
            {item ? (
                <>
                    <div className="text-4xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">{item.icon}</div>
                    <div className="absolute -bottom-2 px-2 py-0.5 bg-black/80 rounded border border-white/10 text-[9px] text-white truncate max-w-full">
                        {item.name}
                    </div>
                </>
            ) : (
                <div className="text-gray-600 text-[10px] font-mono tracking-widest uppercase">{type}</div>
            )}
        </div>
    );
}

function StatBox({ label, value, color, suffix = '' }: { label: string, value: number, color: string, suffix?: string }) {
    return (
        <div className="bg-black/30 p-2 rounded border border-white/5 text-center">
            <div className="text-[10px] text-gray-500 mb-1 tracking-widest">{label}</div>
            <div className={`text-2xl font-black font-mono ${color}`}>
                {value > 0 ? `+${value}` : value}{suffix}
            </div>
        </div>
    );
}

function getRarityColor(rarity: string) {
    switch (rarity) {
        case 'COMMON': return 'border-gray-500 text-gray-500 shadow-gray-500/20';
        case 'UNCOMMON': return 'border-green-500 text-green-500 shadow-green-500/20';
        case 'RARE': return 'border-blue-500 text-blue-500 shadow-blue-500/20';
        case 'EPIC': return 'border-purple-500 text-purple-500 shadow-purple-500/20';
        case 'LEGENDARY': return 'border-orange-500 text-orange-500 shadow-orange-500/20';
        case 'MYTHIC': return 'border-red-600 text-red-600 shadow-red-600/20';
        default: return 'border-white text-white';
    }
}
