
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okqqezruqtgbvdmatrtv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcXFlenJ1cXRnYnZkbWF0cnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzE2MjUsImV4cCI6MjA4MTMwNzYyNX0.qB8kBigeWotuZd9zJrAd4rqnqyBGZXzj9AU0fqs27_Q';
const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSave() {
    console.log("🐞 Starting Debug Save...");

    // 1. Create a dummy Auth User (or verify we can access public RLS for debugging if anon is allowed, usually need login)
    // Since we don't have a user token easily here, we'll try to insert to a known test user ID from previous runs or random
    // Note: RLS Usually blocks modification without a valid session. 
    // WE CANNOT DEBUG RLS WITHOUT LOGIN.
    // However, we can check basic table constraints if we use the *SERVICE ROLE* key, but we only have ANON key.

    // ALTERNATIVE: We can check table info or 'items' table again.

    console.log("Checking if 'inventory' table accepts 'slot' column...");
    const testUUID = crypto.randomUUID();

    // We will attempt to insert a row with 'slot' using a random UUID for user_id. 
    // If RLS is strict (auth.uid() = user_id), this will fail with RLS violation.
    // If it fails with "column does not exist", we know strict missing column.

    const { error } = await supabase.from('inventory').insert([{
        id: testUUID,
        user_id: '00000000-0000-0000-0000-000000000000',
        item_id: 'stone',
        quantity: 1,
        slot: 'test-slot'
    }]);

    if (error) {
        console.log("❌ Insert Error:", error.message);
        console.log("Full Error:", error);

        if (error.message.includes('column "slot" of relation "inventory" does not exist')) {
            console.log("🚨 DIAGNOSIS: The 'slot' column is DEFINITELY missing.");
        } else if (error.message.includes('new row violates row-level security')) {
            console.log("⚠️ RLS Blocked: This is expected without login, BUT it means the column 'slot' MIGHT exist (Postgres checks columns before RLS often, but not always).");
            // To be sure, we select.
        }
    } else {
        console.log("✅ Insert Success (RLS must be loose or anon allowed). Slot column exists.");
        await supabase.from('inventory').delete().eq('id', testUUID);
    }

    // Double check column existence via select
    console.log("Checking via Select...");
    const { error: selectError } = await supabase.from('inventory').select('slot').limit(1);
    if (selectError) {
        console.log("❌ Select Error:", selectError.message);
    } else {
        console.log("✅ Select Success: 'slot' column exists.");
    }
}

debugSave();
