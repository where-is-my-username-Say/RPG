import type { CombatEnemy } from '../types';

// Epic Enemies for Cyber Mercenary
export const ENEMIES: Record<string, CombatEnemy> = {
    // --- STREET TIER (Level 1-5) ---
    street_punk: {
        id: 'street_punk',
        name: 'STREET PUNK',
        image: '/enemies/street_punk.png',
        level: 1,
        hp: 40,
        maxHp: 40,
        attack: 8,
        defense: 2,
        skills: [
            { id: 'rusty_shiv', name: 'Rusty Shiv', description: 'Stab', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 10, target: 'enemy' }], energyCost: 0, cooldown: 0, icon: '🗡️' }
        ],
        lootTable: { gold: { min: 20, max: 50 }, xp: 25, items: [{ itemId: 'scrap_metal', chance: 0.3, quantity: 1 }] }
    },
    sewer_rat: {
        id: 'sewer_rat',
        name: 'MUTATED RAT',
        image: '/enemies/mutant.png',
        level: 2,
        hp: 55,
        maxHp: 55,
        attack: 12,
        defense: 1,
        skills: [
            { id: 'bite', name: 'Toxic Bite', description: 'Bite', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 15, target: 'enemy' }], energyCost: 0, icon: '🦷' }
        ],
        lootTable: { gold: { min: 30, max: 60 }, xp: 40, items: [] }
    },
    scavenger: {
        id: 'scavenger',
        name: 'ZONE SCAVENGER',
        image: '/enemies/street_punk.png',
        level: 2,
        hp: 60,
        maxHp: 60,
        attack: 14,
        defense: 4,
        skills: [
            { id: 'crowbar', name: 'Crowbar Smash', description: 'Smash', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 18, target: 'enemy' }], energyCost: 0, icon: '🔧' }
        ],
        lootTable: { gold: { min: 40, max: 80 }, xp: 50, items: [{ itemId: 'electronic_parts', chance: 0.4, quantity: 1 }] }
    },
    drone_scout: {
        id: 'drone_scout',
        name: 'SCOUT DRONE',
        image: '/enemies/drone.png',
        level: 3,
        hp: 45,
        maxHp: 45,
        attack: 20,
        defense: 8,
        skills: [
            { id: 'zap', name: 'Zap', description: 'Small shock', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 20, target: 'enemy' }], energyCost: 0, icon: '⚡' }
        ],
        lootTable: { gold: { min: 50, max: 90 }, xp: 60, items: [{ itemId: 'tech_scrap', chance: 0.5, quantity: 1 }] }
    },
    corp_guard: {
        id: 'corp_guard',
        name: 'CORP SECURITY',
        image: '/enemies/soldier.png',
        level: 4,
        hp: 100,
        maxHp: 100,
        attack: 18,
        defense: 10,
        skills: [
            { id: 'baton', name: 'Stun Baton', description: 'Strike', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 22, target: 'enemy' }], energyCost: 0, icon: '👮' }
        ],
        lootTable: { gold: { min: 80, max: 120 }, xp: 80, items: [] }
    },
    rogue_ai: {
        id: 'rogue_ai',
        name: 'ROGUE AI (MINI BOSS)',
        image: '/enemies/boss.png',
        level: 5,
        hp: 250,
        maxHp: 250,
        attack: 25,
        defense: 15,
        skills: [
            { id: 'glitch', name: 'System Glitch', description: 'Digital attack', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 35, target: 'enemy' }], energyCost: 0, icon: '👾' }
        ],
        lootTable: { gold: { min: 200, max: 400 }, xp: 250, items: [{ itemId: 'rare_chip', chance: 0.5, quantity: 1 }] }
    },

    // --- MID TIER (Level 6-12) ---
    toxic_slime: {
        id: 'toxic_slime',
        name: 'TOXIC SLUDGE',
        image: '/enemies/mutant.png',
        level: 6,
        hp: 150,
        maxHp: 150,
        attack: 22,
        defense: 5,
        skills: [
            { id: 'splash', name: 'Acid Splash', description: 'Burn', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 30, target: 'enemy' }], energyCost: 0, icon: '🧪' }
        ],
        lootTable: { gold: { min: 90, max: 150 }, xp: 120, items: [] }
    },
    cyber_thug: {
        id: 'cyber_thug',
        name: 'CYBER ENFORCER',
        image: '/enemies/street_punk.png',
        level: 7,
        hp: 180,
        maxHp: 180,
        attack: 28,
        defense: 12,
        skills: [
            { id: 'power_fist', name: 'Power Fist', description: 'Punch', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 35, target: 'enemy' }], energyCost: 0, icon: '👊' }
        ],
        lootTable: { gold: { min: 120, max: 180 }, xp: 150, items: [] }
    },
    construction_mech: {
        id: 'construction_mech',
        name: 'ROGUE LOADER MECH',
        image: '/enemies/mech_heavy.png',
        level: 8,
        hp: 300,
        maxHp: 300,
        attack: 40,
        defense: 25,
        skills: [
            { id: 'crush', name: 'Hydraulic Crush', description: 'Heavy hit', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 50, target: 'enemy' }], energyCost: 0, icon: '🏗️' }
        ],
        lootTable: { gold: { min: 200, max: 300 }, xp: 250, items: [{ itemId: 'titanium_plating', chance: 0.2, quantity: 1 }] }
    },
    assault_drone: {
        id: 'assault_drone',
        name: 'HUNTER KILLER DRONE',
        image: '/enemies/drone.png',
        level: 9,
        hp: 120,
        maxHp: 120,
        attack: 45,
        defense: 10,
        skills: [
            { id: 'missile', name: 'Micro Missile', description: 'Explosive', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 55, target: 'enemy' }], energyCost: 0, icon: '🚀' }
        ],
        lootTable: { gold: { min: 150, max: 250 }, xp: 200, items: [] }
    },
    elite_trooper: {
        id: 'elite_trooper',
        name: 'ELITE SHOCK TROOPER',
        image: '/enemies/soldier.png',
        level: 10,
        hp: 250,
        maxHp: 250,
        attack: 38,
        defense: 30,
        skills: [
            { id: 'rifle', name: 'Pulse Rifle', description: 'Shoot', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 45, target: 'enemy' }], energyCost: 0, icon: '🔫' }
        ],
        lootTable: { gold: { min: 250, max: 400 }, xp: 350, items: [] }
    },

    // --- HIGH TIER (Level 11-20) ---
    bio_horror: {
        id: 'bio_horror',
        name: 'LAB EXPERIMENT 66',
        image: '/enemies/mutant.png',
        level: 12,
        hp: 500,
        maxHp: 500,
        attack: 50,
        defense: 20,
        skills: [
            { id: 'vomit', name: 'Toxic Vomit', description: 'Gross', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 60, target: 'enemy' }], energyCost: 0, icon: '🤮' }
        ],
        lootTable: { gold: { min: 400, max: 600 }, xp: 500, items: [] }
    },
    warmachine: {
        id: 'warmachine',
        name: 'WAR WALKER',
        image: '/enemies/mech_heavy.png',
        level: 15,
        hp: 800,
        maxHp: 800,
        attack: 70,
        defense: 50,
        skills: [
            { id: 'gatling', name: 'Gatling Gun', description: 'Brrrr', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 80, target: 'enemy' }], energyCost: 0, icon: '🌪️' }
        ],
        lootTable: { gold: { min: 800, max: 1200 }, xp: 1000, items: [{ itemId: 'mech_core', chance: 0.5, quantity: 1 }] }
    },
    cyber_demon: {
        id: 'cyber_demon',
        name: 'NET DEMON (BOSS)',
        image: '/enemies/boss.png',
        level: 20,
        hp: 2000,
        maxHp: 2000,
        attack: 100,
        defense: 60,
        skills: [
            { id: 'inferno', name: 'Digital Inferno', description: 'Fire', type: 'active', tier: 1, maxRank: 1, tree: 'tree1', effects: [{ type: 'damage', value: 120, target: 'enemy' }], energyCost: 0, icon: '🔥' }
        ],
        lootTable: { gold: { min: 2000, max: 5000 }, xp: 5000, items: [{ itemId: 'legendary_blade', chance: 1.0, quantity: 1 }] }
    }
};

// Get random enemy for contracts
export function getRandomEnemy(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): CombatEnemy {
    const enemyPool = {
        EASY: ['street_punk', 'scavenger', 'corporate_drone'],
        MEDIUM: ['rogue_ai', 'corrupted_netrunner'],
        HARD: ['gang_leader', 'cyber_ninja', 'mech_sentinel']
    };

    const pool = enemyPool[difficulty];
    const randomId = pool[Math.floor(Math.random() * pool.length)];
    // Return a copy
    return JSON.parse(JSON.stringify(ENEMIES[randomId]));
}
