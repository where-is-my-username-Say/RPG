import React from 'react';
import { SkillTree } from './SkillTree';
import { NavigationBar } from '../ui/NavigationBar';

export const SkillsView: React.FC = () => {
    return (
        <div className="w-full h-screen bg-cyber-darker text-white p-4 pb-20 overflow-hidden relative">
            <div className="max-w-7xl mx-auto h-full flex flex-col gap-4">
                <SkillTree />
            </div>
            <NavigationBar />
        </div>
    );
};
