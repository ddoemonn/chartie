import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
export declare class DoughnutChart implements ChartInstance {
    private config;
    constructor(config: ChartConfig);
    render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void;
    private renderLegend;
    private renderSlices;
    destroy(): void;
}
//# sourceMappingURL=DoughnutChart.d.ts.map