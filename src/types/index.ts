// Core type definitions for the electrical panel designer

export interface Component {
  id: string;
  itemCode: string;
  description: string;
  dimensions: {
    width: number; // in mm
    height: number; // in mm
    widthPx: number; // converted to pixels
    heightPx: number; // converted to pixels
  };
  svgPath?: string;
  category: ComponentCategory;
  isRotatable: boolean;
  isDraggable: boolean; // This is for component definition only, not canvas behavior
  isResizable: boolean;
  isToolbarItem: boolean;
  linkedItemId?: string;
  electricalRatings?: {
    voltage?: string;
    current?: string;
    power?: string;
  };
}

export interface CanvasComponent {
  id: string;
  componentId: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number; // in degrees
  scale: {
    x: number;
    y: number;
  };
  customName?: string;
  layer: number;
  isLocked: boolean; // This controls dragging behavior on canvas
  isVisible: boolean;
  isSelected: boolean;
}

export interface QuotationItem {
  id: string;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addedToCanvas: number;
}

export interface QuotationTemplate {
  id: string;
  name: string;
  description: string;
  items: QuotationItem[];
  canvasState: CanvasState;
  thumbnail?: string;
  createdAt: Date;
  lastModified: Date;
}

export interface CanvasState {
  components: CanvasComponent[];
  zoom: number;
  pan: {
    x: number;
    y: number;
  };
  gridSize: number;
  showGrid: boolean;
  showRulers: boolean;
  showLabels: boolean;
  snapToGrid: boolean; // Always false, kept for compatibility
}

export interface AppState {
  canvas: CanvasState;
  components: Component[];
  quotation: QuotationItem[];
  quotationTemplates: QuotationTemplate[];
  activeTab: 'design' | 'database' | 'quotation';
  selectedComponentIds: string[];
  undoStack: CanvasState[];
  redoStack: CanvasState[];
  hasUnsavedChanges: boolean;
  lastSaved: Date;
}

export type ComponentCategory = 
  | 'Busbars'
  | 'Enclosures' 
  | 'Protection'
  | 'Control'
  | 'Measurement'
  | 'Accessories'
  | 'Other';

export interface GridSettings {
  size: number;
  majorLines: number;
  visible: boolean;
  snap: boolean; // Always false
}

export interface ViewSettings {
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  showRulers: boolean;
  showLabels: boolean;
}