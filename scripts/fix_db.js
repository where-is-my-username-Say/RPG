
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okqqezruqtgbvdmatrtv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcXFlenJ1cXRnYnZkbWF0cnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzE2MjUsImV4cCI6MjA4MTMwNzYyNX0.qB8kBigeWotuZd9zJrAd4rqnqyBGZXzj9AU0fqs27_Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixItems() {
    console.log("Checking and fixing items...");

    const itemsToFix = [
        {
            id: 'cardboardite',
            name: 'Cardboardite',
            type: 'MATERIAL',
            rarity: 'COMMON',
            description: "Looks useless, but it works.",
            icon: '📦' // close enough
        },
        {
            id: 'stone', // Just in case
            name: 'Stone',
            type: 'MATERIAL',
            rarity: 'COMMON',
            description: 'A simple rock.',
            icon: '🪨'
        }
    ];

    for (const item of itemsToFix) {
        // Check if exists
        const { data } = await supabase.from('items').select('*').eq('id', item.id);

        if (!data || data.length === 0) {
            console.log(`Inserting ${item.name}...`);
            const { error } = await supabase.from('items').insert([item]);
            if (error) {
                console.error(`Failed to insert ${item.name}:`, error);
            } else {
                console.log(`Successfully inserted ${item.name}`);
            }
        } else {
            console.log(`${item.name} already exists.`);
        }
    }
}

fixItems();
