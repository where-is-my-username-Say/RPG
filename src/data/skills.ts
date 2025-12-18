import type { ClassSkillTrees } from '../types/skills';

// ============================================
// ENFORCER SKILL TREES
// ============================================

export const ENFORCER_SKILLS: ClassSkillTrees = {
    tree1: {
        name: 'Tank Mastery',
        icon: '🛡️',
        description: 'Defensive abilities and HP bonuses',
        skills: [
            // Tier 1
            {
                id: 'enforcer_tank_1',
                name: 'Iron Skin',
                description: 'Increase max HP by 5% per rank',
                tree: 'tree1',
                tier: 1,
                maxRank: 5,
                type: 'passive',
                effects: [
                    { type: 'stat_boost', stat: 'hp', value: 5, scaling: 'per_rank' }
                ],
                icon: '🛡️'
            },
            // Tier 2
            {
                id: 'enforcer_tank_2a',
                name: 'Taunt',
                description: 'Force enemy to attack you, gain +20% defense for 2 turns',
                tree: 'tree1',
                tier: 2,
                maxRank: 5,
                type: 'active',
                requirements: { skillId: 'enforcer_tank_1', skillRank: 3 },
                effects: [
                    { type: 'buff', stat: 'defense', value: 20, scaling: 'flat', duration: 2, target: 'self' },
                    { type: 'debuff', value: 100, duration: 2, target: 'enemy' }
                ],
                energyCost: 20,
                cooldown: 3,
                icon: '💢'
            },
            {
                id: 'enforcer_tank_2b',
                name: 'Fortify',
                description: 'Increase defense by 30% for 2 turns',
                tree: 'tree1',
                tier: 2,
                maxRank: 3,
                type: 'active',
                requirements: { skillId: 'enforcer_tank_1', skillRank: 3 },
                effects: [
                    { type: 'buff', stat: 'defense', value: 30, scaling: 'flat', duration: 2, target: 'self' }
                ],
                energyCost: 25,
                cooldown: 4,
                icon: '🏰'
            },
            // Tier 3
            {
                id: 'enforcer_tank_3a',
                name: 'Last Stand',
                description: 'Survive a fatal blow with 1 HP once per combat',
                tree: 'tree1',
                tier: 3,
                maxRank: 1,
                type: 'passive',
                requirements: { skillId: 'enforcer_tank_2a', skillRank: 3 },
                effects: [
                    { type: 'passive_trigger', value: 1 }
                ],
                icon: '💪'
            },
            {
                id: 'enforcer_tank_3b',
                name: 'Shield Wall',
                description: 'Block the next 3 attacks',
                tree: 'tree1',
                tier: 3,
                maxRank: 3,
                type: 'active',
                requirements: { skillId: 'enforcer_tank_2b', skillRank: 2 },
                effects: [
                    { type: 'buff', value: 3, duration: 5, target: 'self' }
                ],
                energyCost: 40,
                cooldown: 5,
                icon: '🛡️'
            },
            // Tier 4
            {
                id: 'enforcer_tank_4a',
                name: 'Immovable',
                description: 'Cannot be knocked back or stunned',
                tree: 'tree1',
                tier: 4,
                maxRank: 1,
                type: 'passive',
                requirements: { skillId: 'enforcer_tank_3a', skillRank: 1 },
                effects: [
                    { type: 'passive_trigger', value: 1 }
                ],
                icon: '⛰️'
            },
            {
                id: 'enforcer_tank_4b',
                name: 'Guardian',
                description: 'Gain +10% defense per ally alive',
                tree: 'tree1',
                tier: 4,
                maxRank: 3,
                type: 'passive',
                requirements: { skillId: 'enforcer_tank_3b', skillRank: 2 },
                effects: [
                    { type: 'stat_boost', stat: 'defense', value: 10, scaling: 'per_rank' }
                ],
                icon: '👥'
            },
            // Tier 5
            {
                id: 'enforcer_tank_5',
                name: "Titan's Endurance",
                description: 'Become invulnerable for 1 turn',
                tree: 'tree1',
                tier: 5,
                maxRank: 1,
                type: 'active',
                requirements: { skillId: 'enforcer_tank_4a', skillRank: 1, level: 40 },
                effects: [
                    { type: 'buff', value: 100, duration: 1, target: 'self' }
                ],
                energyCost: 80,
                cooldown: 10,
                icon: '⚡'
            }
        ]
    },

    tree2: {
        name: 'Heavy Weapons',
        icon: '⚔️',
        description: 'Offensive abilities and damage bonuses',
        skills: [
            // Tier 1
            {
                id: 'enforcer_weapon_1',
                name: 'Heavy Smash',
                description: 'Basic attack dealing 100% damage',
                tree: 'tree2',
                tier: 1,
                maxRank: 5,
                type: 'active', // Changed from passive
                effects: [
                    { type: 'damage', value: 10, scaling: 'per_rank', target: 'enemy' },
                    { type: 'stat_boost', stat: 'attack', value: 2, scaling: 'per_rank' } // Added small passive boost too? No, keep simple.
                ],
                energyCost: 10,
                cooldown: 0,
                icon: '⚔️'
            },
            // Tier 2
            {
                id: 'enforcer_weapon_2a',
                name: 'Power Strike',
                description: 'Deal 150% damage',
                tree: 'tree2',
                tier: 2,
                maxRank: 5,
                type: 'active',
                requirements: { skillId: 'enforcer_weapon_1', skillRank: 3 },
                effects: [
                    { type: 'damage', value: 150, scaling: 'flat', target: 'enemy' }
                ],
                energyCost: 30,
                cooldown: 2,
                icon: '💥'
            },
            {
                id: 'enforcer_weapon_2b',
                name: 'Cleave',
                description: 'Hit all enemies for 80% damage',
                tree: 'tree2',
                tier: 2,
                maxRank: 3,
                type: 'active',
                requirements: { skillId: 'enforcer_weapon_1', skillRank: 3 },
                effects: [
                    { type: 'damage', value: 80, scaling: 'flat', target: 'all_enemies' }
                ],
                energyCost: 45,
                cooldown: 4,
                icon: '🌀'
            },
            // Tier 3
            {
                id: 'enforcer_weapon_3a',
                name: 'Armor Break',
                description: 'Reduce enemy defense by 50% for 3 turns',
                tree: 'tree2',
                tier: 3,
                maxRank: 3,
                type: 'active',
                requirements: { skillId: 'enforcer_weapon_2a', skillRank: 3 },
                effects: [
                    { type: 'debuff', stat: 'defense', value: 50, duration: 3, target: 'enemy' }
                ],
                energyCost: 35,
                cooldown: 4,
                icon: '🔨'
            },
            {
                id: 'enforcer_weapon_3b',
                name: 'Critical Strike',
                description: 'Increase critical hit chance by 10% per rank',
                tree: 'tree2',
                tier: 3,
                maxRank: 5,
                type: 'passive',
                requirements: { skillId: 'enforcer_weapon_2b', skillRank: 2 },
                effects: [
                    { type: 'stat_boost', value: 10, scaling: 'per_rank' }
                ],
                icon: '🎯'
            },
            // Tier 4
            {
                id: 'enforcer_weapon_4a',
                name: 'Execute',
                description: 'Instantly kill enemy if HP < 20%',
                tree: 'tree2',
                tier: 4,
                maxRank: 1,
                type: 'active',
                requirements: { skillId: 'enforcer_weapon_3a', skillRank: 2 },
                effects: [
                    { type: 'damage', value: 9999, target: 'enemy' }
                ],
                energyCost: 50,
                cooldown: 6,
                icon: '💀'
            },
            {
                id: 'enforcer_weapon_4b',
                name: 'Rampage',
                description: 'Gain +5% damage per kill (stacks 5x)',
                tree: 'tree2',
                tier: 4,
                maxRank: 3,
                type: 'passive',
                requirements: { skillId: 'enforcer_weapon_3b', skillRank: 3 },
                effects: [
                    { type: 'stat_boost', stat: 'attack', value: 5, scaling: 'per_rank' }
                ],
                icon: '🔥'
            },
            // Tier 5
            {
                id: 'enforcer_weapon_5',
                name: 'Devastate',
                description: 'Deal 500% damage to single target',
                tree: 'tree2',
                tier: 5,
                maxRank: 1,
                type: 'active',
                requirements: { skillId: 'enforcer_weapon_4a', skillRank: 1, level: 40 },
                effects: [
                    { type: 'damage', value: 500, target: 'enemy' }
                ],
                energyCost: 100,
                cooldown: 10,
                icon: '💥'
            }
        ]
    },

    tree3: {
        name: 'Combat Endurance',
        icon: '💪',
        description: 'Energy and sustain abilities',
        skills: [
            // Tier 1
            {
                id: 'enforcer_endurance_1',
                name: 'Stamina',
                description: 'Increase max energy by 2 per rank',
                tree: 'tree3',
                tier: 1,
                maxRank: 5,
                type: 'passive',
                effects: [
                    { type: 'stat_boost', stat: 'maxEnergy', value: 2, scaling: 'per_rank' }
                ],
                icon: '⚡'
            },
            // Tier 2
            {
                id: 'enforcer_endurance_2a',
                name: 'Second Wind',
                description: 'Restore 30% HP',
                tree: 'tree3',
                tier: 2,
                maxRank: 3,
                type: 'active',
                requirements: { skillId: 'enforcer_endurance_1', skillRank: 3 },
                effects: [
                    { type: 'heal', value: 30, target: 'self' }
                ],
                energyCost: 40,
                cooldown: 5,
                icon: '💚'
            },
            {
                id: 'enforcer_endurance_2b',
                name: 'Adrenaline Rush',
                description: 'Increase speed by 50% for 3 turns',
                tree: 'tree3',
                tier: 2,
                maxRank: 3,
                type: 'active',
                requirements: { skillId: 'enforcer_endurance_1', skillRank: 3 },
                effects: [
                    { type: 'buff', stat: 'speed', value: 50, duration: 3, target: 'self' }
                ],
                energyCost: 35,
                cooldown: 4,
                icon: '⚡'
            },
            // Tier 3
            {
                id: 'enforcer_endurance_3a',
                name: 'Unstoppable',
                description: 'Immune to debuffs',
                tree: 'tree3',
                tier: 3,
                maxRank: 1,
                type: 'passive',
                requirements: { skillId: 'enforcer_endurance_2a', skillRank: 2 },
                effects: [
                    { type: 'passive_trigger', value: 1 }
                ],
                icon: '🚫'
            },
            {
                id: 'enforcer_endurance_3b',
                name: 'Battle Rage',
                description: 'Gain +1% damage per 1% HP lost',
                tree: 'tree3',
                tier: 3,
                maxRank: 5,
                type: 'passive',
                requirements: { skillId: 'enforcer_endurance_2b', skillRank: 2 },
                effects: [
                    { type: 'stat_boost', stat: 'attack', value: 1, scaling: 'per_rank' }
                ],
                icon: '😤'
            },
            // Tier 4
            {
                id: 'enforcer_endurance_4a',
                name: 'Berserker',
                description: 'Gain +20% damage when below 50% HP',
                tree: 'tree3',
                tier: 4,
                maxRank: 3,
                type: 'passive',
                requirements: { skillId: 'enforcer_endurance_3a', skillRank: 1 },
                effects: [
                    { type: 'stat_boost', stat: 'attack', value: 20, scaling: 'per_rank' }
                ],
                icon: '💢'
            },
            {
                id: 'enforcer_endurance_4b',
                name: 'Relentless',
                description: 'Gain +1 action per turn',
                tree: 'tree3',
                tier: 4,
                maxRank: 1,
                type: 'passive',
                requirements: { skillId: 'enforcer_endurance_3b', skillRank: 3 },
                effects: [
                    { type: 'passive_trigger', value: 1 }
                ],
                icon: '🔄'
            },
            // Tier 5
            {
                id: 'enforcer_endurance_5',
                name: 'Phoenix',
                description: 'Revive with 50% HP on death (once per combat)',
                tree: 'tree3',
                tier: 5,
                maxRank: 1,
                type: 'passive',
                requirements: { skillId: 'enforcer_endurance_4a', skillRank: 2, level: 40 },
                effects: [
                    { type: 'passive_trigger', value: 50 }
                ],
                icon: '🔥'
            }
        ]
    }
};

