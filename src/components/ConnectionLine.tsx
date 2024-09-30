// src/components/ConnectionLine.tsx

import React from "react";

interface ConnectionLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  startX,
  startY,
  endX,
  endY,
}) => {
  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
};

export default ConnectionLine;
