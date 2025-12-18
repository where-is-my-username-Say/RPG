import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabase';

export function useAutoSave() {
    const { player } = useGameStore();
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastSavedState = useRef<string>('');

    useEffect(() => {
        if (!player) return;

        // Dedup: Check if stringified state actually changed to avoid DB spam
        const currentStateString = JSON.stringify({
            gold: player.gold,
            xp: player.xp,
            level: player.level,
            energy: player.energy,
            inventory: player.inventory,
            equipment: player.equipment,
            classId: player.classId,
            reputation: player.reputationTier,
            skillPoints: player.skillPoints
        });

        if (currentStateString === lastSavedState.current) return;

        // Debounce save (2 seconds)
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            console.log('Auto-saving...');
            await useGameStore.getState().saveToSupabase();

            lastSavedState.current = currentStateString;
            console.log('Save complete');
        }, 1000);

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [player]);
}