// ============================================
// NETRUNNER SKILL TREES  
// ============================================

export const NETRUNNER_SKILLS: ClassSkillTrees = {
    tree1: {
        name: 'Hacking',
        icon: '💻',
        description: 'Offensive hacking abilities',
        skills: [
            { id: 'netrunner_hack_1', name: 'Zap', description: 'Basic cyber attack', tree: 'tree1', tier: 1, maxRank: 5, type: 'active', effects: [{ type: 'damage', value: 12, scaling: 'per_rank', target: 'enemy' }], energyCost: 5, icon: '💻' },
            { id: 'netrunner_hack_2a', name: 'System Breach', description: 'Disable enemy ability for 2 turns', tree: 'tree1', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_hack_1', skillRank: 3 }, effects: [{ type: 'debuff', value: 100, duration: 2, target: 'enemy' }], energyCost: 35, cooldown: 4, icon: '🔓' },
            { id: 'netrunner_hack_2b', name: 'Data Spike', description: '120% damage, low cooldown', tree: 'tree1', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'netrunner_hack_1', skillRank: 3 }, effects: [{ type: 'damage', value: 120, target: 'enemy' }], energyCost: 25, cooldown: 1, icon: '⚡' },
            { id: 'netrunner_hack_3a', name: 'Firewall', description: 'Block next enemy attack', tree: 'tree1', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_hack_2a', skillRank: 2 }, effects: [{ type: 'buff', value: 1, duration: 2, target: 'self' }], energyCost: 30, cooldown: 3, icon: '🛡️' },
            { id: 'netrunner_hack_3b', name: 'Exploit', description: '+15% damage to disabled enemies', tree: 'tree1', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'netrunner_hack_2b', skillRank: 3 }, effects: [{ type: 'stat_boost', stat: 'attack', value: 15, scaling: 'per_rank' }], icon: '🎯' },
            { id: 'netrunner_hack_4a', name: 'Zero-Day', description: 'Instant kill enemy < 15% HP', tree: 'tree1', tier: 4, maxRank: 1, type: 'active', requirements: { skillId: 'netrunner_hack_3a', skillRank: 2 }, effects: [{ type: 'damage', value: 9999, target: 'enemy' }], energyCost: 60, cooldown: 7, icon: '💀' },
            { id: 'netrunner_hack_4b', name: 'Backdoor', description: 'Abilities cost 20% less energy', tree: 'tree1', tier: 4, maxRank: 3, type: 'passive', requirements: { skillId: 'netrunner_hack_3b', skillRank: 3 }, effects: [{ type: 'stat_boost', stat: 'maxEnergy', value: 20, scaling: 'per_rank' }], icon: '🔑' },
            { id: 'netrunner_hack_5', name: 'System Crash', description: 'Stun all enemies for 1 turn', tree: 'tree1', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'netrunner_hack_4a', skillRank: 1, level: 40 }, effects: [{ type: 'debuff', value: 100, duration: 1, target: 'all_enemies' }], energyCost: 90, cooldown: 10, icon: '💥' }
        ]
    },
    tree2: {
        name: 'Support',
        icon: '🔧',
        description: 'Healing and buff abilities',
        skills: [
            { id: 'netrunner_support_1', name: 'Nano-Tech', description: '+5% healing power per rank', tree: 'tree2', tier: 1, maxRank: 5, type: 'passive', effects: [{ type: 'stat_boost', value: 5, scaling: 'per_rank' }], icon: '🔧' },
            { id: 'netrunner_support_2a', name: 'Nano-Repair', description: 'Heal ally for 40% HP', tree: 'tree2', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'netrunner_support_1', skillRank: 3 }, effects: [{ type: 'heal', value: 40, target: 'ally' }], energyCost: 35, cooldown: 2, icon: '💚' },
            { id: 'netrunner_support_2b', name: 'Shield Protocol', description: 'Grant ally +30% defense', tree: 'tree2', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_support_1', skillRank: 3 }, effects: [{ type: 'buff', stat: 'defense', value: 30, duration: 3, target: 'ally' }], energyCost: 30, cooldown: 3, icon: '🛡️' },
            { id: 'netrunner_support_3a', name: 'Energy Transfer', description: 'Give ally 20 energy', tree: 'tree2', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_support_2a', skillRank: 3 }, effects: [{ type: 'buff', value: 20, target: 'ally' }], energyCost: 25, cooldown: 4, icon: '⚡' },
            { id: 'netrunner_support_3b', name: 'Overcharge', description: 'Heals also grant +10% attack', tree: 'tree2', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'netrunner_support_2b', skillRank: 2 }, effects: [{ type: 'stat_boost', stat: 'attack', value: 10, scaling: 'per_rank' }], icon: '🔥' },
            { id: 'netrunner_support_4a', name: 'Mass Heal', description: 'Heal all allies for 25% HP', tree: 'tree2', tier: 4, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_support_3a', skillRank: 2 }, effects: [{ type: 'heal', value: 25, target: 'all_allies' }], energyCost: 60, cooldown: 5, icon: '💚' },
            { id: 'netrunner_support_4b', name: 'Resurrection', description: 'Revive fallen ally with 30% HP', tree: 'tree2', tier: 4, maxRank: 1, type: 'active', requirements: { skillId: 'netrunner_support_3b', skillRank: 3 }, effects: [{ type: 'heal', value: 30, target: 'ally' }], energyCost: 80, cooldown: 8, icon: '✨' },
            { id: 'netrunner_support_5', name: 'Omega Protocol', description: 'Full heal + cleanse all allies', tree: 'tree2', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'netrunner_support_4a', skillRank: 2, level: 40 }, effects: [{ type: 'heal', value: 100, target: 'all_allies' }], energyCost: 100, cooldown: 10, icon: '🌟' }
        ]
    },
    tree3: {
        name: 'Debuffs',
        icon: '🦠',
        description: 'Status effects and DoT',
        skills: [
            { id: 'netrunner_debuff_1', name: 'Malware', description: '+5% debuff duration per rank', tree: 'tree3', tier: 1, maxRank: 5, type: 'passive', effects: [{ type: 'stat_boost', value: 5, scaling: 'per_rank' }], icon: '🦠' },
            { id: 'netrunner_debuff_2a', name: 'Virus Upload', description: '20% HP as DoT over 3 turns', tree: 'tree3', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'netrunner_debuff_1', skillRank: 3 }, effects: [{ type: 'debuff', value: 20, duration: 3, target: 'enemy' }], energyCost: 30, cooldown: 2, icon: '🦠' },
            { id: 'netrunner_debuff_2b', name: 'Slow Code', description: 'Reduce enemy speed by 50%', tree: 'tree3', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_debuff_1', skillRank: 3 }, effects: [{ type: 'debuff', stat: 'speed', value: 50, duration: 3, target: 'enemy' }], energyCost: 25, cooldown: 3, icon: '🐌' },
            { id: 'netrunner_debuff_3a', name: 'Confusion', description: 'Enemy attacks random target', tree: 'tree3', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_debuff_2a', skillRank: 3 }, effects: [{ type: 'debuff', value: 100, duration: 2, target: 'enemy' }], energyCost: 40, cooldown: 4, icon: '😵' },
            { id: 'netrunner_debuff_3b', name: 'Corruption', description: 'Debuffs spread to nearby enemies', tree: 'tree3', tier: 3, maxRank: 3, type: 'passive', requirements: { skillId: 'netrunner_debuff_2b', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 1 }], icon: '🌐' },
            { id: 'netrunner_debuff_4a', name: 'Paralyze', description: 'Stun enemy for 1 turn', tree: 'tree3', tier: 4, maxRank: 3, type: 'active', requirements: { skillId: 'netrunner_debuff_3a', skillRank: 2 }, effects: [{ type: 'debuff', value: 100, duration: 1, target: 'enemy' }], energyCost: 45, cooldown: 5, icon: '⚡' },
            { id: 'netrunner_debuff_4b', name: 'Cascade Failure', description: 'Debuffs stack 2x', tree: 'tree3', tier: 4, maxRank: 1, type: 'passive', requirements: { skillId: 'netrunner_debuff_3b', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 2 }], icon: '💥' },
            { id: 'netrunner_debuff_5', name: 'Total Corruption', description: 'All debuffs on all enemies', tree: 'tree3', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'netrunner_debuff_4a', skillRank: 2, level: 40 }, effects: [{ type: 'debuff', value: 100, duration: 3, target: 'all_enemies' }], energyCost: 100, cooldown: 10, icon: '☠️' }
        ]
    }
};

