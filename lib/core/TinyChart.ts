import type { ChartConfig, ChartOptions, ChartBounds, AnimationFrame, ChartType } from '../types';
import { setupHighDPICanvas, easingFunctions } from '../utils/helpers';
import { BarChart } from '../charts/BarChart';
import { LineChart } from '../charts/LineChart';
import { PieChart } from '../charts/PieChart';
import { DoughnutChart } from '../charts/DoughnutChart';
import { AreaChart } from '../charts/AreaChart';
import { ScatterChart } from '../charts/ScatterChart';

export interface ChartInstance {
  render(ctx: CanvasRenderingContext2D, bounds: ChartBounds, progress: number): void;
  destroy(): void;
}

export class Chartie {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: ChartConfig;
  private chartInstance: ChartInstance | null = null;
  private animationId: number | null = null;
  private startTime: number = 0;
  private isAnimating: boolean = false;

  constructor(canvasOrId: string | HTMLCanvasElement, config: ChartConfig) {
    // Get canvas element
    if (typeof canvasOrId === 'string') {
      const element = document.getElementById(canvasOrId);
      if (!element || !(element instanceof HTMLCanvasElement)) {
        throw new Error(`Canvas element with id "${canvasOrId}" not found`);
      }
      this.canvas = element;
    } else {
      this.canvas = canvasOrId;
    }

    this.config = this.mergeDefaultOptions(config);
    this.ctx = setupHighDPICanvas(this.canvas);
    
    this.createChartInstance();
    this.setupResizeListener();
    this.render();
  }

  private mergeDefaultOptions(config: ChartConfig): ChartConfig {
    const defaultOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: '#ffffff',
      animation: {
        duration: 800,
        easing: 'easeInOut'
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#333333',
          font: {
            size: 12,
            family: 'Arial, sans-serif'
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1
      },
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    };

    // Chart type specific defaults
    if (['bar', 'line', 'area', 'scatter'].includes(config.type)) {
      defaultOptions.scales = {
        x: {
          display: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1
          },
          ticks: {
            display: true,
            color: '#666666',
            font: {
              size: 10,
              family: 'Arial, sans-serif'
            }
          }
        },
        y: {
          display: true,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1
          },
          ticks: {
            display: true,
            color: '#666666',
            font: {
              size: 10,
              family: 'Arial, sans-serif'
            }
          }
        }
      };
    }

    return {
      ...config,
      options: {
        ...defaultOptions,
        ...config.options
      }
    };
  }

  private createChartInstance(): void {
    const chartMap: Record<ChartType, new (config: ChartConfig) => ChartInstance> = {
      bar: BarChart,
      line: LineChart,
      pie: PieChart,
      doughnut: DoughnutChart,
      area: AreaChart,
      scatter: ScatterChart
    };

    const ChartClass = chartMap[this.config.type];
    if (!ChartClass) {
      throw new Error(`Unsupported chart type: ${this.config.type}`);
    }

    this.chartInstance = new ChartClass(this.config);
  }

  private setupResizeListener(): void {
    if (!this.config.options?.responsive) return;

    const resizeObserver = new ResizeObserver(() => {
      this.ctx = setupHighDPICanvas(this.canvas);
      this.render();
    });

    resizeObserver.observe(this.canvas);
  }

  private getChartBounds(): ChartBounds {
    const padding = this.config.options?.padding || {};
    const canvasWidth = this.canvas.clientWidth;
    const canvasHeight = this.canvas.clientHeight;

    return {
      x: padding.left || 10,
      y: padding.top || 10,
      width: canvasWidth - (padding.left || 10) - (padding.right || 10),
      height: canvasHeight - (padding.top || 10) - (padding.bottom || 10)
    };
  }

  public render(): void {
    if (!this.chartInstance) return;

    const animationOptions = this.config.options?.animation;
    if (animationOptions?.duration && animationOptions.duration > 0) {
      this.startAnimation();
    } else {
      this.renderFrame(1);
    }
  }

  private startAnimation(): void {
    if (this.isAnimating) {
      this.stopAnimation();
    }

    this.isAnimating = true;
    this.startTime = performance.now();
    this.animateFrame();
  }

  private animateFrame(): void {
    if (!this.isAnimating) return;

    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const duration = this.config.options?.animation?.duration || 800;
    const progress = Math.min(elapsed / duration, 1);

    const easingType = this.config.options?.animation?.easing || 'easeInOut';
    const easedProgress = easingFunctions[easingType](progress);

    this.renderFrame(easedProgress);

    if (progress < 1) {
      this.animationId = requestAnimationFrame(() => this.animateFrame());
    } else {
      this.isAnimating = false;
    }
  }

  private renderFrame(progress: number): void {
    if (!this.chartInstance) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    // Set background
    const backgroundColor = this.config.options?.backgroundColor;
    if (backgroundColor) {
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    }

    // Render chart
    const bounds = this.getChartBounds();
    this.chartInstance.render(this.ctx, bounds, progress);
  }

  private stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isAnimating = false;
  }

  public update(config: Partial<ChartConfig>): void {
    this.config = this.mergeDefaultOptions({
      ...this.config,
      ...config
    });

    this.createChartInstance();
    this.render();
  }

  public destroy(): void {
    this.stopAnimation();
    this.chartInstance?.destroy();
    this.chartInstance = null;
  }
} 