export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter';
export type Color = string | CanvasGradient | CanvasPattern;
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
    tension?: number;
}
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
    animation?: {
        duration?: number;
        easing?: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
    };
    scales?: {
        x?: AxisConfig;
        y?: AxisConfig;
    };
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
    tooltip?: {
        enabled?: boolean;
        backgroundColor?: Color;
        titleColor?: Color;
        bodyColor?: Color;
        borderColor?: Color;
        borderWidth?: number;
    };
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
export interface ChartBounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface AnimationFrame {
    progress: number;
    currentValues: Record<string, number>;
}
//# sourceMappingURL=index.d.ts.map