import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { GameState, GameView, PlayerProfile, DailyProgress, Skill } from '../types';
import { ALL_SKILLS } from '../data/skills';
import { CLASSES } from '../data/classes';

interface GameStore extends GameState {
    // Actions
    setView: (view: GameView) => void;
    setPlayer: (player: PlayerProfile | null) => void;
    setDailyProgress: (progress: DailyProgress | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Energy
    updateEnergy: () => void;
    consumeEnergy: (amount: number) => boolean;

    // XP & Leveling
    gainXP: (amount: number) => void;
    gainGold: (amount: number) => void;

    // Inventory
    addItem: (itemId: string, quantity: number, customProps?: any) => void;
    removeItem: (itemId: string, quantity: number) => boolean;

    // Equipment Actions
    equipItem: (item: any) => void;
    unequipItem: (slot: 'helmet' | 'chest' | 'legs' | 'weapon') => void;
    sellItem: (itemId: string, quantity: number) => void;

    // Skill System
    allocateSkillPoint: (skillId: string) => void;
    resetSkillTree: (tree: 'tree1' | 'tree2' | 'tree3') => void;
    getSkillBonus: (stat: string) => number;
    getPlayerStats: () => { hp: number; attack: number; defense: number; critChance: number };

    // Persistence
    loadFromSupabase: (userId: string) => Promise<void>;
    saveToSupabase: () => Promise<void>;
    completeTutorial: () => void;
    resetAccount: () => Promise<void>;
    deleteAccount: () => Promise<void>;
}

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial State
    player: null,
    dailyProgress: null,
    availableContracts: [],
    activeCombat: null,
    currentParty: null,
    currentGuild: null,
    currentView: 'SPLASH',
    isLoading: false,
    error: null,

    // UI/Debug State
    isSaving: false,
    saveError: null,

