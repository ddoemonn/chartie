import type { ChartConfig, ChartBounds } from '../types';
export interface ChartInstance {
    render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void;
    destroy(): void;
}
export declare class Chartie {
    private canvas;
    private ctx;
    private config;
    private chartInstance;
    private animationId;
    private startTime;
    private isAnimating;
    constructor(canvasOrId: string | HTMLCanvasElement, config: ChartConfig);
    private mergeDefaultOptions;
    private createChartInstance;
    private setupResizeListener;
    private getChartBounds;
    render(): void;
    private startAnimation;
    private animateFrame;
    private renderFrame;
    private stopAnimation;
    update(config: Partial<ChartConfig>): void;
    destroy(): void;
}
//# sourceMappingURL=TinyChart.d.ts.map