import { useState, useEffect } from "react";

type Position = {
  x: number;
  y: number;
};

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState<Position | null>(null);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
};
