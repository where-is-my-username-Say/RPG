export interface Pickaxe {
    id: string;
    name: string;
    power: number;
    luck: number; // Percent bonus
    color: string;
    price?: number;
}

export const PICKAXES: Pickaxe[] = [
    { id: 'stone_pickaxe', name: 'Stone Pickaxe', power: 2, luck: 0, color: '#9ca3af', price: 0 },
    { id: 'bronze_pickaxe', name: 'Bronze Pickaxe', power: 7, luck: 0, color: '#ca8a04', price: 150 },
    { id: 'iron_pickaxe', name: 'Iron Pickaxe', power: 10, luck: 5, color: '#d1d5db', price: 500 },
    { id: 'gold_pickaxe', name: 'Gold Pickaxe', power: 16, luck: 15, color: '#eab308', price: 1500 },
    { id: 'platinum_pickaxe', name: 'Platinum Pickaxe', power: 24, luck: 20, color: '#e5e7eb', price: 5000 },
    { id: 'stonewake_pickaxe', name: 'Stonewake Pickaxe', power: 33, luck: 25, color: '#14b8a6', price: 3333 },
    { id: 'cobalt_pickaxe', name: 'Cobalt Pickaxe', power: 40, luck: 25, color: '#1d4ed8', price: 10000 },
    { id: 'titanium_pickaxe', name: 'Titanium Pickaxe', power: 55, luck: 38, color: '#64748b', price: 22500 },
    { id: 'uranium_pickaxe', name: 'Uranium Pickaxe', power: 67, luck: 41, color: '#10b981', price: 37500 },
    { id: 'mythril_pickaxe', name: 'Mythril Pickaxe', power: 80, luck: 43, color: '#22d3ee', price: 67500 },
    { id: 'arcane_pickaxe', name: 'Arcane Pickaxe', power: 115, luck: 45, color: '#a855f7', price: 125000 },
    { id: 'demonic_pickaxe', name: 'Demonic Pickaxe', power: 175, luck: 66, color: '#ef4444', price: 500000 },
];
