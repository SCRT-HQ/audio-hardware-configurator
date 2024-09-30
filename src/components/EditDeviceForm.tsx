// src/components/EditDeviceForm.tsx

import React, { useState } from "react";
import { Device, Port } from "../types/devices";

interface EditDeviceFormProps {
  device: Device;
  onUpdateDevice: (updatedDevice: Device) => void;
  onCancel: () => void;
}

const EditDeviceForm: React.FC<EditDeviceFormProps> = ({
  device,
  onUpdateDevice,
  onCancel,
}) => {
  const [name, setName] = useState(device.name);
  const [type, setType] = useState(device.type);
  const [gridSize, setGridSize] = useState(device.gridSize);
  const [inputs, setInputs] = useState<Port[]>(device.inputs);
  const [outputs, setOutputs] = useState<Port[]>(device.outputs);

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        id: `input-${Date.now()}`,
        name: `Input ${inputs.length + 1}`,
        type: "input",
      },
    ]);
  };

  const handleAddOutput = () => {
    setOutputs([
      ...outputs,
      {
        id: `output-${Date.now()}`,
        name: `Output ${outputs.length + 1}`,
        type: "output",
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDevice({
      ...device,
      name,
      type,
      gridSize,
      inputs,
      outputs,
    });
  };

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
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
          onChange={(e) => setType(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
          onChange={(e) => setGridSize(Number(e.target.value))}
          required
          min="10"
          max="100"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <button
          type="button"
          onClick={handleAddInput}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add Input
        </button>
        <button
          type="button"
          onClick={handleAddOutput}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Add Output
        </button>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Inputs: {inputs.length}
        </h4>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Outputs: {outputs.length}
        </h4>
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
  );
};

export default EditDeviceForm;