    // Actions
    setView: (view) => set({ currentView: view }),
    setPlayer: (player) => set({ player }),
    setDailyProgress: (progress) => set({ dailyProgress: progress }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    completeTutorial: () => {
        const { player } = get();
        if (!player) return;
        set({ player: { ...player, tutorialCompleted: true } });
        // Trigger save
        get().saveToSupabase();
    },

    // Energy System
    updateEnergy: () => {
        const { player } = get();
        if (!player) return;

        const now = new Date();
        const lastUpdate = new Date(player.lastEnergyUpdate);
        const minutesPassed = Math.floor((now.getTime() - lastUpdate.getTime()) / 60000);

        if (minutesPassed > 0) {
            const energyGained = Math.floor(minutesPassed / 6); // 1 energy per 6 minutes
            const newEnergy = Math.min(player.maxEnergy, player.energy + energyGained);

            set({
                player: {
                    ...player,
                    energy: newEnergy,
                    lastEnergyUpdate: now
                }
            });
        }
    },

    consumeEnergy: (amount: number) => {
        const { player } = get();
        if (!player || player.energy < amount) return false;

        // Optimistic Update
        set({
            player: {
                ...player,
                energy: player.energy - amount
            }
        });

        // Trigger Save (Debounced by useAutoSave normally, but good to have state updated)
        return true;
    },

    // Progression
    gainXP: (amount: number) => {
        const { player } = get();
        if (!player) return;

        let newXP = (player.xp || 0) + amount;
        let newLevel = player.level || 1;
        let newSkillPoints = player.skillPoints || 0;
        let newMaxEnergy = player.maxEnergy || 100;

        // Check for level up
        while (newXP >= calculateXPToNext(newLevel) && newLevel < 100) {
            newXP -= calculateXPToNext(newLevel);
            newLevel++;
            newSkillPoints++;
            newMaxEnergy = 100 + (newLevel * 2);

            // Full energy refill on level up
            set({
                player: {
                    ...player,
                    level: newLevel,
                    xp: newXP,
                    xpToNext: calculateXPToNext(newLevel),
                    skillPoints: newSkillPoints,
                    maxEnergy: newMaxEnergy,
                    energy: newMaxEnergy
                }
            });
        }

        set({
            player: {
                ...player,
                xp: newXP,
                level: newLevel,
                skillPoints: newSkillPoints,
                maxEnergy: newMaxEnergy
            }
        });
    },

    getPlayerStats: () => {
        const { player, getSkillBonus } = get();
        if (!player) return { hp: 0, attack: 0, defense: 0, critChance: 0 };

        // SAFETY: Fallback to 'enforcer' if classId is invalid or missing
        const safeClassId = (player.classId && CLASSES[player.classId]) ? player.classId : 'enforcer';
        const classData = CLASSES[safeClassId];

        const currentLevel = player.level || 1;
        const levelBonusMultiplier = 1 + (currentLevel - 1) * 0.1; // 10% per level

        // Base Stats (Scaled by Level)
        const baseHP = Math.floor(classData.baseStats.hp * levelBonusMultiplier);
        const baseAttack = Math.floor(classData.baseStats.attack * levelBonusMultiplier);
        const baseDefense = Math.floor(classData.baseStats.defense * levelBonusMultiplier);
        const baseCrit = classData.baseStats.critChance || 5; // Default 5%

        // Equipment Bonuses
        let equipHP = 0;
        let equipAttack = 0;
        let equipDefense = 0;
        let equipCrit = 0;

        const equipment = player.equipment || {};
        Object.values(equipment).forEach((item: any) => {
            if (item && item.stats) {
                equipHP += item.stats.hp || 0;
                equipAttack += item.stats.attack || 0;
                equipDefense += item.stats.defense || 0;
                equipCrit += item.stats.critChance || 0;
            }
        });

        // Skill Bonuses
        const skillHP = getSkillBonus('hp');
        const skillAttack = getSkillBonus('attack');
        const skillDefense = getSkillBonus('defense');
        const skillCrit = getSkillBonus('critChance');

        return {
            hp: baseHP + equipHP + skillHP,
            attack: baseAttack + equipAttack + skillAttack,
            defense: baseDefense + equipDefense + skillDefense,
            critChance: baseCrit + equipCrit + skillCrit
        };
    },

    gainGold: (amount: number) => {
        const { player } = get();
        if (!player) return;

        set({
            player: {
                ...player,
                gold: (player.gold || 0) + amount
            }
        });
    },

    // Inventory Actions
    addItem: (itemId: string, quantity: number, customProps?: any) => {
        const { player } = get();
        if (!player) return;

        const inventory = player.inventory || [];
        const existingItemIndex = inventory.findIndex(i => i.itemId === itemId && !i.stats); // Only stack non-unique items

        let newInventory = [...inventory];

        // Helper for non-secure contexts (e.g., LAN HTTP)
        const generateUUID = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                return crypto.randomUUID();
            }
            // Fallback for insecure contexts
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        };

        if (customProps) {
            newInventory.push({
                id: generateUUID(),
                userId: player.id,
                itemId,
                quantity,
                isEquipped: false,
                upgradeLevel: 0,
                ...customProps
            });
        } else if (existingItemIndex > -1) {
            newInventory[existingItemIndex] = {
                ...newInventory[existingItemIndex],
                quantity: newInventory[existingItemIndex].quantity + quantity
            };
        } else {
            newInventory.push({
                id: generateUUID(),
                userId: player.id,
                itemId,
                quantity,
                isEquipped: false,
                upgradeLevel: 0
            });
        }

