import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';

type FunctionType = 'sin' | 'cos' | 'tan' | 'exp' | 'log' | 'polynomial';

const FunctionTransformations: React.FC = () => {
  const [functionType, setFunctionType] = useState<FunctionType>('sin');
  const [a, setA] = useState(1); // Scale
  const [b, setB] = useState(0); // Horizontal shift
  const [c, setC] = useState(1); // Vertical scale
  const [d, setD] = useState(0); // Vertical shift
  const [polynomialDegree, setPolynomialDegree] = useState(2);
  const [coefficients, setCoefficients] = useState([1, 0, 0, 0, 0]); // Up to 4th degree

  const evaluateFunction = (x: number): number => {
    const transformedX = a * (x - b);
    let baseValue: number;
    
    switch (functionType) {
      case 'sin':
        baseValue = Math.sin(transformedX);
        break;
      case 'cos':
        baseValue = Math.cos(transformedX);
        break;
      case 'tan':
        baseValue = Math.tan(transformedX);
        break;
      case 'exp':
        baseValue = Math.exp(transformedX);
        break;
      case 'log':
        baseValue = Math.log(Math.abs(transformedX) + 0.0001); // Avoid log(0)
        break;
      case 'polynomial':
        baseValue = coefficients.reduce((sum, coeff, index) => 
          sum + coeff * Math.pow(transformedX, index), 0);
        break;
      default:
        baseValue = 0;
    }
    
    return c * baseValue + d;
  };

  const data: Data[] = useMemo(() => {
    const x = Array.from({ length: 1000 }, (_, i) => (i - 500) / 50);
    const y = x.map(evaluateFunction);

    // Add derivative
    const dx = 0.01;
    const derivative = x.map(x => 
      (evaluateFunction(x + dx) - evaluateFunction(x - dx)) / (2 * dx)
    );

    return [
      {
        x,
        y,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: 'f(x)',
        line: { color: '#3B82F6', width: 2 }
      },
      {
        x,
        y: derivative,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: "f'(x)",
        line: { color: '#EF4444', width: 2, dash: 'dash' }
      }
    ];
  }, [functionType, a, b, c, d, polynomialDegree, coefficients]);

  const layout = {
    title: 'Function Transformation Explorer',
    xaxis: { title: 'x', range: [-10, 10] },
    yaxis: { title: 'y', range: [-10, 10] },
    showlegend: true,
    grid: { rows: 1, columns: 1, pattern: 'independent' as const }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Function Transformations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2">
            Function Type:
            <select
              value={functionType}
              onChange={(e) => setFunctionType(e.target.value as FunctionType)}
              className="ml-2 p-1 border rounded"
            >
              <option value="sin">Sine</option>
              <option value="cos">Cosine</option>
              <option value="tan">Tangent</option>
              <option value="exp">Exponential</option>
              <option value="log">Logarithm</option>
              <option value="polynomial">Polynomial</option>
            </select>
          </label>
        </div>
        
        {functionType === 'polynomial' && (
          <div>
            <label className="block mb-2">
              Polynomial Degree: {polynomialDegree}
              <input
                type="range"
                min="1"
                max="4"
                step="1"
                value={polynomialDegree}
                onChange={(e) => setPolynomialDegree(parseInt(e.target.value))}
                className="w-full"
              />
            </label>
            <div className="grid grid-cols-5 gap-2">
              {coefficients.slice(0, polynomialDegree + 1).map((coeff, index) => (
                <input
                  key={index}
                  type="number"
                  value={coeff}
                  onChange={(e) => {
                    const newCoeffs = [...coefficients];
                    newCoeffs[index] = parseFloat(e.target.value) || 0;
                    setCoefficients(newCoeffs);
                  }}
                  className="w-full p-1 border rounded"
                  placeholder={`x^${index}`}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block mb-2">
            a (Horizontal Scale): {a}
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            b (Horizontal Shift): {b}
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            c (Vertical Scale): {c}
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
        <div>
          <label className="block mb-2">
            d (Vertical Shift): {d}
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={d}
              onChange={(e) => setD(parseFloat(e.target.value))}
              className="w-full"
            />
          </label>
        </div>
      </div>
      <Plot
        data={data}
        layout={layout}
        style={{ width: '100%', height: '500px' }}
      />
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Current Function:</h3>
        <p className="font-mono">
          f(x) = {c} * {functionType === 'polynomial' 
            ? coefficients
                .slice(0, polynomialDegree + 1)
                .map((coeff, index) => `${coeff}x^${index}`)
                .join(' + ')
            : `${functionType}(${a}(x - ${b}))`} + {d}
        </p>
        <p className="mt-2 text-gray-600">
          The blue line shows the function, and the red dashed line shows its derivative.
        </p>
      </div>
    </div>
  );
};

export default FunctionTransformations; 