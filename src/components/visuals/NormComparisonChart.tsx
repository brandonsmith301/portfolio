import Plot from 'react-plotly.js';

const xValues = Array.from({ length: 401 }, (_, i) => -5 + (10 * i) / 400);
const l1Data = xValues.map((v) => Math.abs(v));
const l2Data = xValues.map((v) => v * v);

const annotationTextColor = '#272727'; 

export const NormComparisonChart = () => {
  const trace1 = {
    x: xValues,
    y: l1Data,
    type: 'scatter' as const,
    mode: 'lines' as const, 
    name: 'L1 norm (p=1)',
    line: {
      color: '#1D282E',
      width: 1.5,
    },
    marker: {
      color: '#1D282E',
      size: 5,
      symbol: 'diamond' as const,
      line: {
        width: 1,
        color: annotationTextColor,
      },
    },
    hovertemplate: '%{y:.1f}', 
  };

  const trace2 = {
    x: xValues,
    y: l2Data,
    type: 'scatter' as const,
    mode: 'lines' as const,
    name: 'L2 norm (p=2)',
    line: {
      color: '#C78C78',
      width: 1.5, 
    },
    marker: {
      color: '#C78C78',
      size: 5,
      symbol: 'circle' as const,
      line: {
        width: 1,
        color: annotationTextColor,
      },
    },
    hovertemplate: '%{y:.1f}',
  };

  const layout = {
    plot_bgcolor: 'rgba(0,0,0,0)', 
    paper_bgcolor: 'rgba(0,0,0,0)',
    xaxis: {
      title: { text: 'Error Value (x)', font: { family: 'Serif'} },
      showgrid: true,
      zeroline: false,
      showline: true, 
      ticks: 'outside' as const,
      linecolor: '#444',
      gridwidth: 0.1,
      griddash: 'dot' as const,
    },
    yaxis: {
      title: { text: 'Error Magnitude', font: { family: 'Serif'} },
      showgrid: true,
      zeroline: false,
      showline: true,
      ticks: 'outside' as const,
      rangemode: 'tozero' as const,
      hoverformat: '.2f',
      range: [0, 10],
      linecolor: '#444',
      gridwidth: 0.1,
      griddash: 'dot' as const,
    },
    legend: {
      orientation: 'v' as const,
      yanchor: 'top' as const,
      y: -0.15, 
      xanchor: 'left' as const,
      x: 0,
      font: { family: 'Serif', size: 15, color: annotationTextColor },
    },
    hovermode: 'x unified' as const,
    hoverlabel: {
      bgcolor: 'white',
      font: { size: 12, family: 'Serif' },
      namelength: -1,
    },
    autosize: true,
    margin: { t: 40, l: 60, b: 80, r: 40, pad: 4 },
    dragmode: false as const, 
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
    <Plot
      data={[trace1, trace2]}
      layout={layout}
      useResizeHandler={true}
      style={{ width: '100%', height: '450px' }} 
      config={config}
    />
  );
}; 