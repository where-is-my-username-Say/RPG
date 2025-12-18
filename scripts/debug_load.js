
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okqqezruqtgbvdmatrtv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcXFlenJ1cXRnYnZkbWF0cnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzE2MjUsImV4cCI6MjA4MTMwNzYyNX0.qB8kBigeWotuZd9zJrAd4rqnqyBGZXzj9AU0fqs27_Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLoad() {
    console.log("🚀 START Debug Load Simulation");

    // We need a userId. I will look for one, or use a dummy if I can't find one.
    // I'll grab the first user from profiles.
    const { data: users, error: userError } = await supabase.from('profiles').select('id').limit(1);

    if (userError || !users || users.length === 0) {
        console.error("❌ Could not find ANY user to test with:", userError);
        return;
    }

    const userId = users[0].id;
    console.log("👤 Testing with User ID:", userId);

    try {
        // 1. Fetch Profile + Game Data Blob
        console.log("1️⃣ Fetching Profile...");
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error("❌ Profile Fetch Failed:", error);
            throw error;
        }

        console.log("✅ Profile Fetched:", profile ? "Found" : "Null");
        if (!profile) return;

        // Check for game_data
        if (profile.game_data) {
            console.log("📂 game_data column EXISTS and has data.");
        } else {
            console.log("⚠️ game_data column is MISSING or NULL (undefined).");
            // Check if key exists in object at all
            if ('game_data' in profile) {
                console.log("   (Column exists but is null)");
            } else {
                console.log("   (Column DOES NOT EXIST in returned data - PostgREST schema cache issue?)");
            }
        }

        // 2. Legacy Inventory Check
        console.log("2️⃣ Testing Legacy Inventory Load...");
        const { data: inventoryData, error: invError } = await supabase
            .from('inventory')
            .select('*, item:items(*)')
            .eq('user_id', userId);

        if (invError) {
            console.error("❌ Inventory Load Failed:", invError.message);
        } else {
            console.log("✅ Inventory Load Success. Count:", inventoryData.length);
        }

    } catch (err) {
        console.error("💥 CRASH during load simulation:", err);
    }
}

debugLoad();
