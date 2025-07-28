import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Component, CanvasComponent } from '../../types';
import { ElectricalComponentNode } from './ElectricalComponentNode';

interface ReactFlowCanvasProps {
  canvasComponents: CanvasComponent[];
  componentDefinitions: Component[];
  onComponentMove: (id: string, position: { x: number; y: number }) => void;
  onComponentSelect: (ids: string[], addToSelection?: boolean) => void;
  showGrid: boolean;
  showLabels: boolean;
  snapToGrid: boolean;
  gridSize: number;
}

const nodeTypes = {
  electricalComponent: ElectricalComponentNode,
};

const ReactFlowCanvasInner: React.FC<ReactFlowCanvasProps> = ({
  canvasComponents,
  componentDefinitions,
  onComponentMove,
  onComponentSelect,
  showGrid,
  showLabels,
  gridSize,
}) => {
  const { fitView } = useReactFlow();

  // Convert canvas components to React Flow nodes
  const nodes: Node[] = useMemo(() => {
    return canvasComponents.map((canvasComp) => {
      const componentDef = componentDefinitions.find(c => c.id === canvasComp.componentId);
      if (!componentDef) return null;

      return {
        id: canvasComp.id,
        type: 'electricalComponent',
        position: canvasComp.position,
        data: {
          canvasComponent: canvasComp,
          componentDefinition: componentDef,
          showLabels,
        },
        selected: canvasComp.isSelected,
        draggable: !canvasComp.isLocked, // Only check if locked, ignore isDraggable from component definition
        selectable: !canvasComp.isLocked,
      };
    }).filter(Boolean) as Node[];
  }, [canvasComponents, componentDefinitions, showLabels]);

  const [reactFlowNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes when props change
  React.useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Update position immediately without any processing
      onComponentMove(node.id, node.position);
    },
    [onComponentMove]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      const selectedIds = selectedNodes.map(node => node.id);
      onComponentSelect(selectedIds);
    },
    [onComponentSelect]
  );

  return (
    <div className="flex-1 relative">
      <ReactFlow
        nodes={reactFlowNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid={false}
        snapGrid={[1, 1]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.1}
        maxZoom={4}
        attributionPosition="bottom-left"
        deleteKeyCode={null}
        multiSelectionKeyCode="Shift"
        panOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        selectNodesOnDrag={false}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Controls 
          position="top-right"
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
        
        <MiniMap 
          position="bottom-right"
          nodeColor={(node) => {
            const canvasComp = canvasComponents.find(c => c.id === node.id);
            return canvasComp?.isSelected ? '#3b82f6' : '#6b7280';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          pannable
          zoomable
        />
        
        {showGrid && (
          <Background 
            variant={BackgroundVariant.Lines}
            gap={gridSize * 2}
            size={1}
            color="#e5e7eb"
          />
        )}

        <Panel position="bottom-left" className="bg-white px-3 py-2 rounded shadow-sm border text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>Grid: {gridSize}mm</span>
            <span className="text-green-600 font-medium">Free Drag Mode</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const ReactFlowCanvas: React.FC<ReactFlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <ReactFlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
};