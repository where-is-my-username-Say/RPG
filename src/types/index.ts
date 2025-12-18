// Type Definitions for Cyber Mercenary v0.1

// ============================================
// PLAYER & PROGRESSION
// ============================================

// ============================================
// PLAYER & PROGRESSION
// ============================================

import type { Skill, PlayerSkills } from './skills';
export type { Skill, PlayerSkills };

// ============================================
// PLAYER & PROGRESSION
// ============================================

export interface PlayerProfile {
    id: string;
    username: string;
    level: number;
    xp: number;
    xpToNext: number;
    gold: number;
    energy: number;
    maxEnergy: number;
    lastEnergyUpdate: Date;
    classId: CharacterClassId;
    skillPoints: number;
    skills: PlayerSkills; // New Skills State
    reputationTier: ReputationTier;
    inventory: InventoryItem[];
    createdAt: Date;
    lastLogin: Date;
    equipment?: Equipment; // New Equipment State
    unlockedWaypoints?: string[]; // IDs of unlocked waypoints
    completedQuests?: string[]; // IDs of completed quests
    tutorialCompleted?: boolean;
}

export interface Equipment {
    helmet?: InventoryItem;
    chest?: InventoryItem;
    legs?: InventoryItem;
    weapon?: InventoryItem;
    // Removed OFFHAND and BOOTS as per user request
}

export type ReputationTier =
    | 'STREET_RAT'      // Level 1-20
    | 'CONTRACTOR'      // Level 21-40
    | 'SPECIALIST'      // Level 41-60
    | 'ELITE_OPERATIVE' // Level 61-80
    | 'LEGEND';         // Level 81-100

export type CharacterClassId = 'enforcer' | 'netrunner' | 'medic' | 'assassin' | 'scavenger';

export interface CharacterClass {
    id: CharacterClassId;
    name: string;
    description: string;
    icon: string;
    baseStats: {
        hp: number;
        attack: number;
        defense: number;
        critChance: number;
    };
    skills: Skill[];
}

// ============================================
// DAILY SYSTEMS
// ============================================

export interface DailyProgress {
    userId: string;
    date: string; // YYYY-MM-DD
    loginClaimed: boolean;
    loginStreak: number;
    contractsCompleted: number;
    dailyBossCompleted: boolean;
    energyRefillsUsed: number;
}

export interface DailyContract {
    id: string;
    title: string;
    description: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    objectives: ContractObjective[];
    rewards: Reward[];
    energyCost: number;
    timeLimit: number; // minutes
}

export interface ContractObjective {
    type: 'DEFEAT' | 'COLLECT' | 'HACK' | 'SURVIVE';
    target: string;
    count: number;
    current: number;
}

export interface Reward {
    type: 'XP' | 'GOLD' | 'ITEM' | 'ENERGY';
    amount: number;
    itemId?: string;
}

// ============================================
// COMBAT
// ============================================

export interface CombatSession {
    id: string;
    type: 'PVE' | 'PVP';
    players: CombatPlayer[];
    enemies: CombatEnemy[];
    turnOrder: string[];
    currentTurnId: string;
    turnTimeLimit: number;
    round: number;
    status: 'ACTIVE' | 'VICTORY' | 'DEFEAT';
}

export interface CombatPlayer {
    userId: string;
    username: string;
    classId: CharacterClassId;
    hp: number;
    maxHp: number;
    energy: number;
    buffs: StatusEffect[];
    debuffs: StatusEffect[];
    isAlive: boolean;
}

export interface CombatEnemy {
    id: string;
    name: string;
    level: number;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    skills: Skill[];
    lootTable: LootTable;
    image?: string;
}

export interface StatusEffect {
    id: string;
    name: string;
    type: 'BUFF' | 'DEBUFF';
    duration: number; // turns
    value: number;
}

export interface LootTable {
    gold: { min: number; max: number };
    xp: number;
    items: LootDrop[];
}

export interface LootDrop {
    itemId: string;
    chance: number; // 0-1
    quantity: number;
}

// ============================================
// ITEMS & INVENTORY
// ============================================

export interface Item {
    id: string;
    name: string;
    description: string;
    type: 'WEAPON' | 'ARMOR' | 'CONSUMABLE' | 'MATERIAL';
    subtype?: string;
    rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
    stats?: ItemStats;
    icon: string;
}

export interface ItemStats {
    hp: number;
    attack: number;
    defense: number;
    critChance: number;
}

export interface InventoryItem {
    id: string;
    userId: string;
    itemId: string;
    quantity: number;
    slot?: number;
    isEquipped: boolean;
    upgradeLevel: number;
    // For unique/crafted items
    instanceId?: string;
    name?: string;
    description?: string;
    type?: 'WEAPON' | 'ARMOR' | 'CONSUMABLE' | 'MATERIAL';
    subtype?: string;
    rarity?: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
    stats?: ItemStats;
    icon?: string;
    value?: number; // Calculated value for crafted/unique items
}

// ============================================
// SOCIAL
// ============================================

export interface Friend {
    id: string;
    userId: string;
    friendId: string;
    username: string;
    level: number;
    classId: CharacterClassId;
    status: 'pending' | 'accepted';
    isOnline: boolean;
    lastSeen: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    senderName: string;
    partyId: string | null; // null for global
    content: string;
    createdAt: string;
    type: 'CHAT' | 'SYSTEM' | 'LOOT';
}

export interface Guild {
    id: string;
    name: string;
    tag: string;
    level: number;
    xp: number;
    memberCount: number;
    maxMembers: number;
    leaderId: string;
    treasury: number;
    createdAt: Date;
}

export interface GuildMember {
    userId: string;
    guildId: string;
    rank: 'LEADER' | 'OFFICER' | 'MEMBER' | 'RECRUIT';
    contributionPoints: number;
    joinedAt: Date;
}

export interface Party {
    id: string;
    leaderId: string;
    code?: string; // Party invite code
    members: PartyMember[];
    maxSize: number;
    isPublic: boolean;
    activityType: 'DUNGEON' | 'RAID' | 'PVP' | 'OPEN_WORLD';
    createdAt: Date;
}

export interface PartyMember {
    userId: string;
    username: string;
    classId: CharacterClassId;
    level: number;
    isReady: boolean;
}

export interface PartyInvite {
    id: string;
    partyId: string;
    fromUserId: string;
    toUserId: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: string;
    fromUsername?: string; // Joined field
}

// ============================================
// GAME STATE
// ============================================

export interface GameState {
    // Player
    player: PlayerProfile | null;

    // Daily
    dailyProgress: DailyProgress | null;
    availableContracts: DailyContract[];

    // Combat
    activeCombat: CombatSession | null;

    // Social
    currentParty: Party | null;
    currentGuild: Guild | null;

    // UI
    currentView: GameView;
    isLoading: boolean;
    isSaving: boolean; // Debug/UI
    saveError: string | null; // Debug/UI
    error: string | null;
}

export type GameView =
    | 'SPLASH'
    | 'LOGIN'
    | 'CHARACTER_SELECT'
    | 'MAIN_HUB'
    | 'COMBAT'
    | 'INVENTORY'
    | 'SKILLS'
    | 'MINING'
    | 'FORGING'
    | 'GUILD'
    | 'WORLD_MAP';
