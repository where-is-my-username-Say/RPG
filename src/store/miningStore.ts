import { create } from 'zustand';
import { MINING_CONFIG, ORES, type Ore } from '../data/mining';
import { useGameStore } from './gameStore';

export interface MiningCell {
    id: string;
    x: number;
    y: number;
    isRevealed: boolean;
    content: Ore | null;
    health: number; // Current health of the rock/ore
    maxHealth: number;
}

interface MiningStore {
    grid: MiningCell[];
    isMining: boolean;
    miningMessage: string | null;

    // Actions
    initGrid: () => void;
    handleCellClick: (x: number, y: number) => void;
    resetGrid: () => void;
}

export const useMiningStore = create<MiningStore>((set, get) => ({
    grid: [],
    isMining: false,
    miningMessage: null,

    initGrid: () => {
        const { grid } = get();
        if (grid.length > 0) return; // Already initialized

        const newGrid: MiningCell[] = [];
        const size = MINING_CONFIG.GRID_SIZE;

        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                // Determine content based on probabilities
                let content: Ore | null = null;
                // Simple loot table logic
                // 30% chance to be empty rock (null content but still needs mining?)
                // Actually let's say 40% chance of Ore, 60% Rock/Empty

                if (Math.random() < 0.4) {
                    // Simplified weighted random for now:
                    const roll = Math.random();
                    if (roll > 0.98) content = ORES.find(o => o.id === 'cyber_shard') || ORES[5];
                    else if (roll > 0.93) content = ORES.find(o => o.id === 'neon_crystal') || ORES[4];
                    else if (roll > 0.85) content = ORES.find(o => o.id === 'titanium_ore') || ORES[3];
                    else if (roll > 0.70) content = ORES.find(o => o.id === 'iron_ore') || ORES[2];
                    else if (roll > 0.40) content = ORES.find(o => o.id === 'copper_ore') || ORES[1];
                    else content = ORES.find(o => o.id === 'scrap_metal') || ORES[0];
                }

                newGrid.push({
                    id: `${x}-${y}`,
                    x,
                    y,
                    isRevealed: false,
                    content,
                    health: content ? content.hardness : 10,
                    maxHealth: content ? content.hardness : 10
                });
            }
        }
        set({ grid: newGrid, miningMessage: "Sector Scanned. Ready to drill." });
    },

    resetGrid: () => {
        const gameActions = useGameStore.getState();
        if (gameActions.consumeEnergy(MINING_CONFIG.RESET_COST)) {
            set({ grid: [] }); // Clear logic
            get().initGrid();  // Re-init
            set({ miningMessage: "Sector Reset! New vein located." });
        } else {
            set({ miningMessage: "Insufficient Energy to reset sector!" });
        }
    },

    handleCellClick: (x: number, y: number) => {
        const { grid } = get();
        const cellIndex = grid.findIndex(c => c.x === x && c.y === y);
        if (cellIndex === -1) return;

        const cell = grid[cellIndex];
        const gameActions = useGameStore.getState();

        // Reveal Logic
        if (!cell.isRevealed) {
            if (!gameActions.consumeEnergy(MINING_CONFIG.REVEAL_COST)) {
                set({ miningMessage: "Not enough energy to scan!" });
                return;
            }

            const newGrid = [...grid];
            newGrid[cellIndex] = { ...cell, isRevealed: true };

            // If empty, maybe auto-reveal neighbors? (Flood fill) - Feature for later
            set({ grid: newGrid, miningMessage: cell.content ? "Ore signignaled!" : "Empty rock." });
            return;
        }

        // Mining Logic (if revealed and has content or is rock)
        // Check pickaxe power (Placeholder: 10 base + skill bonuses?)
        // For now hardcode power = 10
        const pickaxePower = 10;

        // Use energy for mining? Config said BASE_ENERGY_COST
        if (!gameActions.consumeEnergy(MINING_CONFIG.BASE_ENERGY_COST)) {
            set({ miningMessage: "Exhausted! Need energy to drill." });
            return;
        }

        let newHealth = cell.health - pickaxePower;
        let message = "Drilling...";

        if (newHealth <= 0) {
            // Destroyed/Mined
            if (cell.content) {
                // Give rewards
                gameActions.addItem(cell.content.id, 1, {
                    name: cell.content.name,
                    icon: '🪨', // Generic ore icon or specific?
                    description: `Raw ${cell.content.name}`
                });
                gameActions.gainXP(cell.content.xp);
                message = `Extracted ${cell.content.name}!`;
            } else {
                message = "Cleared debris.";
            }

            // Update cell to be empty/cleared
            const newGrid = [...grid];
            newGrid[cellIndex] = {
                ...cell,
                health: 0,
                content: null, // Removed
                // Keep isRevealed true, maybe mark as 'mined' visually
            };
            set({ grid: newGrid, miningMessage: message });

        } else {
            // Just damage
            const newGrid = [...grid];
            newGrid[cellIndex] = { ...cell, health: newHealth };
            set({ grid: newGrid, miningMessage: "Chipping away..." });
        }
    }
}));
