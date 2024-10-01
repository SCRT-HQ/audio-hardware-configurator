// src/components/CustomNode.tsx

import React from 'react'
import { Handle, Position } from '@xyflow/react'
import { Device, Port } from '../types/devices'

interface CustomNodeData extends Device {
  onEdit: (device: Device) => void
  onDelete: (id: string) => void
}

const CustomNode: React.FC<{ data: CustomNodeData }> = ({ data }) => {
  return (
    <div
      className="px-4 py-2 shadow-md rounded-md bg-white dark:bg-gray-800 border-2 border-stone-400 dark:border-gray-600"
      style={{ zIndex: 0 }}
    >
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {data.type.charAt(0).toUpperCase()}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            {data.name}
          </div>
          <div className="text-gray-500 dark:text-gray-400">{data.type}</div>
        </div>
      </div>

      <div className="mt-2">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Inputs:
        </div>
        {data.inputs.map((input: Port, index: number) => (
          <div key={input.id} className="flex items-center">
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              style={{ left: -8, top: `${(index + 1) * 24}px` }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
              {input.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Outputs:
        </div>
        {data.outputs.map((output: Port, index: number) => (
          <div key={output.id} className="flex items-center justify-end">
            <span className="text-xs text-gray-600 dark:text-gray-400 mr-2">
              {output.name}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ right: -8, top: `${(index + 1) * 24}px` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-end">
        <button
          className="mr-2 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          onClick={() => data.onEdit(data)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
          onClick={() => data.onDelete(data.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default CustomNode
