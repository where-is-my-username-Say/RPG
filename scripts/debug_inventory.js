
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okqqezruqtgbvdmatrtv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcXFlenJ1cXRnYnZkbWF0cnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzE2MjUsImV4cCI6MjA4MTMwNzYyNX0.qB8kBigeWotuZd9zJrAd4rqnqyBGZXzj9AU0fqs27_Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugInventory() {
    console.log("Debugging Inventory...");

    // 1. Get any profile to check schema
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (profileError || !profiles || profiles.length === 0) {
        console.error("Could not fetch profiles:", profileError);
        return;
    }

    const user = profiles[0];
    console.log("Profile Columns:", Object.keys(user));
    return;

    // 2. Check Inventory
    const { data: inventory, error: invError } = await supabase
        .from('inventory')
        .select('*')
        .eq('user_id', user.id);

    if (invError) {
        console.error("Inventory fetch error:", invError);
    } else {
        console.log(`Inventory Count: ${inventory.length}`);
        console.log("Items:", inventory);
    }
}

debugInventory();
