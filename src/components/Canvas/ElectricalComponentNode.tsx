import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { CanvasComponent, Component } from '../../types';

interface ElectricalComponentNodeData {
  canvasComponent: CanvasComponent;
  componentDefinition: Component;
  showLabels: boolean;
}

export const ElectricalComponentNode: React.FC<NodeProps<ElectricalComponentNodeData>> = ({
  data,
  selected,
}) => {
  const { canvasComponent, componentDefinition, showLabels } = data;

  const getComponentColor = () => {
    switch (componentDefinition.category) {
      case 'Protection': return 'bg-red-500';
      case 'Control': return 'bg-blue-500';
      case 'Measurement': return 'bg-green-500';
      case 'Busbars': return 'bg-yellow-500';
      case 'Enclosures': return 'bg-gray-500';
      default: return 'bg-purple-500';
    }
  };

  return (
    <div
      className={`relative group ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${canvasComponent.isLocked ? 'cursor-not-allowed' : 'cursor-move'}`}
      style={{
        width: componentDefinition.dimensions.widthPx,
        height: componentDefinition.dimensions.heightPx,
        opacity: canvasComponent.isVisible ? 1 : 0.3,
        transform: `rotate(${canvasComponent.rotation}deg) scale(${canvasComponent.scale.x}, ${canvasComponent.scale.y})`,
      }}
    >
      {/* Component Visual */}
      <div 
        className={`w-full h-full ${getComponentColor()} border-2 border-gray-700 rounded flex items-center justify-center text-white text-xs font-medium shadow-lg overflow-hidden`}
        title={componentDefinition.description}
      >
        {componentDefinition.svgPath ? (
          <div 
            className="w-full h-full flex items-center justify-center p-1"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            dangerouslySetInnerHTML={{ __html: componentDefinition.svgPath }}
          />
        ) : (
          <span className="text-center leading-tight px-1 truncate">
            {componentDefinition.itemCode}
          </span>
        )}
      </div>

      {/* Connection Handles - Only show if not locked */}
      {!canvasComponent.isLocked && (
        <>
          <Handle
            type="source"
            position={Position.Top}
            className="w-2 h-2 !bg-blue-500 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ top: -4 }}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            className="w-2 h-2 !bg-blue-500 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ bottom: -4 }}
          />
          <Handle
            type="source"
            position={Position.Left}
            className="w-2 h-2 !bg-blue-500 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: -4 }}
          />
          <Handle
            type="target"
            position={Position.Right}
            className="w-2 h-2 !bg-blue-500 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ right: -4 }}
          />
        </>
      )}

      {/* Component Label */}
      {showLabels && (
        <div className="absolute -bottom-6 left-0 text-xs bg-white px-1 py-0.5 rounded shadow border whitespace-nowrap z-10">
          {canvasComponent.customName || componentDefinition.itemCode}
        </div>
      )}

      {/* Status Indicators */}
      <div className="absolute top-0 right-0 flex space-x-1">
        {canvasComponent.isLocked && (
          <div className="bg-red-500 text-white text-xs px-1 rounded-bl">
            <Lock className="w-3 h-3" />
          </div>
        )}
        {!canvasComponent.isVisible && (
          <div className="bg-gray-500 text-white text-xs px-1 rounded-bl">
            <EyeOff className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Electrical Rating Badge */}
      {componentDefinition.electricalRatings?.current && (
        <div className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs px-1 rounded text-center">
          {componentDefinition.electricalRatings.current}
        </div>
      )}
    </div>
  );
};