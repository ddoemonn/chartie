import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
export declare class AreaChart implements ChartInstance {
    private lineChart;
    constructor(config: ChartConfig);
    render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void;
    destroy(): void;
}
//# sourceMappingURL=AreaChart.d.ts.map