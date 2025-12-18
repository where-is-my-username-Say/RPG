import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Friend, ChatMessage, Party, PartyInvite } from '../types';

interface SocialState {
    friends: Friend[];
    pendingRequests: Friend[];
    party: Party | null;
    partyMembers: any[]; // Will type properly later
    partyInvites: PartyInvite[];
    onlinePlayers: any[];
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchFriends: () => Promise<void>;
    fetchPendingRequests: () => Promise<void>;
    sendFriendRequest: (username: string) => Promise<{ success: boolean; message: string } | undefined>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
    declineFriendRequest: (requestId: string) => Promise<void>;

    // Chat
    fetchMessages: () => Promise<void>;
    sendMessage: (content: string, type?: 'GLOBAL' | 'PARTY') => Promise<void>;
    subscribeToChat: () => () => void; // returns cleanup function

    // Party
    fetchParty: () => Promise<void>;
    fetchPartyMembers: () => Promise<void>;
    createParty: () => Promise<void>;
    joinParty: (partyId: string) => Promise<void>;
    leaveParty: () => Promise<void>;
    inviteToParty: (friendId: string) => Promise<void>;
    acceptPartyInvite: (inviteId: string) => Promise<void>;
    declinePartyInvite: (inviteId: string) => Promise<void>;
    fetchPartyInvites: () => Promise<void>;
    subscribeToPartyInvites: () => () => void;

    // Online Players
    fetchOnlinePlayers: () => Promise<void>;
}

