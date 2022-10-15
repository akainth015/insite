
import { useEffect, useState , useRef } from 'react';
import * as Plot from "@observablehq/plot";
export function LinePlot({data}) {
  const ref = useRef();
  useEffect(() => {
    const lineChart = Plot.plot({
      marks: [
        Plot.lineY(data, {
          x: "time",
          y: "sine"
        }),
        Plot.ruleY([0])
      ],
      y: {
        grid: true
      },
      marginLeft: 50,
      marginTop: 50,
      marginBottom: 50
    });
    ref.current.append(lineChart);
    return () => lineChart.remove();
  }, [data]);

  return (
    <div title="Sine Chart">
      <div ref={ref}></div>
    </div>
  );
}