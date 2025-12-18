import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { Button } from '../ui';

// Tutorial Steps Configuration
const STEPS = [
    {
        title: "WELCOME OPERATIVE",
        content: "Welcome to the Neon City. You are a mercenary seeking fortune in this cyberpunk dystopia. Gather resources, forge equipment, and undertake dangerous contracts.",
        position: "center"
    },
    {
        title: "ENERGY SYSTEMS",
        content: "Every action requires Energy (⚡). Your suit recharges automatically over time (1 Energy / 6 mins). Manage it wisely.",
        position: "top-right",
        highlight: "energy-indicator"
    },
    {
        title: "MINING OPERATIONS",
        content: "Visit the MINING district to gather raw materials. Different zones yield different ores. You'll need these to forge gear.",
        position: "bottom-left"
    },
    {
        title: "CONTRACTS & COMBAT",
        content: "Accept DAILY CONTRACTS from the Main Hub to earn XP and Gold. Be careful - higher difficulty contracts spawn tougher enemies.",
        position: "center"
    },
    {
        title: "SOCIAL NETWORK",
        content: "The Community tab allows you to form SQUADS. Playing with friends boosts your efficiency. Check 'The Nexus' to find other operatives.",
        position: "bottom-right"
    }
];

export function TutorialOverlay() {
    const { player, completeTutorial } = useGameStore();
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Only show if player exists and tutorial NOT completed
    useEffect(() => {
        if (player && player.tutorialCompleted === false) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [player]);

    if (!isVisible) return null;

    const step = STEPS[currentStep];

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            completeTutorial();
            setIsVisible(false);
        }
    };

    const handleSkip = () => {
        if (confirm("Skip the onboarding tutorial?")) {
            completeTutorial();
            setIsVisible(false);
        }
    };

    // Dynamic Positioning Styles
    const getPositionStyles = () => {
        switch (step.position) {
            case 'top-right':
                return "top-24 right-4 md:right-10";
            case 'bottom-left':
                return "bottom-32 left-4 md:left-10";
            case 'bottom-right':
                return "bottom-32 right-4 md:right-10";
            case 'center':
            default:
                return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2";
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] pointer-events-none">
                {/* Backdrop (Darken background to focus attention) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black pointer-events-auto"
                />

                {/* Tutorial Card */}
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="tutorial-title"
                    key={currentStep}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className={`absolute ${getPositionStyles()} w-[90%] md:w-[500px] pointer-events-auto`}
                >
                    <div className="bg-cyber-darker border-2 border-cyber-cyan shadow-[0_0_50px_rgba(0,240,255,0.3)] rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-cyber-cyan/20 p-4 border-b border-cyber-cyan/30 flex justify-between items-center">
                            <h2 id="tutorial-title" className="text-xl font-black text-cyber-cyan tracking-widest">
                                {step.title}
                            </h2>
                            <div className="text-xs font-mono text-cyber-cyan/70 bg-black/40 px-2 py-1 rounded border border-cyber-cyan/30">
                                STEP {currentStep + 1}/{STEPS.length}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                {step.content}
                            </p>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-4 bg-black/40 flex justify-between items-center gap-4">
                            <button
                                onClick={handleSkip}
                                className="text-xs text-gray-500 hover:text-white underline"
                            >
                                SKIP TUTORIAL
                            </button>

                            <Button variant="primary" onClick={handleNext} className="shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                                {currentStep === STEPS.length - 1 ? 'INITIALIZE SYSTEMS' : 'NEXT ►'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
