
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xbjqbjqbjqbjq.supabase.co'; // manual fallback if needed
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '...'; // I'll need to read .env first really or assume it's set in env
// Better: just read the file values if I can, or use the ones from the code I saw.

// I will just use the imports from the project if I can run with ts-node
// But easier:
// I'll assume the environment variables are set in the terminal session or valid in .env

async function checkItem() {
    const { createClient } = require('@supabase/supabase-js');
    const url = process.env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_ANON_KEY;

    if (!url || !key) {
        console.error("Missing credentials");
        return;
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('id', 'cardboardite');

    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Found items:", data);
        if (data.length === 0) {
            console.log("Cardboardite MISSING in DB!");
        } else {
            console.log("Cardboardite EXISTS in DB.");
        }
    }
}

checkItem();
