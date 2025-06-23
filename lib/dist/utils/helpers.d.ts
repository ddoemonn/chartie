import type { Color } from '../types';
export declare const getColorArray: (colors: Color | Color[], length: number) => Color[];
export declare const hexToRgba: (hex: string, alpha?: number) => string;
export declare const clamp: (value: number, min: number, max: number) => number;
export declare const lerp: (start: number, end: number, progress: number) => number;
export declare const getMinMax: (data: number[]) => {
    min: number;
    max: number;
};
export declare const getDevicePixelRatio: () => number;
export declare const setupHighDPICanvas: (canvas: HTMLCanvasElement) => CanvasRenderingContext2D;
export declare const easingFunctions: {
    linear: (t: number) => number;
    easeInOut: (t: number) => number;
    easeIn: (t: number) => number;
    easeOut: (t: number) => number;
};
export declare const defaultColors: string[];
export declare const measureText: (ctx: CanvasRenderingContext2D, text: string) => TextMetrics;
export declare const getTextHeight: (ctx: CanvasRenderingContext2D) => number;
export declare const degToRad: (degrees: number) => number;
export declare const radToDeg: (radians: number) => number;
//# sourceMappingURL=helpers.d.ts.map