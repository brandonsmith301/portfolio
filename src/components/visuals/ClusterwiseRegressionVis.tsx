import { useState, useEffect, useCallback } from 'react';
import Plot from 'react-plotly.js';

interface ClusterwiseRegressionVisProps {
  nClusters?: number;
  nPointsPerCluster?: number;
  noise?: number;
  slopeRange?: [number, number];
  interceptRange?: [number, number];
  randomSeed?: number;
}

const generateData = (
  nClusters: number = 3,
  nPointsPerCluster: number = 20,
  noise: number = 2.0,
  slopeRange: [number, number] = [0.3, 1.5],
  interceptRange: [number, number] = [10, 40],
  randomSeed: number = Date.now()
) => {
  let seed = randomSeed;
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const X: number[] = [];
  for (let i = 0; i < nPointsPerCluster; i++) {
    X.push(20 + (40 * i) / (nPointsPerCluster - 1)); 
  }

  const data: { x: number; y: number; cluster: number }[] = [];

  for (let cluster = 0; cluster < nClusters; cluster++) {
    const slope = slopeRange[0] + seededRandom() * (slopeRange[1] - slopeRange[0]);
    const intercept = interceptRange[0] + seededRandom() * (interceptRange[1] - interceptRange[0]);

    for (let i = 0; i < nPointsPerCluster; i++) {
      const x = X[i];
      const gaussianNoise = () => {
        let u = 0, v = 0;
        while (u === 0) u = seededRandom();
        while (v === 0) v = seededRandom();
        return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      };
      const y = slope * x + intercept + noise * gaussianNoise();
      
      data.push({ x, y, cluster: Math.floor(seededRandom() * nClusters) });
    }
  }

  for (let i = data.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [data[i], data[j]] = [data[j], data[i]];
  }
  
  data.forEach((point) => {
    point.cluster = Math.floor(seededRandom() * nClusters);
  });

  return data;
};

const calculateRegression = (points: { x: number; y: number }[]) => {
  if (points.length < 2) {
    // If only one point, return horizontal line through that point
    return { slope: 0, intercept: points[0]?.y || 0 };
  }
  
  const n = points.length;
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const sumXY = points.reduce((sum, p) => sum + p.x * p.y, 0);
  const sumX2 = points.reduce((sum, p) => sum + p.x * p.x, 0);
  
  // Using least squares method
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
};

const getError = (point: { x: number; y: number }, slope: number, intercept: number, p: number = 2) => {
  const prediction = slope * point.x + intercept;
  const error = Math.abs(point.y - prediction);
  return p === 1 ? error : Math.pow(error, p);
};

const assignToClusters = (data: { x: number; y: number; cluster: number }[], regressionLines: Array<{ slope: number; intercept: number }>, p: number = 2) => {
  const newData = data.map(point => {
    let minError = Infinity;
    let bestCluster = 0;

    regressionLines.forEach((line, cluster) => {
      const error = getError(point, line.slope, line.intercept, p);
      if (error < minError) {
        minError = error;
        bestCluster = cluster;
      }
    });

    return { ...point, cluster: bestCluster };
  });

  return newData;
};

const distanceToLine = (point: { x: number; y: number }, slope: number, intercept: number) => {
  const prediction = slope * point.x + intercept;
  return Math.abs(prediction - point.y);
};

