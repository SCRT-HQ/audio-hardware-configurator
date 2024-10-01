// src/types/devices.ts

export interface Port {
  id: string
  name: string
  type: 'input' | 'output'
  color: string
}

export interface Device {
  id: string
  name: string
  type: string
  gridSize: number
  inputs: Port[]
  outputs: Port[]
  position: { x: number; y: number }
}

export interface Connection {
  id: string
  sourceDeviceId: string
  sourcePortId: string
  targetDeviceId: string
  targetPortId: string
}
