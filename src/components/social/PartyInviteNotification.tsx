import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocialStore } from '../../store/socialStore';
import { Button } from '../ui';

export function PartyInviteNotification() {
    const {
        partyInvites,
        fetchPartyInvites,
        subscribeToPartyInvites,
        acceptPartyInvite,
        declinePartyInvite
    } = useSocialStore();

    useEffect(() => {
        // Initial fetch
        fetchPartyInvites();

        // Subscribe to real-time changes
        const unsubscribe = subscribeToPartyInvites();
        return () => unsubscribe();
    }, []);

    if (partyInvites.length === 0) return null;

    return (
        <div className="fixed top-24 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {partyInvites.map((invite) => (
                    <motion.div
                        key={invite.id}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="bg-black/90 border border-cyber-cyan p-4 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.3)] pointer-events-auto w-80 backdrop-blur-md"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h4 className="text-cyber-cyan font-bold italic text-sm animate-pulse">⚡ INCOMING TRANSMISSION</h4>
                                <p className="text-white text-sm mt-1">
                                    <span className="font-bold text-cyber-yellow">{invite.fromUsername}</span> invited you to join their squad.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                onClick={() => acceptPartyInvite(invite.id)}
                            >
                                ACCEPT
                            </Button>
                            <Button
                                variant="danger"
                                size="sm"
                                className="flex-1"
                                onClick={() => declinePartyInvite(invite.id)}
                            >
                                DECLINE
                            </Button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
