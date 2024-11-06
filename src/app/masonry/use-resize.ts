import { useState } from "react";

export function useResizeObserver(): {ref: (node: HTMLDivElement | null) => void, width: number} {
  const [width, setWidth] = useState(0);

  const ref = (node: HTMLDivElement | null) => {
    if (node) {
      const resizeObserver = new ResizeObserver((entries) => {
        const { width } = entries[0].contentRect;
        setWidth(width);
      });
      resizeObserver.observe(node);
    }
  };

  return { ref, width: width };
}