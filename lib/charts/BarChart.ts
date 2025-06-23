import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
import { getColorArray, defaultColors, getMinMax, lerp } from '../utils/helpers';

export class BarChart implements ChartInstance {
  private config: ChartConfig;
  private minValue: number = 0;
  private maxValue: number = 0;

  constructor(config: ChartConfig) {
    this.config = config;
    this.calculateMinMax();
  }

  private calculateMinMax(): void {
    const allData: number[] = [];
    
    this.config.data.datasets.forEach(dataset => {
      if (Array.isArray(dataset.data)) {
        dataset.data.forEach(value => {
          if (typeof value === 'number') {
            allData.push(value);
          } else if (typeof value === 'object' && 'y' in value) {
            allData.push(value.y);
          }
        });
      }
    });

    const { min, max } = getMinMax(allData);
    this.minValue = Math.min(0, min); // Include 0 for bar charts
    this.maxValue = max;
  }

  private getValueFromData(data: number | { x: number; y: number }): number {
    return typeof data === 'number' ? data : data.y;
  }

  render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    if (!this.config.data.datasets.length) return;

    // Setup scales area
    const scalesOptions = this.config.options?.scales;
    const legendHeight = this.config.options?.legend?.display ? 50 : 0;
    const chartBounds = {
      x: bounds.x + 50, // Space for Y axis labels
      y: bounds.y + legendHeight + 10,
      width: bounds.width - 80, // Space for Y axis labels and padding
      height: bounds.height - legendHeight - 50 // Space for X axis labels
    };

    // Render legend
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }

    // Render grid and axes
    if (scalesOptions?.x?.grid?.display || scalesOptions?.y?.grid?.display) {
      this.renderGrid(ctx, chartBounds);
    }

    // Render axes
    this.renderAxes(ctx, chartBounds);

    // Render bars
    this.renderBars(ctx, chartBounds, progress);
  }

  private renderLegend(ctx: CanvasRenderingContext2D, bounds: ChartBounds): void {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display) return;

    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    let x = bounds.x + 20; // Add left padding
    const y = bounds.y + 15; // Better vertical positioning

    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || 'Arial'}`;
    ctx.fillStyle = legendOptions.labels?.color || '#333';

    this.config.data.datasets.forEach((dataset, index) => {
      // Color box with better size and positioning
      const backgroundColor = typeof dataset.backgroundColor === 'string' 
        ? dataset.backgroundColor 
        : Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = backgroundColor || '#3498db';
      ctx.fillRect(x, y + 8, 18, 12); // Slightly larger box

      // Label with better spacing
      ctx.fillStyle = legendOptions.labels?.color || '#333';
      ctx.fillText(dataset.label || `Dataset ${index + 1}`, x + 28, y + 17);
      
      // Better spacing calculation based on text width
      const textWidth = ctx.measureText(dataset.label || `Dataset ${index + 1}`).width;
      x += textWidth + 70; // Increased spacing between items
    });
  }

  private renderGrid(ctx: CanvasRenderingContext2D, bounds: ChartBounds): void {
    const scalesOptions = this.config.options?.scales;
    
    ctx.strokeStyle = scalesOptions?.y?.grid?.color || 'rgba(0,0,0,0.1)';
    ctx.lineWidth = scalesOptions?.y?.grid?.lineWidth || 1;

    // Horizontal grid lines (Y axis)
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

    // Vertical grid lines (X axis)
    if (scalesOptions?.x?.grid?.display && this.config.data.labels) {
      const stepWidth = bounds.width / this.config.data.labels.length;
      this.config.data.labels.forEach((_, index) => {
        const x = bounds.x + stepWidth * (index + 0.5);
        ctx.beginPath();
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.height);
        ctx.stroke();
      });
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
          const value = this.minValue + (this.maxValue - this.minValue) * (1 - i / gridLines);
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
      if (scalesOptions.x.ticks?.display && this.config.data.labels) {
        ctx.fillStyle = scalesOptions.x.ticks.color || '#666';
        ctx.font = `${scalesOptions.x.ticks.font?.size || 10}px ${scalesOptions.x.ticks.font?.family || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        const stepWidth = bounds.width / this.config.data.labels.length;
        this.config.data.labels.forEach((label, index) => {
          const x = bounds.x + stepWidth * (index + 0.5);
          ctx.fillText(label, x, bounds.y + bounds.height + 5);
        });
      }
    }
  }

  private renderBars(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    if (!this.config.data.labels) return;

    const barWidth = bounds.width / this.config.data.labels.length;
    const datasetCount = this.config.data.datasets.length;
    const barGroupWidth = barWidth * 0.8; // 80% of available space
    const individualBarWidth = barGroupWidth / datasetCount;
    const colors = getColorArray(defaultColors, datasetCount);

    this.config.data.datasets.forEach((dataset, datasetIndex) => {
      const color = typeof dataset.backgroundColor === 'string' 
        ? dataset.backgroundColor 
        : Array.isArray(colors) ? colors[datasetIndex] : colors;
      
      ctx.fillStyle = color || '#3498db';

      dataset.data.forEach((dataPoint, index) => {
        const value = this.getValueFromData(dataPoint);
        const animatedValue = lerp(0, value, progress);
        
        // Calculate bar height (from 0 to value)
        const zeroY = bounds.y + bounds.height - ((0 - this.minValue) / (this.maxValue - this.minValue)) * bounds.height;
        const valueY = bounds.y + bounds.height - ((animatedValue - this.minValue) / (this.maxValue - this.minValue)) * bounds.height;
        const barHeight = zeroY - valueY;

        // Calculate bar position
        const groupX = bounds.x + index * barWidth + (barWidth - barGroupWidth) / 2;
        const barX = groupX + datasetIndex * individualBarWidth;

        // Draw bar
        if (barHeight > 0) {
          ctx.fillRect(barX, valueY, individualBarWidth - 1, barHeight);
        } else {
          // For negative values
          ctx.fillRect(barX, zeroY, individualBarWidth - 1, Math.abs(barHeight));
        }

        // Draw border
        if (dataset.borderColor && dataset.borderWidth) {
          ctx.strokeStyle = dataset.borderColor;
          ctx.lineWidth = dataset.borderWidth;
          ctx.strokeRect(barX, valueY, individualBarWidth - 1, barHeight);
        }
      });
    });
  }

  destroy(): void {
    // No cleanup needed for bar charts
  }
} 