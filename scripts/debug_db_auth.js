
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://okqqezruqtgbvdmatrtv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rcXFlenJ1cXRnYnZkbWF0cnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MzE2MjUsImV4cCI6MjA4MTMwNzYyNX0.qB8kBigeWotuZd9zJrAd4rqnqyBGZXzj9AU0fqs27_Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugWithAuth() {
    console.log("Authenticating...");

    // 1. Sign Up/In Test User
    const email = 'test.user.gravity@example.com';
    const password = 'password123';

    let { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (authError) {
        console.log("Sign in failed, trying sign up...");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username: 'DebugAgent' }
            }
        });

        if (signUpError) {
            console.error("Sign Up Error:", signUpError);
            return;
        }
        user = signUpData.user;
    }

    if (!user) {
        console.error("No user.");
        return;
    }

    console.log("Logged in as:", user.id);

    // 2. Insert Item to check ID type
    console.log("Attempting Insert with UUID ID...");
    const testUUID = crypto.randomUUID();

    const { data, error: insertError } = await supabase.from('inventory').insert([{
        id: testUUID, // TEST 1: explicit UUID
        user_id: user.id,
        item_id: 'stone',
        quantity: 1
    }]).select();

    if (insertError) {
        console.log("Insert with UUID failed:", insertError.message);
        if (insertError.message.includes('invalid input syntax for type bigint')) {
            console.log("CONCLUSION: ID IS BIGINT (SERIAL).");
        }
    } else {
        console.log("Insert with UUID SUCCESS! ID is likely UUID.");
        console.log("Returned Data:", data);
        // Cleanup
        await supabase.from('inventory').delete().eq('id', testUUID);
    }
}

debugWithAuth();
