# 📊 Chartie

Ultra-lightweight canvas-based charting library - Chart.js alternative under 10kb

## ✨ Features

- 🎨 **6 Chart Types**: Bar, Line, Pie, Doughnut, Area, Scatter
- 🚀 **Lightweight**: Under 10kb bundle size  
- ⚡ **Performance**: Pure Canvas API, zero dependencies
- 🎭 **Animations**: Smooth animations with easing functions
- 📱 **Responsive**: Built-in responsive and retina support
- 🔧 **TypeScript**: Full TypeScript support

## 🚀 Installation

```bash
npm install chartie
```

## 📝 Quick Start

### JavaScript

```javascript
import { Chartie } from 'chartie';

const config = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3],
      backgroundColor: '#3b82f6'
    }]
  }
};

const chart = new Chartie('myCanvas', config);
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

## 📈 Chart Types

- `bar` - Vertical bar chart
- `line` - Line chart with optional fill
- `pie` - Pie chart
- `doughnut` - Doughnut chart  
- `area` - Area chart (filled line)
- `scatter` - Scatter plot

## 🤝 Contributing

Contributions are very welcome! We're still at the very beginning and would love your help to make Chartie even better.

- 🐛 Report bugs
- 💡 Suggest new features
- 🔧 Submit pull requests
- 📚 Improve documentation

## 📄 License

MIT License
