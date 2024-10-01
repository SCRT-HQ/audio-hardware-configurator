// src/components/CustomEdge.tsx

import React from 'react'
import { getBezierPath, EdgeProps } from '@xyflow/react'

const CustomEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <path
        id={id}
        style={{ ...style, zIndex: 1000 }}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <foreignObject
        width={20}
        height={20}
        x={(sourceX + targetX) / 2 - 10}
        y={(sourceY + targetY) / 2 - 10}
        className="overflow-visible pointer-events-none"
        requiredExtensions="http://www.w3.org/1999/xhtml"
        style={{ zIndex: 1001 }}
      >
        <div className="flex justify-center items-center w-full h-full">
          <button
            className="w-3 h-3 bg-red-500 border-1 border-white text-white rounded-full edge-button leading-none cursor-pointer pointer-events-auto transition-all duration-200 ease-in-out hover:bg-red-600 hover:scale-110 shadow-md flex justify-center items-center"
            style={{ zIndex: 1002 }}
            onClick={event => {
              event.stopPropagation()
              if (data && typeof data.onDelete === 'function') {
                data.onDelete(id)
              }
            }}
          >
            X
          </button>
        </div>
      </foreignObject>
    </>
  )
}

export default CustomEdge
