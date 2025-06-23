// utils/helpers.ts
var getColorArray = (colors, length) => {
  if (Array.isArray(colors)) {
    return colors.length >= length ? colors.slice(0, length) : [...colors, ...Array(length - colors.length).fill(colors[colors.length - 1] || "#3498db")];
  }
  return Array(length).fill(colors);
};
var hexToRgba = (hex, alpha = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3])
    return `rgba(52, 152, 219, ${alpha})`;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
var clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};
var lerp = (start, end, progress) => {
  return start + (end - start) * progress;
};
var getMinMax = (data) => {
  if (data.length === 0)
    return { min: 0, max: 1 };
  const min = Math.min(...data);
  const max = Math.max(...data);
  const padding = (max - min) * 0.1;
  return {
    min: min - padding,
    max: max + padding
  };
};
var getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};
var setupHighDPICanvas = (canvas) => {
  const ctx = canvas.getContext("2d");
  if (!ctx)
    throw new Error("Could not get canvas context");
  const dpr = getDevicePixelRatio();
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  return ctx;
};
var easingFunctions = {
  linear: (t) => t,
  easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeIn: (t) => t * t,
  easeOut: (t) => t * (2 - t)
};
var defaultColors = [
  "#3498db",
  "#e74c3c",
  "#2ecc71",
  "#f39c12",
  "#9b59b6",
  "#1abc9c",
  "#34495e",
  "#e67e22",
  "#95a5a6",
  "#d35400"
];

