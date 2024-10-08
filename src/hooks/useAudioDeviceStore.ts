// src/hooks/useAudioDeviceStore.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Device, Connection } from '../types/devices'
import { GRID_SIZE } from '../constants/grid'

const DEVICES_KEY = ['devices']
const CONNECTIONS_KEY = ['connections']
const STORAGE_KEY = 'audioDeviceArrangerState'

// Load initial state from localStorage
const loadInitialState = (): {
  devices: Device[]
  connections: Connection[]
} => {
  const savedState = localStorage.getItem(STORAGE_KEY)
  if (savedState) {
    return JSON.parse(savedState)
  }
  return { devices: [], connections: [] }
}

let { devices, connections } = loadInitialState()

// Save state to localStorage
const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ devices, connections }))
}

// Simulated API functions
const getDevices = () => Promise.resolve(devices)
const getConnections = () => Promise.resolve(connections)

const addDevice = (device: Device) => {
  const snappedPosition = {
    x: Math.round(device.position.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(device.position.y / GRID_SIZE) * GRID_SIZE,
  }
  const newDevice = { ...device, position: snappedPosition }
  devices.push(newDevice)
  saveState()
  return Promise.resolve(newDevice)
}

const updateDevicePosition = (
  id: string,
  position: { x: number; y: number },
) => {
  devices = devices.map(d => (d.id === id ? { ...d, position } : d))
  saveState()
  return Promise.resolve(devices.find(d => d.id === id))
}

const updateDevice = (updatedDevice: Device) => {
  devices = devices.map(d => (d.id === updatedDevice.id ? updatedDevice : d))

  // Remove connections for deleted ports
  connections = connections.filter(conn => {
    const sourceDevice = devices.find(d => d.id === conn.sourceDeviceId)
    const targetDevice = devices.find(d => d.id === conn.targetDeviceId)
    if (!sourceDevice || !targetDevice) return false
    const sourcePort = sourceDevice.outputs.find(
      o => o.id === conn.sourcePortId,
    )
    const targetPort = targetDevice.inputs.find(i => i.id === conn.targetPortId)
    return sourcePort && targetPort
  })

  saveState()
  return Promise.resolve(updatedDevice)
}

const deleteDevice = (id: string) => {
  devices = devices.filter(d => d.id !== id)
  connections = connections.filter(
    c => c.sourceDeviceId !== id && c.targetDeviceId !== id,
  )
  saveState()
  return Promise.resolve()
}

const addConnection = (connection: Connection) => {
  connections.push(connection)
  saveState()
  return Promise.resolve(connection)
}

const removeConnection = (connectionId: string) => {
  connections = connections.filter(c => c.id !== connectionId)
  saveState()
  return Promise.resolve()
}

export function useAudioDeviceStore() {
  const queryClient = useQueryClient()

  const devicesQuery = useQuery({
    queryKey: DEVICES_KEY,
    queryFn: getDevices,
  })

  const connectionsQuery = useQuery({
    queryKey: CONNECTIONS_KEY,
    queryFn: getConnections,
  })

  const addDeviceMutation = useMutation({
    mutationFn: addDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_KEY })
    },
  })

  const updateDeviceMutation = useMutation({
    mutationFn: updateDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_KEY })
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY })
    },
  })

  const deleteDeviceMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_KEY })
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY })
    },
  })

  const updateDevicePositionMutation = useMutation({
    mutationFn: ({
      id,
      position,
    }: {
      id: string
      position: { x: number; y: number }
    }) => updateDevicePosition(id, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICES_KEY })
    },
  })

  const addConnectionMutation = useMutation({
    mutationFn: addConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY })
    },
  })

  const removeConnectionMutation = useMutation({
    mutationFn: removeConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CONNECTIONS_KEY })
    },
  })

  return {
    devices: devicesQuery.data || [],
    connections: connectionsQuery.data || [],
    isLoading: devicesQuery.isLoading || connectionsQuery.isLoading,
    addDevice: addDeviceMutation.mutate,
    updateDevicePosition: updateDevicePositionMutation.mutate,
    addConnection: addConnectionMutation.mutate,
    removeConnection: removeConnectionMutation.mutate,
    updateDevice: updateDeviceMutation.mutate,
    deleteDevice: deleteDeviceMutation.mutate,
  }
}
