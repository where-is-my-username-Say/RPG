export interface Ore {
    id: string;
    name: string;
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
    value: number; // Gold value
    hardness: number; // Pickaxe power needed (or clicks)
    xp: number;
    color: string;
    probability: number; // 0-1
}

export const ORES: Ore[] = [
    {
        id: 'scrap_metal',
        name: 'Scrap Metal',
        rarity: 'COMMON',
        value: 5,
        hardness: 10,
        xp: 2,
        color: '#9ca3af', // Gray
        probability: 0.4
    },
    {
        id: 'copper_ore',
        name: 'Copper Ore',
        rarity: 'COMMON',
        value: 15,
        hardness: 15,
        xp: 5,
        color: '#ea580c', // Orange
        probability: 0.3
    },
    {
        id: 'iron_ore',
        name: 'Iron Ore',
        rarity: 'UNCOMMON',
        value: 30,
        hardness: 25,
        xp: 10,
        color: '#d1d5db', // Silver
        probability: 0.15
    },
    {
        id: 'titanium_ore',
        name: 'Titanium Ore',
        rarity: 'RARE',
        value: 75,
        hardness: 50,
        xp: 25,
        color: '#60a5fa', // Blue
        probability: 0.08
    },
    {
        id: 'neon_crystal',
        name: 'Neon Crystal',
        rarity: 'EPIC',
        value: 200,
        hardness: 100,
        xp: 50,
        color: '#d946ef', // Magenta
        probability: 0.05
    },
    {
        id: 'cyber_shard',
        name: 'Cyber Shard',
        rarity: 'LEGENDARY',
        value: 500,
        hardness: 200,
        xp: 100,
        color: '#facc15', // Yellow
        probability: 0.02
    }
];

export const MINING_CONFIG = {
    GRID_SIZE: 8,
    BASE_ENERGY_COST: 2,
    REVEAL_COST: 1,
    RESET_COST: 20
};
