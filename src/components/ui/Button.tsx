import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    disabled?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'font-bold uppercase tracking-wider transition-all duration-200 relative overflow-hidden touch-manipulation select-none cursor-pointer';

    const variants = {
        primary: 'bg-cyber-cyan text-cyber-dark hover:bg-cyber-purple hover:shadow-[0_0_20px_rgba(176,38,255,0.5)]',
        secondary: 'bg-transparent border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-dark',
        danger: 'bg-cyber-pink text-white hover:bg-red-600 hover:shadow-[0_0_20px_rgba(255,0,110,0.5)]',
        success: 'bg-green-500 text-white hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]'
    };

    const sizes = {
        sm: 'px-4 py-3 text-xs min-h-[44px]', // Mobile touch target friendly
        md: 'px-6 py-4 text-sm min-h-[50px]',
        lg: 'px-8 py-5 text-base min-h-[60px]'
    };

    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
            transition={{ duration: 0 }}
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    PROCESSING...
                </span>
            ) : children}

            {/* Glow effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </motion.button>
    );
}