// ============================================
// MEDIC SKILL TREES
// ============================================

export const MEDIC_SKILLS: ClassSkillTrees = {
    tree1: {
        name: 'Healing',
        icon: '💉',
        description: 'Powerful healing abilities',
        skills: [
            { id: 'medic_heal_1', name: 'Medical Training', description: '+5% healing power per rank', tree: 'tree1', tier: 1, maxRank: 5, type: 'passive', effects: [{ type: 'stat_boost', value: 5, scaling: 'per_rank' }], icon: '💉' },
            { id: 'medic_heal_2a', name: 'Emergency Med', description: 'Instant 50% HP heal', tree: 'tree1', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'medic_heal_1', skillRank: 3 }, effects: [{ type: 'heal', value: 50, target: 'ally' }], energyCost: 40, cooldown: 2, icon: '💚' },
            { id: 'medic_heal_2b', name: 'Regeneration', description: 'Heal 10% HP per turn for 3 turns', tree: 'tree1', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'medic_heal_1', skillRank: 3 }, effects: [{ type: 'heal', value: 10, duration: 3, target: 'ally' }], energyCost: 35, cooldown: 3, icon: '💚' },
            { id: 'medic_heal_3a', name: 'Mass Heal', description: 'Heal all allies for 30% HP', tree: 'tree1', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'medic_heal_2a', skillRank: 3 }, effects: [{ type: 'heal', value: 30, target: 'all_allies' }], energyCost: 60, cooldown: 4, icon: '💚' },
            { id: 'medic_heal_3b', name: 'Triage', description: 'Heals on low HP targets 2x effective', tree: 'tree1', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'medic_heal_2b', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 2 }], icon: '🎯' },
            { id: 'medic_heal_4a', name: 'Resurrection', description: 'Revive fallen ally with 40% HP', tree: 'tree1', tier: 4, maxRank: 1, type: 'active', requirements: { skillId: 'medic_heal_3a', skillRank: 2 }, effects: [{ type: 'heal', value: 40, target: 'ally' }], energyCost: 80, cooldown: 8, icon: '✨' },
            { id: 'medic_heal_4b', name: 'Life Link', description: 'Share 20% of healing with all allies', tree: 'tree1', tier: 4, maxRank: 3, type: 'passive', requirements: { skillId: 'medic_heal_3b', skillRank: 3 }, effects: [{ type: 'passive_trigger', value: 20 }], icon: '🔗' },
            { id: 'medic_heal_5', name: 'Miracle', description: 'Full heal all allies + cleanse', tree: 'tree1', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'medic_heal_4a', skillRank: 1, level: 40 }, effects: [{ type: 'heal', value: 100, target: 'all_allies' }], energyCost: 100, cooldown: 10, icon: '🌟' }
        ]
    },
    tree2: {
        name: 'Buffs',
        icon: '⚡',
        description: 'Enhance ally performance',
        skills: [
            { id: 'medic_buff_1', name: 'Stimulant Science', description: '+5% buff effectiveness per rank', tree: 'tree2', tier: 1, maxRank: 5, type: 'passive', effects: [{ type: 'stat_boost', value: 5, scaling: 'per_rank' }], icon: '⚡' },
            { id: 'medic_buff_2a', name: 'Combat Stim', description: 'Grant ally +30% attack', tree: 'tree2', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'medic_buff_1', skillRank: 3 }, effects: [{ type: 'buff', stat: 'attack', value: 30, duration: 3, target: 'ally' }], energyCost: 30, cooldown: 2, icon: '⚔️' },
            { id: 'medic_buff_2b', name: 'Defensive Nano', description: 'Grant ally +30% defense', tree: 'tree2', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'medic_buff_1', skillRank: 3 }, effects: [{ type: 'buff', stat: 'defense', value: 30, duration: 3, target: 'ally' }], energyCost: 30, cooldown: 2, icon: '🛡️' },
            { id: 'medic_buff_3a', name: 'Speed Boost', description: 'Grant ally +30% speed', tree: 'tree2', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'medic_buff_2a', skillRank: 3 }, effects: [{ type: 'buff', stat: 'speed', value: 30, duration: 3, target: 'ally' }], energyCost: 30, cooldown: 2, icon: '⚡' },
            { id: 'medic_buff_3b', name: 'Synergy', description: 'Buffs last 1 turn longer', tree: 'tree2', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'medic_buff_2b', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 1 }], icon: '🔄' },
            { id: 'medic_buff_4a', name: 'Full Buff', description: 'All buffs to one ally', tree: 'tree2', tier: 4, maxRank: 3, type: 'active', requirements: { skillId: 'medic_buff_3a', skillRank: 2 }, effects: [{ type: 'buff', value: 30, duration: 3, target: 'ally' }], energyCost: 70, cooldown: 5, icon: '🌟' },
            { id: 'medic_buff_4b', name: 'Amplify', description: 'Buffs grant +10% to all stats', tree: 'tree2', tier: 4, maxRank: 3, type: 'passive', requirements: { skillId: 'medic_buff_3b', skillRank: 3 }, effects: [{ type: 'stat_boost', value: 10, scaling: 'per_rank' }], icon: '📈' },
            { id: 'medic_buff_5', name: 'Ascension', description: 'Grant ally +100% all stats for 2 turns', tree: 'tree2', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'medic_buff_4a', skillRank: 2, level: 40 }, effects: [{ type: 'buff', value: 100, duration: 2, target: 'ally' }], energyCost: 100, cooldown: 10, icon: '👑' }
        ]
    },
    tree3: {
        name: 'Hybrid Combat',
        icon: '🔫',
        description: 'Offensive medic abilities',
        skills: [
            { id: 'medic_combat_1', name: 'Scalpel', description: 'Basic melee attack', tree: 'tree3', tier: 1, maxRank: 5, type: 'active', effects: [{ type: 'damage', value: 8, scaling: 'per_rank', target: 'enemy' }], energyCost: 0, icon: '🔪' },
            { id: 'medic_combat_2a', name: 'Scalpel Strike', description: 'Precise attack, high crit chance', tree: 'tree3', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'medic_combat_1', skillRank: 3 }, effects: [{ type: 'damage', value: 130, target: 'enemy' }], energyCost: 25, cooldown: 2, icon: '🔪' },
            { id: 'medic_combat_2b', name: 'Poison Dart', description: 'DoT + heal reduction', tree: 'tree3', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'medic_combat_1', skillRank: 3 }, effects: [{ type: 'debuff', value: 15, duration: 3, target: 'enemy' }], energyCost: 30, cooldown: 3, icon: '💉' },
            { id: 'medic_combat_3a', name: 'Combat Medic', description: 'Deal damage and heal', tree: 'tree3', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'medic_combat_2a', skillRank: 3 }, effects: [{ type: 'damage', value: 100, target: 'enemy' }, { type: 'heal', value: 20, target: 'self' }], energyCost: 35, cooldown: 3, icon: '⚕️' },
            { id: 'medic_combat_3b', name: 'Tactical Strike', description: 'Attacks remove buffs', tree: 'tree3', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'medic_combat_2b', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 1 }], icon: '🎯' },
            { id: 'medic_combat_4a', name: 'Vital Strike', description: '200% damage to low HP enemies', tree: 'tree3', tier: 4, maxRank: 3, type: 'active', requirements: { skillId: 'medic_combat_3a', skillRank: 2 }, effects: [{ type: 'damage', value: 200, target: 'enemy' }], energyCost: 50, cooldown: 4, icon: '💥' },
            { id: 'medic_combat_4b', name: 'Battle Surgeon', description: 'Kills heal nearby allies', tree: 'tree3', tier: 4, maxRank: 3, type: 'passive', requirements: { skillId: 'medic_combat_3b', skillRank: 3 }, effects: [{ type: 'heal', value: 15, target: 'all_allies' }], icon: '💚' },
            { id: 'medic_combat_5', name: 'Omega Strike', description: 'Massive damage + heal all allies', tree: 'tree3', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'medic_combat_4a', skillRank: 2, level: 40 }, effects: [{ type: 'damage', value: 400, target: 'enemy' }, { type: 'heal', value: 30, target: 'all_allies' }], energyCost: 100, cooldown: 10, icon: '💫' }
        ]
    }
};

