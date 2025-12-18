import type { CharacterClass } from '../types';
import { ALL_SKILLS } from './skills';

// Character Classes for Cyber Mercenary
export const CLASSES: Record<string, CharacterClass> = {
    enforcer: {
        id: 'enforcer',
        name: 'Enforcer',
        description: 'Heavy combat specialist with high HP and defense',
        icon: '🛡️',
        baseStats: {
            hp: 150,
            attack: 18,
            defense: 15,
            critChance: 5,
            speed: 80
        },
        skills: [
            ALL_SKILLS.enforcer.tree1.skills[0],
            ALL_SKILLS.enforcer.tree2.skills[0],
            ALL_SKILLS.enforcer.tree3.skills[0]
        ]
    },

    netrunner: {
        id: 'netrunner',
        name: 'Netrunner',
        description: 'Tech specialist with hacking abilities and debuffs',
        icon: '💻',
        baseStats: {
            hp: 90,
            attack: 22,
            defense: 8,
            critChance: 12,
            speed: 110
        },
        skills: [
            ALL_SKILLS.netrunner.tree1.skills[0],
            ALL_SKILLS.netrunner.tree2.skills[0],
            ALL_SKILLS.netrunner.tree3.skills[0]
        ]
    },

    medic: {
        id: 'medic',
        name: 'Medic',
        description: 'Support specialist with healing and buffs',
        icon: '💉',
        baseStats: {
            hp: 100,
            attack: 12,
            defense: 10,
            critChance: 8,
            speed: 100
        },
        skills: [
            ALL_SKILLS.medic.tree1.skills[0],
            ALL_SKILLS.medic.tree2.skills[0],
            ALL_SKILLS.medic.tree3.skills[0]
        ]
    },

    assassin: {
        id: 'assassin',
        name: 'Assassin',
        description: 'High damage dealer with critical strikes',
        icon: '🗡️',
        baseStats: {
            hp: 85,
            attack: 28,
            defense: 6,
            critChance: 25,
            speed: 130
        },
        skills: [
            ALL_SKILLS.assassin.tree1.skills[0],
            ALL_SKILLS.assassin.tree2.skills[0],
            ALL_SKILLS.assassin.tree3.skills[0]
        ]
    },

    // FALLBACK CLASS (Prevents Crashes for Default Profiles)
    scavenger: {
        id: 'scavenger',
        name: 'Survivor',
        description: 'A rugged survivor of the neon wastes.',
        icon: '🎒',
        baseStats: {
            hp: 100,
            attack: 10,
            defense: 10,
            critChance: 5,
            speed: 100
        },
        skills: [] // Empty skills for now to prevent skill lookup crashes
    }
};
