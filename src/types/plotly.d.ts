declare module 'plotly.js-dist-min' {
  const Plotly: {
    newPlot: (
      element: HTMLElement,
      data: Array<{
        x: number[];
        y: number[];
        type?: string;
        mode?: string;
        name?: string;
        line?: {
          color?: string;
        };
      }>,
      layout?: {
        title?: string;
        xaxis?: {
          title?: string;
        };
        yaxis?: {
          title?: string;
        };
        showlegend?: boolean;
        margin?: {
          t?: number;
          b?: number;
          l?: number;
          r?: number;
        };
      }
    ) => void;
  };
  export default Plotly;
} 