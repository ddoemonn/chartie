// Main export
export { Chartie } from './core/TinyChart';

// Types
export type {
  ChartType,
  ChartConfig,
  ChartOptions,
  Dataset,
  DataPoint,
  Color,
  AxisConfig,
  ChartBounds,
  AnimationFrame
} from './types';

// Utility functions that might be useful for external use
export {
  getColorArray,
  hexToRgba,
  clamp,
  lerp,
  getMinMax,
  defaultColors,
  easingFunctions
} from './utils/helpers';

// Version
export const version = '0.1.0'; 