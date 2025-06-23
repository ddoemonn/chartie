import type { ChartConfig, ChartBounds } from '../types';
import type { ChartInstance } from '../core/TinyChart';
import { getColorArray, defaultColors, degToRad, lerp } from '../utils/helpers';

export class PieChart implements ChartInstance {
  private config: ChartConfig;

  constructor(config: ChartConfig) {
    this.config = config;
  }

  render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void {
    if (!this.config.data.datasets.length) return;

    const legendHeight = this.config.options?.legend?.display ? 60 : 0;
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + legendHeight + 20 + (bounds.height - legendHeight - 40) / 2;
    const radius = Math.min(bounds.width, bounds.height - legendHeight - 40) / 2 - 20;

    // Render legend
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }

    // Render pie slices
    this.renderSlices(ctx, centerX, centerY, radius, progress);
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

  private renderSlices(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, progress: number): void {
    if (!this.config.data.datasets[0] || !this.config.data.labels) return;

    const dataset = this.config.data.datasets[0];
    const data = dataset.data as number[];
    const total = data.reduce((sum, value) => sum + value, 0);
    const colors = getColorArray(dataset.backgroundColor || defaultColors, data.length);

    let currentAngle = -Math.PI / 2; // Start from top

    data.forEach((value, index) => {
      const sliceAngle = (value / total) * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle * progress;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
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

       // Draw label if progress is complete
       if (progress > 0.8 && this.config.data.labels && this.config.data.labels[index]) {
         const labelAngle = currentAngle + sliceAngle / 2;
         const labelRadius = radius * 0.7;
         const labelX = centerX + Math.cos(labelAngle) * labelRadius;
         const labelY = centerY + Math.sin(labelAngle) * labelRadius;

         ctx.fillStyle = '#333';
         ctx.font = '12px Arial';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         ctx.fillText(this.config.data.labels[index], labelX, labelY);
       }

      

      currentAngle += sliceAngle;
    });
  }

  destroy(): void {
    // No cleanup needed
  }
} 