        set({
            player: {
                ...player,
                inventory: newInventory
            }
        });
    },

    removeItem: (itemId: string, quantity: number) => {
        const { player } = get();
        if (!player) return false;

        const inventory = player.inventory || [];
        const existingItemIndex = inventory.findIndex(i => i.itemId === itemId);

        if (existingItemIndex === -1) return false;

        const item = inventory[existingItemIndex];
        if (item.quantity < quantity) return false;

        let newInventory = [...inventory];

        if (item.quantity === quantity) {
            newInventory.splice(existingItemIndex, 1);
        } else {
            newInventory[existingItemIndex] = {
                ...item,
                quantity: item.quantity - quantity
            };
        }

        set({
            player: {
                ...player,
                inventory: newInventory
            }
        });
        return true;
    },

    // --- EQUIPMENT ACTIONS ---
    equipItem: (itemToEquip: any) => {
        const { player } = get();
        if (!player) return;

        // Determine Slot
        let slot: 'helmet' | 'chest' | 'legs' | 'weapon' | null = null;
        if (itemToEquip.subtype.includes('HELMET')) slot = 'helmet';
        if (itemToEquip.subtype.includes('CHEST')) slot = 'chest';
        if (itemToEquip.subtype.includes('LEGS')) slot = 'legs';
        if (['DAGGER', 'SWORD', 'AXE', 'KATANA', 'GREATSWORD', 'HAMMER'].some((t: string) => itemToEquip.subtype.includes(t))) slot = 'weapon';

        if (!slot) return;

        const currentEquipment = player.equipment || {};
        const currentlyEquipped = currentEquipment[slot];

        let newInventory = [...(player.inventory || [])];
        let newEquipment = { ...currentEquipment };

        // 1. Remove item from inventory
        const invIndex = newInventory.findIndex(i => i.id === itemToEquip.id);
        if (invIndex > -1) {
            if (newInventory[invIndex].quantity > 1) {
                newInventory[invIndex].quantity--;
            } else {
                newInventory.splice(invIndex, 1);
            }
        }

        // 2. If something is equipped, put it back in inventory
        if (currentlyEquipped) {
            newInventory.push(currentlyEquipped);
        }

        // 3. Equip new item
        newEquipment[slot] = itemToEquip;

        set({
            player: {
                ...player,
                inventory: newInventory,
                equipment: newEquipment
            }
        });
    },

    unequipItem: (slot: 'helmet' | 'chest' | 'legs' | 'weapon') => {
        const { player } = get();
        if (!player || !player.equipment || !player.equipment[slot]) return;

        const item = player.equipment[slot];
        const newInventory = [...(player.inventory || []), item!];
        const newEquipment = { ...player.equipment };
        delete newEquipment[slot];

        set({
            player: {
                ...player,
                inventory: newInventory,
                equipment: newEquipment
            }
        });
    },

    sellItem: (itemId: string, quantity: number) => {
        const { player, removeItem, gainGold } = get();
        if (!player) return;

        const inventory = player.inventory || [];
        const item = inventory.find(i => i.itemId === itemId);
        if (!item) return;

        const val = item.value || 10;
        const totalValue = val * quantity;

        if (removeItem(itemId, quantity)) {
            gainGold(totalValue);
        }
    },

    // --- SKILL SYSTEM ---
    allocateSkillPoint: (skillId: string) => {
        const { player } = get();
        if (!player || (player.skillPoints || 0) <= 0) return;

        const classSkills = ALL_SKILLS[player.classId as keyof typeof ALL_SKILLS];
        if (!classSkills) return;

        const skillDef = Object.values(classSkills).flatMap((tree: any) => tree.skills).find((s: Skill) => s.id === skillId);
        if (!skillDef) return;

        const currentSkills = player.skills || {};
        const currentRank = currentSkills[skillId] || 0;

        if (currentRank >= skillDef.maxRank) return;

        set({
            player: {
                ...player,
                skillPoints: (player.skillPoints || 0) - 1,
                skills: {
                    ...currentSkills,
                    [skillId]: currentRank + 1
                }
            }
        });
    },

    resetSkillTree: (treeId: 'tree1' | 'tree2' | 'tree3') => {
        const { player } = get();
        if (!player) return;

        const classSkills = ALL_SKILLS[player.classId as keyof typeof ALL_SKILLS];
        if (!classSkills || !classSkills[treeId]) return;

        const treeSkills = classSkills[treeId].skills;
        const currentSkills = { ...(player.skills || {}) };
        let refundedPoints = 0;

        treeSkills.forEach((skill: Skill) => {
            if (currentSkills[skill.id]) {
                refundedPoints += currentSkills[skill.id];
                delete currentSkills[skill.id];
            }
        });

        set({
            player: {
                ...player,
                skillPoints: (player.skillPoints || 0) + refundedPoints,
                skills: currentSkills
            }
        });
    },

    getSkillBonus: (stat: string) => {
        const { player } = get();
        if (!player) return 0;

        // Safety for skill bonus lookup
        const safeClassId = (player.classId && ALL_SKILLS[player.classId as keyof typeof ALL_SKILLS]) ? player.classId : 'enforcer';
        const classSkills = ALL_SKILLS[safeClassId as keyof typeof ALL_SKILLS];
        if (!classSkills) return 0;

        let totalBonus = 0;
        const learnedSkills = player.skills || {};

        Object.entries(learnedSkills).forEach(([skillId, rank]) => {
            const rankNum = rank as number;
            if (rankNum <= 0) return;

            const skillDef = Object.values(classSkills).flatMap((tree: any) => tree.skills).find((s: Skill) => s.id === skillId);

            if (skillDef && skillDef.type === 'passive') {
                skillDef.effects.forEach((effect: any) => {
                    if (effect.type === 'stat_boost' && effect.stat === stat) {
                        if (effect.scaling === 'per_rank') {
                            totalBonus += effect.value * rankNum;
                        } else {
                            totalBonus += effect.value;
                        }
                    }
                });
            }
        });

        return totalBonus;
    },

    loadFromSupabase: async (userId: string) => {
        console.log("🚀 START loadFromSupabase (Robust Hydration Mode):", userId);
        set({ isLoading: true, error: null });

        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('game_data')
                .eq('id', userId)
                .single();

            let loadedPlayer: PlayerProfile;

            // Scenario 1: No data found, or explicit null/error.
            if (error || !profile) {
                console.warn("⚠️ No Profile Found. Creating Survivor Default.");
                loadedPlayer = createDefaultPlayer(userId);
            }
            // Scenario 2: Data found, but game_data is null or empty object (Common after adding column)
            else if (!profile.game_data || Object.keys(profile.game_data).length === 0) {
                console.warn("⚠️ Empty Save Blob Found. Hydrating with Defaults.");
                loadedPlayer = createDefaultPlayer(userId);
            }
            // Scenario 3: Valid Data Found
            else {
                console.log("📂 Save Blob Found. Hydrating...");
                const blob = profile.game_data;
                const safeDate = (d: any) => d ? new Date(d) : new Date();

                // AGGRESSIVE HYDRATION: Ensure primitive defaults
                // This prevents "undefined.toLocaleString()" crashes
                loadedPlayer = {
                    ...blob,
                    id: blob.id || userId,
                    username: blob.username || 'Survivor',
                    classId: (blob.classId && CLASSES[blob.classId]) ? blob.classId : 'scavenger',
                    level: typeof blob.level === 'number' ? blob.level : 1,
                    xp: typeof blob.xp === 'number' ? blob.xp : 0,
                    xpToNext: typeof blob.xpToNext === 'number' ? blob.xpToNext : 100,
                    gold: typeof blob.gold === 'number' ? blob.gold : 0,
                    energy: typeof blob.energy === 'number' ? blob.energy : 100,
                    maxEnergy: typeof blob.maxEnergy === 'number' ? blob.maxEnergy : 100,
                    skillPoints: typeof blob.skillPoints === 'number' ? blob.skillPoints : 0,
                    reputationTier: blob.reputationTier || 'STREET_RAT',

                    inventory: Array.isArray(blob.inventory) ? blob.inventory : [],
                    equipment: blob.equipment || {},
                    skills: blob.skills || {},
                    unlockedWaypoints: blob.unlockedWaypoints || [],
                    completedQuests: blob.completedQuests || [],
                    tutorialCompleted: blob.tutorialCompleted ?? false,

                    lastEnergyUpdate: safeDate(blob.lastEnergyUpdate),
                    createdAt: safeDate(blob.createdAt),
                    lastLogin: new Date()
                };
            }

            console.log("✅ Load Complete:", loadedPlayer);

            // Force Character Selection if Scavenger (New Account)
            let initialView: GameView = 'MAIN_HUB';
            if (loadedPlayer.classId === 'scavenger') {
                console.log("🆕 New User Detected (Scavenger). Redirecting to Class Selection.");
                initialView = 'CHARACTER_SELECT';
            }

            set({ player: loadedPlayer, isLoading: false, currentView: initialView });

        } catch (err: any) {
            console.error("❌ Fatal Load Error:", err);
            // Even on fatal error, load default so user can play
            set({ player: createDefaultPlayer(userId), isLoading: false, error: "Cloud Load Failed - Offline Mode Active" });
        }
    },

    saveToSupabase: async () => {
        const { player, isSaving } = get();
        if (!player || isSaving) return;

        set({ isSaving: true, saveError: null });

        try {
            console.log("💾 Saving Game...", player.gold);

            const gameDataBlob = {
                ...player,
                lastEnergyUpdate: player.lastEnergyUpdate.toISOString(),
                createdAt: player.createdAt.toISOString(),
                lastLogin: new Date().toISOString()
            };

            const { error } = await supabase
                .from('profiles')
                .update({
                    game_data: gameDataBlob,
                    // Redundant columns for easy SQL querying (optional)
                    level: player.level,
                    gold: player.gold,
                    xp: player.xp
                })
                .eq('id', player.id);

            if (error) {
                // Ignore "Column not found" errors to prevent UI spam if schema is old
                if (error.message?.includes('column "game_data" does not exist')) {
                    console.warn("⚠️ Save Warning: game_data column missing. Skipping persistent save.");
                    set({ isSaving: false, saveError: "Database outdated (Missing 'game_data' column). But you can keep playing!" });
                    return;
                }
                throw error;
            }

            console.log("✅ Save Success");
            set({ isSaving: false });

        } catch (err: any) {
            console.error("❌ Save Failed:", err);
            set({ isSaving: false, saveError: err.message });
        }
    },

    resetAccount: async () => {
        const { player } = get();
        if (!player) return;
        set({ isLoading: true });

        try {
            const defaultData = createDefaultPlayer(player.id);
            // Ensure Scavenger class to trigger selection
            defaultData.classId = 'scavenger';

            const gameDataBlob = {
                ...defaultData,
                lastEnergyUpdate: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            };

            await supabase
                .from('profiles')
                .update({
                    game_data: gameDataBlob,
                    level: 1,
                    xp: 0,
                    gold: 0,
                    energy: 100,
                    class_id: 'scavenger'
                })
                .eq('id', player.id);

            set({ player: defaultData, isLoading: false, currentView: 'CHARACTER_SELECT' });
            window.location.reload();

        } catch (err) {
            console.error("Reset Failed", err);
            set({ isLoading: false, error: "Reset Failed" });
        }
    },

    deleteAccount: async () => {
        const { player } = get();
        if (!player) return;
        set({ isLoading: true });

        try {
            // 1. Delete Profile Data
            const { error } = await supabase.from('profiles').delete().eq('id', player.id);
            if (error) throw error;

            // 2. Sign Out
            await supabase.auth.signOut();
            window.location.reload();

        } catch (err: any) {
            console.error("Delete Account Failed", err);
            set({ isLoading: false, error: "Delete Failed: " + err.message });
        }
    }
}));

// Helper to create default player
function createDefaultPlayer(userId: string): PlayerProfile {
    return {
        id: userId,
        username: 'Survivor',
        classId: 'scavenger',
        level: 1,
        xp: 0,
        xpToNext: 100,
        gold: 0,
        energy: 100,
        maxEnergy: 100,
        lastEnergyUpdate: new Date(),
        reputationTier: 'STREET_RAT',
        inventory: [],
        equipment: {},
        skills: {},
        skillPoints: 0,
        unlockedWaypoints: [],
        completedQuests: [],
        tutorialCompleted: false,
        createdAt: new Date(),
        lastLogin: new Date()
    };
}

function calculateXPToNext(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.25)); // Reduced from 1.5 for smoother progression
}
