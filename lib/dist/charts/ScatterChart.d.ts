import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
export declare class ScatterChart implements ChartInstance {
    private config;
    private minX;
    private maxX;
    private minY;
    private maxY;
    constructor(config: ChartConfig);
    private calculateMinMax;
    render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void;
    private renderLegend;
    private renderGrid;
    private renderAxes;
    private renderPoints;
    destroy(): void;
}
//# sourceMappingURL=ScatterChart.d.ts.map