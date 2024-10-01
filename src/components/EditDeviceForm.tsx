// src/components/EditDeviceForm.tsx

import React, { useState } from 'react'
import { Device, Port } from '../types/devices'
import { colorOptions } from '../constants/colors'

interface EditDeviceFormProps {
  device: Device
  onUpdateDevice: (updatedDevice: Device) => void
  onCancel: () => void
}

const EditDeviceForm: React.FC<EditDeviceFormProps> = ({
  device,
  onUpdateDevice,
  onCancel,
}) => {
  const [name, setName] = useState(device.name)
  const [type, setType] = useState(device.type)
  const [gridSize, setGridSize] = useState(device.gridSize)
  const [inputs, setInputs] = useState<Port[]>(device.inputs)
  const [outputs, setOutputs] = useState<Port[]>(device.outputs)

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        id: `input-${Date.now()}`,
        name: `Input ${inputs.length + 1}`,
        type: 'input',
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      },
    ])
  }

  const handleAddOutput = () => {
    setOutputs([
      ...outputs,
      {
        id: `output-${Date.now()}`,
        name: `Output ${outputs.length + 1}`,
        type: 'output',
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
      },
    ])
  }

  const handleRemoveInput = (id: string) => {
    setInputs(inputs.filter(input => input.id !== id))
  }

  const handleRemoveOutput = (id: string) => {
    setOutputs(outputs.filter(output => output.id !== id))
  }

  const handleUpdatePort = (
    portType: 'input' | 'output',
    id: string,
    newName: string,
  ) => {
    if (portType === 'input') {
      setInputs(
        inputs.map(input =>
          input.id === id ? { ...input, name: newName } : input,
        ),
      )
    } else {
      setOutputs(
        outputs.map(output =>
          output.id === id ? { ...output, name: newName } : output,
        ),
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateDevice({
      ...device,
      name,
      type,
      gridSize,
      inputs,
      outputs,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Type
        </label>
        <input
          type="text"
          id="type"
          value={type}
          onChange={e => setType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label
          htmlFor="gridSize"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Grid Size
        </label>
        <input
          type="number"
          id="gridSize"
          value={gridSize}
          onChange={e => setGridSize(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Inputs
        </h3>
        {inputs.map(input => (
          <div key={input.id} className="flex items-center mb-2">
            <input
              type="text"
              value={input.name}
              onChange={e =>
                handleUpdatePort('input', input.id, e.target.value)
              }
              className="flex-grow mr-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={() => handleRemoveInput(input.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddInput}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Input
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Outputs
        </h3>
        {outputs.map(output => (
          <div key={output.id} className="flex items-center mb-2">
            <input
              type="text"
              value={output.name}
              onChange={e =>
                handleUpdatePort('output', output.id, e.target.value)
              }
              className="flex-grow mr-2 p-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              type="button"
              onClick={() => handleRemoveOutput(output.id)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOutput}
          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Output
        </button>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
        >
          Update Device
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditDeviceForm
