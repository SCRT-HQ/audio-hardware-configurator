// src/components/DeviceNode.tsx

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Device, Port } from "../types/devices";

interface DeviceNodeProps {
  device: Device;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onEdit: (device: Device) => void;
  onDelete: (id: string) => void;
  onPortClick: (deviceId: string, portId: string, isOutput: boolean) => void;
  isConnecting: boolean;
  gridWidth: number;
  gridHeight: number;
}

const DeviceNode: React.FC<DeviceNodeProps> = ({
  device,
  onMove,
  onEdit,
  onDelete,
  onPortClick,
  isConnecting,
  gridWidth,
  gridHeight,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(device.position);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [nodeSize, setNodeSize] = useState({ width: 0, height: 0 });

  console.log("inputs", gridWidth, gridHeight, nodeSize);

  useEffect(() => {
    setPosition(device.position);
  }, [device.position]);

  useEffect(() => {
    if (nodeRef.current) {
      setNodeSize({
        width: nodeRef.current.offsetWidth,
        height: nodeRef.current.offsetHeight,
      });
    }
  }, []);

  const snapToGrid = useCallback(
    (x: number, y: number) => {
      const snappedX = Math.round(x / device.gridSize) * device.gridSize;
      const snappedY = Math.round(y / device.gridSize) * device.gridSize;
      return { x: snappedX, y: snappedY };
    },
    [device.gridSize]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      setPosition((prevPos) => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));

      dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        const snappedPosition = snapToGrid(position.x, position.y);
        setPosition(snappedPosition);
        onMove(device.id, snappedPosition);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, device.id, onMove, position, snapToGrid]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const renderPorts = (ports: Port[], isOutput: boolean) => (
    <div className={`${isOutput ? "outputs" : "inputs"} mt-2`}>
      <h4 className="text-sm font-semibold">
        {isOutput ? "Outputs" : "Inputs"}
      </h4>
      {ports.map((port) => (
        <div
          key={port.id}
          className={`text-xs cursor-pointer ${
            isConnecting ? "hover:bg-blue-200 dark:hover:bg-blue-700" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onPortClick(device.id, port.id, isOutput);
          }}
        >
          {port.name}
        </div>
      ))}
    </div>
  );

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            ref={nodeRef}
            className="absolute bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-3 select-none shadow-md transition-colors"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              cursor: isDragging ? "grabbing" : "grab",
              width: `${device.gridSize * 3}px`,
              height: `${device.gridSize * 3}px`,
            }}
            onMouseDown={handleMouseDown}
          >
            <h3 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
              {device.name}
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Type: {device.type}
            </div>
            {renderPorts(device.inputs, false)}
            {renderPorts(device.outputs, true)}
            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Grid: ({Math.round(position.x / device.gridSize)},{" "}
              {Math.round(position.y / device.gridSize)})
            </div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="mt-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
                  Actions
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="bg-white dark:bg-gray-800 rounded shadow-lg p-1">
                  <DropdownMenu.Item
                    className="px-2 py-1 text-sm text-gray-800 dark:text-white hover:bg-blue-500 hover:text-white rounded cursor-pointer"
                    onSelect={() => onEdit(device)}
                  >
                    Edit
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="px-2 py-1 text-sm text-gray-800 dark:text-white hover:bg-red-500 hover:text-white rounded cursor-pointer"
                    onSelect={() => onDelete(device.id)}
                  >
                    Delete
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className="bg-gray-800 text-white p-2 rounded text-sm">
            <p>Inputs: {device.inputs.length}</p>
            <p>Outputs: {device.outputs.length}</p>
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default DeviceNode;
