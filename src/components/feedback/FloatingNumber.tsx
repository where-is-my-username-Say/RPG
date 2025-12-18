import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingNumberProps {
    value: number;
    prefix?: string;
    suffix?: string;
    color?: 'white' | 'cyan' | 'purple' | 'yellow' | 'green' | 'red';
    size?: 'sm' | 'md' | 'lg';
    duration?: number;
    onComplete?: () => void;
}

const colorMap = {
    white: 'text-white',
    cyan: 'text-cyber-cyan',
    purple: 'text-cyber-purple',
    yellow: 'text-cyber-yellow',
    green: 'text-green-400',
    red: 'text-red-400',
};

const sizeMap = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
};

export function FloatingNumber({
    value,
    prefix = '',
    suffix = '',
    color = 'white',
    size = 'md',
    duration = 2000,
    onComplete
}: FloatingNumberProps) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            onComplete?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 1, y: 0, scale: 0.5 }}
                    animate={{
                        opacity: [1, 1, 0],
                        y: -100,
                        scale: [0.5, 1.2, 1],
                        x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: duration / 1000, ease: "easeOut" }}
                    className={`
                        pointer-events-none fixed z-[100]
                        font-bold font-mono tracking-wider
                        ${colorMap[color]}
                        ${sizeMap[size]}
                        drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]
                    `}
                    style={{
                        textShadow: `0 0 20px currentColor, 0 0 40px currentColor`,
                    }}
                >
                    {prefix}{value.toLocaleString()}{suffix}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook to manage multiple floating numbers
export function useFloatingNumbers() {
    const [numbers, setNumbers] = useState<Array<{
        id: string;
        value: number;
        prefix?: string;
        suffix?: string;
        color?: FloatingNumberProps['color'];
        size?: FloatingNumberProps['size'];
        x: number;
        y: number;
    }>>([]);

    const addFloatingNumber = (
        value: number,
        x: number,
        y: number,
        options?: {
            prefix?: string;
            suffix?: string;
            color?: FloatingNumberProps['color'];
            size?: FloatingNumberProps['size'];
        }
    ) => {
        const id = `${Date.now()}-${Math.random()}`;
        setNumbers(prev => [...prev, { id, value, x, y, ...options }]);
    };

    const removeFloatingNumber = (id: string) => {
        setNumbers(prev => prev.filter(n => n.id !== id));
    };

    return {
        numbers,
        addFloatingNumber,
        FloatingNumbersRenderer: () => (
            <>
                {numbers.map(num => (
                    <div
                        key={num.id}
                        style={{
                            position: 'fixed',
                            left: num.x,
                            top: num.y,
                            pointerEvents: 'none',
                            zIndex: 100,
                        }}
                    >
                        <FloatingNumber
                            value={num.value}
                            prefix={num.prefix}
                            suffix={num.suffix}
                            color={num.color}
                            size={num.size}
                            onComplete={() => removeFloatingNumber(num.id)}
                        />
                    </div>
                ))}
            </>
        )
    };
}