// charts/BarChart.ts
var BarChart = class {
  constructor(config) {
    this.minValue = 0;
    this.maxValue = 0;
    this.config = config;
    this.calculateMinMax();
  }
  calculateMinMax() {
    const allData = [];
    this.config.data.datasets.forEach((dataset) => {
      if (Array.isArray(dataset.data)) {
        dataset.data.forEach((value) => {
          if (typeof value === "number") {
            allData.push(value);
          } else if (typeof value === "object" && "y" in value) {
            allData.push(value.y);
          }
        });
      }
    });
    const { min, max } = getMinMax(allData);
    this.minValue = Math.min(0, min);
    this.maxValue = max;
  }
  getValueFromData(data) {
    return typeof data === "number" ? data : data.y;
  }
  render(ctx, bounds, progress) {
    if (!this.config.data.datasets.length)
      return;
    const scalesOptions = this.config.options?.scales;
    const legendHeight = this.config.options?.legend?.display ? 50 : 0;
    const chartBounds = {
      x: bounds.x + 50,
      // Space for Y axis labels
      y: bounds.y + legendHeight + 10,
      width: bounds.width - 80,
      // Space for Y axis labels and padding
      height: bounds.height - legendHeight - 50
      // Space for X axis labels
    };
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }
    if (scalesOptions?.x?.grid?.display || scalesOptions?.y?.grid?.display) {
      this.renderGrid(ctx, chartBounds);
    }
    this.renderAxes(ctx, chartBounds);
    this.renderBars(ctx, chartBounds, progress);
  }
  renderLegend(ctx, bounds) {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display)
      return;
    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    let x = bounds.x + 20;
    const y = bounds.y + 15;
    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || "Arial"}`;
    ctx.fillStyle = legendOptions.labels?.color || "#333";
    this.config.data.datasets.forEach((dataset, index) => {
      const backgroundColor = typeof dataset.backgroundColor === "string" ? dataset.backgroundColor : Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = backgroundColor || "#3498db";
      ctx.fillRect(x, y + 8, 18, 12);
      ctx.fillStyle = legendOptions.labels?.color || "#333";
      ctx.fillText(dataset.label || `Dataset ${index + 1}`, x + 28, y + 17);
      const textWidth = ctx.measureText(dataset.label || `Dataset ${index + 1}`).width;
      x += textWidth + 70;
    });
  }
  renderGrid(ctx, bounds) {
    const scalesOptions = this.config.options?.scales;
    ctx.strokeStyle = scalesOptions?.y?.grid?.color || "rgba(0,0,0,0.1)";
    ctx.lineWidth = scalesOptions?.y?.grid?.lineWidth || 1;
    if (scalesOptions?.y?.grid?.display) {
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const y = bounds.y + bounds.height / gridLines * i;
        ctx.beginPath();
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.width, y);
        ctx.stroke();
      }
    }
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
  renderAxes(ctx, bounds) {
    const scalesOptions = this.config.options?.scales;
    if (scalesOptions?.y?.display) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y);
      ctx.lineTo(bounds.x, bounds.y + bounds.height);
      ctx.stroke();
      if (scalesOptions.y.ticks?.display) {
        ctx.fillStyle = scalesOptions.y.ticks.color || "#666";
        ctx.font = `${scalesOptions.y.ticks.font?.size || 10}px ${scalesOptions.y.ticks.font?.family || "Arial"}`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const value = this.minValue + (this.maxValue - this.minValue) * (1 - i / gridLines);
          const y = bounds.y + bounds.height / gridLines * i;
          ctx.fillText(value.toFixed(1), bounds.x - 5, y);
        }
      }
    }
    if (scalesOptions?.x?.display) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y + bounds.height);
      ctx.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
      ctx.stroke();
      if (scalesOptions.x.ticks?.display && this.config.data.labels) {
        ctx.fillStyle = scalesOptions.x.ticks.color || "#666";
        ctx.font = `${scalesOptions.x.ticks.font?.size || 10}px ${scalesOptions.x.ticks.font?.family || "Arial"}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const stepWidth = bounds.width / this.config.data.labels.length;
        this.config.data.labels.forEach((label, index) => {
          const x = bounds.x + stepWidth * (index + 0.5);
          ctx.fillText(label, x, bounds.y + bounds.height + 5);
        });
      }
    }
  }
  renderBars(ctx, bounds, progress) {
    if (!this.config.data.labels)
      return;
    const barWidth = bounds.width / this.config.data.labels.length;
    const datasetCount = this.config.data.datasets.length;
    const barGroupWidth = barWidth * 0.8;
    const individualBarWidth = barGroupWidth / datasetCount;
    const colors = getColorArray(defaultColors, datasetCount);
    this.config.data.datasets.forEach((dataset, datasetIndex) => {
      const color = typeof dataset.backgroundColor === "string" ? dataset.backgroundColor : Array.isArray(colors) ? colors[datasetIndex] : colors;
      ctx.fillStyle = color || "#3498db";
      dataset.data.forEach((dataPoint, index) => {
        const value = this.getValueFromData(dataPoint);
        const animatedValue = lerp(0, value, progress);
        const zeroY = bounds.y + bounds.height - (0 - this.minValue) / (this.maxValue - this.minValue) * bounds.height;
        const valueY = bounds.y + bounds.height - (animatedValue - this.minValue) / (this.maxValue - this.minValue) * bounds.height;
        const barHeight = zeroY - valueY;
        const groupX = bounds.x + index * barWidth + (barWidth - barGroupWidth) / 2;
        const barX = groupX + datasetIndex * individualBarWidth;
        if (barHeight > 0) {
          ctx.fillRect(barX, valueY, individualBarWidth - 1, barHeight);
        } else {
          ctx.fillRect(barX, zeroY, individualBarWidth - 1, Math.abs(barHeight));
        }
        if (dataset.borderColor && dataset.borderWidth) {
          ctx.strokeStyle = dataset.borderColor;
          ctx.lineWidth = dataset.borderWidth;
          ctx.strokeRect(barX, valueY, individualBarWidth - 1, barHeight);
        }
      });
    });
  }
  destroy() {
  }
};

