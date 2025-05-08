import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';

const VolumeOfRevolution: React.FC = () => {
  const [functionStr, setFunctionStr] = useState('x^2');
  const [axis, setAxis] = useState<'x' | 'y'>('x');
  const [start, setStart] = useState(-2);
  const [end, setEnd] = useState(2);
  const [resolution, setResolution] = useState(50);
  const [showCrossSections, setShowCrossSections] = useState(false);
  const [crossSectionPosition, setCrossSectionPosition] = useState(0);
  const [showVolume, setShowVolume] = useState(true);

  const evaluateFunction = (x: number): number => {
    try {
      // Replace x^n with Math.pow(x,n) and add support for common functions
      const mathExpr = functionStr
        .replace(/\s+/g, '')
        .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
        .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
        .replace(/tan\(([^)]+)\)/g, 'Math.tan($1)')
        .replace(/exp\(([^)]+)\)/g, 'Math.exp($1)')
        .replace(/log\(([^)]+)\)/g, 'Math.log($1)')
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/x\^(\d+)/g, 'Math.pow(x,$1)')
        .replace(/x/g, `(${x})`);
      return Function('return ' + mathExpr)();
    } catch (error) {
      console.error('Error evaluating function:', error);
      return 0;
    }
  };

  const calculateVolume = (start: number, end: number, steps: number): number => {
    const dx = (end - start) / steps;
    let volume = 0;

    for (let i = 0; i < steps; i++) {
      const x = start + i * dx;
      const y = evaluateFunction(x);
      if (axis === 'x') {
        // Disk method: V = ∫ π[f(x)]² dx
        volume += Math.PI * y * y * dx;
      } else {
        // Shell method: V = ∫ 2πx[f(x)] dx
        volume += 2 * Math.PI * x * y * dx;
      }
    }

    return Math.abs(volume);
  };

  const { points, crossSection } = useMemo(() => {
    const result: { x: number[]; y: number[]; z: number[] } = {
      x: [],
      y: [],
      z: [],
    };

    const step = (end - start) / resolution;
    const thetaStep = (2 * Math.PI) / resolution;

    // Generate surface points
    for (let i = 0; i <= resolution; i++) {
      const x = start + i * step;
      const y = evaluateFunction(x);

      for (let j = 0; j <= resolution; j++) {
        const theta = j * thetaStep;
        if (axis === 'x') {
          result.x.push(x);
          result.y.push(y * Math.cos(theta));
          result.z.push(y * Math.sin(theta));
        } else {
          result.x.push(x * Math.cos(theta));
          result.y.push(x * Math.sin(theta));
          result.z.push(y);
        }
      }
    }

    // Generate cross section points
    const crossSection: { x: number[]; y: number[]; z: number[] } = {
      x: [],
      y: [],
      z: [],
    };

    if (showCrossSections) {
      const y = evaluateFunction(crossSectionPosition);
      for (let j = 0; j <= resolution; j++) {
        const theta = j * thetaStep;
        if (axis === 'x') {
          crossSection.x.push(crossSectionPosition);
          crossSection.y.push(y * Math.cos(theta));
          crossSection.z.push(y * Math.sin(theta));
        } else {
          crossSection.x.push(crossSectionPosition * Math.cos(theta));
          crossSection.y.push(crossSectionPosition * Math.sin(theta));
          crossSection.z.push(y);
        }
      }
    }

    return { points: result, crossSection };
  }, [start, end, resolution, axis, functionStr, showCrossSections, crossSectionPosition]);

  const volume = useMemo(() => {
    return showVolume ? calculateVolume(start, end, 1000) : 0;
  }, [start, end, axis, functionStr, showVolume]);

  const data: Data[] = [
    {
      type: 'surface',
      x: points.x,
      y: points.y,
      z: points.z,
      colorscale: 'Viridis',
      opacity: 0.8,
    } as any
  ];

  if (showCrossSections) {
    data.push({
      type: 'scatter3d',
      x: crossSection.x,
      y: crossSection.y,
      z: crossSection.z,
      mode: 'lines',
      line: { color: '#EF4444', width: 5 },
      name: 'Cross Section'
    } as any);
  }

  const layout = {
    title: `Volume of Revolution around ${axis.toUpperCase()}-axis`,
    scene: {
      xaxis: { title: 'X', range: [-5, 5] },
      yaxis: { title: 'Y', range: [-5, 5] },
      zaxis: { title: 'Z', range: [-5, 5] },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      }
    },
    margin: { t: 50, b: 50, l: 50, r: 50 },
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Volume of Revolution</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Function</label>
            <input
              type="text"
              value={functionStr}
              onChange={(e) => setFunctionStr(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter function (e.g., x^2, sin(x), etc.)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Axis of Rotation</label>
            <select
              value={axis}
              onChange={(e) => setAxis(e.target.value as 'x' | 'y')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="x">X-axis (Disk Method)</option>
              <option value="y">Y-axis (Shell Method)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Point</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{start}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Point</label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={end}
              onChange={(e) => setEnd(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{end}</span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Resolution</label>
            <input
              type="range"
              min="20"
              max="100"
              step="10"
              value={resolution}
              onChange={(e) => setResolution(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-500">{resolution}</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showCrossSections}
                onChange={(e) => setShowCrossSections(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2">Show Cross Sections</span>
            </label>
            {showCrossSections && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Cross Section Position</label>
                <input
                  type="range"
                  min={start}
                  max={end}
                  step="0.1"
                  value={crossSectionPosition}
                  onChange={(e) => setCrossSectionPosition(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{crossSectionPosition}</span>
              </div>
            )}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showVolume}
                onChange={(e) => setShowVolume(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2">Calculate Volume</span>
            </label>
          </div>
          {showVolume && (
            <div className="p-4 bg-gray-50 rounded-md">
              <p className="text-lg font-semibold">Volume: {volume.toFixed(4)} cubic units</p>
            </div>
          )}
        </div>
        <div>
          <Plot
            data={data}
            layout={layout}
            style={{ width: '100%', height: '500px' }}
            config={{ responsive: true }}
          />
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Volume Calculation Methods:</h3>
        <div className="space-y-2 text-gray-600">
          <p>
            <strong>Disk Method (around x-axis):</strong> V = ∫ π[f(x)]² dx
          </p>
          <p>
            <strong>Shell Method (around y-axis):</strong> V = ∫ 2πx[f(x)] dx
          </p>
          <p>
            The visualization shows the 3D solid formed by rotating the curve around the chosen axis.
            Cross sections can be displayed to better understand the shape at specific points.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolumeOfRevolution; 