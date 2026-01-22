import { useState, useCallback, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    DragEndEvent,
    DragStartEvent,
    closestCenter
} from '@dnd-kit/core';
import { TeacherInput } from './components/TeacherInput';
import { BlockTray } from './components/BlockTray';
import { Block } from './components/Block';
import { BlockData, TrayId } from './types';
import { cn } from './lib/utils';

function App() {
    const [blocks, setBlocks] = useState<BlockData[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [formula, setFormula] = useState({ left: 3, right: 2 });

    // Sensors for better drag experience
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            }
        })
    );

    // Initialize blocks when formula changes
    const handleFormulaUpdate = useCallback((left: number, right: number) => {
        setFormula({ left, right });

        // Create new blocks
        const newBlocks: BlockData[] = [];

        // Left blocks (Red)
        for (let i = 0; i < left; i++) {
            newBlocks.push({
                id: `left-${i}`,
                sourceTray: 'left',
                currentTray: 'left',
                color: 'bg-red-500' // Premium red
            });
        }

        // Right blocks (Yellow/Gold)
        for (let i = 0; i < right; i++) {
            newBlocks.push({
                id: `right-${i}`,
                sourceTray: 'right',
                currentTray: 'right',
                color: 'bg-yellow-400' // Premium yellow
            });
        }

        setBlocks(newBlocks);
    }, []);

    // Effect to initialize default blocks
    useEffect(() => {
        handleFormulaUpdate(3, 2);
    }, [handleFormulaUpdate]);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active) {
            const overId = over.id as TrayId;
            // only allow dropping in trays
            if (['left', 'right', 'combined'].includes(overId)) {
                setBlocks((prev) => prev.map(block => {
                    if (block.id === active.id) {
                        return { ...block, currentTray: overId };
                    }
                    return block;
                }));
            }
        }
    };

    const getBlocksInTray = (trayId: TrayId) => blocks.filter(b => b.currentTray === trayId);

    const activeBlock = activeId ? blocks.find(b => b.id === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen bg-orange-50 font-sans p-4 flex flex-col items-center">
                {/* Header / Input */}
                <div className="w-full max-w-4xl flex flex-col items-center mt-8">
                    <TeacherInput initialValue="3 + 2" onUpdate={handleFormulaUpdate} />
                </div>

                {/* Main Workspace */}
                <div className="w-full max-w-4xl flex flex-col gap-8 mt-4">

                    {/* Top Trays (Formula parts) */}
                    <div className="flex flex-row justify-center gap-8 items-stretch">
                        {/* Left Part */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <BlockTray
                                id="left"
                                count={formula.left} // Static label from formula
                                className="w-full h-full min-h-[180px] bg-white shadow-sm"
                            >
                                {getBlocksInTray('left').map(block => (
                                    <Block key={block.id} block={block} />
                                ))}
                            </BlockTray>
                        </div>

                        {/* Plus Sign */}
                        <div className="flex items-center justify-center text-4xl font-bold text-gray-400 pb-12">
                            と
                        </div>

                        {/* Right Part */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                            <BlockTray
                                id="right"
                                count={formula.right} // Static label from formula
                                className="w-full h-full min-h-[180px] bg-white shadow-sm"
                            >
                                {getBlocksInTray('right').map(block => (
                                    <Block key={block.id} block={block} />
                                ))}
                            </BlockTray>
                        </div>
                    </div>

                    {/* Bottom Tray (Result) */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-full">
                            <BlockTray
                                id="combined"
                                label="あわせて"
                                count={getBlocksInTray('combined').length}
                                className="w-full min-h-[220px] bg-orange-50/50 border-dashed border-orange-300"
                            >
                                {getBlocksInTray('combined').map(block => (
                                    <Block key={block.id} block={block} />
                                ))}
                            </BlockTray>
                        </div>
                    </div>

                </div>

                {/* Drag Overlay for smooth visual */}
                <DragOverlay>
                    {activeBlock ? <Block block={activeBlock} /> : null}
                </DragOverlay>

                <p className="fixed bottom-4 text-gray-400 text-sm">
                    ブロックをドラッグして「あわせて」に移動しましょう
                </p>
            </div>
        </DndContext>
    )
}

export default App
