import React from "react";
import * as Form from "@radix-ui/react-form";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Device } from "../types/devices";

interface DeviceFormProps {
  device: Device | null;
  onSubmit: (device: Device) => void;
}

const DeviceForm: React.FC<DeviceFormProps> = ({ device, onSubmit }) => {
  const [inputs, setInputs] = React.useState(device?.inputs || []);
  const [outputs, setOutputs] = React.useState(device?.outputs || []);
  const [gridSize, setGridSize] = React.useState(device?.gridSize || 100); // Default to 20 if not provided

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    onSubmit({
      id: device?.id || "",
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      inputs,
      outputs,
      position: device?.position || { x: 0, y: 0 },
      gridSize: gridSize,
    });
  };

  return (
    <Form.Root onSubmit={handleSubmit}>
      <Form.Field name="name">
        <Form.Label>Name</Form.Label>
        <Form.Control asChild>
          <input
            className="border p-2 w-full"
            defaultValue={device?.name}
            required
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="type">
        <Form.Label>Type</Form.Label>
        <Form.Control asChild>
          <input
            className="border p-2 w-full"
            defaultValue={device?.type}
            required
          />
        </Form.Control>
      </Form.Field>

      <Form.Field name="gridSize">
        <Form.Label>Grid Size</Form.Label>
        <Form.Control asChild>
          <input
            type="number"
            className="border p-2 w-full"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
            required
          />
        </Form.Control>
      </Form.Field>

      {/* ... rest of your component ... */}

      <div className="mt-4">
        <label>Inputs</label>
        <ToggleGroup.Root
          type="multiple"
          value={inputs.map((i) => i.id)}
          onValueChange={(value) =>
            setInputs(
              value.map((id) => ({ id, name: `Input ${id}`, type: "input" }))
            )
          }
        >
          {[1, 2, 3, 4].map((num) => (
            <ToggleGroup.Item
              key={num}
              value={`input-${num}`}
              className="border p-2 m-1 data-[state=on]:bg-blue-500 data-[state=on]:text-white"
            >
              {num}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <div className="mt-4">
        <label>Outputs</label>
        <ToggleGroup.Root
          type="multiple"
          value={outputs.map((o) => o.id)}
          onValueChange={(value) =>
            setOutputs(
              value.map((id) => ({ id, name: `Output ${id}`, type: "output" }))
            )
          }
        >
          {[1, 2, 3, 4].map((num) => (
            <ToggleGroup.Item
              key={num}
              value={`output-${num}`}
              className="border p-2 m-1 data-[state=on]:bg-green-500 data-[state=on]:text-white"
            >
              {num}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      </div>

      <Form.Submit asChild>
        <button className="mt-4 bg-blue-500 text-white p-2 rounded">
          {device ? "Update Device" : "Add Device"}
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default DeviceForm;