// ============================================
// ASSASSIN SKILL TREES
// ============================================

export const ASSASSIN_SKILLS: ClassSkillTrees = {
    tree1: {
        name: 'Stealth',
        icon: '🗡️',
        description: 'Stealth and critical strikes',
        skills: [
            { id: 'assassin_stealth_1', name: 'Quick Stab', description: 'Fast attack', tree: 'tree1', tier: 1, maxRank: 5, type: 'active', effects: [{ type: 'damage', value: 15, scaling: 'per_rank', target: 'enemy' }], energyCost: 5, icon: '🗡️' },
            { id: 'assassin_stealth_2a', name: 'Backstab', description: '200% damage if enemy full HP', tree: 'tree1', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'assassin_stealth_1', skillRank: 3 }, effects: [{ type: 'damage', value: 200, target: 'enemy' }], energyCost: 35, cooldown: 3, icon: '🗡️' },
            { id: 'assassin_stealth_2b', name: 'Vanish', description: 'Dodge next attack guaranteed', tree: 'tree1', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'assassin_stealth_1', skillRank: 3 }, effects: [{ type: 'buff', value: 100, duration: 1, target: 'self' }], energyCost: 30, cooldown: 4, icon: '👤' },
            { id: 'assassin_stealth_3a', name: 'Shadow Strike', description: 'Ignore 50% defense', tree: 'tree1', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'assassin_stealth_2a', skillRank: 3 }, effects: [{ type: 'damage', value: 150, target: 'enemy' }], energyCost: 40, cooldown: 3, icon: '⚔️' },
            { id: 'assassin_stealth_3b', name: 'Silent Killer', description: "Crits don't trigger counterattacks", tree: 'tree1', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'assassin_stealth_2b', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 1 }], icon: '🤫' },
            { id: 'assassin_stealth_4a', name: 'Assassinate', description: 'Instant kill if enemy < 20% HP', tree: 'tree1', tier: 4, maxRank: 1, type: 'active', requirements: { skillId: 'assassin_stealth_3a', skillRank: 2 }, effects: [{ type: 'damage', value: 9999, target: 'enemy' }], energyCost: 50, cooldown: 6, icon: '💀' },
            { id: 'assassin_stealth_4b', name: 'From the Shadows', description: 'First attack always crits', tree: 'tree1', tier: 4, maxRank: 3, type: 'passive', requirements: { skillId: 'assassin_stealth_3b', skillRank: 3 }, effects: [{ type: 'passive_trigger', value: 100 }], icon: '🌑' },
            { id: 'assassin_stealth_5', name: 'Death Mark', description: 'Next attack instant kills', tree: 'tree1', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'assassin_stealth_4a', skillRank: 1, level: 40 }, effects: [{ type: 'damage', value: 9999, target: 'enemy' }], energyCost: 100, cooldown: 10, icon: '☠️' }
        ]
    },
    tree2: {
        name: 'Speed',
        icon: '⚡',
        description: 'Speed and multi-attacks',
        skills: [
            { id: 'assassin_speed_1', name: 'Agility', description: '+3% speed per rank', tree: 'tree2', tier: 1, maxRank: 5, type: 'passive', effects: [{ type: 'stat_boost', stat: 'speed', value: 3, scaling: 'per_rank' }], icon: '⚡' },
            { id: 'assassin_speed_2a', name: 'Rapid Strikes', description: 'Attack twice in one turn', tree: 'tree2', tier: 2, maxRank: 5, type: 'active', requirements: { skillId: 'assassin_speed_1', skillRank: 3 }, effects: [{ type: 'damage', value: 80, target: 'enemy' }], energyCost: 40, cooldown: 3, icon: '⚔️' },
            { id: 'assassin_speed_2b', name: 'Evasion', description: '+10% dodge chance per rank', tree: 'tree2', tier: 2, maxRank: 5, type: 'passive', requirements: { skillId: 'assassin_speed_1', skillRank: 3 }, effects: [{ type: 'stat_boost', value: 10, scaling: 'per_rank' }], icon: '💨' },
            { id: 'assassin_speed_3a', name: 'Momentum', description: '+10% damage per consecutive hit', tree: 'tree2', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'assassin_speed_2a', skillRank: 3 }, effects: [{ type: 'stat_boost', stat: 'attack', value: 10, scaling: 'per_rank' }], icon: '🔥' },
            { id: 'assassin_speed_3b', name: 'Blur', description: 'Untargetable for 1 turn', tree: 'tree2', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'assassin_speed_2b', skillRank: 3 }, effects: [{ type: 'buff', value: 100, duration: 1, target: 'self' }], energyCost: 45, cooldown: 5, icon: '👻' },
            { id: 'assassin_speed_4a', name: 'Lightning Reflexes', description: 'Always act first', tree: 'tree2', tier: 4, maxRank: 1, type: 'passive', requirements: { skillId: 'assassin_speed_3a', skillRank: 3 }, effects: [{ type: 'stat_boost', stat: 'speed', value: 999 }], icon: '⚡' },
            { id: 'assassin_speed_4b', name: 'Combo Master', description: '3rd hit in combo is free', tree: 'tree2', tier: 4, maxRank: 3, type: 'passive', requirements: { skillId: 'assassin_speed_3b', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 3 }], icon: '🎯' },
            { id: 'assassin_speed_5', name: 'Time Dilation', description: 'Take 3 turns in a row', tree: 'tree2', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'assassin_speed_4a', skillRank: 1, level: 40 }, effects: [{ type: 'buff', value: 3, duration: 1, target: 'self' }], energyCost: 100, cooldown: 10, icon: '⏰' }
        ]
    },
    tree3: {
        name: 'Critical Damage',
        icon: '💥',
        description: 'Maximize critical damage',
        skills: [
            { id: 'assassin_crit_1', name: 'Precision', description: '+10% crit damage per rank', tree: 'tree3', tier: 1, maxRank: 5, type: 'passive', effects: [{ type: 'stat_boost', value: 10, scaling: 'per_rank' }], icon: '💥' },
            { id: 'assassin_crit_2a', name: 'Vital Strike', description: 'Next attack guaranteed crit', tree: 'tree3', tier: 2, maxRank: 3, type: 'active', requirements: { skillId: 'assassin_crit_1', skillRank: 3 }, effects: [{ type: 'buff', value: 100, duration: 1, target: 'self' }], energyCost: 30, cooldown: 3, icon: '🎯' },
            { id: 'assassin_crit_2b', name: 'Weak Point', description: '+5% crit chance per rank', tree: 'tree3', tier: 2, maxRank: 5, type: 'passive', requirements: { skillId: 'assassin_crit_1', skillRank: 3 }, effects: [{ type: 'stat_boost', value: 5, scaling: 'per_rank' }], icon: '🔍' },
            { id: 'assassin_crit_3a', name: 'Execute', description: '300% crit damage', tree: 'tree3', tier: 3, maxRank: 3, type: 'active', requirements: { skillId: 'assassin_crit_2a', skillRank: 2 }, effects: [{ type: 'damage', value: 300, target: 'enemy' }], energyCost: 50, cooldown: 4, icon: '💀' },
            { id: 'assassin_crit_3b', name: 'Deadly Precision', description: 'Crits ignore armor', tree: 'tree3', tier: 3, maxRank: 5, type: 'passive', requirements: { skillId: 'assassin_crit_2b', skillRank: 3 }, effects: [{ type: 'passive_trigger', value: 1 }], icon: '🎯' },
            { id: 'assassin_crit_4a', name: 'Chain Crit', description: 'Crits grant another attack', tree: 'tree3', tier: 4, maxRank: 1, type: 'passive', requirements: { skillId: 'assassin_crit_3a', skillRank: 2 }, effects: [{ type: 'passive_trigger', value: 1 }], icon: '🔗' },
            { id: 'assassin_crit_4b', name: 'Bloodlust', description: 'Crits restore 10 energy', tree: 'tree3', tier: 4, maxRank: 3, type: 'passive', requirements: { skillId: 'assassin_crit_3b', skillRank: 3 }, effects: [{ type: 'stat_boost', stat: 'maxEnergy', value: 10, scaling: 'per_rank' }], icon: '🩸' },
            { id: 'assassin_crit_5', name: 'Perfect Strike', description: '1000% guaranteed crit', tree: 'tree3', tier: 5, maxRank: 1, type: 'active', requirements: { skillId: 'assassin_crit_4a', skillRank: 1, level: 40 }, effects: [{ type: 'damage', value: 1000, target: 'enemy' }], energyCost: 100, cooldown: 10, icon: '⭐' }
        ]
    }
};

// Export all class skills
export const ALL_SKILLS = {
    enforcer: ENFORCER_SKILLS,
    netrunner: NETRUNNER_SKILLS,
    medic: MEDIC_SKILLS,
    assassin: ASSASSIN_SKILLS,
    scavenger: {
        tree1: { name: 'Survival', icon: '🎒', description: 'Basic survival skills', skills: [] },
        tree2: { name: 'Scavenging', icon: '🔍', description: 'Finding resources', skills: [] },
        tree3: { name: 'Jury-Rigging', icon: '🔧', description: 'Basic repairs', skills: [] }
    }
};
