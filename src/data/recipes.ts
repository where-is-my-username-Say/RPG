export type QualityTier = 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC' | 'DIVINE';

export interface ForgeRecipe {
    id: string;
    name: string;
    type: 'WEAPON' | 'ARMOR';
    subtype: 'DAGGER' | 'KATANA' | 'SWORD' | 'AXE' | 'GREATSWORD' | 'HAMMER' |
    'HELMET_LIGHT' | 'CHEST_LIGHT' | 'LEGS_LIGHT' |
    'HELMET_MEDIUM' | 'CHEST_MEDIUM' | 'LEGS_MEDIUM' |
    'HELMET_HEAVY' | 'CHEST_HEAVY' | 'LEGS_HEAVY';
    baseStats: {
        damage?: number;
        defense?: number;
        critChance?: number;
    };
    oreCount: number; // How many ores needed
    description: string;
    icon?: string; // Optional icon override
}

export const QUALITY_MULTIPLIERS: Record<QualityTier, number> = {
    COMMON: 1.0,
    UNCOMMON: 1.2,
    RARE: 1.5,
    EPIC: 2.0,
    LEGENDARY: 3.0,
    MYTHIC: 5.0,
    DIVINE: 10.0,
};

export const FORGE_RECIPES: ForgeRecipe[] = [
    // --- LIGHT WEAPONS (Speed) ---
    {
        id: 'bp_dagger',
        name: 'Dagger Blueprint',
        type: 'WEAPON',
        subtype: 'DAGGER',
        baseStats: { damage: 5, critChance: 15 },
        oreCount: 3,
        description: 'Fast, deadly, requires few materials.',
        icon: '🔪'
    },
    {
        id: 'bp_katana',
        name: 'Katana Blueprint',
        type: 'WEAPON',
        subtype: 'KATANA',
        baseStats: { damage: 8, critChance: 10 },
        oreCount: 4,
        description: 'The standard for speed and precision.',
        icon: '🗡️'
    },
    {
        id: 'bp_rapier',
        name: 'Rapier Blueprint',
        type: 'WEAPON',
        subtype: 'SWORD', // Close enough
        baseStats: { damage: 7, critChance: 12 },
        oreCount: 4,
        description: 'Piercing strikes with high velocity.',
        icon: '🤺'
    },

    // --- MEDIUM WEAPONS (Balanced) ---
    {
        id: 'bp_sword',
        name: 'Longsword Blueprint',
        type: 'WEAPON',
        subtype: 'SWORD',
        baseStats: { damage: 12, critChance: 5 },
        oreCount: 5,
        description: 'A balanced weapon for any warrior.',
        icon: '⚔️'
    },
    {
        id: 'bp_axe',
        name: 'Battle Axe Blueprint',
        type: 'WEAPON',
        subtype: 'AXE',
        baseStats: { damage: 15, critChance: 4 },
        oreCount: 6,
        description: 'Heavy hits with decent recovery.',
        icon: '🪓'
    },

    // --- HEAVY WEAPONS (Damage) ---
    {
        id: 'bp_greatsword',
        name: 'Greatsword Blueprint',
        type: 'WEAPON',
        subtype: 'GREATSWORD',
        baseStats: { damage: 25, critChance: 2 },
        oreCount: 10,
        description: 'Massive damage, requires many ores.',
        icon: '🗡️'
    },
    {
        id: 'bp_colossal',
        name: 'Colossal Blade Blueprint',
        type: 'WEAPON',
        subtype: 'GREATSWORD',
        baseStats: { damage: 35, critChance: 0 },
        oreCount: 20,
        description: 'A mountain of metal. Devastating power.',
        icon: '🗡️'
    },
    {
        id: 'bp_hammer',
        name: 'Warhammer Blueprint',
        type: 'WEAPON',
        subtype: 'HAMMER',
        baseStats: { damage: 30, critChance: 1 },
        oreCount: 12,
        description: 'Crushes armor and bones alike.',
        icon: '🔨'
    },

    // --- LIGHT ARMOR ---
    {
        id: 'bp_light_helm',
        name: 'Light Helmet Blueprint',
        type: 'ARMOR',
        subtype: 'HELMET_LIGHT',
        baseStats: { defense: 2, critChance: 2 },
        oreCount: 4,
        description: 'Light protection for the head.',
        icon: '🪖'
    },
    {
        id: 'bp_light_chest',
        name: 'Light Chestplate Blueprint',
        type: 'ARMOR',
        subtype: 'CHEST_LIGHT',
        baseStats: { defense: 5, critChance: 4 },
        oreCount: 8,
        description: 'Light protection for the body.',
        icon: '👕'
    },
    {
        id: 'bp_light_legs',
        name: 'Light Leggings Blueprint',
        type: 'ARMOR',
        subtype: 'LEGS_LIGHT',
        baseStats: { defense: 3, critChance: 3 },
        oreCount: 6,
        description: 'Light protection for the legs.',
        icon: '👖'
    },

    // --- MEDIUM ARMOR ---
    {
        id: 'bp_med_helm',
        name: 'Medium Helmet Blueprint',
        type: 'ARMOR',
        subtype: 'HELMET_MEDIUM',
        baseStats: { defense: 5, critChance: 0 },
        oreCount: 5,
        description: 'Medium protection for the head.',
        icon: '🪖'
    },
    {
        id: 'bp_med_chest',
        name: 'Medium Chestplate Blueprint',
        type: 'ARMOR',
        subtype: 'CHEST_MEDIUM',
        baseStats: { defense: 12, critChance: 0 },
        oreCount: 10,
        description: 'Medium protection for the body.',
        icon: '👕'
    },
    {
        id: 'bp_med_legs',
        name: 'Medium Leggings Blueprint',
        type: 'ARMOR',
        subtype: 'LEGS_MEDIUM',
        baseStats: { defense: 8, critChance: 0 },
        oreCount: 7,
        description: 'Medium protection for the legs.',
        icon: '👖'
    },

    // --- HEAVY ARMOR ---
    {
        id: 'bp_heavy_helm',
        name: 'Heavy Helmet Blueprint',
        type: 'ARMOR',
        subtype: 'HELMET_HEAVY',
        baseStats: { defense: 10, critChance: -1 },
        oreCount: 8,
        description: 'Heavy protection for the head.',
        icon: '🪖'
    },
    {
        id: 'bp_heavy_chest',
        name: 'Heavy Chestplate Blueprint',
        type: 'ARMOR',
        subtype: 'CHEST_HEAVY',
        baseStats: { defense: 25, critChance: -2 },
        oreCount: 15,
        description: 'Heavy protection for the body.',
        icon: '🛡️'
    },
    {
        id: 'bp_heavy_legs',
        name: 'Heavy Leggings Blueprint',
        type: 'ARMOR',
        subtype: 'LEGS_HEAVY',
        baseStats: { defense: 15, critChance: -1 },
        oreCount: 10,
        description: 'Heavy protection for the legs.',
        icon: '🦵'
    },
];
