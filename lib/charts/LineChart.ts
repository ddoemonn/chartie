import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
import { getColorArray, defaultColors, getMinMax, lerp } from '../utils/helpers';

export class LineChart implements ChartInstance {
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
    this.minValue = min;
    this.maxValue = max;
  }

  private getValueFromData(data: number | { x: number; y: number }): number {
    return typeof data === 'number' ? data : data.y;
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

    // Render lines
    this.renderLines(ctx, chartBounds, progress);
  }

  private renderLegend(ctx: CanvasRenderingContext2D, bounds: ChartBounds): void {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display) return;

    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    let x = bounds.x + 20;
    const y = bounds.y + 15;

    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || 'Arial'}`;

    this.config.data.datasets.forEach((dataset, index) => {
      // Color line
      const color = dataset.borderColor || 
        (Array.isArray(colors) ? colors[index] : colors) || '#3498db';
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + 12);
      ctx.lineTo(x + 20, y + 12);
      ctx.stroke();

      // Label
      ctx.fillStyle = legendOptions.labels?.color || '#333';
      ctx.fillText(dataset.label || `Dataset ${index + 1}`, x + 30, y + 17);
      
      const textWidth = ctx.measureText(dataset.label || `Dataset ${index + 1}`).width;
      x += textWidth + 70;
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
    if (scalesOptions?.x?.grid?.display && this.config.data.labels) {
      const stepWidth = bounds.width / (this.config.data.labels.length - 1);
      this.config.data.labels.forEach((_, index) => {
        const x = bounds.x + stepWidth * index;
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

        const stepWidth = bounds.width / (this.config.data.labels.length - 1);
        this.config.data.labels.forEach((label, index) => {
          const x = bounds.x + stepWidth * index;
          ctx.fillText(label, x, bounds.y + bounds.height + 5);
        });
      }
    }
  }

  private renderLines(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    if (!this.config.data.labels) return;

    const stepWidth = bounds.width / (this.config.data.labels.length - 1);
    const colors = getColorArray(defaultColors, this.config.data.datasets.length);

    this.config.data.datasets.forEach((dataset, datasetIndex) => {
      const borderColor = dataset.borderColor || 
        (Array.isArray(colors) ? colors[datasetIndex] : colors) || '#3498db';
      const tension = dataset.tension || 0;
      
      // Calculate points
      const points: Array<{ x: number; y: number }> = [];
      dataset.data.forEach((dataPoint, index) => {
        const value = this.getValueFromData(dataPoint);
        const x = bounds.x + stepWidth * index;
        const y = bounds.y + bounds.height - ((value - this.minValue) / (this.maxValue - this.minValue)) * bounds.height;
        points.push({ x, y });
      });

      // Animate points based on progress
      const animatedPoints = points.map((point, index) => ({
        x: point.x,
        y: lerp(bounds.y + bounds.height, point.y, progress)
      }));

      // Draw area fill if specified
      if (dataset.fill && animatedPoints.length > 0) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.moveTo(animatedPoints[0]!.x, bounds.y + bounds.height);
        animatedPoints.forEach((point, index) => {
          if (index === 0) {
            ctx.lineTo(point.x, point.y);
          } else if (tension > 0 && index > 0) {
            // Smooth curve
            const prevPoint = animatedPoints[index - 1]!;
            const cp1x = prevPoint.x + (point.x - prevPoint.x) * tension;
            const cp1y = prevPoint.y;
            const cp2x = point.x - (point.x - prevPoint.x) * tension;
            const cp2y = point.y;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.lineTo(animatedPoints[animatedPoints.length - 1]!.x, bounds.y + bounds.height);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // Draw line
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = dataset.borderWidth || 2;
      ctx.beginPath();
      animatedPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else if (tension > 0 && index > 0) {
          // Smooth curve
          const prevPoint = animatedPoints[index - 1]!;
          const cp1x = prevPoint.x + (point.x - prevPoint.x) * tension;
          const cp1y = prevPoint.y;
          const cp2x = point.x - (point.x - prevPoint.x) * tension;
          const cp2y = point.y;
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.stroke();

      // Draw points
      ctx.fillStyle = borderColor;
      animatedPoints.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }

  destroy(): void {
    // No cleanup needed
  }
} 