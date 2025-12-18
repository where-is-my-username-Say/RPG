// Skill System Type Definitions

export interface Skill {
    id: string;
    name: string;
    description: string;
    tree: 'tree1' | 'tree2' | 'tree3';
    tier: 1 | 2 | 3 | 4 | 5;
    maxRank: number;
    currentRank?: number;
    type: 'passive' | 'active';
    requirements?: {
        level?: number;
        skillId?: string;
        skillRank?: number;
    };
    effects: SkillEffect[];
    icon: string;
    energyCost?: number;
    cooldown?: number;
}

export interface SkillEffect {
    type: 'stat_boost' | 'ability' | 'passive_trigger' | 'damage' | 'heal' | 'buff' | 'debuff';
    stat?: 'hp' | 'attack' | 'defense' | 'speed' | 'maxEnergy';
    value: number;
    scaling?: 'per_rank' | 'flat';
    duration?: number; // For buffs/debuffs
    target?: 'self' | 'ally' | 'enemy' | 'all_allies' | 'all_enemies';
}

export interface SkillTreeDefinition {
    name: string;
    icon: string;
    description: string;
    skills: Skill[];
}

export interface ClassSkillTrees {
    tree1: SkillTreeDefinition;
    tree2: SkillTreeDefinition;
    tree3: SkillTreeDefinition;
}

// Player skill allocation
export interface PlayerSkills {
    [skillId: string]: number; // skill ID -> current rank
}
