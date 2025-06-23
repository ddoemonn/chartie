import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
import { getColorArray, defaultColors } from '../utils/helpers';

export class DoughnutChart implements ChartInstance {
  private config: ChartConfig;

  constructor(config: ChartConfig) {
    this.config = config;
  }

  render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    if (!this.config.data.datasets.length) return;

    const legendHeight = this.config.options?.legend?.display ? 60 : 0;
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + legendHeight + 20 + (bounds.height - legendHeight - 40) / 2;
    const outerRadius = Math.min(bounds.width, bounds.height - legendHeight - 40) / 2 - 20;
    const innerRadius = outerRadius * 0.6; // 60% inner radius for doughnut

    // Render legend
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }

    // Render doughnut slices
    this.renderSlices(ctx, centerX, centerY, outerRadius, innerRadius, progress);
  }

  private renderLegend(ctx: CanvasRenderingContext2D, bounds: ChartBounds): void {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display || !this.config.data.labels) return;

    const dataset = this.config.data.datasets[0];
    if (!dataset) return;

    // Use the same color source as the slices to ensure consistency
    const colors = getColorArray(dataset.backgroundColor || defaultColors, this.config.data.labels.length);
    const availableWidth = bounds.width - 40; // Leave padding on sides
    const itemsPerRow = Math.min(4, this.config.data.labels.length); // Max 4 items per row
    const itemWidth = availableWidth / itemsPerRow;

    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || 'Arial'}`;

    this.config.data.labels.forEach((label, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const x = bounds.x + 20 + col * itemWidth; // Start with left padding
      const y = bounds.y + 20 + row * 30; // Better vertical spacing

      // Color box with better size and positioning - use same color as slice
      const color = Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = color || '#3498db';
      ctx.fillRect(x, y - 6, 18, 12); // Better positioned box

      // Label with better spacing
      ctx.fillStyle = legendOptions.labels?.color || '#333';
      ctx.textAlign = 'left';
      ctx.fillText(label, x + 25, y + 1);
    });
  }

  private renderSlices(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, outerRadius: number, innerRadius: number, progress: number): void {
    if (!this.config.data.datasets[0] || !this.config.data.labels) return;

    const dataset = this.config.data.datasets[0];
    const data = dataset.data as number[];
    const total = data.reduce((sum, value) => sum + value, 0);
    const colors = getColorArray(dataset.backgroundColor || defaultColors, data.length);

    let currentAngle = -Math.PI / 2; // Start from top

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle * progress;

      // Draw slice using path for doughnut shape
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, currentAngle, true);
      ctx.closePath();

      const color = Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = color || '#3498db';
      ctx.fill();

      // Draw border
      if (dataset.borderColor && dataset.borderWidth) {
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = dataset.borderWidth;
        ctx.stroke();
      }

      currentAngle += sliceAngle;
    });
  }

  destroy(): void {
    // No cleanup needed
  }
} 