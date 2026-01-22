export type TrayId = 'left' | 'right' | 'combined';

export interface BlockData {
    id: string;
    sourceTray: 'left' | 'right'; // The tray where it originated
    currentTray: TrayId; // Where it is currently
    color: string;
}

export interface Formula {
    left: number; // e.g., 3
    right: number; // e.g., 2
}
