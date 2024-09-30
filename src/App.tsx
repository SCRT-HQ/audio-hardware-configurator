// src/App.tsx

import { useState, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as Dialog from "@radix-ui/react-dialog";
import { useAudioDeviceStore } from "./hooks/useAudioDeviceStore";
import DeviceNode from "./components/DeviceNode";
import ConnectionLine from "./components/ConnectionLine";
import DarkModeToggle from "./components/DarkModeToggle";
import AddDeviceForm from "./components/AddDeviceForm";
import { Device, Connection } from "./types/devices";
import { DOT_SIZE, GRID_SIZE } from "./constants/grid";
import EditDeviceForm from "./components/EditDeviceForm";

const queryClient = new QueryClient();

function AudioDeviceArrangerApp() {
  const {
    devices,
    isLoading,
    addDevice,
    updateDevicePosition,
    updateDevice,
    deleteDevice,
  } = useAudioDeviceStore();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [gridSize, setGridSize] = useState({ width: 0, height: 0 });
  const gridContainerRef = useRef<HTMLDivElement>(null);

  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<{
    deviceId: string;
    portId: string;
  } | null>(null);
  const [tempConnection, setTempConnection] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleAddCustomDevice = (deviceData: Omit<Device, "id">) => {
    addDevice({
      ...deviceData,
      id: `device-${Date.now()}`,
    });
  };

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device);
  };

  const handleUpdateDevice = (updatedDevice: Device) => {
    updateDevice(updatedDevice);
    setEditingDevice(null);
  };

  const handleDeleteDevice = (id: string) => {
    deleteDevice(id);
    setConnections(
      connections.filter(
        (conn) => conn.sourceDeviceId !== id && conn.targetDeviceId !== id
      )
    );
  };

  const handlePortClick = (
    deviceId: string,
    portId: string,
    isOutput: boolean,
    event: React.MouseEvent
  ) => {
    if (connectingFrom) {
      if (isOutput || connectingFrom.deviceId === deviceId) {
        // Can't connect output to output or to the same device
        setConnectingFrom(null);
        setTempConnection(null);
        return;
      }
      // Complete the connection
      const newConnection: Connection = {
        id: `connection-${Date.now()}`,
        sourceDeviceId: connectingFrom.deviceId,
        sourcePortId: connectingFrom.portId,
        targetDeviceId: deviceId,
        targetPortId: portId,
      };
      setConnections([...connections, newConnection]);
      setConnectingFrom(null);
      setTempConnection(null);
    } else if (isOutput) {
      // Start a new connection from an output port
      setConnectingFrom({ deviceId, portId });
      setTempConnection({ x: event.clientX, y: event.clientY });
    }
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const updateGridSize = () => {
      if (gridContainerRef.current) {
        const toolbarWidth = 256; // Adjust if needed (w-64 = 16rem = 256px)
        setGridSize({
          width: window.innerWidth - toolbarWidth,
          height: gridContainerRef.current.clientHeight,
        });
      }
    };

    updateGridSize();
    window.addEventListener("resize", updateGridSize);
    return () => window.removeEventListener("resize", updateGridSize);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleGridExpansion = (newPosition: { x: number; y: number }) => {
    setGridSize((prevSize) => ({
      width: Math.max(prevSize.width, newPosition.x + GRID_SIZE),
      height: Math.max(prevSize.height, newPosition.y + GRID_SIZE),
    }));
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (connectingFrom) {
      setTempConnection({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    if (connectingFrom) {
      setConnectingFrom(null);
      setTempConnection(null);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  const dotMatrixStyle = {
    backgroundImage: `
      radial-gradient(circle, ${isDarkMode ? "#4a5568" : "#e0e0e0"} ${
      DOT_SIZE / 2
    }px, transparent ${DOT_SIZE / 2}px)
    `,
    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    backgroundPosition: `-${DOT_SIZE / 2}px -${DOT_SIZE / 2}px`,
    width: `${Math.max(gridSize.width, window.innerWidth - 256)}px`,
    height: `${Math.max(gridSize.height, window.innerHeight - 64)}px`,
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Toolbar */}
      <Dialog.Root
        open={editingDevice !== null}
        onOpenChange={(open) => !open && setEditingDevice(null)}
      >
        <div className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 p-4 shadow-lg pt-16 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
            Add Device
          </h2>
          <AddDeviceForm onAddDevice={handleAddCustomDevice} />
        </div>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <Dialog.Title className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Edit Device
            </Dialog.Title>
            {editingDevice && (
              <EditDeviceForm
                device={editingDevice}
                onUpdateDevice={handleUpdateDevice}
                onCancel={() => setEditingDevice(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Audio Hardware Configurator
          </h1>
          <DarkModeToggle
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </header>

        {/* Grid */}
        <div
          ref={gridContainerRef}
          className="flex-1 overflow-auto"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div
            className="border border-gray-300 dark:border-gray-600 relative transition-colors"
            style={dotMatrixStyle}
          >
            {connections.map((connection) => {
              const sourceDevice = devices.find(
                (d) => d.id === connection.sourceDeviceId
              );
              const targetDevice = devices.find(
                (d) => d.id === connection.targetDeviceId
              );
              if (!sourceDevice || !targetDevice) return null;

              return (
                <ConnectionLine
                  key={connection.id}
                  startX={sourceDevice.position.x + sourceDevice.gridSize * 1.5}
                  startY={sourceDevice.position.y + sourceDevice.gridSize * 1.5}
                  endX={targetDevice.position.x + targetDevice.gridSize * 1.5}
                  endY={targetDevice.position.y + targetDevice.gridSize * 1.5}
                />
              );
            })}
            {connectingFrom && tempConnection && (
              <ConnectionLine
                startX={
                  devices.find((d) => d.id === connectingFrom.deviceId)!
                    .position.x +
                  GRID_SIZE * 1.5
                }
                startY={
                  devices.find((d) => d.id === connectingFrom.deviceId)!
                    .position.y +
                  GRID_SIZE * 1.5
                }
                endX={tempConnection.x}
                endY={tempConnection.y}
                isTemp={true}
              />
            )}
            {devices.map((device) => (
              <DeviceNode
                key={device.id}
                device={device}
                onMove={(id, position) => {
                  updateDevicePosition({ id, position });
                  handleGridExpansion(position);
                }}
                onEdit={handleEditDevice}
                onDelete={handleDeleteDevice}
                onPortClick={handlePortClick}
                isConnecting={!!connectingFrom}
                gridWidth={gridSize.width}
                gridHeight={gridSize.height}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioDeviceArrangerApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
