import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Data } from 'plotly.js';

interface Vector {
  x: number;
  y: number;
  z: number;
}

type Operation = 'cross' | 'dot' | 'projection' | 'parallelogram' | 'triple';

const VectorCalculus: React.FC = () => {
  const [vector1, setVector1] = useState<Vector>({ x: 1, y: 0, z: 0 });
  const [vector2, setVector2] = useState<Vector>({ x: 0, y: 1, z: 0 });
  const [vector3, setVector3] = useState<Vector>({ x: 0, y: 0, z: 1 });
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>(['cross', 'dot']);
  const [showComponents, setShowComponents] = useState(false);

  const calculateCrossProduct = (v1: Vector, v2: Vector): Vector => {
    return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x,
    };
  };

  const calculateDotProduct = (v1: Vector, v2: Vector): number => {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  };

  const calculateMagnitude = (v: Vector): number => {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  };

  const calculateProjection = (v1: Vector, v2: Vector): Vector => {
    const dot = calculateDotProduct(v1, v2);
    const mag2 = calculateMagnitude(v2) ** 2;
    const scale = dot / mag2;
    return {
      x: v2.x * scale,
      y: v2.y * scale,
      z: v2.z * scale,
    };
  };

  const calculateTripleProduct = (v1: Vector, v2: Vector, v3: Vector): number => {
    const cross = calculateCrossProduct(v1, v2);
    return calculateDotProduct(cross, v3);
  };

  const scaleVector = (v: Vector, scale: number): Vector => {
    return {
      x: v.x * scale,
      y: v.y * scale,
      z: v.z * scale,
    };
  };

  const addVectors = (v1: Vector, v2: Vector): Vector => {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
      z: v1.z + v2.z,
    };
  };

  const { data, results } = useMemo(() => {
    const data: Data[] = [
      // Vector 1
      {
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, vector1.x],
        y: [0, vector1.y],
        z: [0, vector1.z],
        name: 'Vector 1',
        line: { color: '#3B82F6', width: 5 },
        marker: { size: 5 },
        text: ['', 'v₁'],
        textposition: 'top center',
      } as any,
      // Vector 2
      {
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, vector2.x],
        y: [0, vector2.y],
        z: [0, vector2.z],
        name: 'Vector 2',
        line: { color: '#10B981', width: 5 },
        marker: { size: 5 },
        text: ['', 'v₂'],
        textposition: 'top center',
      } as any,
    ];

    const results: Record<string, number | Vector> = {};

    if (selectedOperations.includes('cross')) {
      const crossProduct = calculateCrossProduct(vector1, vector2);
      results.crossProduct = crossProduct;
      data.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, crossProduct.x],
        y: [0, crossProduct.y],
        z: [0, crossProduct.z],
        name: 'Cross Product',
        line: { color: '#EF4444', width: 5 },
        marker: { size: 5 },
        text: ['', 'v₁ × v₂'],
        textposition: 'top center',
      } as any);
    }

    if (selectedOperations.includes('dot')) {
      results.dotProduct = calculateDotProduct(vector1, vector2);
    }

    if (selectedOperations.includes('projection')) {
      const projection = calculateProjection(vector1, vector2);
      results.projection = projection;
      data.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, projection.x],
        y: [0, projection.y],
        z: [0, projection.z],
        name: 'Projection',
        line: { color: '#F59E0B', width: 5 },
        marker: { size: 5 },
        text: ['', 'proj'],
        textposition: 'top center',
      } as any);
    }

    if (selectedOperations.includes('parallelogram')) {
      const sum = addVectors(vector1, vector2);
      data.push({
        type: 'scatter3d',
        mode: 'lines',
        x: [vector1.x, sum.x],
        y: [vector1.y, sum.y],
        z: [vector1.z, sum.z],
        line: { color: '#8B5CF6', width: 2, dash: 'dash' },
        showlegend: false,
      } as any,
      {
        type: 'scatter3d',
        mode: 'lines',
        x: [vector2.x, sum.x],
        y: [vector2.y, sum.y],
        z: [vector2.z, sum.z],
        line: { color: '#8B5CF6', width: 2, dash: 'dash' },
        showlegend: false,
      } as any);
    }

    if (selectedOperations.includes('triple')) {
      data.push({
        type: 'scatter3d',
        mode: 'lines+markers+text',
        x: [0, vector3.x],
        y: [0, vector3.y],
        z: [0, vector3.z],
        name: 'Vector 3',
        line: { color: '#EC4899', width: 5 },
        marker: { size: 5 },
        text: ['', 'v₃'],
        textposition: 'top center',
      } as any);
      results.tripleProduct = calculateTripleProduct(vector1, vector2, vector3);
    }

    if (showComponents) {
      // Add component vectors for v₁
      data.push(
        {
          type: 'scatter3d',
          mode: 'lines',
          x: [0, vector1.x],
          y: [0, 0],
          z: [0, 0],
          name: 'v₁ components',
          line: { color: '#3B82F6', width: 2, dash: 'dot' },
        } as any,
        {
          type: 'scatter3d',
          mode: 'lines',
          x: [0, 0],
          y: [0, vector1.y],
          z: [0, 0],
          line: { color: '#3B82F6', width: 2, dash: 'dot' },
          showlegend: false,
        } as any,
        {
          type: 'scatter3d',
          mode: 'lines',
          x: [0, 0],
          y: [0, 0],
          z: [0, vector1.z],
          line: { color: '#3B82F6', width: 2, dash: 'dot' },
          showlegend: false,
        } as any,
      );

      // Add component vectors for v₂
      data.push(
        {
          type: 'scatter3d',
          mode: 'lines',
          x: [0, vector2.x],
          y: [0, 0],
          z: [0, 0],
          name: 'v₂ components',
          line: { color: '#10B981', width: 2, dash: 'dot' },
        } as any,
        {
          type: 'scatter3d',
          mode: 'lines',
          x: [0, 0],
          y: [0, vector2.y],
          z: [0, 0],
          line: { color: '#10B981', width: 2, dash: 'dot' },
          showlegend: false,
        } as any,
        {
          type: 'scatter3d',
          mode: 'lines',
          x: [0, 0],
          y: [0, 0],
          z: [0, vector2.z],
          line: { color: '#10B981', width: 2, dash: 'dot' },
          showlegend: false,
        } as any,
      );
    }

    return { data, results };
  }, [vector1, vector2, vector3, selectedOperations, showComponents]);

  const layout = {
    title: '3D Vector Visualization',
    scene: {
      xaxis: { title: 'X', range: [-5, 5] },
      yaxis: { title: 'Y', range: [-5, 5] },
      zaxis: { title: 'Z', range: [-5, 5] },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1.5 }
      }
    },
    margin: { t: 50, b: 50, l: 50, r: 50 },
    showlegend: true,
    legend: { x: 1.1, y: 1 }
  };

  const VectorInput = ({ vector, setVector, label }: { vector: Vector; setVector: (v: Vector) => void; label: string }) => (
    <div>
      <h3 className="text-lg font-semibold mb-2">{label}</h3>
      <div className="grid grid-cols-3 gap-2">
        {['x', 'y', 'z'].map((coord) => (
          <div key={coord}>
            <label className="block text-sm font-medium text-gray-700">{coord.toUpperCase()}</label>
            <input
              type="number"
              value={vector[coord as keyof Vector]}
              onChange={(e) => setVector({ ...vector, [coord]: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              step="0.1"
            />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Vector Calculus</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <VectorInput vector={vector1} setVector={setVector1} label="Vector 1" />
          <VectorInput vector={vector2} setVector={setVector2} label="Vector 2" />
          {selectedOperations.includes('triple') && (
            <VectorInput vector={vector3} setVector={setVector3} label="Vector 3" />
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Operations</h3>
            {(['cross', 'dot', 'projection', 'parallelogram', 'triple'] as Operation[]).map((op) => (
              <label key={op} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedOperations.includes(op)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOperations([...selectedOperations, op]);
                    } else {
                      setSelectedOperations(selectedOperations.filter(o => o !== op));
                    }
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="ml-2 capitalize">{op}</span>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showComponents}
                onChange={(e) => setShowComponents(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2">Show Components</span>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-md space-y-2">
            {selectedOperations.includes('dot') && (
              <p>Dot Product: {(results.dotProduct as number).toFixed(4)}</p>
            )}
            {selectedOperations.includes('triple') && (
              <p>Triple Product: {(results.tripleProduct as number).toFixed(4)}</p>
            )}
            {selectedOperations.includes('cross') && (
              <p>
                Cross Product: ({(results.crossProduct as Vector).x.toFixed(2)},
                {(results.crossProduct as Vector).y.toFixed(2)},
                {(results.crossProduct as Vector).z.toFixed(2)})
              </p>
            )}
            {selectedOperations.includes('projection') && (
              <p>
                Projection: ({(results.projection as Vector).x.toFixed(2)},
                {(results.projection as Vector).y.toFixed(2)},
                {(results.projection as Vector).z.toFixed(2)})
              </p>
            )}
          </div>
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
        <h3 className="text-lg font-semibold mb-2">Vector Operations:</h3>
        <div className="space-y-2 text-gray-600">
          <p>
            <strong>Dot Product:</strong> v₁·v₂ = |v₁||v₂|cos(θ) = x₁x₂ + y₁y₂ + z₁z₂
          </p>
          <p>
            <strong>Cross Product:</strong> v₁×v₂ = |v₁||v₂|sin(θ)n = (y₁z₂-z₁y₂, z₁x₂-x₁z₂, x₁y₂-y₁x₂)
          </p>
          <p>
            <strong>Vector Projection:</strong> proj_v₂(v₁) = ((v₁·v₂)/|v₂|²)v₂
          </p>
          <p>
            <strong>Triple Product:</strong> v₁·(v₂×v₃) = volume of parallelepiped
          </p>
        </div>
      </div>
    </div>
  );
};

export default VectorCalculus; 