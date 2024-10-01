// src/App.tsx

import { useState, useCallback, useEffect, useMemo } from 'react'
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './reactflow-dark.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as Dialog from '@radix-ui/react-dialog'
import { useAudioDeviceStore } from './hooks/useAudioDeviceStore'
import CustomNode from './components/CustomNode'
import DarkModeToggle from './components/DarkModeToggle'
import AddDeviceForm from './components/AddDeviceForm'
import { Device } from './types/devices'
import EditDeviceForm from './components/EditDeviceForm'

const queryClient = new QueryClient()

const nodeTypes = {
  customNode: CustomNode,
}

function AudioDeviceArrangerApp() {
  const {
    devices,
    isLoading,
    addDevice,
    // updateDevicePosition,
    updateDevice,
    deleteDevice,
    addConnection,
  } = useAudioDeviceStore()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [editingDevice, setEditingDevice] = useState<Device | null>(null)

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (devices) {
      const flowNodes = devices.map(device => ({
        id: device.id,
        type: 'customNode',
        position: device.position,
        data: {
          ...device,
          onEdit: handleEditDevice,
          onDelete: handleDeleteDevice,
        },
      }))
      setNodes(flowNodes)
    }
  }, [devices])

  const defaultEdgeOptions = useMemo(
    () => ({
      style: {
        strokeWidth: 2,
        stroke: isDarkMode ? '#a0aec0' : '#4a5568',
      },
      animated: true,
    }),
    [isDarkMode],
  )

  useEffect(() => {
    setEdges(eds =>
      eds.map(edge => ({
        ...edge,
        style: {
          ...edge.style,
          stroke: isDarkMode ? '#a0aec0' : '#4a5568',
        },
      })),
    )
  }, [isDarkMode])

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: isDarkMode ? '#a0aec0' : '#4a5568', strokeWidth: 2 },
      }
      setEdges(eds => addEdge(newEdge, eds))
      addConnection({
        id: `${params.source}-${params.target}`,
        sourceDeviceId: params.source,
        sourcePortId: params.sourceHandle as string,
        targetDeviceId: params.target,
        targetPortId: params.targetHandle as string,
      })
    },
    [setEdges, addConnection, isDarkMode],
  )

  const handleAddCustomDevice = (deviceData: Omit<Device, 'id'>) => {
    const newDevice = {
      ...deviceData,
      id: `device-${Date.now()}`,
      position: { x: 100, y: 100 },
    }
    addDevice(newDevice)
  }

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device)
  }

  const handleUpdateDevice = (updatedDevice: Device) => {
    updateDevice(updatedDevice)
    setEditingDevice(null)
  }

  const handleDeleteDevice = (id: string) => {
    deleteDevice(id)
    setNodes(nds => nds.filter(node => node.id !== id))
    setEdges(eds =>
      eds.filter(edge => edge.source !== id && edge.target !== id),
    )
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Toolbar */}
      <Dialog.Root
        open={editingDevice !== null}
        onOpenChange={open => !open && setEditingDevice(null)}
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

        {/* React Flow */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-900">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 2 }}
            className={isDarkMode ? 'dark-flow' : ''}
          >
            <Controls className={isDarkMode ? 'dark-controls' : ''} />
            <MiniMap className={isDarkMode ? 'dark-minimap' : ''} />
            <Background color={isDarkMode ? '#555' : '#aaa'} gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AudioDeviceArrangerApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
