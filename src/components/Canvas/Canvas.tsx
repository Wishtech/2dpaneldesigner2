import React from 'react';
import { CanvasState, CanvasComponent, Component } from '../../types';
import { ReactFlowCanvas } from './ReactFlowCanvas';

interface CanvasProps {
  canvasState: CanvasState;
  components: Component[];
  onComponentMove: (id: string, position: { x: number; y: number }) => void;
  onComponentSelect: (ids: string[], addToSelection?: boolean) => void;
  onCanvasClick: (position: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  canvasState,
  components,
  onComponentMove,
  onComponentSelect,
  onCanvasClick,
  onZoomChange,
  onPanChange
}) => {
  return (
    <ReactFlowCanvas
      canvasComponents={canvasState.components}
      componentDefinitions={components}
      onComponentMove={onComponentMove}
      onComponentSelect={onComponentSelect}
      showGrid={canvasState.showGrid}
      showLabels={canvasState.showLabels}
      snapToGrid={canvasState.snapToGrid}
      gridSize={canvasState.gridSize}
    />
  );
};