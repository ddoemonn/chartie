'use client';

import { useState } from 'react';
import ChartieComponent from '@/components/ChartieComponent';
import CodeHighlighter from '@/components/CodeHighlighter';
import type { ChartConfig } from 'chartie';

// Chart configurations for all types
const barChartConfig: ChartConfig = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [120, 190, 300, 500, 200, 300],
      backgroundColor: '#6366f1',
      borderColor: '#4f46e5',
      borderWidth: 1
    }, {
      label: 'Profit',
      data: [80, 120, 200, 350, 150, 220],
      backgroundColor: '#06b6d4',
      borderColor: '#0891b2',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 1200, easing: 'easeInOut' }
  }
};

const lineChartConfig: ChartConfig = {
  type: 'line',
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [{
      label: 'Active Users',
      data: [1200, 1900, 3000, 5000, 2000, 3000],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 3,
      fill: false,
      tension: 0.4
    }, {
      label: 'New Signups',
      data: [800, 1200, 2000, 3500, 1500, 2200],
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderWidth: 3,
      fill: false,
      tension: 0.4
    }]
  },
  options: {
    responsive: true,
    animation: { duration: 1000, easing: 'easeInOut' }
  }
};

const pieChartConfig: ChartConfig = {
  type: 'pie',
  data: {
    labels: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js'],
    datasets: [{
      data: [35, 25, 20, 12, 8],
      backgroundColor: [
        '#6366f1', // Indigo
        '#10b981', // Emerald  
        '#f59e0b', // Amber
        '#ef4444', // Red
        '#8b5cf6'  // Violet
      ]
    }]
  },
  options: {
    animation: { duration: 1500, easing: 'easeInOut' }
  }
};

const doughnutChartConfig: ChartConfig = {
  type: 'doughnut',
  data: {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [{
      data: [60, 35, 5],
      backgroundColor: ['#06b6d4', '#10b981', '#f59e0b']
    }]
  },
  options: {
    animation: { duration: 1300, easing: 'easeInOut' }
  }
};

const areaChartConfig: ChartConfig = {
  type: 'area',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [{
      label: 'Sales Growth',
      data: [100, 150, 300, 250],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 2,
      tension: 0.3
    }]
  },
  options: {
    animation: { duration: 1100, easing: 'easeInOut' }
  }
};

const scatterChartConfig: ChartConfig = {
  type: 'scatter',
  data: {
    datasets: [{
      label: 'Dataset 1',
      data: [
        { x: 10, y: 20 },
        { x: 15, y: 25 },
        { x: 20, y: 22 },
        { x: 25, y: 28 },
        { x: 30, y: 35 },
        { x: 35, y: 32 }
      ],
      backgroundColor: '#ef4444'
    }, {
      label: 'Dataset 2',
      data: [
        { x: 12, y: 15 },
        { x: 18, y: 20 },
        { x: 22, y: 18 },
        { x: 28, y: 25 },
        { x: 32, y: 30 },
        { x: 38, y: 28 }
      ],
      backgroundColor: '#06b6d4'
    }]
  },
  options: {
    animation: { duration: 900, easing: 'easeInOut' }
  }
};

const chartTabs = [
  { id: 'bar', label: 'Bar Chart', config: barChartConfig },
  { id: 'line', label: 'Line Chart', config: lineChartConfig },
  { id: 'pie', label: 'Pie Chart', config: pieChartConfig },
  { id: 'doughnut', label: 'Doughnut Chart', config: doughnutChartConfig },
  { id: 'area', label: 'Area Chart', config: areaChartConfig },
  { id: 'scatter', label: 'Scatter Chart', config: scatterChartConfig }
];

const installCode = `npm install chartie`;

const basicUsageCode = `import { Chartie } from 'chartie';

const config = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales',
      data: [12, 19, 3],
      backgroundColor: '#6366f1'
    }]
  }
};

const chart = new Chartie('myCanvas', config);`;

const reactUsageCode = `import { Chartie } from 'chartie';
import { useEffect, useRef } from 'react';

function MyChart({ config }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const chart = new Chartie(canvasRef.current, config);
    return () => chart.destroy();
  }, [config]);
  
  return <canvas ref={canvasRef} width={400} height={300} />;
}`;

export default function Home() {
  const [activeTab, setActiveTab] = useState('bar');
  const activeChart = chartTabs.find(tab => tab.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Chartie</h1>
          <p className="text-xl text-gray-600 mb-4">Ultra-lightweight canvas charting library</p>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            The modern Chart.js alternative • Under 10kb • Zero dependencies • Pure Canvas API
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['< 10kb', 'TypeScript', 'Zero Deps', '6 Chart Types'].map((badge, i) => (
              <span key={i} className="px-3 py-1 bg-gray-900 text-white rounded text-sm font-medium">
                {badge}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800 transition-colors">
              Get Started
            </button>
            <button className="px-6 py-3 bg-white text-gray-700 font-medium rounded border border-gray-300 hover:bg-gray-50 transition-colors">
              View on GitHub
            </button>
          </div>
        </header>

        {/* Installation */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Installation</h2>
          <div className="max-w-xl mx-auto">
            <CodeHighlighter code={installCode} language="bash" />
          </div>
        </section>

        {/* Basic Usage */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Usage</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vanilla JavaScript</h3>
              <CodeHighlighter code={basicUsageCode} language="javascript" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">React</h3>
              <CodeHighlighter code={reactUsageCode} language="javascript" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '6 Chart Types', desc: 'Bar, Line, Pie, Doughnut, Area, and Scatter charts' },
              { title: 'Ultra Light', desc: 'Under 10kb bundle size with zero dependencies' },
              { title: 'High Performance', desc: 'Pure Canvas API for optimal rendering speed' },
              { title: 'Smooth Animations', desc: 'Beautiful animations with multiple easing functions' },
              { title: 'Responsive Design', desc: 'Built-in responsive and retina display support' },
              { title: 'TypeScript First', desc: 'Full TypeScript support with complete type definitions' }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Chart Examples with Tabs */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Chart Types</h2>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-8 bg-white rounded-lg border border-gray-200 p-2 max-w-4xl mx-auto">
            {chartTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors m-1 ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Chart Display */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">{activeChart.label}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex justify-center">
                <ChartieComponent config={activeChart.config} width={400} height={300} />
              </div>
              <div className="lg:pl-4">
                <h4 className="text-lg font-medium text-gray-800 mb-3">Configuration</h4>
                <CodeHighlighter 
                  code={JSON.stringify(activeChart.config, null, 2)} 
                  language="javascript" 
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-500">Built with ❤️ for the developer community</p>
          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-400">
            <span>MIT License</span>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <span>TypeScript</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
