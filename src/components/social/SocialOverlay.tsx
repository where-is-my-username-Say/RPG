import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui';
import { useSocialStore } from '../../store/socialStore';
import { useGameStore } from '../../store/gameStore';
import { usePresence } from '../../hooks/usePresence';
import { supabase } from '../../lib/supabase';
import { CLASSES } from '../../data/classes';
import { useUIStore } from '../../store/uiStore';

interface SocialOverlayProps {
    onClose: () => void;
}

export function SocialOverlay({ onClose }: SocialOverlayProps) {
    const [activeTab, setActiveTab] = useState<'CHAT' | 'FRIENDS' | 'PARTY' | 'NEXUS'>('CHAT');
    const [chatMode, setChatMode] = useState<'GLOBAL' | 'PARTY'>('GLOBAL');
    const {
        messages,
        fetchMessages,
        sendMessage,
        subscribeToChat,
        friends,
        pendingRequests,
        fetchFriends,
        fetchPendingRequests,
        sendFriendRequest,
        acceptFriendRequest,
        declineFriendRequest,
        party,
        partyMembers,
        fetchParty,
        fetchPartyMembers,
        createParty,
        joinParty,
        inviteToParty,
        leaveParty,
        onlinePlayers,
        fetchOnlinePlayers
    } = useSocialStore();

    const { player } = useGameStore();

    const [chatInput, setChatInput] = useState('');
    const [friendInput, setFriendInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState<string>('ALL');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const { addToast } = useUIStore();
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Track player presence
    usePresence();

    // Initialize data
    useEffect(() => {
        fetchMessages();
        fetchFriends();
        fetchPendingRequests();
        fetchParty();
        fetchOnlinePlayers(); // Fetch online players for Nexus
        const unsubscribe = subscribeToChat();

        // Refresh online players every 30 seconds
        const interval = setInterval(fetchOnlinePlayers, 30000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    // Fetch party members when party changes
    useEffect(() => {
        if (party) {
            fetchPartyMembers();
        }
    }, [party]);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        await sendMessage(chatInput, chatMode);
        setChatInput('');
    };

    // Filter messages based on chat mode
    const filteredMessages = chatMode === 'GLOBAL'
        ? messages.filter(m => !m.partyId)
        : messages.filter(m => m.partyId === party?.id);

    const handleAddFriend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!friendInput.trim()) return;

        const result = await sendFriendRequest(friendInput);
        setFriendInput('');

        if (result?.success) {
            addToast(result.message, 'success');
        } else {
            addToast(result?.message || 'Failed to add friend', 'error');
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-black/90 border-l border-cyber-cyan z-[100] p-4 flex flex-col backdrop-blur-md"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-cyber-cyan/30 pb-4">
                <h2 className="text-2xl font-black text-cyber-cyan italic">COMMUNITY</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
                {(['CHAT', 'FRIENDS', 'PARTY', 'NEXUS'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`
                            flex-1 py-2 text-xs font-bold font-mono border-b-2 transition-all relative
                            ${activeTab === tab
                                ? 'text-cyber-cyan border-cyber-cyan bg-cyber-cyan/10'
                                : 'text-gray-500 border-transparent hover:text-gray-300'}
                        `}
                    >
                        {tab}
                        {tab === 'FRIENDS' && pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-cyber-yellow text-black text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative flex flex-col">

                {/* CHAT TAB */}
                {activeTab === 'CHAT' && (
                    <>
                        {/* Chat Mode Toggle */}
                        {party && (
                            <div className="mb-4 flex gap-2">
                                <button
                                    onClick={() => setChatMode('GLOBAL')}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded transition-all ${chatMode === 'GLOBAL'
                                        ? 'bg-cyber-cyan text-black'
                                        : 'bg-cyber-darker border border-cyber-cyan/30 text-gray-400'
                                        }`}
                                >
                                    🌐 GLOBAL
                                </button>
                                <button
                                    onClick={() => setChatMode('PARTY')}
                                    className={`flex-1 py-2 px-3 text-xs font-bold rounded transition-all ${chatMode === 'PARTY'
                                        ? 'bg-cyber-purple text-black'
                                        : 'bg-cyber-darker border border-cyber-purple/30 text-gray-400'
                                        }`}
                                >
                                    🛡️ SQUAD
                                </button>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-cyber-cyan/30">
                            {chatMode === 'PARTY' && filteredMessages.length === 0 && (
                                <div className="text-center text-gray-500 text-sm mt-10">
                                    No squad messages yet. Start chatting!
                                </div>
                            )}
                            {filteredMessages.map((msg) => (
                                <div key={msg.id} className="text-sm">
                                    <div className="flex items-baseline gap-2">
                                        <span className={`font-bold ${msg.senderId === player?.id ? 'text-cyber-yellow' : 'text-cyber-cyan'}`}>
                                            {msg.senderName}:
                                        </span>
                                        <span className="text-gray-300 break-words">{msg.content}</span>
                                    </div>
                                    <div className="text-[10px] text-gray-600 mt-1">
                                        {new Date(msg.createdAt).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <form onSubmit={handleSendChat} className="mt-4 pt-4 border-t border-cyber-cyan/20">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Transmit message..."
                                    className="flex-1 bg-cyber-darker border border-cyber-cyan/30 rounded px-3 py-2 text-sm text-white focus:border-cyber-cyan outline-none"
                                />
                                <Button type="submit" variant="primary" size="sm">SEND</Button>
                            </div>
                        </form>
                    </>
                )}

                {/* FRIENDS TAB */}
                {activeTab === 'FRIENDS' && (
                    <div className="flex flex-col h-full">
                        <form onSubmit={handleAddFriend} className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={friendInput}
                                    onChange={(e) => setFriendInput(e.target.value)}
                                    placeholder="Add by username..."
                                    className="flex-1 bg-cyber-darker border border-cyber-cyan/30 rounded px-3 py-2 text-sm text-white focus:border-cyber-cyan outline-none"
                                />
                                <Button type="submit" variant="success" size="sm">+</Button>
                            </div>
                        </form>

                        {/* Pending Requests */}
                        {pendingRequests.length > 0 && (
                            <div className="mb-4 pb-4 border-b border-cyber-cyan/20">
                                <div className="text-xs text-cyber-yellow uppercase tracking-widest mb-2">Pending Requests</div>
                                <div className="space-y-2">
                                    {pendingRequests.map(request => (
                                        <div key={request.id} className="bg-cyber-darker/50 p-3 rounded border border-cyber-yellow/30 flex justify-between items-center">
                                            <div>
                                                <div className="font-bold text-white">{request.username}</div>
                                                <div className="text-xs text-gray-400">Lv.{request.level} {request.classId}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="success"
                                                    size="sm"
                                                    onClick={() => acceptFriendRequest(request.id)}
                                                >
                                                    ✓
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => declineFriendRequest(request.id)}
                                                >
                                                    ✕
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {friends.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">No signals detected.</div>
                            ) : (
                                friends.map(friend => (
                                    <div key={friend.id} className="bg-cyber-darker/50 p-3 rounded border border-cyber-cyan/20 flex justify-between items-center">
                                        <div>
                                            <div className="font-bold text-white">{friend.username}</div>
                                            <div className="text-xs text-gray-400">Lv.{friend.level} {friend.classId}</div>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} title={friend.isOnline ? 'Online' : 'Offline'} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* PARTY TAB */}
                {activeTab === 'PARTY' && (
                    <div className="flex flex-col h-full">
                        {!party ? (
                            <div className="text-center mt-20">
                                <div className="text-6xl mb-4">🛡️</div>
                                <h3 className="text-xl font-bold text-white mb-2">NO SQUAD LINKED</h3>
                                <p className="text-gray-400 text-sm mb-6">Create or join a squad to synchronize combat data.</p>

                                <div className="space-y-3">
                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        isLoading={isCreating}
                                        onClick={async () => {
                                            setIsCreating(true);
                                            try {
                                                await createParty();
                                                addToast('Squad link established', 'success');
                                            } catch (e) {
                                                addToast('Failed to create squad', 'error');
                                            } finally {
                                                setIsCreating(false);
                                            }
                                        }}
                                    >
                                        CREATE SQUAD
                                    </Button>

                                    <div className="text-xs text-gray-500 uppercase">OR</div>

                                    <div className="flex gap-2">
                                        <input
                                            id="join-code-input"
                                            type="text"
                                            placeholder="ENTER CODE..."
                                            maxLength={6}
                                            className="flex-1 bg-cyber-darker border border-cyber-cyan/30 rounded px-3 py-3 text-sm text-white focus:border-cyber-cyan outline-none uppercase font-mono text-center"
                                            onChange={(e) => { e.target.value = e.target.value.toUpperCase(); }}
                                        />
                                        <Button
                                            variant="secondary"
                                            isLoading={isJoining}
                                            onClick={async () => {
                                                const input = document.getElementById('join-code-input') as HTMLInputElement;
                                                const code = input?.value.trim();
                                                if (!code || code.length !== 6) { addToast('Enter 6-char code', 'warning'); return; }

                                                setIsJoining(true);
                                                try {
                                                    const { data } = await supabase.from('parties').select('id').eq('code', code).single();
                                                    if (data) {
                                                        await joinParty(data.id);
                                                        input.value = '';
                                                        addToast('Joined squad successfully', 'success');
                                                    } else {
                                                        addToast('Squad not found', 'error');
                                                    }
                                                } catch (e) {
                                                    addToast('Connection failed', 'error');
                                                } finally {
                                                    setIsJoining(false);
                                                }
                                            }}
                                        >
                                            JOIN
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="mb-4 pb-4 border-b border-cyber-purple/20">
                                    <div className="text-xs text-cyber-purple uppercase tracking-widest mb-2">
                                        Your Squad {party.leaderId === player?.id && '(Leader)'}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Code: <span className="text-cyber-cyan font-mono">{party.code || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto space-y-2">
                                    {partyMembers.length === 0 ? (
                                        <div className="text-center text-gray-500 mt-10">
                                            Loading members...
                                        </div>
                                    ) : (
                                        partyMembers.map((member: any) => (
                                            <div key={member.userId} className="bg-cyber-darker/50 p-2 rounded border border-cyber-purple/20">
                                                <div className="flex justify-between">
                                                    <div className="font-bold text-white text-sm">{member.username}</div>
                                                    {party.leaderId === member.userId && <span className="text-xs text-cyber-yellow">★</span>}
                                                </div>
                                                <div className="text-xs text-gray-400">Lv.{member.level}</div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-cyber-purple/20 space-y-2">
                                    {party.leaderId === player?.id && partyMembers.length < 4 && (
                                        <Button
                                            variant="primary"
                                            className="w-full"
                                            onClick={() => {
                                                if (friends.length === 0) {
                                                    addToast('No friends to invite', 'warning');
                                                    return;
                                                }
                                                const friendNames = friends.map(f => f.username).join(', ');
                                                const friendName = prompt(`Enter friend username to invite:\n\nYour friends: ${friendNames}`);
                                                if (friendName) {
                                                    const friend = friends.find(f => f.username.toLowerCase() === friendName.toLowerCase());
                                                    if (friend) {
                                                        inviteToParty(friend.friendId);
                                                        addToast(`Invited ${friend.username}`, 'success');
                                                    } else {
                                                        addToast('Friend not found', 'error');
                                                    }
                                                }
                                            }}
                                        >
                                            INVITE FRIEND
                                        </Button>
                                    )}
                                    <Button
                                        variant="danger"
                                        className="w-full"
                                        onClick={leaveParty}
                                    >
                                        {party.leaderId === player?.id ? 'DISBAND SQUAD' : 'LEAVE SQUAD'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* NEXUS TAB */}
                {activeTab === 'NEXUS' && (
                    <div className="flex flex-col h-full">
                        {/* Search & Filters */}
                        <div className="mb-4 space-y-3">
                            <input
                                type="text"
                                placeholder="Search operatives..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-cyber-darker border border-cyber-cyan/30 rounded px-3 py-2 text-sm text-white focus:border-cyber-cyan outline-none"
                            />

                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button
                                    onClick={() => setFilterClass('ALL')}
                                    className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-all ${filterClass === 'ALL'
                                        ? 'bg-cyber-cyan text-black'
                                        : 'bg-cyber-darker border border-cyber-cyan/30 text-gray-400'
                                        }`}
                                >
                                    ALL
                                </button>
                                {Object.values(CLASSES).map((cls) => (
                                    <button
                                        key={cls.id}
                                        onClick={() => setFilterClass(cls.id)}
                                        className={`px-3 py-1 rounded text-xs font-bold whitespace-nowrap transition-all ${filterClass === cls.id
                                            ? 'bg-cyber-cyan text-black'
                                            : 'bg-cyber-darker border border-cyber-cyan/30 text-gray-400'
                                            }`}
                                    >
                                        {cls.icon} {cls.name.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Online Players List */}
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {onlinePlayers
                                .filter(p => {
                                    if (p.id === player?.id) return false;
                                    if (searchTerm && !p.username.toLowerCase().includes(searchTerm.toLowerCase())) return false;
                                    if (filterClass !== 'ALL' && p.classId !== filterClass) return false;
                                    return true;
                                })
                                .map((onlinePlayer) => {
                                    const classData = CLASSES[onlinePlayer.classId as keyof typeof CLASSES];
                                    const isAlreadyFriend = friends.some(f => f.friendId === onlinePlayer.id);

                                    return (
                                        <div key={onlinePlayer.id} className="bg-cyber-darker/50 p-3 rounded border border-cyber-cyan/20">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-2xl">{classData?.icon || '❓'}</div>
                                                    <div>
                                                        <div className="font-bold text-white">{onlinePlayer.username}</div>
                                                        <div className="text-xs text-gray-400">Lv.{onlinePlayer.level} {classData?.name}</div>
                                                    </div>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-green-500" title="Online" />
                                            </div>

                                            <div className="flex gap-2">
                                                {party && party.leaderId === player?.id && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => {
                                                            inviteToParty(onlinePlayer.id);
                                                            addToast(`Invited ${onlinePlayer.username}`, 'success');
                                                        }}
                                                    >
                                                        📨 INVITE
                                                    </Button>
                                                )}

                                                {!isAlreadyFriend && (
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={async () => {
                                                            const result = await sendFriendRequest(onlinePlayer.username);
                                                            if (result?.success) {
                                                                addToast(result.message, 'success');
                                                            } else {
                                                                addToast(result?.message || 'Failed', 'error');
                                                            }
                                                        }}
                                                    >
                                                        ➕ ADD
                                                    </Button>
                                                )}

                                                {isAlreadyFriend && (
                                                    <div className="flex-1 flex items-center justify-center text-xs text-green-500 font-bold">
                                                        ✓ FRIEND
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                            {onlinePlayers.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    No operatives online
                                </div>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </motion.div>
    );
}