export const useSocialStore = create<SocialState>((set, get) => ({
    friends: [],
    pendingRequests: [],
    party: null,
    partyMembers: [],
    partyInvites: [],
    onlinePlayers: [],
    messages: [],
    isLoading: false,
    error: null,

    fetchFriends: async () => {
        set({ isLoading: true });
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch successful friendships
            const { data: friendsData, error } = await supabase
                .from('friends')
                .select('*')
                .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
                .eq('status', 'accepted');

            if (error) throw error;

            console.log('Friends data:', friendsData);

            // Extract IDs of friends
            const friendIds = friendsData.map(f => f.user_id === user.id ? f.friend_id : f.user_id);

            if (friendIds.length === 0) {
                set({ friends: [], isLoading: false });
                return;
            }

            console.log('Friend IDs:', friendIds);

            // Fetch profile data for these friends
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .in('id', friendIds);

            if (profilesError) throw profilesError;

            console.log('Profiles:', profiles);

            // Fetch presence data separately to avoid FK issues
            const { data: presenceData } = await supabase
                .from('player_presence')
                .select('*')
                .in('user_id', friendIds);

            // Map to Friend objects (filter out null profiles)
            const friends: Friend[] = (profiles || [])
                .filter(p => p && p.id)
                .map(p => {
                    const presence = presenceData?.find(pr => pr.user_id === p.id);
                    return {
                        id: p.id,
                        userId: user.id,
                        friendId: p.id,
                        username: p.username,
                        level: p.level,
                        classId: p.class_id,
                        status: 'accepted',
                        isOnline: presence?.status === 'online',
                        lastSeen: presence?.last_seen || p.last_login
                    };
                });

            console.log('Mapped friends:', friends);

            set({ friends });

        } catch (err: any) {
            console.error('Error fetching friends:', err);
            set({ error: err.message });
        } finally {
            set({ isLoading: false });
        }
    },

    sendFriendRequest: async (username: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not logged in');

            // 1. Find user by username
            const { data: targetProfile, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username)
                .single();

            if (profileError || !targetProfile) throw new Error('User not found');
            if (targetProfile.id === user.id) throw new Error("Can't add yourself");

            // 2. Insert request
            const { error: insertError } = await supabase
                .from('friends')
                .insert({
                    user_id: user.id,
                    friend_id: targetProfile.id,
                    status: 'pending'
                });

            if (insertError) {
                if (insertError.code === '23505') throw new Error('Friend request already sent');
                throw insertError;
            }

            // Don't refresh friend list yet - they need to accept first
            return { success: true, message: 'Friend request sent!' };

        } catch (err: any) {
            console.error('Friend request error:', err);
            set({ error: err.message });
            return { success: false, message: err.message };
        }
    },

    fetchPendingRequests: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Fetch pending requests WHERE I am the friend_id (receiver)
            const { data: requestsData, error } = await supabase
                .from('friends')
                .select('*, sender:profiles!friends_user_id_fkey(id, username, level, class_id)')
                .eq('friend_id', user.id)
                .eq('status', 'pending');

            if (error) throw error;

            const requests: Friend[] = requestsData.map((r: any) => ({
                id: r.id,
                userId: r.user_id,
                friendId: r.friend_id,
                username: r.sender.username,
                level: r.sender.level,
                classId: r.sender.class_id,
                status: 'pending',
                isOnline: false,
                lastSeen: ''
            }));

            set({ pendingRequests: requests });
        } catch (err: any) {
            console.error('Error fetching pending requests:', err);
        }
    },

    acceptFriendRequest: async (requestId: string) => {
        try {
            const { error } = await supabase
                .from('friends')
                .update({ status: 'accepted' })
                .eq('id', requestId);

            if (error) throw error;

            // Refresh both lists
            await get().fetchPendingRequests();
            await get().fetchFriends();
        } catch (err: any) {
            console.error('Error accepting friend:', err);
        }
    },

    declineFriendRequest: async (requestId: string) => {
        try {
            const { error } = await supabase
                .from('friends')
                .delete()
                .eq('id', requestId);

            if (error) throw error;

            // Refresh pending list
            await get().fetchPendingRequests();
        } catch (err: any) {
            console.error('Error declining friend:', err);
        }
    },

    fetchMessages: async () => {
        // Calculate 24 hours ago
        const yesterday = new Date();
        yesterday.setHours(yesterday.getHours() - 24);

        const { data, error: _error } = await supabase
            .from('chat_messages')
            .select('*, sender:profiles(username)')
            .gt('created_at', yesterday.toISOString()) // Filter last 24h
            .order('created_at', { ascending: false })
            .limit(50);

        if (data) {
            const msgs = data.reverse().map((m: any) => ({
                id: m.id,
                senderId: m.sender_id,
                senderName: m.sender?.username || 'Unknown',
                partyId: m.party_id,
                content: m.content,
                createdAt: m.created_at,
                type: 'CHAT'
            })) as ChatMessage[];

            set({ messages: msgs });
        }
    },

    sendMessage: async (content: string, type = 'GLOBAL') => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from('chat_messages').insert({
            sender_id: user.id,
            content,
            party_id: type === 'PARTY' ? get().party?.id : null
        });
    },

    subscribeToChat: () => {
        const subscription = supabase
            .channel('public:chat_messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, async (payload) => {
                // We need to fetch the username for the sender
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', payload.new.sender_id)
                    .single();

                const newMsg: ChatMessage = {
                    id: payload.new.id,
                    senderId: payload.new.sender_id,
                    senderName: profile?.username || 'Unknown',
                    partyId: payload.new.party_id,
                    content: payload.new.content,
                    createdAt: payload.new.created_at,
                    type: 'CHAT'
                };

                set(state => ({ messages: [...state.messages, newMsg] }));
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },

    fetchParty: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if user is in a party
            const { data: memberData } = await supabase
                .from('party_members')
                .select('party_id')
                .eq('user_id', user.id)
                .single();

            if (!memberData) {
                set({ party: null });
                return;
            }

            // Fetch party details
            const { data: partyData } = await supabase
                .from('parties')
                .select('*')
                .eq('id', memberData.party_id)
                .single();

            if (!partyData) {
                set({ party: null });
                return;
            }

            // Map to Party interface
            const party: Party = {
                id: partyData.id,
                leaderId: partyData.leader_id,
                code: partyData.code,
                members: [],
                maxSize: partyData.max_members || 4,
                isPublic: false,
                activityType: 'OPEN_WORLD',
                createdAt: new Date(partyData.created_at)
            };

            set({ party });
        } catch (err: any) {
            console.error('Error fetching party:', err);
        }
    },

    createParty: async () => {
        try {
            console.log('Creating party...');
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not logged in');

            // Generate random party code (6 chars)
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            // Create party
            const { data: partyData, error: partyError } = await supabase
                .from('parties')
                .insert({
                    leader_id: user.id,
                    code: code
                })
                .select()
                .single();

            if (partyError) {
                console.error('Party creation error:', partyError);
                throw partyError;
            }

            console.log('Party created:', partyData);

            // Add self as member
            const { error: memberError } = await supabase
                .from('party_members')
                .insert({ party_id: partyData.id, user_id: user.id });

            if (memberError) {
                console.error('Member add error:', memberError);
                throw memberError;
            }

            // Map database response to Party interface
            const party: Party = {
                id: partyData.id,
                leaderId: partyData.leader_id,
                code: partyData.code,
                members: [],
                maxSize: partyData.max_members || 4,
                isPublic: false,
                activityType: 'OPEN_WORLD',
                createdAt: new Date(partyData.created_at)
            };

            console.log('Mapped party:', party);
            set({ party });
        } catch (err: any) {
            console.error('Error creating party:', err);
            set({ error: err.message });
        }
    },

    joinParty: async (partyId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not logged in');

            // Add self as member
            const { error } = await supabase
                .from('party_members')
                .insert({ party_id: partyId, user_id: user.id });

            if (error) throw error;

            await get().fetchParty();
        } catch (err: any) {
            console.error('Error joining party:', err);
            set({ error: err.message });
        }
    },

    leaveParty: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const party = get().party;
            if (!party) return;

            // Remove self from party
            await supabase
                .from('party_members')
                .delete()
                .eq('user_id', user.id);

            // If leader, delete the party (CASCADE will remove all members)
            if (party.leaderId === user.id) {
                await supabase
                    .from('parties')
                    .delete()
                    .eq('id', party.id);
            }

            set({ party: null });
        } catch (err: any) {
            console.error('Error leaving party:', err);
        }
    },

    fetchPartyMembers: async () => {
        try {
            const party = get().party;
            if (!party) return;

            // Fetch all members of the party
            const { data: membersData } = await supabase
                .from('party_members')
                .select('user_id, joined_at')
                .eq('party_id', party.id);

            if (!membersData) return;

            // Fetch profiles for each member
            const userIds = membersData.map(m => m.user_id);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .in('id', userIds);

            if (!profiles) return;

            // Map to party members with stats
            const members = profiles.map(p => ({
                userId: p.id,
                username: p.username,
                level: p.level,
                classId: p.class_id,
                hp: p.hp || 100,
                maxHp: p.max_hp || 100,
                energy: p.energy || 100,
                maxEnergy: p.max_energy || 100
            }));

            set({ partyMembers: members });
        } catch (err: any) {
            console.error('Error fetching party members:', err);
        }
    },

    inviteToParty: async (friendId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const party = get().party;
            if (!user || !party) return;

            // Create party invite
            await supabase
                .from('party_invites')
                .insert({
                    party_id: party.id,
                    from_user_id: user.id,
                    to_user_id: friendId,
                    status: 'pending'
                });

        } catch (err: any) {
            console.error('Error inviting to party:', err);
        }
    },

    acceptPartyInvite: async (inviteId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get invite details
            const { data: invite } = await supabase
                .from('party_invites')
                .select('party_id')
                .eq('id', inviteId)
                .single();

            if (!invite) return;

            // Join the party
            await get().joinParty(invite.party_id);

            // Update invite status
            await supabase
                .from('party_invites')
                .update({ status: 'accepted' })
                .eq('id', inviteId);

            // Refresh list
            await get().fetchPartyInvites();

        } catch (err: any) {
            console.error('Error accepting party invite:', err);
        }
    },

    declinePartyInvite: async (inviteId: string) => {
        try {
            await supabase
                .from('party_invites')
                .update({ status: 'declined' })
                .eq('id', inviteId);

            // Refresh list
            await get().fetchPartyInvites();
        } catch (err: any) {
            console.error('Error declining party invite:', err);
        }
    },

    fetchPartyInvites: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: invites, error } = await supabase
                .from('party_invites')
                .select('*')
                .eq('to_user_id', user.id)
                .eq('status', 'pending');

            if (error) throw error;
            if (!invites || invites.length === 0) {
                set({ partyInvites: [] });
                return;
            }

            // Fetch sender profiles
            const senderIds = invites.map(i => i.from_user_id);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('id, username')
                .in('id', senderIds);

            const mappedInvites: PartyInvite[] = invites.map(inv => ({
                id: inv.id,
                partyId: inv.party_id,
                fromUserId: inv.from_user_id,
                toUserId: inv.to_user_id,
                status: inv.status,
                createdAt: inv.created_at,
                fromUsername: profiles?.find(p => p.id === inv.from_user_id)?.username || 'Unknown'
            }));

            set({ partyInvites: mappedInvites });
        } catch (err: any) {
            console.error('Error fetching party invites:', err);
        }
    },

    subscribeToPartyInvites: () => {
        const subscription = supabase
            .channel('public:party_invites')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'party_invites' }, async (payload) => {
                // Refresh invites on any change aimed at us
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // If check to avoid unnecessary fetches
                if (payload.new && (payload.new as any).to_user_id === user.id) {
                    await get().fetchPartyInvites();
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    },

    fetchOnlinePlayers: async () => {
        try {
            // Fetch all online players from presence
            const { data: presenceData } = await supabase
                .from('player_presence')
                .select('user_id, username, status')
                .eq('status', 'online')
                .limit(50);

            if (!presenceData) return;

            // Fetch profiles for these players
            const userIds = presenceData.map(p => p.user_id);
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .in('id', userIds);

            if (!profiles) return;

            // Map to online players
            const onlinePlayers = profiles.map(p => ({
                id: p.id,
                username: p.username,
                level: p.level,
                classId: p.class_id,
                status: presenceData.find(pr => pr.user_id === p.id)?.status || 'online'
            }));

            set({ onlinePlayers });
        } catch (err: any) {
            console.error('Error fetching online players:', err);
        }
    }
}));
