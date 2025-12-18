
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function DynamicBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-cyber-darker">
            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(var(--color-cyber-cyan) 1px, transparent 1px),
          linear-gradient(90deg, var(--color-cyber-cyan) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
                    transformOrigin: 'top center',
                }}
            >
                <motion.div
                    className="absolute inset-0"
                    animate={{
                        backgroundPosition: ['0px 0px', '0px 40px'],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{
                        backgroundImage: 'inherit',
                        backgroundSize: 'inherit',
                    }}
                />
            </div>

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-cyber-cyan rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0,
                        scale: 0,
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [0, 0.5, 0],
                        scale: [0, Math.random() * 0.5 + 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "easeInOut",
                    }}
                    style={{
                        width: Math.random() * 4 + 1,
                        height: Math.random() * 4 + 1,
                    }}
                />
            ))}

            {/* Ambient Glows */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[100px]"
                animate={{
                    x: mousePosition.x * 50,
                    y: mousePosition.y * 50,
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    scale: {
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                    },
                    default: {
                        type: "spring",
                        stiffness: 50,
                        damping: 20
                    }
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-[100px]"
                animate={{
                    x: mousePosition.x * -50,
                    y: mousePosition.y * -50,
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    scale: {
                        duration: 7,
                        repeat: Infinity,
                        repeatType: "reverse",
                    },
                    default: {
                        type: "spring",
                        stiffness: 50,
                        damping: 20
                    }
                }}
            />

            {/* Scanline Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_4px,3px_100%] pointer-events-none" />
        </div>
    );
}
