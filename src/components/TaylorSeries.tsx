import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';

type FunctionType = 'sin' | 'cos' | 'exp' | 'ln';

const TaylorSeries: React.FC = () => {
  const [functionType, setFunctionType] = useState<FunctionType>('sin');
  const [terms, setTerms] = useState(1);
  const [x0, setX0] = useState(0);
  const [showError, setShowError] = useState(true);
  const [showDerivatives, setShowDerivatives] = useState(false);

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const evaluateFunction = (x: number, type: FunctionType): number => {
    switch (type) {
      case 'sin':
        return Math.sin(x);
      case 'cos':
        return Math.cos(x);
      case 'exp':
        return Math.exp(x);
      case 'ln':
        return Math.log(Math.abs(x) + 0.0001); // Avoid log(0)
      default:
        return 0;
    }
  };

  const evaluateDerivative = (x: number, type: FunctionType, order: number): number => {
    switch (type) {
      case 'sin':
        return Math.sin(x + Math.PI * order / 2);
      case 'cos':
        return Math.cos(x + Math.PI * order / 2);
      case 'exp':
        return Math.exp(x);
      case 'ln':
        return Math.pow(-1, order - 1) * factorial(order - 1) / Math.pow(Math.abs(x) + 0.0001, order);
      default:
        return 0;
    }
  };

  const data: Data[] = useMemo(() => {
    const x = Array.from({ length: 1000 }, (_, i) => (i - 500) / 100);
    
    // Original function
    const y_original = x.map(x => evaluateFunction(x, functionType));
    
    // Taylor series approximation
    const y_taylor = x.map(xi => {
      let sum = 0;
      for (let n = 0; n < terms; n++) {
        sum += (evaluateDerivative(x0, functionType, n) * Math.pow(xi - x0, n)) / factorial(n);
      }
      return sum;
    });

    // Error term
    const y_error = x.map((xi, i) => Math.abs(y_original[i] - y_taylor[i]));

    // Individual terms
    const termContributions: Data[] = showDerivatives 
      ? Array.from({ length: terms }, (_, n) => ({
          x,
          y: x.map(xi => 
            (evaluateDerivative(x0, functionType, n) * Math.pow(xi - x0, n)) / factorial(n)
          ),
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: `Term ${n}`,
          line: { 
            dash: 'dot',
            width: 1
          }
        }))
      : [];

    const result: Data[] = [
      {
        x,
        y: y_original,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: `Original ${functionType}(x)`,
        line: { color: '#3B82F6', width: 2 }
      },
      {
        x,
        y: y_taylor,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: `Taylor Series (n=${terms})`,
        line: { color: '#EF4444', width: 2 }
      },
      ...termContributions
    ];

    if (showError) {
      result.push({
        x,
        y: y_error,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'Error',
        line: { color: '#10B981', width: 1, dash: 'dash' },
        yaxis: 'y2'
      });
    }

    return result;
  }, [terms, x0, functionType, showError, showDerivatives]);

  const layout = {
    title: `Taylor Series Approximation of ${functionType}(x)`,
    xaxis: { title: 'x', range: [-5, 5] },
    yaxis: { title: 'y', range: [-5, 5] },
    yaxis2: {
      title: 'Error',
      overlaying: 'y' as const,
      side: 'right' as const,
      showgrid: false,
      range: [0, 2]
    },
    showlegend: true,
    legend: { x: 1.1, y: 1 }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Taylor Series Approximation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">
            Function:
            <select
              value={functionType}
              onChange={(e) => setFunctionType(e.target.value as FunctionType)}
              className="ml-2 p-1 border rounded"
            >
              <option value="sin">sin(x)</option>
              <option value="cos">cos(x)</option>
              <option value="exp">exp(x)</option>
              <option value="ln">ln(x)</option>
            </select>
          </label>
        </div>
        <div>
          <label className="block mb-2">
            Number of Terms: {terms}
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={terms}
              onChange={(e) => setTerms(parseInt(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            Center (x₀): {x0}
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={x0}
              onChange={(e) => setX0(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showError}
              onChange={(e) => setShowError(e.target.checked)}
              className="mr-2"
            />
            Show Error Term
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showDerivatives}
              onChange={(e) => setShowDerivatives(e.target.checked)}
              className="mr-2"
            />
            Show Individual Terms
          </label>
        </div>
      </div>
      <Plot
        data={data}
        layout={layout}
        style={{ width: '100%', height: '500px' }}
      />
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Taylor Series Formula:</h3>
        <p className="font-mono">
          f(x) ≈ Σ (f⁽ⁿ⁾(x₀)/n!) * (x - x₀)ⁿ
        </p>
        <p className="mt-2 text-gray-600">
          The blue line shows the original function, the red line shows the Taylor series approximation,
          and the green dashed line shows the absolute error between them.
          {showDerivatives && " The dotted lines show the contribution of each term in the series."}
        </p>
      </div>
    </div>
  );
};

export default TaylorSeries; 