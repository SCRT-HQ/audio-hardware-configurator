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
  ConnectionLineType,
  applyNodeChanges,
  OnNodesChange,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './reactflow-dark.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import * as Dialog from '@radix-ui/react-dialog'
import { useAudioDeviceStore } from './hooks/useAudioDeviceStore'
import CustomNode from './components/CustomNode'
import CustomEdge from './components/CustomEdge'
import DarkModeToggle from './components/DarkModeToggle'
import AddDeviceForm from './components/AddDeviceForm'
import { Device } from './types/devices'
import EditDeviceForm from './components/EditDeviceForm'
import CustomConnectionLine from './components/CustomConnectionLine'

const queryClient = new QueryClient()

const nodeTypes = {
  customNode: CustomNode,
}

const edgeTypes = {
  custom: CustomEdge,
}

function AudioDeviceArrangerApp() {
  const {
    devices,
    connections,
    isLoading,
    addDevice,
    updateDevice,
    deleteDevice,
    addConnection,
    removeConnection,
    updateDevicePosition,
  } = useAudioDeviceStore()

  const [nodes, setNodes] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [isAddingDevice, setIsAddingDevice] = useState(false)

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const handleEdgeDelete = useCallback(
    (edgeId: string) => {
      removeConnection(edgeId)
      setEdges(eds => eds.filter(e => e.id !== edgeId))
    },
    [removeConnection],
  )

  useEffect(() => {
    if (devices && connections) {
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

      const flowEdges = connections.map(connection => ({
        id: connection.id,
        source: connection.sourceDeviceId,
        target: connection.targetDeviceId,
        sourceHandle: connection.sourcePortId,
        targetHandle: connection.targetPortId,
        type: 'custom',
        data: { onDelete: handleEdgeDelete },
      }))
      setEdges(flowEdges)
    }
  }, [devices, connections, handleEdgeDelete])

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

  const onNodesChange: OnNodesChange = useCallback(
    changes => {
      setNodes(nds => applyNodeChanges(changes, nds))
    },
    [setNodes],
  )

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      updateDevicePosition({ id: node.id, position: node.position })
    },
    [updateDevicePosition],
  )

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: isDarkMode ? '#a0aec0' : '#4a5568', strokeWidth: 2 },
      }
      setEdges(eds => addEdge(newEdge, eds))
      addConnection({
        id: `${params.source}-${params.target}-${params.sourceHandle}-${params.targetHandle}`,
        sourceDeviceId: params.source,
        sourcePortId: params.sourceHandle as string,
        targetDeviceId: params.target,
        targetPortId: params.targetHandle as string,
      })
    },
    [setEdges, addConnection, isDarkMode],
  )

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      edgesToDelete.forEach(edge => {
        removeConnection(edge.id)
      })
    },
    [removeConnection],
  )

  const handleAddCustomDevice = (deviceData: Omit<Device, 'id'>) => {
    const newDevice = {
      ...deviceData,
      id: `device-${Date.now()}`,
      position: { x: 100, y: 100 },
    }
    addDevice(newDevice)
    setIsAddingDevice(false)
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
  }

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Audio Hardware Configurator
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsAddingDevice(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Device
          </button>
          <DarkModeToggle
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{ hideAttribution: true }}
          style={{ zIndex: 0 }}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 2 }}
          className={isDarkMode ? 'dark-flow' : ''}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineComponent={CustomConnectionLine}
        >
          <Controls className={isDarkMode ? 'dark-controls' : ''} />
          <MiniMap className={isDarkMode ? 'dark-minimap' : ''} />
          <Background color={isDarkMode ? '#555' : '#aaa'} gap={16} />
        </ReactFlow>
      </div>

      {/* Add Device Dialog */}
      <Dialog.Root
        open={isAddingDevice}
        onOpenChange={open => !open && setIsAddingDevice(false)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <Dialog.Title className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Add Device
            </Dialog.Title>
            <AddDeviceForm onAddDevice={handleAddCustomDevice} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit Device Dialog */}
      <Dialog.Root
        open={editingDevice !== null}
        onOpenChange={open => !open && setEditingDevice(null)}
      >
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
