# Chartie

Ultra-lightweight canvas-based charting library under 10kb.

## Installation

```bash
npm install chartie
```

## Quick Start

### JavaScript

```javascript
import { Chartie } from 'chartie';

const chart = new Chartie('canvas-id', {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3, 5],
      backgroundColor: '#3b82f6'
    }]
  }
});
```

### React

```jsx
import { useEffect, useRef } from 'react';
import { Chartie } from 'chartie';

function Chart() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chart = new Chartie(canvasRef.current, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu'],
        datasets: [{
          label: 'Revenue',
          data: [65, 59, 80, 81],
          borderColor: '#ef4444',
          fill: true
        }]
      }
    });

    return () => chart.destroy();
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
```

## Chart Types

| Type | Description |
|------|-------------|
| `bar` | Vertical bar chart |
| `line` | Line chart with optional fill |
| `area` | Filled line chart |
| `pie` | Pie chart |
| `doughnut` | Doughnut chart |
| `scatter` | Scatter plot |

## Configuration

```javascript
const config = {
  type: 'line',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Revenue',
      data: [100, 120, 115, 134],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true
    }]
  },
  options: {
    legend: {
      display: true
    },
    scales: {
      y: {
        display: true,
        grid: { display: true }
      }
    }
  }
};
```

## Features

- ✅ 6 chart types
- ✅ Under 10kb gzipped
- ✅ Zero dependencies
- ✅ TypeScript support
- ✅ Responsive & retina ready
- ✅ Smooth animations

## Contributing

Contributions are very welcome! We're still at the very beginning and would love your help to make Chartie even better.

- 🐛 Report bugs
- 💡 Suggest new features  
- 🔧 Submit pull requests
- 📚 Improve documentation

Check out our [GitHub repository](https://github.com/ddoemonn/chartie) to get started!

## Repository

[GitHub Repository](https://github.com/ddoemonn/chartie)

## License

MIT
