import { useDraggable } from '@dnd-kit/core';
import { cn } from '../lib/utils';
import { BlockData } from '../types';

interface BlockProps {
    block: BlockData;
}

export function Block({ block }: BlockProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: block.id,
        data: block,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "w-12 h-12 rounded-full shadow-lg cursor-grab active:cursor-grabbing touch-none transition-shadow",
                "flex items-center justify-center border-4 border-white/30",
                block.color,
                isDragging ? "z-50 shadow-2xl scale-110 opacity-90" : "shadow-md hover:scale-105"
            )}
        >
            {/* 3D effect inner circle */}
            <div className="w-8 h-8 rounded-full bg-white/20" />
        </div>
    );
}
