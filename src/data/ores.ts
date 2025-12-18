export interface Ore {
    id: string;
    name: string;
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'DIVINE';
    color: string;
    value: number; // Sell Price
    multiplier: number; // Stat Multiplier for Forging
    hardness: number; // Pickaxe power recommended/related
    xp: number; // Experience gained when mining
    description?: string;
}

export const ORES: Record<string, Ore> = {
    // --- STONEWAKE CROSS ---
    stone: { id: 'stone', name: 'Stone', rarity: 'COMMON', color: '#9ca3af', value: 1, multiplier: 1.0, hardness: 1, xp: 1 },
    sand_stone: { id: 'sand_stone', name: 'Sand Stone', rarity: 'COMMON', color: '#d6d3d1', value: 1.5, multiplier: 1.05, hardness: 1, xp: 2 },
    cardboardite: { id: 'cardboardite', name: 'Cardboardite', rarity: 'COMMON', color: '#d4a373', value: 0.5, multiplier: 1.0, hardness: 0, xp: 1, description: "Looks useless, but it works." },
    copper: { id: 'copper', name: 'Copper', rarity: 'COMMON', color: '#f97316', value: 2, multiplier: 1.1, hardness: 2, xp: 3 },
    iron: { id: 'iron', name: 'Iron', rarity: 'COMMON', color: '#d1d5db', value: 2.5, multiplier: 1.2, hardness: 3, xp: 4 },
    tin: { id: 'tin', name: 'Tin', rarity: 'UNCOMMON', color: '#94a3b8', value: 3, multiplier: 1.25, hardness: 4, xp: 6 },
    silver: { id: 'silver', name: 'Silver', rarity: 'UNCOMMON', color: '#e5e7eb', value: 4, multiplier: 1.3, hardness: 5, xp: 8 },
    gold: { id: 'gold', name: 'Gold', rarity: 'UNCOMMON', color: '#eab308', value: 10, multiplier: 1.4, hardness: 6, xp: 12 },
    bananite: { id: 'bananite', name: 'Bananite', rarity: 'UNCOMMON', color: '#fef08a', value: 6, multiplier: 1.5, hardness: 6, xp: 15 },
    platinum: { id: 'platinum', name: 'Platinum', rarity: 'RARE', color: '#ffffff', value: 8, multiplier: 1.6, hardness: 7, xp: 20 },
    mushroomite: { id: 'mushroomite', name: 'Mushroomite', rarity: 'RARE', color: '#ef4444', value: 8, multiplier: 1.6, hardness: 7, xp: 25 },
    aite: { id: 'aite', name: 'Aite', rarity: 'EPIC', color: '#3b82f6', value: 12, multiplier: 2.0, hardness: 8, xp: 30 },
    poopite: { id: 'poopite', name: 'Poopite', rarity: 'EPIC', color: '#78350f', value: 12, multiplier: 2.1, hardness: 8, xp: 35 },

    // --- FORGOTTEN KINGDOM ---
    cobalt: { id: 'cobalt', name: 'Cobalt', rarity: 'UNCOMMON', color: '#1d4ed8', value: 8, multiplier: 1.8, hardness: 10, xp: 40 },
    titanium: { id: 'titanium', name: 'Titanium', rarity: 'UNCOMMON', color: '#64748b', value: 10, multiplier: 2.0, hardness: 12, xp: 50 },
    lapis_lazuli: { id: 'lapis_lazuli', name: 'Lapis Lazuli', rarity: 'UNCOMMON', color: '#1e3a8a', value: 12, multiplier: 2.2, hardness: 15, xp: 60 },
    volcanic_rock: { id: 'volcanic_rock', name: 'Volcanic Rock', rarity: 'RARE', color: '#7f1d1d', value: 15, multiplier: 2.5, hardness: 18, xp: 75 },
    quartz: { id: 'quartz', name: 'Quartz', rarity: 'RARE', color: '#f5f5f5', value: 12, multiplier: 2.4, hardness: 20, xp: 80 },
    amethyst: { id: 'amethyst', name: 'Amethyst', rarity: 'RARE', color: '#a855f7', value: 14, multiplier: 2.6, hardness: 22, xp: 90 },
    topaz: { id: 'topaz', name: 'Topaz', rarity: 'RARE', color: '#fbbf24', value: 16, multiplier: 2.8, hardness: 25, xp: 100 },
    diamond: { id: 'diamond', name: 'Diamond', rarity: 'RARE', color: '#b9fbc0', value: 20, multiplier: 3.0, hardness: 30, xp: 150 },
    sapphire: { id: 'sapphire', name: 'Sapphire', rarity: 'RARE', color: '#2563eb', value: 22, multiplier: 3.2, hardness: 35, xp: 160 },
    cuprite: { id: 'cuprite', name: 'Cuprite', rarity: 'EPIC', color: '#b91c1c', value: 25, multiplier: 3.5, hardness: 40, xp: 200 },
    obsidian: { id: 'obsidian', name: 'Obsidian', rarity: 'EPIC', color: '#000000', value: 25, multiplier: 3.8, hardness: 50, xp: 250 },
    emerald: { id: 'emerald', name: 'Emerald', rarity: 'EPIC', color: '#10b981', value: 28, multiplier: 4.0, hardness: 55, xp: 300 },

    // --- GOBLIN CAVE / SPECIAL ---
    crimson_crystal: { id: 'crimson_crystal', name: 'Crimson Crystal', rarity: 'RARE', color: '#dc2626', value: 30, multiplier: 4.5, hardness: 60, xp: 350 },
    cyan_crystal: { id: 'cyan_crystal', name: 'Cyan Crystal', rarity: 'RARE', color: '#06b6d4', value: 30, multiplier: 4.5, hardness: 60, xp: 350 },
    darkryte: { id: 'darkryte', name: 'Darkryte', rarity: 'LEGENDARY', color: '#312e81', value: 50, multiplier: 6.3, hardness: 70, xp: 500 },
    demonite: { id: 'demonite', name: 'Demonite', rarity: 'LEGENDARY', color: '#dc2626', value: 45, multiplier: 5.5, hardness: 80, xp: 600 },
    eye_ore: { id: 'eye_ore', name: 'Eye Ore', rarity: 'LEGENDARY', color: '#8b5cf6', value: 25, multiplier: 5.0, hardness: 90, xp: 700 },
    fireite: { id: 'fireite', name: 'Fireite', rarity: 'LEGENDARY', color: '#f59e0b', value: 40, multiplier: 5.2, hardness: 100, xp: 800 },
    lightite: { id: 'lightite', name: 'Lightite', rarity: 'LEGENDARY', color: '#fef08a', value: 150, multiplier: 6.0, hardness: 110, xp: 1000 },
    magmaite: { id: 'magmaite', name: 'Magmaite', rarity: 'MYTHIC', color: '#ea580c', value: 50, multiplier: 7.0, hardness: 150, xp: 2000 },
    uranium: { id: 'uranium', name: 'Uranium', rarity: 'MYTHIC', color: '#10b981', value: 40, multiplier: 8.0, hardness: 200, xp: 5000 },
};

