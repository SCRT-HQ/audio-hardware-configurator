import React, { useState } from "react";
import { Device, Port } from "../types/devices";
import * as Form from "@radix-ui/react-form";

interface AddDeviceFormProps {
  onAddDevice: (device: Omit<Device, "id">) => void;
}

const AddDeviceForm: React.FC<AddDeviceFormProps> = ({ onAddDevice }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("synthesizer");
  const [gridSize, setGridSize] = useState(100);
  const [inputs, setInputs] = useState<Port[]>([]);
  const [outputs, setOutputs] = useState<Port[]>([]);

  const handleAddDevice = () => {
    onAddDevice({
      name: name,
      type: type,
      gridSize,
      // width,
      // height,
      inputs: [],
      outputs: [],
      position: { x: 0, y: 0 },
    });
  };

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

  return (
    <Form.Root className="space-y-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-md">
      <Form.Field name="name" className="flex flex-col">
        <Form.Label className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
          Name
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </Form.Control>
      </Form.Field>
      <Form.Field name="type" className="flex flex-col">
        <Form.Label className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
          Type
        </Form.Label>
        <Form.Control asChild>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </Form.Control>
      </Form.Field>
      <Form.Field name="gridSize" className="flex flex-col">
        <Form.Label className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
          Grid Size
        </Form.Label>
        <Form.Control asChild>
          <input
            type="number"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            className="p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </Form.Control>
      </Form.Field>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleAddInput}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Add Input
        </button>
        <button
          type="button"
          onClick={handleAddOutput}
          className="px-2 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
        >
          Add Output
        </button>
      </div>
      <div>
        <div className="flex space-x-4">
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Inputs
            </h3>
            {inputs.map((input) => (
              <div
                key={input.id}
                className="text-xs text-gray-700 dark:text-gray-400"
              >
                {input.name}
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Outputs
            </h3>
            {outputs.map((output) => (
              <div
                key={output.id}
                className="text-xs text-gray-700 dark:text-gray-400"
              >
                {output.name}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <button
          type="submit"
          onClick={handleAddDevice}
          className="px-2 py-1 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800 transition-colors"
        >
          Add Device
        </button>
      </div>
    </Form.Root>
  );
};

export default AddDeviceForm;
