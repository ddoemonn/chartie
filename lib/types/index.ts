// Core chart types
export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter';

// Color types
export type Color = string | CanvasGradient | CanvasPattern;

// Data point types
export interface DataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface Dataset {
  label?: string;
  data: number[] | DataPoint[];
  backgroundColor?: Color | Color[];
  borderColor?: Color;
  borderWidth?: number;
  fill?: boolean;
  tension?: number; // for line charts
}

// Chart configuration
export interface ChartConfig {
  type: ChartType;
  data: {
    labels?: string[];
    datasets: Dataset[];
  };
  options?: ChartOptions;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  backgroundColor?: Color;
  
  // Animation
  animation?: {
    duration?: number;
    easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
  };
  
  // Scales (for bar, line, area, scatter charts)
  scales?: {
    x?: AxisConfig;
    y?: AxisConfig;
  };
  
  // Legend
  legend?: {
    display?: boolean;
    position?: 'top' | 'bottom' | 'left' | 'right';
    labels?: {
      color?: Color;
      font?: {
        size?: number;
        family?: string;
      };
    };
  };
  
  // Tooltip
  tooltip?: {
    enabled?: boolean;
    backgroundColor?: Color;
    titleColor?: Color;
    bodyColor?: Color;
    borderColor?: Color;
    borderWidth?: number;
  };
  
  // Padding
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export interface AxisConfig {
  display?: boolean;
  min?: number;
  max?: number;
  grid?: {
    display?: boolean;
    color?: Color;
    lineWidth?: number;
  };
  ticks?: {
    display?: boolean;
    color?: Color;
    font?: {
      size?: number;
      family?: string;
    };
  };
}

// Internal chart bounds and dimensions
export interface ChartBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Animation frame interface
export interface AnimationFrame {
  progress: number;
  currentValues: Record<string, number>;
} 