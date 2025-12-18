
import { MINING_NODES } from '../src/data/ores';

// Mock console to avoid spam
const console = {
    log: (...args: any[]) => { },
    warn: (...args: any[]) => process.stdout.write('WARN: ' + args.join(' ') + '\n'),
    error: (...args: any[]) => process.stdout.write('ERROR: ' + args.join(' ') + '\n'),
} as any;

function testMiningDrops() {
    const node = MINING_NODES.find(n => n.id === 'pebbles'); // Use basic node
    if (!node) throw new Error("Node not found");

    process.stdout.write(`Testing drops for node: ${node.name}\n`);

    const results: Record<string, number> = {};
    const iterations = 100;
    let totalDropsCount = 0;

    for (let k = 0; k < iterations; k++) {
        // 1. Determine Total Drops
        let totalDrops = 1;
        const roll = Math.random();

        if (roll < 0.60) { totalDrops = 1; }
        else if (roll < 0.90) { totalDrops = 2; }
        else if (roll < 0.98) { totalDrops = 3; }
        else { totalDrops = Math.floor(Math.random() * 2) + 4; }

        // 2. Roll specific ores
        const dropsReceived: Record<string, number> = {};
        const drops = node.drops;
        const totalWeight = drops.reduce((sum, d) => sum + d.chance, 0);

        for (let i = 0; i < totalDrops; i++) {
            let r = Math.random() * totalWeight;
            for (const drop of drops) {
                if (r < drop.chance) {
                    dropsReceived[drop.oreId] = (dropsReceived[drop.oreId] || 0) + 1;
                    results[drop.oreId] = (results[drop.oreId] || 0) + 1;
                    totalDropsCount++;
                    break;
                }
                r -= drop.chance;
            }
        }
    }

    process.stdout.write(`Simulation Complete (${iterations} breaks):\n`);
    process.stdout.write(JSON.stringify(results, null, 2) + '\n');
    process.stdout.write(`Total Items Dropped: ${totalDropsCount}\n`);

    if (totalDropsCount === 0) {
        process.stdout.write("FAIL: No drops generated!\n");
    } else {
        process.stdout.write("PASS: Drops generated successfully.\n");
    }
}

testMiningDrops();
