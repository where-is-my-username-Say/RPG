import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button, Panel } from './ui';
import { motion } from 'framer-motion';
import { DynamicBackground } from './cyber/DynamicBackground';

interface AuthViewProps {
    onSuccess: () => void;
}

export function AuthView({ onSuccess }: AuthViewProps) {
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP' | 'VERIFY'>('LOGIN');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Restore state from localStorage on mount (handle mobile refreshes)
    useEffect(() => {
        const savedMode = localStorage.getItem('auth_mode');
        const savedEmail = localStorage.getItem('auth_email');
        if (savedMode === 'VERIFY' && savedEmail) {
            setMode('VERIFY');
            setEmail(savedEmail);
        }
    }, []);

    // Save state when switching to VERIFY
    const setVerifyMode = (email: string) => {
        setMode('VERIFY');
        localStorage.setItem('auth_mode', 'VERIFY');
        localStorage.setItem('auth_email', email);
    };

    const clearPersistedState = () => {
        localStorage.removeItem('auth_mode');
        localStorage.removeItem('auth_email');
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'VERIFY') {
                // Verify email token
                const { error: verifyError } = await supabase.auth.verifyOtp({
                    email,
                    token,
                    type: 'signup'
                });

                if (verifyError) throw verifyError;

                // Create profile if needed (handled in App.tsx now, but ensure we trigger it)
                // Just proceeding to success should trigger the session state change in App.tsx

            } else if (mode === 'SIGNUP') {
                // Sign up
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username }
                    }
                });

                if (signUpError) throw signUpError;

                // Try to sign in to check if email confirmation is required
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (signInError) {
                    if (signInError.message.includes('Email not confirmed')) {
                        // Switch to verify mode
                        setVerifyMode(email);
                        setError('Account created! Please enter the code emailed to you.');
                        setLoading(false);
                        return;
                    } else {
                        throw signInError;
                    }
                }
            } else {
                // Login
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (signInError) {
                    if (signInError.message.includes('Email not confirmed')) {
                        setVerifyMode(email);
                        setError('Email not confirmed. Enter the code from your email.');
                        setLoading(false);
                        return;
                    }
                    throw signInError;
                }
            }

            clearPersistedState();
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-cyber-darker flex items-center justify-center p-4 overflow-hidden">
            <DynamicBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -10, 0]
                }}
                transition={{
                    y: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    default: { duration: 0.5 }
                }}
                className="relative z-10 w-full max-w-md perspective-1000"
            >
                <Panel title={mode === 'LOGIN' ? 'SYSTEM ACCESS' : mode === 'VERIFY' ? 'SECURITY CHECK' : 'NEW OPERATIVE'} glowColor={mode === 'VERIFY' ? 'purple' : 'cyan'}>
                    <form onSubmit={handleAuth} className="space-y-4">

                        {/* Email - Always show unless in Verify mode (locked) or simple logic */}
                        <div className="space-y-2">
                            <label className="text-cyber-cyan text-xs font-mono uppercase tracking-widest">
                                EMAIL_ID
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={mode === 'VERIFY'}
                                className={`w-full bg-cyber-darker border border-cyber-cyan/30 text-cyber-cyan px-4 py-3 rounded focus:outline-none focus:border-cyber-cyan font-mono ${mode === 'VERIFY' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                placeholder="operative@cyber.net"
                            />
                        </div>

                        {/* Username (signup only) */}
                        {mode === 'SIGNUP' && (
                            <div className="space-y-2">
                                <label className="text-cyber-cyan text-xs font-mono uppercase tracking-widest">
                                    USERNAME
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-cyber-darker border border-cyber-cyan/30 text-cyber-cyan px-4 py-3 rounded focus:outline-none focus:border-cyber-cyan font-mono"
                                    placeholder="Ghost"
                                />
                            </div>
                        )}

                        {/* Password (login/signup only) */}
                        {mode !== 'VERIFY' && (
                            <div className="space-y-2">
                                <label className="text-cyber-cyan text-xs font-mono uppercase tracking-widest">
                                    PASSWORD
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-cyber-darker border border-cyber-cyan/30 text-cyber-cyan px-4 py-3 rounded focus:outline-none focus:border-cyber-cyan font-mono"
                                    placeholder="••••••••"
                                />
                                {mode === 'SIGNUP' && (
                                    <p className="text-xs text-gray-400 font-mono">
                                        MIN 8 CHARS | UPPERCASE | NUMBER
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Verification Token (Verify only) */}
                        {mode === 'VERIFY' && (
                            <div className="space-y-2">
                                <label className="text-cyber-purple text-xs font-mono uppercase tracking-widest animate-pulse">
                                    SECURITY_TOKEN
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="w-full bg-cyber-darker border border-cyber-purple text-cyber-purple px-4 py-3 rounded focus:outline-none focus:border-cyber-purple font-mono text-center tracking-[1em] text-xl"
                                    placeholder="00000000"
                                    maxLength={8}
                                />
                                <p className="text-xs text-gray-400 font-mono text-center">
                                    CHECK YOUR SECURE CHANNEL (EMAIL)
                                </p>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="bg-cyber-pink/20 border border-cyber-pink text-cyber-pink px-4 py-2 rounded text-sm font-mono">
                                {mode === 'VERIFY' ? '⚠ ' : 'ERROR: '}{error}
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant={mode === 'VERIFY' ? 'primary' : 'primary'} // can verify use a different color? Button supports variants? we'll stick to primary.
                            size="lg"
                            className="w-full"
                            isLoading={loading}
                        >
                            {mode === 'LOGIN' ? 'INITIALIZE SESSION' : mode === 'VERIFY' ? 'VERIFY IDENTITY' : 'CREATE OPERATIVE'}
                        </Button>

                        {/* Toggle mode */}
                        <div className="text-center text-sm font-mono text-gray-400">
                            {mode === 'LOGIN' ? (
                                <>
                                    New operative?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('SIGNUP')}
                                        className="text-cyber-cyan hover:underline"
                                    >
                                        Register
                                    </button>
                                </>
                            ) : mode === 'SIGNUP' ? (
                                <>
                                    Already registered?{' '}
                                    <button
                                        type="button"
                                        onClick={() => setMode('LOGIN')}
                                        className="text-cyber-cyan hover:underline"
                                    >
                                        Login
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setMode('LOGIN')}
                                    className="text-cyber-cyan hover:underline"
                                >
                                    Back to Login
                                </button>
                            )}
                        </div>
                    </form>
                </Panel>
            </motion.div>
        </div>
    );
}
