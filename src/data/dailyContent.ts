import type { DailyContract } from '../types';

// Daily Contracts - Refreshes every 24 hours
export const DAILY_CONTRACTS: DailyContract[] = [
    {
        id: 'data_extraction',
        title: 'Data Extraction',
        description: 'Infiltrate corporate servers and extract classified data',
        difficulty: 'EASY',
        objectives: [
            {
                type: 'HACK',
                target: 'Corporate Terminal',
                count: 3,
                current: 0
            }
        ],
        rewards: [
            { type: 'XP', amount: 500 },
            { type: 'GOLD', amount: 1000 }
        ],
        energyCost: 20,
        timeLimit: 15
    },

    {
        id: 'bounty_hunt',
        title: 'Bounty: Rogue AI',
        description: 'Track down and eliminate a rogue AI in the undercity',
        difficulty: 'MEDIUM',
        objectives: [
            {
                type: 'DEFEAT',
                target: 'Rogue AI',
                count: 1,
                current: 0
            }
        ],
        rewards: [
            { type: 'XP', amount: 1200 },
            { type: 'GOLD', amount: 2500 },
            { type: 'ITEM', amount: 1, itemId: 'rare_chip' }
        ],
        energyCost: 30,
        timeLimit: 20
    },

    {
        id: 'supply_run',
        title: 'Supply Run',
        description: 'Collect medical supplies from abandoned clinics',
        difficulty: 'EASY',
        objectives: [
            {
                type: 'COLLECT',
                target: 'Med Kit',
                count: 5,
                current: 0
            }
        ],
        rewards: [
            { type: 'XP', amount: 400 },
            { type: 'GOLD', amount: 800 },
            { type: 'ITEM', amount: 3, itemId: 'health_pack' }
        ],
        energyCost: 15,
        timeLimit: 10
    },

    {
        id: 'gang_warfare',
        title: 'Gang Warfare',
        description: 'Assist local gang in territorial dispute',
        difficulty: 'HARD',
        objectives: [
            {
                type: 'DEFEAT',
                target: 'Gang Member',
                count: 10,
                current: 0
            },
            {
                type: 'SURVIVE',
                target: 'Boss Fight',
                count: 1,
                current: 0
            }
        ],
        rewards: [
            { type: 'XP', amount: 2000 },
            { type: 'GOLD', amount: 5000 },
            { type: 'ITEM', amount: 1, itemId: 'epic_weapon' }
        ],
        energyCost: 50,
        timeLimit: 30
    }
];

// Daily Login Rewards (7-day cycle)
export const LOGIN_REWARDS = [
    { day: 1, rewards: [{ type: 'ENERGY', amount: 50 }, { type: 'GOLD', amount: 1000 }] },
    { day: 2, rewards: [{ type: 'ITEM', amount: 3, itemId: 'rare_loot_box' }] },
    { day: 3, rewards: [{ type: 'ENERGY', amount: 100 }, { type: 'GOLD', amount: 5000 }] },
    { day: 4, rewards: [{ type: 'ITEM', amount: 1, itemId: 'epic_loot_box' }] },
    { day: 5, rewards: [{ type: 'ITEM', amount: 1, itemId: 'skill_respec_token' }] },
    { day: 6, rewards: [{ type: 'GOLD', amount: 10000 }, { type: 'ENERGY', amount: 100 }] },
    { day: 7, rewards: [{ type: 'ITEM', amount: 1, itemId: 'legendary_loot_box' }, { type: 'ITEM', amount: 1, itemId: 'exclusive_cosmetic' }] }
];
