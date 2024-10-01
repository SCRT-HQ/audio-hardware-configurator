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
    <div className="px-4 py-2 shadow-md rounded-md bg-white dark:bg-gray-800 border-2 border-stone-400 dark:border-gray-600">
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

      {data.inputs.map((input: Port, index: number) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{ top: `${25 + index * 20}%` }}
        />
      ))}

      {data.outputs.map((output: Port, index: number) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{ top: `${25 + index * 20}%` }}
        />
      ))}

      <div className="mt-2 flex justify-end">
        <button
          className="mr-2 px-2 py-1 bg-blue-500 text-white rounded text-sm"
          onClick={() => data.onEdit(data)}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded text-sm"
          onClick={() => data.onDelete(data.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default CustomNode
