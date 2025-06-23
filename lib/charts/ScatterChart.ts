import type { ChartConfig, ChartBounds, DataPoint } from '../types';
import type { ChartInstance } from '../core/TinyChart';
import { getColorArray, defaultColors, getMinMax, lerp } from '../utils/helpers';

export class ScatterChart implements ChartInstance {
  private config: ChartConfig;
  private minX: number = 0;
  private maxX: number = 0;
  private minY: number = 0;
  private maxY: number = 0;

  constructor(config: ChartConfig) {
    this.config = config;
    this.calculateMinMax();
  }

  private calculateMinMax(): void {
    const allXData: number[] = [];
    const allYData: number[] = [];
    
    this.config.data.datasets.forEach(dataset => {
      if (Array.isArray(dataset.data)) {
        dataset.data.forEach(value => {
          if (typeof value === 'object' && 'x' in value && 'y' in value) {
            allXData.push(value.x);
            allYData.push(value.y);
          }
        });
      }
    });

    const xMinMax = getMinMax(allXData);
    const yMinMax = getMinMax(allYData);
    
    this.minX = xMinMax.min;
    this.maxX = xMinMax.max;
    this.minY = yMinMax.min;
    this.maxY = yMinMax.max;
  }

  render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    if (!this.config.data.datasets.length) return;

    const legendHeight = this.config.options?.legend?.display ? 50 : 0;
    const chartBounds = {
      x: bounds.x + 50,
      y: bounds.y + legendHeight + 10,
      width: bounds.width - 80,
      height: bounds.height - legendHeight - 50
    };

    // Render legend
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }

    // Render grid
    this.renderGrid(ctx, chartBounds);

    // Render axes
    this.renderAxes(ctx, chartBounds);

    // Render scatter points
    this.renderPoints(ctx, chartBounds, progress);
  }

  private renderLegend(ctx: CanvasRenderingContext2D, bounds: ChartBounds): void {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display) return;

    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    let x = bounds.x + 20; // Add left padding
    const y = bounds.y + 15; // Better vertical positioning

    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || 'Arial'}`;

    this.config.data.datasets.forEach((dataset, index) => {
      // Color circle with better positioning
      const color = dataset.backgroundColor || 
        (Array.isArray(colors) ? colors[index] : colors) || '#3498db';
      ctx.fillStyle = color as string;
      ctx.beginPath();
      ctx.arc(x + 10, y + 14, 6, 0, Math.PI * 2); // Slightly larger circle
      ctx.fill();

      // Label with better spacing
      ctx.fillStyle = legendOptions.labels?.color || '#333';
      ctx.fillText(dataset.label || `Dataset ${index + 1}`, x + 25, y + 17);
      
      // Better spacing calculation based on text width
      const textWidth = ctx.measureText(dataset.label || `Dataset ${index + 1}`).width;
      x += textWidth + 70; // Increased spacing between items
    });
  }

  private renderGrid(ctx: CanvasRenderingContext2D, bounds: ChartBounds): void {
    const scalesOptions = this.config.options?.scales;
    
    ctx.strokeStyle = scalesOptions?.y?.grid?.color || 'rgba(0,0,0,0.1)';
    ctx.lineWidth = scalesOptions?.y?.grid?.lineWidth || 1;

    // Horizontal grid lines
    if (scalesOptions?.y?.grid?.display) {
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const y = bounds.y + (bounds.height / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.width, y);
        ctx.stroke();
      }
    }

    // Vertical grid lines
    if (scalesOptions?.x?.grid?.display) {
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const x = bounds.x + (bounds.width / gridLines) * i;
        ctx.beginPath();
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.height);
        ctx.stroke();
      }
    }
  }

  private renderAxes(ctx: CanvasRenderingContext2D, bounds: ChartBounds): void {
    const scalesOptions = this.config.options?.scales;

    // Y axis
    if (scalesOptions?.y?.display) {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y);
      ctx.lineTo(bounds.x, bounds.y + bounds.height);
      ctx.stroke();

      // Y axis labels
      if (scalesOptions.y.ticks?.display) {
        ctx.fillStyle = scalesOptions.y.ticks.color || '#666';
        ctx.font = `${scalesOptions.y.ticks.font?.size || 10}px ${scalesOptions.y.ticks.font?.family || 'Arial'}`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const value = this.minY + (this.maxY - this.minY) * (1 - i / gridLines);
          const y = bounds.y + (bounds.height / gridLines) * i;
          ctx.fillText(value.toFixed(1), bounds.x - 5, y);
        }
      }
    }

    // X axis
    if (scalesOptions?.x?.display) {
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y + bounds.height);
      ctx.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
      ctx.stroke();

      // X axis labels
      if (scalesOptions.x.ticks?.display) {
        ctx.fillStyle = scalesOptions.x.ticks.color || '#666';
        ctx.font = `${scalesOptions.x.ticks.font?.size || 10}px ${scalesOptions.x.ticks.font?.family || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const value = this.minX + (this.maxX - this.minX) * (i / gridLines);
          const x = bounds.x + (bounds.width / gridLines) * i;
          ctx.fillText(value.toFixed(1), x, bounds.y + bounds.height + 5);
        }
      }
    }
  }

  private renderPoints(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    const colors = getColorArray(defaultColors, this.config.data.datasets.length);

    this.config.data.datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.backgroundColor || 
        (Array.isArray(colors) ? colors[datasetIndex] : colors) || '#3498db';
      
      ctx.fillStyle = color as string;

      dataset.data.forEach(dataPoint => {
        if (typeof dataPoint === 'object' && 'x' in dataPoint && 'y' in dataPoint) {
          const point = dataPoint as DataPoint;
          
          // Calculate position
          const x = bounds.x + ((point.x - this.minX) / (this.maxX - this.minX)) * bounds.width;
          const y = bounds.y + bounds.height - ((point.y - this.minY) / (this.maxY - this.minY)) * bounds.height;
          
          // Animate radius
          const radius = lerp(0, 4, progress);
          
          // Draw point
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();

          // Draw border
          if (dataset.borderColor && dataset.borderWidth) {
            ctx.strokeStyle = dataset.borderColor;
            ctx.lineWidth = dataset.borderWidth;
            ctx.stroke();
          }
        }
      });
    });
  }

  destroy(): void {
    // No cleanup needed
  }
} 