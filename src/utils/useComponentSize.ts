import { useState, useCallback, useLayoutEffect } from "react";

function getSize(el: HTMLElement | null) {
  if (!el) {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: el.offsetWidth,
    height: el.offsetHeight,
  };
}

/**
 From https://github.com/rehooks/component-size.
 Had to be updated to use useCallback hook instead of accepting useRef ref values
 because ref.current is not reactive. See https://reactjs.org/docs/hooks-reference.html#useref
*/
export default function useComponentSize<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [componentSize, setComponentSize] = useState(getSize(node));

  const ref = useCallback((n: T | null) => setNode(n), []);

  const handleResize = useCallback(() => setComponentSize(getSize(node)), [
    node,
  ]);

  useLayoutEffect(() => {
    if (!node) {
      return;
    }
    handleResize();
    if (typeof ResizeObserver === "function") {
      let resizeObserver: ResizeObserver | null = new ResizeObserver(() => handleResize());
      resizeObserver.observe(node);
      return () => {
        resizeObserver?.disconnect();
        resizeObserver = null;
      };
    } else {
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [node, handleResize]);

  return [ref, componentSize] as const;
}
