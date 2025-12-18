import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { MINING_NODES, ORES, type Ore, type MiningNode } from '../../data/ores';
import { PICKAXES } from '../../data/items';
import { Panel, Button, NavigationBar } from '../ui';
import { DynamicBackground } from '../cyber/DynamicBackground';

export function MiningView() {
    const { player, addItem, gainGold, gainXP } = useGameStore();
    const { addToast } = useUIStore();
    const [selectedRegion, setSelectedRegion] = useState<'Stonewake' | 'Forgotten Kingdom' | 'Goblin Cave'>('Stonewake');
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [nodeHP, setNodeHP] = useState<number>(10);
    const [isMining, setIsMining] = useState(false);
    const [isRespawning, setIsRespawning] = useState(false);
    const [showShop, setShowShop] = useState(false);
    const [showSell, setShowSell] = useState(false);
    const [dropPopup, setDropPopup] = useState<{ ore: Ore, amount: number }[] | null>(null);
    const [weakSpot, setWeakSpot] = useState<{ x: number, y: number } | null>(null);
    const [cooldownKey, setCooldownKey] = useState(0); // Forces animation reset
    const [lastMineTime, setLastMineTime] = useState(0);
    const [lootLog, setLootLog] = useState<{ id: number, text: string, color: string }[]>([]);

    // Initial load
    useEffect(() => {
        const firstNode = MINING_NODES.find(n => n.region === selectedRegion);
        if (firstNode) {
            setSelectedNodeId(firstNode.id);
            setNodeHP(firstNode.hp);
        }
    }, [selectedRegion]);

    const currentNode = MINING_NODES.find(n => n.id === selectedNodeId);

    // Spawn weak spot when node changes or respawns
    useEffect(() => {
        if (currentNode && !isRespawning) {
            spawnWeakSpot();
        } else {
            setWeakSpot(null);
        }
    }, [selectedNodeId, isRespawning]);

    const spawnWeakSpot = () => {
        // Random position within approx 100px radius of center
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 80 + 20; // 20-100px from center
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        setWeakSpot({ x, y });
    };

    // Calculate Best Pickaxe
    const bestPickaxe = PICKAXES.reduce((best, current) => {
        const owned = player?.inventory?.some(i => i.itemId === current.id);
        if ((owned || current.id === 'stone_pickaxe') && current.power > best.power) return current;
        return best;
    }, PICKAXES[0]);

    if (!player) return null;

    const handleMine = (e: React.PointerEvent<HTMLDivElement> | React.MouseEvent, isWeakSpotHit: boolean) => {
        e.stopPropagation();
        if (!currentNode || isRespawning || nodeHP <= 0) return;

        const now = Date.now();
        if (now - lastMineTime < 1200) return; // 1.2s Cooldown
        setLastMineTime(now);
        setCooldownKey(prev => prev + 1); // Trigger animation

        setIsMining(true);
        setTimeout(() => setIsMining(false), 100);

        const power = bestPickaxe.power;

        if (power < currentNode.requiredPower) {
            return;
        }

        // Damage Calculation
        let damage = power;
        if (!isWeakSpotHit) {
            damage = Math.floor(power * 0.2); // 20% Damage on miss
            // Minimal 1 dmg if power sufficient
            damage = Math.max(1, damage);
        } else {
            // 100% Damage + Respawn Weak Spot
            spawnWeakSpot();
        }

        // Ensure at least 1 dmg if they have requirements
        damage = Math.max(1, damage);

        const newHP = Math.max(0, nodeHP - damage);
        setNodeHP(newHP);

        // Visual Feedback
        // TODO: Floating text for damage? For now just HP bar.

        if (newHP <= 0) {
            handleBreakNode(currentNode);
        }
    };

    const handleBreakNode = (node: MiningNode) => {
        try {
            console.log("Breaking node:", node.name);
            setIsRespawning(true);

            // 1. Determine Total Drops
            let totalDrops = 1;
            const roll = Math.random();

            if (roll < 0.60) { // 60% chance
                totalDrops = 1;
            } else if (roll < 0.90) { // 30% chance
                totalDrops = 2;
            } else if (roll < 0.98) { // 8% chance
                totalDrops = 3;
            } else { // 2% chance (Jackpot)
                totalDrops = Math.floor(Math.random() * 2) + 4; // 4-5
            }

            console.log(`Drop Roll: ${roll.toFixed(2)}, Total Drops: ${totalDrops}`);

            // 2. Roll specific ores
            const dropsReceived: Record<string, number> = {};
            const drops = node.drops;
            const totalWeight = drops.reduce((sum, d) => sum + d.chance, 0);

            for (let i = 0; i < totalDrops; i++) {
                let r = Math.random() * totalWeight;
                for (const drop of drops) {
                    if (r < drop.chance) {
                        dropsReceived[drop.oreId] = (dropsReceived[drop.oreId] || 0) + 1;
                        break;
                    }
                    r -= drop.chance;
                }
            }

            console.log("Drops determiend:", dropsReceived);

            // 3. Add to Inventory & Prepare Popup
            const newPopupData: { ore: Ore, amount: number }[] = [];

            Object.entries(dropsReceived).forEach(([oreId, amount]) => {
                console.log(`Adding item: ${oreId} x${amount}`);
                addItem(oreId, amount);
                const ore = ORES[oreId];
                if (ore) {
                    newPopupData.push({ ore, amount });
                    // Award XP for each ore mined
                    if (ore.xp) {
                        const earnedXP = ore.xp * amount;
                        console.log(`Gaining XP: ${earnedXP}`);
                        gainXP(earnedXP);
                        // Add XP to popup data for logging
                        newPopupData.push({ ore, amount, isXP: true, xpAmount: earnedXP } as any);
                    }
                } else {
                    console.error(`Ore definition not found for ID: ${oreId}`);
                }
            });

            if (newPopupData.length > 0) {
                setDropPopup(newPopupData);
                // Add to visible log
                newPopupData.forEach(d => {
                    const logId = Date.now() + Math.random();
                    if ((d as any).isXP) {
                        setLootLog(prev => [...prev.slice(-4), { id: logId, text: `+${(d as any).xpAmount} XP`, color: '#fbbf24' }]); // XP Yellow
                    } else {
                        setLootLog(prev => [...prev.slice(-4), { id: logId, text: `+${d.amount} ${d.ore.name}`, color: d.ore.color }]);
                    }
                });
            } else {
                console.warn("No valid drops generated.");
                setLootLog(prev => [...prev.slice(-4), { id: Date.now(), text: "No useful materials found", color: "#6b7280" }]);
            }

            // Respawn Logic
            setTimeout(() => {
                setNodeHP(node.hp);
                setDropPopup(null);
                setIsRespawning(false);
            }, 1500);
        } catch (error) {
            console.error("Mining Critical Error:", error);
            addToast("Mining Error: Check Console", 'error');
            setNodeHP(node.hp);
            setIsRespawning(false);
        }
    };

    // Filter nodes by region
    const regionNodes = MINING_NODES.filter(n => n.region === selectedRegion);
    const inventoryOres = player.inventory?.filter(item => ORES[item.itemId]) || [];

    // Sell Logic
    const handleSell = (oreId: string, quantity: number) => {
        const ore = ORES[oreId];
        if (!ore) return;

        const totalValue = Math.floor(ore.value * quantity);
        addItem(oreId, -quantity);
        gainGold(totalValue);
    };

    return (
        <div className="relative min-h-[100dvh] bg-black text-white select-none pb-48">
            <DynamicBackground />

            {/* Header / Nav */}
            <div className="relative z-10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10 bg-black/60 backdrop-blur-sm">
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    <Button variant="secondary" onClick={() => setShowShop(true)} className="bg-orange-500/20 text-orange-400 border-orange-500/50 whitespace-nowrap min-h-[44px]">
                        🛒 SHOP
                    </Button>
                    <Button variant="secondary" onClick={() => setShowSell(true)} className="bg-green-500/20 text-green-400 border-green-500/50 whitespace-nowrap min-h-[44px]">
                        💰 SELL ORES
                    </Button>
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {(['Stonewake', 'Forgotten Kingdom', 'Goblin Cave'] as const).map(region => (
                        <button
                            key={region}
                            onClick={() => setSelectedRegion(region)}
                            className={`px-3 py-1 md:px-4 md:py-2 rounded text-xs md:text-sm font-bold transition-all border whitespace-nowrap min-h-[44px] ${selectedRegion === region
                                ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                                : 'bg-black/40 border-white/10 text-gray-500 hover:text-white'
                                }`}
                        >
                            {region.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 md:p-6 pb-40 md:pb-6">

                {/* Left: Mining Zones - Mobile Friendly Height */}
                <Panel title={`NODES: ${selectedRegion.toUpperCase()}`} glowColor="cyan" className="h-72 lg:h-full order-2 lg:order-1">
                    <div className="space-y-2 max-h-full overflow-y-auto pr-2 custom-scrollbar">
                        {regionNodes.map(node => (
                            <div
                                key={node.id}
                                onClick={() => {
                                    setSelectedNodeId(node.id);
                                    setNodeHP(node.hp);
                                    setIsRespawning(false);
                                }}
                                className={`
                                    p-3 rounded border cursor-pointer transition-all
                                    ${selectedNodeId === node.id
                                        ? 'bg-cyber-cyan/20 border-cyber-cyan text-white'
                                        : 'bg-black/20 border-white/5 text-gray-400 hover:bg-white/5'}
                                `}
                            >
                                <div className="font-bold">{node.name}</div>
                                <div className={`text-xs font-mono ${bestPickaxe.power >= node.requiredPower ? 'text-green-400' : 'text-red-500'}`}>
                                    PWR: {node.requiredPower} / YOU: {bestPickaxe.power}
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>

                {/* Center: The Rock */}
                <div className="flex flex-col items-center justify-center relative order-1 lg:order-2 py-10 lg:py-0">
                    {/* Dropped popup */}
                    <AnimatePresence>
                        {dropPopup && (
                            <motion.div
                                key="popup"
                                initial={{ y: 0, opacity: 0, scale: 0.5 }}
                                animate={{ y: -80, opacity: 1, scale: 1.5 }}
                                exit={{ opacity: 0 }}
                                className="absolute z-50 pointer-events-none top-1/2 flex flex-col gap-1 items-center"
                            >
                                {dropPopup.map((drop, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        <div className="text-4xl font-black drop-shadow-[0_0_15px_rgba(0,0,0,1)] stroke-black" style={{ color: drop.ore.color, textShadow: '3px 3px 0 #000' }}>
                                            +{drop.amount}
                                        </div>
                                        <div className="text-sm font-bold bg-black/50 px-2 rounded">{drop.ore.name}</div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {currentNode ? (
                        <>
                            <div className="relative flex justify-center items-center w-80 h-80 z-20 touch-none">
                                {/* Base Rock - 20% Damage Zone */}
                                <motion.div
                                    animate={isMining ? { scale: 0.98 } : { scale: 1, y: [0, -5, 0] }}
                                    transition={isMining ? { duration: 0.05 } : { y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
                                    className={`
                                        cursor-pointer group relative w-64 h-64 md:w-72 md:h-72
                                        rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                                        border-4 transition-all duration-200
                                        flex items-center justify-center
                                        backdrop-blur-sm
                                        ${isRespawning ? 'opacity-0 scale-50' : 'opacity-100'}
                                    `}
                                    onPointerDown={(e) => {
                                        // e.preventDefault(); // Removed to allow click fallback
                                        handleMine(e, false);
                                    }}
                                    onClick={(e) => {
                                        handleMine(e, false);
                                    }}
                                    style={{
                                        background: `linear-gradient(135deg, #374151 0%, ${nodeHP < (currentNode.hp / 2) ? '#1f2937' : '#4b5563'} 100%)`,
                                        borderColor: bestPickaxe.power >= currentNode.requiredPower ? '#ffffff' : '#ef4444'
                                    }}
                                >
                                    {/* DEBUG INFO */}
                                    <div className="absolute top-2 text-[10px] text-green-500 font-mono opacity-50 pointer-events-none">
                                        Last Click: {lastMineTime}<br />
                                        HP: {nodeHP}/{currentNode.hp}<br />
                                        Power: {bestPickaxe.power}
                                    </div>
                                    {/* COOLDOWN OVERLAY */}
                                    {lastMineTime > 0 && (
                                        <div key={cooldownKey} className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none z-10">
                                            <div
                                                className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-[2px]"
                                                style={{ animation: 'cooldown 1.2s linear forwards' }}
                                            />
                                        </div>
                                    )}

                                    {/* Inline Style for Keyframes (hacky but effective for single component) */}
                                    <style>{`
                                        @keyframes cooldown {
                                            0% { height: 100%; opacity: 1; }
                                            100% { height: 0%; opacity: 0; }
                                        }
                                    `}</style>

                                    <div className="text-9xl filter drop-shadow-2xl transform select-none pointer-events-none">
                                        🪨
                                    </div>

                                    {/* WEAK SPOT CIRCLE - 100% Damage */}
                                    {weakSpot && !isRespawning && (
                                        <motion.div
                                            key={`${weakSpot.x}-${weakSpot.y}`}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="absolute w-16 h-16 rounded-full border-4 border-cyan-400 bg-cyan-500/30 cursor-crosshair z-30 hover:bg-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                                            style={{
                                                left: `calc(50% + ${weakSpot.x}px - 2rem)`,
                                                top: `calc(50% + ${weakSpot.y}px - 2rem)`,
                                            }}
                                            onPointerDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleMine(e, true);
                                            }}
                                        >
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse pointer-events-none" />
                                        </motion.div>
                                    )}

                                </motion.div>
                            </div>

                            <div className="mt-8 w-64 text-center">
                                <div className="flex justify-between text-xs text-gray-400 mb-1 font-mono">
                                    <span>INTEGRITY</span>
                                    <span>{nodeHP} / {currentNode.hp}</span>
                                </div>
                                <div className="w-full bg-black/50 border border-white/20 h-4 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 to-green-300 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                        animate={{ width: `${(nodeHP / currentNode.hp) * 100}%` }}
                                    />
                                </div>
                                {bestPickaxe.power < currentNode.requiredPower && (
                                    <div className="mt-2 text-red-500 font-bold text-sm bg-black/50 p-1 rounded border border-red-500/30">
                                        PICKAXE TOO WEAK ({bestPickaxe.power}/{currentNode.requiredPower})
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-500 font-mono animate-pulse">Select a Zone to Begin</div>
                    )}

                    <div className="mt-6 text-xs text-gray-500 font-mono bg-black/40 px-3 py-1 rounded-full border border-white/5">
                        EQUIPPED: <span style={{ color: bestPickaxe.color }} className="font-bold">{bestPickaxe.name}</span> (PWR: {bestPickaxe.power})
                    </div>
                </div>

                {/* Right: Inventory - Scrollable */}
                <Panel title="ORE STOCKPILE" glowColor="yellow" className="h-48 lg:h-full order-3">
                    <div className="grid grid-cols-2 gap-3 max-h-full overflow-y-auto pr-2 custom-scrollbar">
                        {inventoryOres.map((item) => {
                            const ore = ORES[item.itemId];
                            if (!ore) return null;
                            return (
                                <div key={item.id} className="bg-black/30 p-2 rounded border border-white/10 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full border border-white/20 shadow-inner shrink-0" style={{ backgroundColor: ore.color }}></div>
                                    <div className="overflow-hidden min-w-0">
                                        <div className="text-sm font-bold text-white truncate">{ore.name}</div>
                                        <div className="text-xs text-cyber-yellow">x{item.quantity}</div>
                                    </div>
                                </div>
                            )
                        })}
                        {inventoryOres.length === 0 && (
                            <div className="col-span-2 text-center text-gray-500 py-10 font-mono text-sm">
                                NO ORES DETECTED
                            </div>
                        )}
                    </div>
                </Panel>

            </div>

            {/* SHOP MODAL */}
            <AnimatePresence>
                {showShop && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6"
                        onClick={() => setShowShop(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-cyber-darker border border-orange-500/30 rounded-xl p-6 max-w-5xl w-full h-[85vh] flex flex-col shadow-[0_0_50px_rgba(249,115,22,0.2)]"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-orange-500/20 pb-4">
                                <div>
                                    <h2 className="text-2xl font-black text-orange-500 tracking-widest">PICKAXE EMPORIUM</h2>
                                    <p className="text-gray-400 font-mono text-sm">UPGRADE YOUR MINING POWER</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">BALANCE</div>
                                    <div className="text-2xl font-bold text-cyber-yellow">{player.gold.toLocaleString()} ₵</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                                {PICKAXES.filter(p => !['stone_pickaxe'].includes(p.id)).map(pickaxe => {
                                    const owned = player.inventory?.some(i => i.itemId === pickaxe.id);

                                    return (
                                        <div
                                            key={pickaxe.id}
                                            className={`
                                                relative p-4 rounded-lg border flex flex-col justify-between transition-all group
                                                ${owned
                                                    ? 'bg-green-500/5 border-green-500/20 opacity-60 hover:opacity-100'
                                                    : 'bg-black/40 border-white/10 hover:border-orange-500 hover:bg-white/5'}
                                            `}
                                        >
                                            <div className="mb-4 text-center">
                                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">⛏️</div>
                                                <div className="font-bold text-lg mb-1" style={{ color: pickaxe.color }}>{pickaxe.name}</div>
                                                <div className="text-xs text-gray-400 font-mono flex justify-center gap-4">
                                                    <div className="bg-black/50 px-2 py-1 rounded text-white">PWR: {pickaxe.power}</div>
                                                    <div className="bg-black/50 px-2 py-1 rounded text-cyber-yellow">LUCK: +{pickaxe.luck}%</div>
                                                </div>
                                            </div>

                                            {owned ? (
                                                <div className="w-full py-2 text-center bg-green-500/20 text-green-400 font-bold rounded border border-green-500/30 font-mono text-sm">
                                                    ALREADY OWNED
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="primary"
                                                    className="w-full bg-orange-600 hover:bg-orange-500 border-orange-400"
                                                    disabled={player.gold < (pickaxe.price || 999999)}
                                                    onClick={() => {
                                                        if (player.gold >= (pickaxe.price || 0)) {
                                                            gainGold(-(pickaxe.price || 0));
                                                            addItem(pickaxe.id, 1);
                                                        }
                                                    }}
                                                >
                                                    BUY {pickaxe.price?.toLocaleString()} ₵
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 text-center">
                                <Button variant="secondary" onClick={() => setShowShop(false)}>
                                    CLOSE SHOP
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SELL MODAL */}
            <AnimatePresence>
                {showSell && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 md:p-6"
                        onClick={() => setShowSell(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-cyber-darker border border-green-500/30 rounded-xl p-6 max-w-4xl w-full h-[80vh] flex flex-col shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                        >
                            <div className="flex justify-between items-center mb-6 border-b border-green-500/20 pb-4">
                                <div>
                                    <h2 className="text-2xl font-black text-green-500 tracking-widest">ORE EXCHANGE</h2>
                                    <p className="text-gray-400 font-mono text-sm">SELL YOUR HARD WORK</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">BALANCE</div>
                                    <div className="text-2xl font-bold text-cyber-yellow">{player.gold.toLocaleString()} ₵</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                                {inventoryOres.length === 0 ? (
                                    <div className="col-span-2 text-center text-gray-500 py-20">NO ORES TO SELL</div>
                                ) : (
                                    inventoryOres.map(item => {
                                        const ore = ORES[item.itemId];
                                        if (!ore) return null;
                                        const sellValue = ore.value;
                                        const totalValue = Math.floor(ore.value * item.quantity);

                                        return (
                                            <div key={item.id} className="bg-black/30 p-3 rounded border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <div className="w-12 h-12 rounded-full border border-white/10 shadow-inner shrink-0" style={{ backgroundColor: ore.color }}></div>
                                                    <div>
                                                        <div className="font-bold text-lg">{ore.name}</div>
                                                        <div className="text-xs text-gray-500 font-mono">Value: {sellValue} ₵/ea</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 w-full md:w-auto justify-end">
                                                    <div className="text-right">
                                                        <div className="text-cyber-yellow font-bold">{totalValue.toLocaleString()} ₵</div>
                                                        <div className="text-xs text-gray-500">x{item.quantity}</div>
                                                    </div>
                                                    <Button variant="primary" className="bg-green-600 hover:bg-green-500 h-10 px-6" onClick={() => handleSell(item.itemId, item.quantity)}>
                                                        SELL ALL
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <div className="mt-6 text-center">
                                <Button variant="secondary" onClick={() => setShowSell(false)}>
                                    CLOSE EXCHANGE
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Loot Log Overlay */}
            <div className="fixed bottom-24 left-4 z-50 flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {lootLog.map(log => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-black/80 backdrop-blur-sm border border-white/10 px-3 py-1 rounded text-sm font-bold shadow-lg"
                            style={{ color: log.color, borderLeft: `3px solid ${log.color}` }}
                        >
                            {log.text}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Navigation Bar */}
            <NavigationBar />
        </div>
    );
}
