import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/gameStore';

/**
 * Hook to track player presence (online/offline status)
 * Automatically updates presence on mount and sets offline on unmount
 */
export function usePresence() {
    const player = useGameStore(state => state.player);

    useEffect(() => {
        if (!player) return;

        let heartbeatInterval: NodeJS.Timeout;

        const updatePresence = async (status: 'online' | 'offline') => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('player_presence')
                .upsert({
                    user_id: user.id,
                    username: player.username,
                    status,
                    last_seen: new Date().toISOString()
                });
        };

        // Set online on mount
        updatePresence('online');

        // Heartbeat every 30 seconds
        heartbeatInterval = setInterval(() => {
            updatePresence('online');
        }, 30000);

        // Set offline on unmount
        return () => {
            clearInterval(heartbeatInterval);
            updatePresence('offline');
        };
    }, [player]);
}