// charts/LineChart.ts
var LineChart = class {
  constructor(config) {
    this.minValue = 0;
    this.maxValue = 0;
    this.config = config;
    this.calculateMinMax();
  }
  calculateMinMax() {
    const allData = [];
    this.config.data.datasets.forEach((dataset) => {
      if (Array.isArray(dataset.data)) {
        dataset.data.forEach((value) => {
          if (typeof value === "number") {
            allData.push(value);
          } else if (typeof value === "object" && "y" in value) {
            allData.push(value.y);
          }
        });
      }
    });
    const { min, max } = getMinMax(allData);
    this.minValue = min;
    this.maxValue = max;
  }
  getValueFromData(data) {
    return typeof data === "number" ? data : data.y;
  }
  render(ctx, bounds, progress) {
    if (!this.config.data.datasets.length)
      return;
    const legendHeight = this.config.options?.legend?.display ? 50 : 0;
    const chartBounds = {
      x: bounds.x + 50,
      y: bounds.y + legendHeight + 10,
      width: bounds.width - 80,
      height: bounds.height - legendHeight - 50
    };
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }
    this.renderGrid(ctx, chartBounds);
    this.renderAxes(ctx, chartBounds);
    this.renderLines(ctx, chartBounds, progress);
  }
  renderLegend(ctx, bounds) {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display)
      return;
    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    let x = bounds.x + 20;
    const y = bounds.y + 15;
    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || "Arial"}`;
    this.config.data.datasets.forEach((dataset, index) => {
      const color = dataset.borderColor || (Array.isArray(colors) ? colors[index] : colors) || "#3498db";
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y + 12);
      ctx.lineTo(x + 20, y + 12);
      ctx.stroke();
      ctx.fillStyle = legendOptions.labels?.color || "#333";
      ctx.fillText(dataset.label || `Dataset ${index + 1}`, x + 30, y + 17);
      const textWidth = ctx.measureText(dataset.label || `Dataset ${index + 1}`).width;
      x += textWidth + 70;
    });
  }
  renderGrid(ctx, bounds) {
    const scalesOptions = this.config.options?.scales;
    ctx.strokeStyle = scalesOptions?.y?.grid?.color || "rgba(0,0,0,0.1)";
    ctx.lineWidth = scalesOptions?.y?.grid?.lineWidth || 1;
    if (scalesOptions?.y?.grid?.display) {
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const y = bounds.y + bounds.height / gridLines * i;
        ctx.beginPath();
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.width, y);
        ctx.stroke();
      }
    }
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
  renderAxes(ctx, bounds) {
    const scalesOptions = this.config.options?.scales;
    if (scalesOptions?.y?.display) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y);
      ctx.lineTo(bounds.x, bounds.y + bounds.height);
      ctx.stroke();
      if (scalesOptions.y.ticks?.display) {
        ctx.fillStyle = scalesOptions.y.ticks.color || "#666";
        ctx.font = `${scalesOptions.y.ticks.font?.size || 10}px ${scalesOptions.y.ticks.font?.family || "Arial"}`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const value = this.minValue + (this.maxValue - this.minValue) * (1 - i / gridLines);
          const y = bounds.y + bounds.height / gridLines * i;
          ctx.fillText(value.toFixed(1), bounds.x - 5, y);
        }
      }
    }
    if (scalesOptions?.x?.display) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y + bounds.height);
      ctx.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
      ctx.stroke();
      if (scalesOptions.x.ticks?.display && this.config.data.labels) {
        ctx.fillStyle = scalesOptions.x.ticks.color || "#666";
        ctx.font = `${scalesOptions.x.ticks.font?.size || 10}px ${scalesOptions.x.ticks.font?.family || "Arial"}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const stepWidth = bounds.width / (this.config.data.labels.length - 1);
        this.config.data.labels.forEach((label, index) => {
          const x = bounds.x + stepWidth * index;
          ctx.fillText(label, x, bounds.y + bounds.height + 5);
        });
      }
    }
  }
  renderLines(ctx, bounds, progress) {
    if (!this.config.data.labels)
      return;
    const stepWidth = bounds.width / (this.config.data.labels.length - 1);
    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    this.config.data.datasets.forEach((dataset, datasetIndex) => {
      const borderColor = dataset.borderColor || (Array.isArray(colors) ? colors[datasetIndex] : colors) || "#3498db";
      const tension = dataset.tension || 0;
      const points = [];
      dataset.data.forEach((dataPoint, index) => {
        const value = this.getValueFromData(dataPoint);
        const x = bounds.x + stepWidth * index;
        const y = bounds.y + bounds.height - (value - this.minValue) / (this.maxValue - this.minValue) * bounds.height;
        points.push({ x, y });
      });
      const animatedPoints = points.map((point, index) => ({
        x: point.x,
        y: lerp(bounds.y + bounds.height, point.y, progress)
      }));
      if (dataset.fill && animatedPoints.length > 0) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = borderColor;
        ctx.beginPath();
        ctx.moveTo(animatedPoints[0].x, bounds.y + bounds.height);
        animatedPoints.forEach((point, index) => {
          if (index === 0) {
            ctx.lineTo(point.x, point.y);
          } else if (tension > 0 && index > 0) {
            const prevPoint = animatedPoints[index - 1];
            const cp1x = prevPoint.x + (point.x - prevPoint.x) * tension;
            const cp1y = prevPoint.y;
            const cp2x = point.x - (point.x - prevPoint.x) * tension;
            const cp2y = point.y;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.lineTo(animatedPoints[animatedPoints.length - 1].x, bounds.y + bounds.height);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = dataset.borderWidth || 2;
      ctx.beginPath();
      animatedPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else if (tension > 0 && index > 0) {
          const prevPoint = animatedPoints[index - 1];
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
      ctx.fillStyle = borderColor;
      animatedPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }
  destroy() {
  }
};

// charts/PieChart.ts
var PieChart = class {
  constructor(config) {
    this.config = config;
  }
  render(ctx, bounds, progress) {
    if (!this.config.data.datasets.length)
      return;
    const legendHeight = this.config.options?.legend?.display ? 60 : 0;
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + legendHeight + 20 + (bounds.height - legendHeight - 40) / 2;
    const radius = Math.min(bounds.width, bounds.height - legendHeight - 40) / 2 - 20;
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }
    this.renderSlices(ctx, centerX, centerY, radius, progress);
  }
  renderLegend(ctx, bounds) {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display || !this.config.data.labels)
      return;
    const dataset = this.config.data.datasets[0];
    if (!dataset)
      return;
    const colors = getColorArray(dataset.backgroundColor || defaultColors, this.config.data.labels.length);
    const availableWidth = bounds.width - 40;
    const itemsPerRow = Math.min(4, this.config.data.labels.length);
    const itemWidth = availableWidth / itemsPerRow;
    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || "Arial"}`;
    this.config.data.labels.forEach((label, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const x = bounds.x + 20 + col * itemWidth;
      const y = bounds.y + 20 + row * 30;
      const color = Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = color || "#3498db";
      ctx.fillRect(x, y - 6, 18, 12);
      ctx.fillStyle = legendOptions.labels?.color || "#333";
      ctx.textAlign = "left";
      ctx.fillText(label, x + 25, y + 1);
    });
  }
  renderSlices(ctx, centerX, centerY, radius, progress) {
    if (!this.config.data.datasets[0] || !this.config.data.labels)
      return;
    const dataset = this.config.data.datasets[0];
    const data = dataset.data;
    const total = data.reduce((sum, value) => sum + value, 0);
    const colors = getColorArray(dataset.backgroundColor || defaultColors, data.length);
    let currentAngle = -Math.PI / 2;
    data.forEach((value, index) => {
      const sliceAngle = value / total * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle * progress;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
      ctx.closePath();
      const color = Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = color || "#3498db";
      ctx.fill();
      if (dataset.borderColor && dataset.borderWidth) {
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = dataset.borderWidth;
        ctx.stroke();
      }
      if (progress > 0.8 && this.config.data.labels && this.config.data.labels[index]) {
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const labelX = centerX + Math.cos(labelAngle) * labelRadius;
        const labelY = centerY + Math.sin(labelAngle) * labelRadius;
        ctx.fillStyle = "#333";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.config.data.labels[index], labelX, labelY);
      }
      currentAngle += sliceAngle;
    });
  }
  destroy() {
  }
};

// charts/DoughnutChart.ts
var DoughnutChart = class {
  constructor(config) {
    this.config = config;
  }
  render(ctx, bounds, progress) {
    if (!this.config.data.datasets.length)
      return;
    const legendHeight = this.config.options?.legend?.display ? 60 : 0;
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + legendHeight + 20 + (bounds.height - legendHeight - 40) / 2;
    const outerRadius = Math.min(bounds.width, bounds.height - legendHeight - 40) / 2 - 20;
    const innerRadius = outerRadius * 0.6;
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }
    this.renderSlices(ctx, centerX, centerY, outerRadius, innerRadius, progress);
  }
  renderLegend(ctx, bounds) {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display || !this.config.data.labels)
      return;
    const dataset = this.config.data.datasets[0];
    if (!dataset)
      return;
    const colors = getColorArray(dataset.backgroundColor || defaultColors, this.config.data.labels.length);
    const availableWidth = bounds.width - 40;
    const itemsPerRow = Math.min(4, this.config.data.labels.length);
    const itemWidth = availableWidth / itemsPerRow;
    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || "Arial"}`;
    this.config.data.labels.forEach((label, index) => {
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      const x = bounds.x + 20 + col * itemWidth;
      const y = bounds.y + 20 + row * 30;
      const color = Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = color || "#3498db";
      ctx.fillRect(x, y - 6, 18, 12);
      ctx.fillStyle = legendOptions.labels?.color || "#333";
      ctx.textAlign = "left";
      ctx.fillText(label, x + 25, y + 1);
    });
  }
  renderSlices(ctx, centerX, centerY, outerRadius, innerRadius, progress) {
    if (!this.config.data.datasets[0] || !this.config.data.labels)
      return;
    const dataset = this.config.data.datasets[0];
    const data = dataset.data;
    const total = data.reduce((sum, value) => sum + value, 0);
    const colors = getColorArray(dataset.backgroundColor || defaultColors, data.length);
    let currentAngle = -Math.PI / 2;
    data.forEach((value, index) => {
      const sliceAngle = value / total * 2 * Math.PI;
      const endAngle = currentAngle + sliceAngle * progress;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, currentAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, currentAngle, true);
      ctx.closePath();
      const color = Array.isArray(colors) ? colors[index] : colors;
      ctx.fillStyle = color || "#3498db";
      ctx.fill();
      if (dataset.borderColor && dataset.borderWidth) {
        ctx.strokeStyle = dataset.borderColor;
        ctx.lineWidth = dataset.borderWidth;
        ctx.stroke();
      }
      currentAngle += sliceAngle;
    });
  }
  destroy() {
  }
};

// charts/AreaChart.ts
var AreaChart = class {
  constructor(config) {
    const areaConfig = {
      ...config,
      data: {
        ...config.data,
        datasets: config.data.datasets.map((dataset) => ({
          ...dataset,
          fill: true
        }))
      }
    };
    this.lineChart = new LineChart(areaConfig);
  }
  render(ctx, bounds, progress) {
    this.lineChart.render(ctx, bounds, progress);
  }
  destroy() {
    this.lineChart.destroy();
  }
};

// charts/ScatterChart.ts
var ScatterChart = class {
  constructor(config) {
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.config = config;
    this.calculateMinMax();
  }
  calculateMinMax() {
    const allXData = [];
    const allYData = [];
    this.config.data.datasets.forEach((dataset) => {
      if (Array.isArray(dataset.data)) {
        dataset.data.forEach((value) => {
          if (typeof value === "object" && "x" in value && "y" in value) {
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
  render(ctx, bounds, progress) {
    if (!this.config.data.datasets.length)
      return;
    const legendHeight = this.config.options?.legend?.display ? 50 : 0;
    const chartBounds = {
      x: bounds.x + 50,
      y: bounds.y + legendHeight + 10,
      width: bounds.width - 80,
      height: bounds.height - legendHeight - 50
    };
    if (this.config.options?.legend?.display) {
      this.renderLegend(ctx, bounds);
    }
    this.renderGrid(ctx, chartBounds);
    this.renderAxes(ctx, chartBounds);
    this.renderPoints(ctx, chartBounds, progress);
  }
  renderLegend(ctx, bounds) {
    const legendOptions = this.config.options?.legend;
    if (!legendOptions?.display)
      return;
    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    let x = bounds.x + 20;
    const y = bounds.y + 15;
    ctx.font = `${legendOptions.labels?.font?.size || 12}px ${legendOptions.labels?.font?.family || "Arial"}`;
    this.config.data.datasets.forEach((dataset, index) => {
      const color = dataset.backgroundColor || (Array.isArray(colors) ? colors[index] : colors) || "#3498db";
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + 10, y + 14, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = legendOptions.labels?.color || "#333";
      ctx.fillText(dataset.label || `Dataset ${index + 1}`, x + 25, y + 17);
      const textWidth = ctx.measureText(dataset.label || `Dataset ${index + 1}`).width;
      x += textWidth + 70;
    });
  }
  renderGrid(ctx, bounds) {
    const scalesOptions = this.config.options?.scales;
    ctx.strokeStyle = scalesOptions?.y?.grid?.color || "rgba(0,0,0,0.1)";
    ctx.lineWidth = scalesOptions?.y?.grid?.lineWidth || 1;
    if (scalesOptions?.y?.grid?.display) {
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const y = bounds.y + bounds.height / gridLines * i;
        ctx.beginPath();
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.width, y);
        ctx.stroke();
      }
    }
    if (scalesOptions?.x?.grid?.display) {
      const gridLines = 5;
      for (let i = 0; i <= gridLines; i++) {
        const x = bounds.x + bounds.width / gridLines * i;
        ctx.beginPath();
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.height);
        ctx.stroke();
      }
    }
  }
  renderAxes(ctx, bounds) {
    const scalesOptions = this.config.options?.scales;
    if (scalesOptions?.y?.display) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y);
      ctx.lineTo(bounds.x, bounds.y + bounds.height);
      ctx.stroke();
      if (scalesOptions.y.ticks?.display) {
        ctx.fillStyle = scalesOptions.y.ticks.color || "#666";
        ctx.font = `${scalesOptions.y.ticks.font?.size || 10}px ${scalesOptions.y.ticks.font?.family || "Arial"}`;
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const value = this.minY + (this.maxY - this.minY) * (1 - i / gridLines);
          const y = bounds.y + bounds.height / gridLines * i;
          ctx.fillText(value.toFixed(1), bounds.x - 5, y);
        }
      }
    }
    if (scalesOptions?.x?.display) {
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bounds.x, bounds.y + bounds.height);
      ctx.lineTo(bounds.x + bounds.width, bounds.y + bounds.height);
      ctx.stroke();
      if (scalesOptions.x.ticks?.display) {
        ctx.fillStyle = scalesOptions.x.ticks.color || "#666";
        ctx.font = `${scalesOptions.x.ticks.font?.size || 10}px ${scalesOptions.x.ticks.font?.family || "Arial"}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const gridLines = 5;
        for (let i = 0; i <= gridLines; i++) {
          const value = this.minX + (this.maxX - this.minX) * (i / gridLines);
          const x = bounds.x + bounds.width / gridLines * i;
          ctx.fillText(value.toFixed(1), x, bounds.y + bounds.height + 5);
        }
      }
    }
  }
  renderPoints(ctx, bounds, progress) {
    const colors = getColorArray(defaultColors, this.config.data.datasets.length);
    this.config.data.datasets.forEach((dataset, datasetIndex) => {
      const color = dataset.backgroundColor || (Array.isArray(colors) ? colors[datasetIndex] : colors) || "#3498db";
      ctx.fillStyle = color;
      dataset.data.forEach((dataPoint) => {
        if (typeof dataPoint === "object" && "x" in dataPoint && "y" in dataPoint) {
          const point = dataPoint;
          const x = bounds.x + (point.x - this.minX) / (this.maxX - this.minX) * bounds.width;
          const y = bounds.y + bounds.height - (point.y - this.minY) / (this.maxY - this.minY) * bounds.height;
          const radius = lerp(0, 4, progress);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
          if (dataset.borderColor && dataset.borderWidth) {
            ctx.strokeStyle = dataset.borderColor;
            ctx.lineWidth = dataset.borderWidth;
            ctx.stroke();
          }
        }
      });
    });
  }
  destroy() {
  }
};

// core/TinyChart.ts
var Chartie = class {
  constructor(canvasOrId, config) {
    this.chartInstance = null;
    this.animationId = null;
    this.startTime = 0;
    this.isAnimating = false;
    if (typeof canvasOrId === "string") {
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
  mergeDefaultOptions(config) {
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      backgroundColor: "#ffffff",
      animation: {
        duration: 800,
        easing: "easeInOut"
      },
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#333333",
          font: {
            size: 12,
            family: "Arial, sans-serif"
          }
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1
      },
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    };
    if (["bar", "line", "area", "scatter"].includes(config.type)) {
      defaultOptions.scales = {
        x: {
          display: true,
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)",
            lineWidth: 1
          },
          ticks: {
            display: true,
            color: "#666666",
            font: {
              size: 10,
              family: "Arial, sans-serif"
            }
          }
        },
        y: {
          display: true,
          grid: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)",
            lineWidth: 1
          },
          ticks: {
            display: true,
            color: "#666666",
            font: {
              size: 10,
              family: "Arial, sans-serif"
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
  createChartInstance() {
    const chartMap = {
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
  setupResizeListener() {
    if (!this.config.options?.responsive)
      return;
    const resizeObserver = new ResizeObserver(() => {
      this.ctx = setupHighDPICanvas(this.canvas);
      this.render();
    });
    resizeObserver.observe(this.canvas);
  }
  getChartBounds() {
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
  render() {
    if (!this.chartInstance)
      return;
    const animationOptions = this.config.options?.animation;
    if (animationOptions?.duration && animationOptions.duration > 0) {
      this.startAnimation();
    } else {
      this.renderFrame(1);
    }
  }
  startAnimation() {
    if (this.isAnimating) {
      this.stopAnimation();
    }
    this.isAnimating = true;
    this.startTime = performance.now();
    this.animateFrame();
  }
  animateFrame() {
    if (!this.isAnimating)
      return;
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    const duration = this.config.options?.animation?.duration || 800;
    const progress = Math.min(elapsed / duration, 1);
    const easingType = this.config.options?.animation?.easing || "easeInOut";
    const easedProgress = easingFunctions[easingType](progress);
    this.renderFrame(easedProgress);
    if (progress < 1) {
      this.animationId = requestAnimationFrame(() => this.animateFrame());
    } else {
      this.isAnimating = false;
    }
  }
  renderFrame(progress) {
    if (!this.chartInstance)
      return;
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    const backgroundColor = this.config.options?.backgroundColor;
    if (backgroundColor) {
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    }
    const bounds = this.getChartBounds();
    this.chartInstance.render(this.ctx, bounds, progress);
  }
  stopAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isAnimating = false;
  }
  update(config) {
    this.config = this.mergeDefaultOptions({
      ...this.config,
      ...config
    });
    this.createChartInstance();
    this.render();
  }
  destroy() {
    this.stopAnimation();
    this.chartInstance?.destroy();
    this.chartInstance = null;
  }
};

// index.ts
var version = "0.1.0";
export {
  Chartie,
  clamp,
  defaultColors,
  easingFunctions,
  getColorArray,
  getMinMax,
  hexToRgba,
  lerp,
  version
};
