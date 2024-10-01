import React from 'react'
import {
  ConnectionLineComponentProps,
  getBezierPath,
  Position,
} from '@xyflow/react'

const CustomConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}) => {
  const [edgePath] = getBezierPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: 'bottom' as Position,
    targetX: toX,
    targetY: toY,
    targetPosition: 'top' as Position,
  })

  return (
    <path
      fill="none"
      stroke={connectionLineStyle?.stroke || '#999'}
      strokeWidth={connectionLineStyle?.strokeWidth || 1}
      className="animated"
      d={edgePath}
    />
  )
}

export default CustomConnectionLine
