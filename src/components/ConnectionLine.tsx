// src/components/ConnectionLine.tsx

import React from 'react'

interface ConnectionLineProps {
  startX: number
  startY: number
  endX: number
  endY: number
  isTemp?: boolean
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  startX,
  startY,
  endX,
  endY,
  isTemp = false,
}) => {
  // Calculate control points for a quadratic bezier curve
  const midX = (startX + endX) / 2
  const midY = (startY + endY) / 2
  const controlX = midX
  const controlY = midY - Math.abs(endY - startY) / 2

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <path
        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
        fill="none"
        stroke={isTemp ? 'rgba(59, 130, 246, 0.5)' : 'rgb(59, 130, 246)'}
        strokeWidth="2"
        strokeDasharray={isTemp ? '5,5' : 'none'}
      />
    </svg>
  )
}

export default ConnectionLine
