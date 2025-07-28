import { Component, ComponentCategory } from '../types';

// Mock component data for demonstration
export const mockComponents: Component[] = [
  {
    id: '1',
    itemCode: 'MCB-16A',
    description: '16A Miniature Circuit Breaker',
    dimensions: {
      width: 18,
      height: 85,
      widthPx: 36,
      heightPx: 170
    },
    category: 'Protection',
    isRotatable: true,
    isDraggable: true,
    isResizable: false,
    isToolbarItem: true,
    electricalRatings: {
      voltage: '230V AC',
      current: '16A',
      power: '3.68kW'
    }
  },
  {
    id: '2',
    itemCode: 'CONT-25A',
    description: '25A Contactor',
    dimensions: {
      width: 45,
      height: 78,
      widthPx: 90,
      heightPx: 156
    },
    category: 'Control',
    isRotatable: true,
    isDraggable: true,
    isResizable: false,
    isToolbarItem: true,
    electricalRatings: {
      voltage: '230V AC',
      current: '25A',
      power: '5.75kW'
    }
  },
  {
    id: '3',
    itemCode: 'BB-100A',
    description: '100A Distribution Busbar',
    dimensions: {
      width: 200,
      height: 20,
      widthPx: 400,
      heightPx: 40
    },
    category: 'Busbars',
    isRotatable: true,
    isDraggable: true,
    isResizable: true,
    isToolbarItem: true,
    electricalRatings: {
      current: '100A'
    }
  },
  {
    id: '4',
    itemCode: 'ENC-400x300',
    description: '400x300mm Enclosure',
    dimensions: {
      width: 400,
      height: 300,
      widthPx: 800,
      heightPx: 600
    },
    category: 'Enclosures',
    isRotatable: false,
    isDraggable: true,
    isResizable: true,
    isToolbarItem: false
  },
  {
    id: '5',
    itemCode: 'METER-3P',
    description: '3-Phase Digital Meter',
    dimensions: {
      width: 72,
      height: 72,
      widthPx: 144,
      heightPx: 144
    },
    category: 'Measurement',
    isRotatable: false,
    isDraggable: true,
    isResizable: false,
    isToolbarItem: false,
    electricalRatings: {
      voltage: '415V AC'
    }
  },
  {
    id: '6',
    itemCode: 'RLY-TIMER',
    description: 'Timer Relay',
    dimensions: {
      width: 22.5,
      height: 78,
      widthPx: 45,
      heightPx: 156
    },
    category: 'Control',
    isRotatable: true,
    isDraggable: true,
    isResizable: false,
    isToolbarItem: false
  }
];

export const componentCategories: ComponentCategory[] = [
  'Busbars',
  'Enclosures',
  'Protection',
  'Control',
  'Measurement',
  'Accessories',
  'Other'
];