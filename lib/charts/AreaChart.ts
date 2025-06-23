import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
import { LineChart } from './LineChart';

export class AreaChart implements ChartInstance {
  private lineChart: LineChart;

  constructor(config: ChartConfig) {
    // Force fill to true for area charts
    const areaConfig = {
      ...config,
      data: {
        ...config.data,
        datasets: config.data.datasets.map(dataset => ({
          ...dataset,
          fill: true
        }))
      }
    };
    
    this.lineChart = new LineChart(areaConfig);
  }

  render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    this.lineChart.render(ctx, bounds, progress);
  }

  destroy(): void {
    this.lineChart.destroy();
  }
} 