import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { useGameStore } from './store/gameStore';
import { useAutoSave } from './hooks/useAutoSave';
import { AuthView } from './components/AuthView';
import { ClassSelection } from './components/ClassSelection';
import { MainHub } from './components/MainHub';

import { MiningView } from './components/mining/MiningView';
import { ForgingView } from './components/forge/ForgingView';
import { InventoryView } from './components/inventory/InventoryView';
import { SkillsView } from './components/skills/SkillsView';
import { SaveStatus } from './components/SaveStatus';
import { PartyInviteNotification } from './components/social/PartyInviteNotification';
import { ToastContainer } from './components/ui/ToastContainer';
import { TutorialOverlay } from './components/onboarding/TutorialOverlay';

export default function App() {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { player, setPlayer, currentView, setView, error, loadFromSupabase, saveToSupabase, isLoading: storeLoading } = useGameStore();

    // GLOBAL AUTO-SAVE
    useAutoSave();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Trigger Load when Session is valid
    useEffect(() => {
        if (session?.user && !player && !storeLoading) {
            console.log("App: Session found, triggering loadFromSupabase for:", session.user.id);
            loadFromSupabase(session.user.id);
        }
    }, [session, player, storeLoading, loadFromSupabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-cyber-dark text-cyber-cyan">
                <div className="animate-pulse text-2xl font-mono">INITIALIZING CORTEX...</div>
            </div>
        );
    }

    if (!session) {
        return <AuthView onSuccess={(userId: string) => { loadFromSupabase(userId); }} />;
    }

    // Logged in but no player profile loaded (Error state)
    if (!player) {
        // Special handling: If store is loading, show loading text
        if (storeLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-cyber-dark text-cyber-cyan">
                    <div className="animate-pulse text-2xl font-mono">LOADING PROFILE...</div>
                </div>
            );
        }

        return (
            <div className="w-screen h-screen bg-cyber-darker flex flex-col items-center justify-center p-4">
                <div className="text-red-500 text-xl font-bold mb-4">⚠️ PROFILE LOAD ERROR</div>

                {/* DEBUG: Show actual error */}
                {error && (
                    <div className="bg-red-900/50 p-4 rounded mb-4 max-w-lg overflow-auto font-mono text-xs text-red-200 border border-red-700">
                        ERROR DETAIL: {error}
                    </div>
                )}

                {/* DEBUG: Show Session ID to confirm auth */}
                <div className="text-xs text-gray-600 mb-4 font-mono">
                    Session: {session.user.id.substring(0, 8)}...
                </div>

                <p className="text-gray-400 mb-4 text-center max-w-md">
                    Could not load player data. This usually means a database schema mismatch.
                    Check the console for details.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => loadFromSupabase(session.user.id)}
                        className="px-4 py-2 bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan rounded hover:bg-cyber-cyan/40"
                    >
                        RETRY LOAD
                    </button>
                    <button
                        onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
                        className="px-4 py-2 text-gray-400 hover:text-white border border-gray-600 rounded"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    // Main Content Rendering Logic
    let content;
    switch (currentView) {
        case 'CHARACTER_SELECT':
            content = <ClassSelection onSelect={(classId) => {
                if (player) {
                    const updatedPlayer = { ...player, classId, level: 1, xp: 0 };
                    setPlayer(updatedPlayer);
                    setView('MAIN_HUB');

                    // Persist immediately
                    saveToSupabase();
                }
            }} />;
            break;
        case 'MINING':
            content = <MiningView />;
            break;
        case 'FORGING':
            content = <ForgingView />;
            break;
        case 'INVENTORY':
            content = <InventoryView />;
            break;
        case 'SKILLS':
            content = <SkillsView />;
            break;
        default:
            content = <MainHub />;
    }

    return (
        <>
            <SaveStatus />
            <PartyInviteNotification />
            <ToastContainer />
            <TutorialOverlay />
            {content}
        </>
    );
}
