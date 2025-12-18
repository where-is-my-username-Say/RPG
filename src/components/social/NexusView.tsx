import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { useSocialStore } from '../../store/socialStore';
import { useGameStore } from '../../store/gameStore';
import { useUIStore } from '../../store/uiStore';
import { CLASSES } from '../../data/classes';

export function NexusView() {
    const { onlinePlayers, fetchOnlinePlayers, friends, inviteToParty, sendFriendRequest, party } = useSocialStore();
    const { player } = useGameStore();
    const { addToast } = useUIStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState<string>('ALL');

    useEffect(() => {
        fetchOnlinePlayers();
        // Refresh every 30 seconds
        const interval = setInterval(fetchOnlinePlayers, 30000);
        return () => clearInterval(interval);
    }, [fetchOnlinePlayers]);

    const filteredPlayers = onlinePlayers.filter(p => {
        // Don't show yourself
        if (p.id === player?.id) return false;

        // Search filter
        if (searchTerm && !p.username.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Class filter
        if (filterClass !== 'ALL' && p.classId !== filterClass) {
            return false;
        }

        return true;
    });

    const handleInviteToParty = async (playerId: string, username: string) => {
        if (!party) {
            addToast('You must be in a party to invite players!', 'warning');
            return;
        }

        if (party.leaderId !== player?.id) {
            addToast('Only the party leader can invite players!', 'error');
            return;
        }

        await inviteToParty(playerId);
        addToast(`Invited ${username} to your squad!`, 'success');
    };

    const handleAddFriend = async (username: string) => {
        const result = await sendFriendRequest(username);
        if (result?.success) {
            addToast(result.message, 'success');
        } else {
            addToast(result?.message || 'Failed to add friend', 'error');
        }
    };

    const isFriend = (playerId: string) => {
        return friends.some(f => f.friendId === playerId);
    };

    return (
        <div className="min-h-[100dvh] p-6 pb-32 bg-cyber-darker">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
            >
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-purple mb-2">
                    THE NEXUS
                </h1>
                <p className="text-gray-400 text-sm">
                    {onlinePlayers.length} operatives currently online
                </p>
            </motion.div>

            {/* Search & Filters */}
            <div className="mb-6 space-y-3">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-cyber-darker border border-cyber-cyan/30 rounded px-4 py-3 text-white focus:border-cyber-cyan outline-none"
                />

                <div className="flex gap-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setFilterClass('ALL')}
                        className={`px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-all ${filterClass === 'ALL'
                            ? 'bg-cyber-cyan text-black'
                            : 'bg-cyber-darker border border-cyber-cyan/30 text-gray-400 hover:text-white'
                            }`}
                    >
                        ALL CLASSES
                    </button>
                    {Object.values(CLASSES).map((cls) => (
                        <button
                            key={cls.id}
                            onClick={() => setFilterClass(cls.id)}
                            className={`px-4 py-2 rounded text-xs font-bold whitespace-nowrap transition-all ${filterClass === cls.id
                                ? 'bg-cyber-cyan text-black'
                                : 'bg-cyber-darker border border-cyber-cyan/30 text-gray-400 hover:text-white'
                                }`}
                        >
                            {cls.icon} {cls.name.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Player Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlayers.length === 0 ? (
                    <div className="col-span-full text-center py-20">
                        <div className="text-6xl mb-4 opacity-20">🔍</div>
                        <p className="text-gray-500">No operatives found</p>
                    </div>
                ) : (
                    filteredPlayers.map((player) => {
                        const classData = CLASSES[player.classId as keyof typeof CLASSES];
                        const isAlreadyFriend = isFriend(player.id);

                        return (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.02, y: -4 }}
                                className="bg-black/40 border border-cyber-cyan/20 rounded-lg p-4 backdrop-blur-sm hover:border-cyber-cyan/50 transition-all"
                            >
                                {/* Player Header */}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="text-4xl">{classData?.icon || '❓'}</div>
                                        <div>
                                            <div className="font-bold text-white text-lg">{player.username}</div>
                                            <div className="text-xs text-gray-400">
                                                Lv.{player.level} {classData?.name || 'Unknown'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Online" />
                                </div>

                                {/* Quick Actions */}
                                <div className="flex gap-2">
                                    {party && party.leaderId === player?.id && (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleInviteToParty(player.id, player.username)}
                                        >
                                            📨 INVITE TO SQUAD
                                        </Button>
                                    )}

                                    {!isAlreadyFriend && (
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleAddFriend(player.username)}
                                        >
                                            ➕ ADD FRIEND
                                        </Button>
                                    )}

                                    {isAlreadyFriend && (
                                        <div className="flex-1 flex items-center justify-center text-xs text-green-500 font-bold">
                                            ✓ FRIEND
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
