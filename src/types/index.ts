export interface LayoutOption {
    id: string
    name: string
    description: string
    photoCount: number
    aspectRatio: string
}

export interface Photo {
    id: string
    dataUrl: string
    timestamp: number
    offsetX: number  // Horizontal position offset (0-100%)
    offsetY: number  // Vertical position offset (0-100%)
}

export interface Sticker {
    id: string
    emoji: string
    x: number
    y: number
    scale: number
    rotation: number
}

export interface ColorOption {
    id: string
    color: string
    isPattern?: boolean
}