export interface MiningNode {
    id: string;
    name: string;
    hp: number;
    requiredPower: number;
    region: 'Stonewake' | 'Forgotten Kingdom' | 'Goblin Cave';
    drops: { oreId: string; chance: number; min: number; max: number }[];
    respawnTime: number;
}

export const MINING_NODES: MiningNode[] = [
    // --- STONEWAKE CROSS ---
    {
        id: 'pebbles',
        name: 'Pebbles',
        hp: 8, // Breakable in 4 hits with Start Pick (2 dmg)
        requiredPower: 2,
        region: 'Stonewake',
        drops: [
            { oreId: 'stone', chance: 1.0, min: 1, max: 1 },
            { oreId: 'sand_stone', chance: 0.5, min: 1, max: 1 },
            { oreId: 'cardboardite', chance: 0.5, min: 1, max: 3 },
        ],
        respawnTime: 2
    },
    {
        id: 'stone_rock',
        name: 'Boulder', // Renamed to match research
        hp: 13,
        requiredPower: 5,
        region: 'Stonewake',
        drops: [
            { oreId: 'stone', chance: 1.0, min: 1, max: 1 },
            { oreId: 'copper', chance: 0.25, min: 1, max: 1 }, // Reduced from 0.4
            { oreId: 'tin', chance: 0.1, min: 1, max: 1 }      // Reduced from 0.2
        ],
        respawnTime: 3
    },
    {
        id: 'metallic_vein',
        name: 'Basalt Rock',
        hp: 16,
        requiredPower: 7,
        region: 'Stonewake',
        drops: [
            { oreId: 'iron', chance: 0.8, min: 1, max: 1 },
            { oreId: 'silver', chance: 0.25, min: 1, max: 1 }, // Reduced from 0.4
            { oreId: 'gold', chance: 0.05, min: 1, max: 1 }    // Reduced from 0.1
        ],
        respawnTime: 5
    },
    {
        id: 'rare_outcrop',
        name: 'Basalt Core', // Renamed
        hp: 39,
        requiredPower: 10,
        region: 'Stonewake',
        drops: [
            { oreId: 'bananite', chance: 0.3, min: 1, max: 1 },
            { oreId: 'mushroomite', chance: 0.3, min: 1, max: 1 },
            { oreId: 'platinum', chance: 0.1, min: 1, max: 1 },
            { oreId: 'aite', chance: 0.05, min: 1, max: 1 }
        ],
        respawnTime: 10
    },

    // --- FORGOTTEN KINGDOM ---
    {
        id: 'kingdom_rubble',
        name: 'Basalt Vein', // Renamed
        hp: 78,
        requiredPower: 20,
        region: 'Forgotten Kingdom',
        drops: [
            { oreId: 'cobalt', chance: 0.8, min: 1, max: 1 },
            { oreId: 'titanium', chance: 0.5, min: 1, max: 1 }
        ],
        respawnTime: 5
    },
    {
        id: 'gem_cluster',
        name: 'Volcanic Rock', // Renamed
        hp: 100,
        requiredPower: 30,
        region: 'Forgotten Kingdom',
        drops: [
            { oreId: 'quartz', chance: 0.6, min: 1, max: 1 },
            { oreId: 'amethyst', chance: 0.5, min: 1, max: 1 },
            { oreId: 'topaz', chance: 0.4, min: 1, max: 1 },
            { oreId: 'sapphire', chance: 0.3, min: 1, max: 1 }
        ],
        respawnTime: 8
    },
    {
        id: 'ancient_bedrock',
        name: 'Ancient Bedrock',
        hp: 200, // Scaled Up
        requiredPower: 50,
        region: 'Forgotten Kingdom',
        drops: [
            { oreId: 'diamond', chance: 0.4, min: 1, max: 1 },
            { oreId: 'cuprite', chance: 0.3, min: 1, max: 1 },
            { oreId: 'obsidian', chance: 0.2, min: 1, max: 1 },
            { oreId: 'emerald', chance: 0.1, min: 1, max: 1 }
        ],
        respawnTime: 15
    },

    // --- GOBLIN CAVE ---
    {
        id: 'crystal_spire',
        name: 'Crystal Spire',
        hp: 400,
        requiredPower: 100,
        region: 'Goblin Cave',
        drops: [
            { oreId: 'crimson_crystal', chance: 0.5, min: 1, max: 1 },
            { oreId: 'cyan_crystal', chance: 0.5, min: 1, max: 1 }
        ],
        respawnTime: 20
    },
    {
        id: 'cursed_earth',
        name: 'Cursed Earth',
        hp: 800,
        requiredPower: 150,
        region: 'Goblin Cave',
        drops: [
            { oreId: 'darkryte', chance: 0.2, min: 1, max: 1 },
            { oreId: 'demonite', chance: 0.15, min: 1, max: 1 },
            { oreId: 'eye_ore', chance: 0.1, min: 1, max: 1 }
        ],
        respawnTime: 30
    },
    {
        id: 'magma_core',
        name: 'Magma Core',
        hp: 1500,
        requiredPower: 250,
        region: 'Goblin Cave',
        drops: [
            { oreId: 'fireite', chance: 0.3, min: 1, max: 1 },
            { oreId: 'magmaite', chance: 0.05, min: 1, max: 1 },
            { oreId: 'uranium', chance: 0.01, min: 1, max: 1 }
        ],
        respawnTime: 60
    }
];
