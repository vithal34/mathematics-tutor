import React, { useState, useMemo, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Layout, Data } from 'plotly.js';
import * as math from 'mathjs';
import { motion } from 'framer-motion';
import { MathJax } from 'better-react-mathjax';

interface MathVisualizerProps {
  concept: 'limits' | 'derivatives' | 'integration' | 'series' | 'vectors';
  onDataUpdate?: (data: any) => void;
}

const DEFAULT_RANGE = { min: -10, max: 10, steps: 1000 };
const ANIMATION_DURATION = 0.5;

export const MathVisualizer: React.FC<MathVisualizerProps> = ({ concept, onDataUpdate }) => {
  // Common state
  const [functionStr, setFunctionStr] = useState('x^2');
  const [range, setRange] = useState(DEFAULT_RANGE);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Concept-specific state
  const [point, setPoint] = useState(0);
  const [epsilon, setEpsilon] = useState(0.1);
  const [numRectangles, setNumRectangles] = useState(20);
  const [seriesTerms, setSeriesTerms] = useState(10);
  const [vectorComponents, setVectorComponents] = useState({ x: 1, y: 1, z: 1 });

  // Function parser and evaluator
  const evaluateFunction = useCallback((x: number): number => {
    try {
      const scope = { x };
      return math.evaluate(functionStr, scope);
    } catch (error) {
      console.error('Error evaluating function:', error);
      return 0;
    }
  }, [functionStr]);

  // Generate x values for plotting
  const xValues = useMemo(() => {
    const { min, max, steps } = range;
    return Array.from({ length: steps }, (_, i) => min + (i * (max - min)) / (steps - 1));
  }, [range]);

  // Generate y values
  const yValues = useMemo(() => {
    return xValues.map(evaluateFunction);
  }, [xValues, evaluateFunction]);

  // Base plot data
  const baseData: Data[] = useMemo(() => {
    return [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      name: 'f(x)',
      line: { color: theme === 'light' ? '#3B82F6' : '#60A5FA', width: 2 }
    }];
  }, [xValues, yValues, theme]);

  // Concept-specific visualizations
  const getConceptData = useCallback((): Data[] => {
    switch (concept) {
      case 'limits':
        return getLimitVisualization();
      case 'derivatives':
        return getDerivativeVisualization();
      case 'integration':
        return getIntegrationVisualization();
      case 'series':
        return getSeriesVisualization();
      case 'vectors':
        return getVectorVisualization();
      default:
        return baseData;
    }
  }, [concept, baseData, point, epsilon, numRectangles, seriesTerms, vectorComponents]);

  // Limit visualization
  const getLimitVisualization = (): Data[] => {
    const leftPoints = Array.from({ length: 20 }, (_, i) => point - epsilon + (epsilon * i) / 10);
    const rightPoints = Array.from({ length: 20 }, (_, i) => point + (epsilon * i) / 10);
    
    return [
      ...baseData,
      {
        x: leftPoints,
        y: leftPoints.map(evaluateFunction),
        type: 'scatter',
        mode: 'markers',
        name: 'Left Approach',
        marker: { color: '#EF4444', size: 8 }
      },
      {
        x: rightPoints,
        y: rightPoints.map(evaluateFunction),
        type: 'scatter',
        mode: 'markers',
        name: 'Right Approach',
        marker: { color: '#10B981', size: 8 }
      }
    ];
  };

  // Derivative visualization
  const getDerivativeVisualization = (): Data[] => {
    const h = 0.0001;
    const derivative = (evaluateFunction(point + h) - evaluateFunction(point)) / h;
    const tangentX = [point - 2, point + 2];
    const tangentY = tangentX.map(x => evaluateFunction(point) + derivative * (x - point));

    return [
      ...baseData,
      {
        x: tangentX,
        y: tangentY,
        type: 'scatter',
        mode: 'lines',
        name: 'Tangent Line',
        line: { color: '#EF4444', width: 2, dash: 'dash' }
      },
      {
        x: [point],
        y: [evaluateFunction(point)],
        type: 'scatter',
        mode: 'markers',
        name: 'Point',
        marker: { color: '#10B981', size: 12, symbol: 'circle' }
      }
    ];
  };

  // Integration visualization
  const getIntegrationVisualization = (): Data[] => {
    const dx = (range.max - range.min) / numRectangles;
    const rectangles: Data[] = [];

    for (let i = 0; i < numRectangles; i++) {
      const x0 = range.min + i * dx;
      const x1 = x0 + dx;
      const y = evaluateFunction(x0);

      rectangles.push({
        x: [x0, x0, x1, x1, x0],
        y: [0, y, y, 0, 0],
        type: 'scatter',
        fill: 'toself',
        fillcolor: 'rgba(59, 130, 246, 0.2)',
        line: { color: 'rgba(59, 130, 246, 0.5)' },
        name: i === 0 ? 'Riemann Sum' : undefined,
        showlegend: i === 0
      });
    }

    return [...baseData, ...rectangles];
  };

  // Series visualization
  const getSeriesVisualization = (): Data[] => {
    const seriesData: Data[] = [];
    let sum = 0;

    for (let n = 1; n <= seriesTerms; n++) {
      const term = evaluateFunction(n);
      sum += term;

      seriesData.push({
        x: [n],
        y: [term],
        type: 'scatter',
        mode: 'markers',
        name: `Term ${n}`,
        marker: { size: 10 }
      });
    }

    return [
      ...seriesData,
      {
        x: Array.from({ length: seriesTerms }, (_, i) => i + 1),
        y: Array.from({ length: seriesTerms }, () => sum / seriesTerms),
        type: 'scatter',
        mode: 'lines',
        name: 'Average',
        line: { color: '#EF4444', dash: 'dash' }
      }
    ];
  };

  // Vector visualization
  const getVectorVisualization = (): Data[] => {
    return [{
      type: 'scatter3d',
      mode: 'lines',
      x: [0, vectorComponents.x],
      y: [0, vectorComponents.y],
      z: [0, vectorComponents.z],
      line: { color: '#3B82F6', width: 6 },
      name: 'Vector'
    }];
  };

  // Layout configuration
  const layout: Partial<Layout> = {
    title: {
      text: `${concept.charAt(0).toUpperCase() + concept.slice(1)} Visualization`,
      font: { size: 24 }
    },
    plot_bgcolor: theme === 'light' ? '#FFFFFF' : '#1F2937',
    paper_bgcolor: theme === 'light' ? '#FFFFFF' : '#1F2937',
    font: {
      color: theme === 'light' ? '#000000' : '#FFFFFF'
    },
    showlegend: true,
    legend: { x: 1.1, y: 1 },
    xaxis: {
      gridcolor: theme === 'light' ? '#E5E7EB' : '#374151',
      showgrid: showGrid,
      zeroline: true,
      zerolinecolor: theme === 'light' ? '#000000' : '#FFFFFF'
    },
    yaxis: {
      gridcolor: theme === 'light' ? '#E5E7EB' : '#374151',
      showgrid: showGrid,
      zeroline: true,
      zerolinecolor: theme === 'light' ? '#000000' : '#FFFFFF'
    },
    margin: { l: 50, r: 50, t: 50, b: 50 },
    hovermode: 'closest'
  };

  // Animation controls
  const handleAnimationToggle = () => {
    setIsAnimating(!isAnimating);
  };

  // Function input with validation
  const handleFunctionChange = (input: string) => {
    try {
      math.parse(input);
      setFunctionStr(input);
    } catch (error) {
      console.error('Invalid function:', error);
    }
  };

  return (
    <div className={`p-6 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            value={functionStr}
            onChange={(e) => handleFunctionChange(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md"
            placeholder="Enter function (e.g., x^2, sin(x))"
          />
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Toggle Theme
          </button>
          <button
            onClick={handleAnimationToggle}
            className="px-4 py-2 bg-green-500 text-white rounded-md"
          >
            {isAnimating ? 'Stop' : 'Animate'}
          </button>
        </div>

        {/* Concept-specific controls */}
        {concept === 'limits' && (
          <div className="flex space-x-4">
            <input
              type="range"
              min={range.min}
              max={range.max}
              step={0.1}
              value={point}
              onChange={(e) => setPoint(Number(e.target.value))}
              className="flex-1"
            />
            <input
              type="range"
              min={0.01}
              max={1}
              step={0.01}
              value={epsilon}
              onChange={(e) => setEpsilon(Number(e.target.value))}
              className="flex-1"
            />
          </div>
        )}

        {/* Similar controls for other concepts */}
      </div>

      {/* Plot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: ANIMATION_DURATION }}
      >
        <Plot
          data={getConceptData()}
          layout={layout}
          config={{ responsive: true }}
          style={{ width: '100%', height: '600px' }}
        />
      </motion.div>

      {/* Mathematical expressions */}
      <div className="mt-4">
        <MathJax>
          {`\\[ ${functionStr.replace(/\^/g, '^{').replace(/([0-9]+)$/, '$1}')} \\]`}
        </MathJax>
      </div>
    </div>
  );
};

export default MathVisualizer; 