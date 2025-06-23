import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
export declare class LineChart implements ChartInstance {
    private config;
    private minValue;
    private maxValue;
    constructor(config: ChartConfig);
    private calculateMinMax;
    private getValueFromData;
    render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void;
    private renderLegend;
    private renderGrid;
    private renderAxes;
    private renderLines;
    destroy(): void;
}
//# sourceMappingURL=LineChart.d.ts.map