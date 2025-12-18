import { motion } from 'framer-motion';
import { Panel } from './ui/Panel';

const NEWS_ITEMS = [
    { id: 1, time: '09:42', category: 'CRIME', text: 'Sector 7 Gang War escalates. Avoid lower levels.', color: 'text-red-400' },
    { id: 2, time: '08:15', category: 'MARKET', text: 'Scrap metal prices up 15% due to shortage.', color: 'text-green-400' },
    { id: 3, time: '07:30', category: 'SYSTEM', text: 'Server maintenance scheduled for 03:00.', color: 'text-cyber-cyan' },
    { id: 4, time: '06:00', category: 'WEATHER', text: 'Heavy acid rain warning for Industrial District.', color: 'text-yellow-400' },
];

export function WorldNewsPanel() {
    return (
        <Panel title="NEON CITY NETWORK" glowColor="purple">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-mono text-red-500 tracking-widest">LIVE FEED_</span>
                </div>

                <div className="space-y-3">
                    {NEWS_ITEMS.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-black/20 border border-white/5 p-3 rounded hover:bg-white/5 transition-colors cursor-default group"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-black/50 ${item.color}`}>
                                    {item.category}
                                </span>
                                <span className="text-[10px] text-gray-600 font-mono">{item.time}</span>
                            </div>
                            <p className="text-sm text-gray-300 font-mono leading-relaxed group-hover:text-white transition-colors">
                                {item.text}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                    <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">
                        End of transmission
                    </span>
                </div>
            </div>
        </Panel>
    );
}
