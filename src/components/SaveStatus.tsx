import { useGameStore } from '../store/gameStore';

export const SaveStatus = () => {
    const { isSaving, saveError } = useGameStore();
    if (!isSaving && !saveError) return null;
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
            {isSaving && (
                <div className="bg-yellow-500/20 text-yellow-400 px-4 py-2 border border-yellow-500/50 backdrop-blur-md rounded-lg animate-pulse">
                    💾 SAVING...
                </div>
            )}
            {saveError && (
                <div className="bg-red-500/80 text-white px-4 py-2 border border-red-500 backdrop-blur-md rounded-lg font-mono text-xs max-w-md">
                    ⚠️ SAVE ERROR: {saveError}
                </div>
            )}
        </div>
    );
};
