import { useDroppable } from '@dnd-kit/core';
import { cn } from '../lib/utils';
import { TrayId } from '../types';

interface BlockTrayProps {
    id: TrayId;
    children: React.ReactNode;
    label?: string;
    count?: number;
    className?: string;
}

export function BlockTray({ id, children, label, count, className }: BlockTrayProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "relative rounded-2xl p-4 transition-colors duration-300 border-4",
                isOver ? "bg-orange-100 border-orange-400 scale-[1.02]" : "bg-white border-orange-200",
                className
            )}
        >
            <div className="absolute -top-3 left-4 bg-orange-500 text-white px-3 py-0.5 rounded-full text-sm font-bold shadow-sm">
                {label}
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center min-h-[100px] p-2">
                {children}
            </div>

            {typeof count === 'number' && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white border-2 border-orange-500 text-orange-600 px-4 py-1 rounded-xl font-bold text-xl shadow-md min-w-[3rem] text-center">
                    {count}
                </div>
            )}
        </div>
    );
}