export const ClusterwiseRegressionVis = ({
  nClusters: initialClusters = 3,
  nPointsPerCluster: initialPoints = 20,
  noise: initialNoise = 2.0,
  slopeRange: initialSlopeRange = [0.3, 1.5],
  interceptRange: initialInterceptRange = [10, 40],
  randomSeed: initialSeed = Date.now()
}: ClusterwiseRegressionVisProps = {}) => {

  const [nClusters, setNClusters] = useState(initialClusters);
  const [nPointsPerCluster, setNPointsPerCluster] = useState(initialPoints);
  const [noise, setNoise] = useState(initialNoise);
  const [slopeRange] = useState(initialSlopeRange);
  const [interceptRange] = useState(initialInterceptRange);
  const [currentSeed, setCurrentSeed] = useState(initialSeed);
  const [useNewSeed, setUseNewSeed] = useState(true);

  const [data, setData] = useState(() => generateData(nClusters, nPointsPerCluster, noise, slopeRange, interceptRange, currentSeed));
  const [iteration, setIteration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [regressionLines, setRegressionLines] = useState<Array<{ slope: number; intercept: number }>>([]);
  const [converged, setConverged] = useState(false);

  const colors = ['#1D282E', '#C78C78', '#7899A3', '#8B7355', '#4682B4', '#9370DB', '#20B2AA'];
  const neutralColor = '#9CA3AF'; 
  const annotationTextColor = '#272727';

  const performIteration = useCallback(() => {
    // Step 1: Calculate regression lines for current clusters
    const clusters = Array.from({ length: nClusters }, (_, i) => i);
    const newRegressionLines = clusters.map(cluster => {
      const clusterPoints = data.filter(p => p.cluster === cluster);
      return calculateRegression(clusterPoints);
    });
    setRegressionLines(newRegressionLines);

    // Step 2: Reassign points to clusters based on error
    const newData = assignToClusters(data, newRegressionLines);
    
    // Check if any assignments changed
    const hasChanged = newData.some((point, i) => point.cluster !== data[i].cluster);

    if (hasChanged) {
      setData(newData);
      setIteration(prev => prev + 1);
    } else {
      setConverged(true);
      setIsPlaying(false);
    }
  }, [data, nClusters]);

  useEffect(() => {
    if (isPlaying && !converged) {
      const timer = setTimeout(performIteration, 1000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, converged, performIteration]);

  const reset = () => {
    const newSeed = useNewSeed ? Date.now() : currentSeed;
    setCurrentSeed(newSeed);
    setData(generateData(nClusters, nPointsPerCluster, noise, slopeRange, interceptRange, newSeed));
    setIteration(0);
    setRegressionLines([]);
    setConverged(false);
    setIsPlaying(false);
  };

  const applyParameters = () => {
    const newSeed = useNewSeed ? Date.now() : currentSeed;
    setCurrentSeed(newSeed);
    setData(generateData(nClusters, nPointsPerCluster, noise, slopeRange, interceptRange, newSeed));
    setIteration(0);
    setRegressionLines([]);
    setConverged(false);
    setIsPlaying(false);
  };

  const traces = [];

  if (iteration === 0 && regressionLines.length === 0) {
    traces.push({
      x: data.map(p => p.x),
      y: data.map(p => p.y),
      type: 'scatter' as const,
      mode: 'markers' as const,
      name: 'Unclustered Data',
      marker: {
        color: neutralColor,
        size: 8,
        symbol: 'circle',
        line: {
          color: 'black',
          width: 0.5,
        },
      },
      hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}',
    });
  } else {
    for (let cluster = 0; cluster < nClusters; cluster++) {
      const clusterData = data.filter(p => p.cluster === cluster);
      if (clusterData.length > 0) {
        traces.push({
          x: clusterData.map(p => p.x),
          y: clusterData.map(p => p.y),
          type: 'scatter' as const,
          mode: 'markers' as const,
          name: `Cluster ${cluster + 1}`,
          marker: {
            color: colors[cluster % colors.length],
            size: 8,
            symbol: ['circle', 'square', 'diamond', 'triangle-up', 'star'][cluster % 5] as any,
            line: {
              color: 'black',
              width: 0.5,
            },
          },
          hovertemplate: 'x: %{x:.2f}<br>y: %{y:.2f}',
        });
      }
    }
  }

  if (regressionLines.length > 0 && iteration > 0) {
    const xRange = [15, 65]; 
    regressionLines.forEach((line, idx) => {
      traces.push({
        x: xRange,
        y: xRange.map(x => line.slope * x + line.intercept),
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: `Regression ${idx + 1}`,
        line: {
          color: colors[idx % colors.length],
          width: 2,
          dash: 'dash' as const,
        },
        showlegend: false,
        hovertemplate: 'y = %{text}',
        text: [`${line.slope.toFixed(2)}x + ${line.intercept.toFixed(2)}`],
      });
    });
  }

  const xValues = data.map(p => p.x);
  const yValues = data.map(p => p.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  
  const xPadding = (xMax - xMin) * 0.1;
  const yPadding = (yMax - yMin) * 0.1;

  const layout = {
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: {
      title: { text: 'Feature (x)', font: { family: 'Serif' } },
      showgrid: true,
      zeroline: false,
      showline: true,
      ticks: 'outside' as const,
      linecolor: '#444',
      gridwidth: 0.1,
      griddash: 'dot' as const,
      range: [xMin - xPadding, xMax + xPadding],
    },
    yaxis: {
      title: { text: 'Target (y)', font: { family: 'Serif' } },
      showgrid: true,
      zeroline: false,
      showline: true,
      ticks: 'outside' as const,
      linecolor: '#444',
      gridwidth: 0.1,
      griddash: 'dot' as const,
      range: [yMin - yPadding, yMax + yPadding],
    },
    legend: {
      orientation: 'v' as const,
      yanchor: 'top' as const,
      y: 1.0,
      xanchor: 'right' as const,
      x: 0.2,
      font: { family: 'Serif', size: 14, color: annotationTextColor },
    },
    hovermode: 'closest' as const,
    hoverlabel: {
      bgcolor: 'white',
      font: { size: 12, family: 'Serif' },
    },
    autosize: true,
    margin: { t: 60, l: 60, b: 60, r: 40, pad: 4 },
    dragmode: false as const,
    title: {
      text: `Iteration: ${iteration}${converged ? ' (Converged)' : ''}`,
      font: { family: 'Serif', size: 16, color: annotationTextColor },
      y: 0.95,
    },
  };

  const config = {
    displayModeBar: false,
    scrollZoom: false,
    responsive: true,
    doubleClick: false as const,
    editable: false,
    showAxisDragHandles: false,
    showAxisRangeEntryBoxes: false,
  };

  return (
    <div className="w-full">
      {/* Control Panel */}
      <div className="mb-6">
        <h5 className="text-sm font-semibold mb-3">Parameters</h5>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Number of Clusters</label>
            <input
              type="number"
              min="2"
              max="7"
              value={nClusters}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 2 && val <= 7) setNClusters(val);
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Points per Cluster</label>
            <input
              type="number"
              min="5"
              max="1000"
              value={nPointsPerCluster}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 5 && val <= 50) setNPointsPerCluster(val);
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-gray-600 mb-1">Noise Level</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={noise}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 0 && val <= 10) setNoise(val);
              }}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center text-xs">
            <input
              type="checkbox"
              checked={useNewSeed}
              onChange={(e) => setUseNewSeed(e.target.checked)}
              className="mr-2"
            />
            Use new random seed on reset
          </label>
          
          <button
            onClick={applyParameters}
            className="px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Apply Parameters
          </button>
        </div>
      </div>
      
      <Plot
        data={traces}
        layout={layout}
        useResizeHandler={true}
        style={{ width: '100%', height: '500px' }}
        config={config}
      />
      
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={converged}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPlaying ? 'Pause' : 'Run'}
        </button>
        
        <button
          onClick={performIteration}
          disabled={isPlaying || converged}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Step
        </button>
        
        <button
          onClick={reset}
          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}; 