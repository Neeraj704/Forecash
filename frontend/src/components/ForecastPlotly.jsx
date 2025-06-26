import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';

export default function ForecastPlotly({ graph }) {
  const plotRef = useRef(null);

  useEffect(() => {
    if (!graph) return;
    Plotly.react(
      plotRef.current,
      graph.data,    
      graph.layout,  
      { responsive: true }
    );
  }, [graph]);

  return <div ref={plotRef} style={{ width: '100%', height: '100%' }} />;
}
