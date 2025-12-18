import { motion } from 'framer-motion';
import { type Toast as ToastType, useUIStore } from '../../store/uiStore';

interface ToastProps {
    toast: ToastType;
}

export function Toast({ toast }: ToastProps) {
    const removeToast = useUIStore((state) => state.removeToast);

    const variants = {
        success: 'border-green-500 bg-green-500/10 text-green-400',
        error: 'border-red-500 bg-red-500/10 text-red-400',
        info: 'border-cyber-cyan bg-cyber-cyan/10 text-cyber-cyan',
        warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-400',
    };

    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️',
        warning: '⚠️',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`
                relative w-80 p-4 mb-3 rounded border-l-4 backdrop-blur-md shadow-lg
                flex items-start gap-3 pointer-events-auto
                ${variants[toast.type]}
            `}
        >
            <div className="text-xl">{icons[toast.type]}</div>
            <div className="flex-1">
                <p className="text-sm font-bold font-mono leading-tight">{toast.message}</p>
            </div>
            <button
                onClick={() => removeToast(toast.id)}
                className="opacity-50 hover:opacity-100 transition-opacity"
            >
                ✕
            </button>

            {/* Loading bar for auto-dismiss */}
            {toast.duration && toast.duration > 0 && (
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                    className={`absolute bottom-0 left-0 h-1 bg-current opacity-30`}
                />
            )}
        </motion.div>
    );
}
