import React from 'react';
import { CanvasComponent, Component } from '../../types';
import { Lock, Unlock, Eye, EyeOff, RotateCw } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponents: CanvasComponent[];
  componentDefinitions: Component[];
  onUpdateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponents,
  componentDefinitions,
  onUpdateComponent
}) => {
  if (selectedComponents.length === 0) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>
        <div className="text-gray-500 text-center py-8">
          <div className="text-lg mb-2">No Selection</div>
          <div className="text-sm">Select components to view their properties</div>
        </div>
      </div>
    );
  }

  const isMultiSelection = selectedComponents.length > 1;
  const firstComponent = selectedComponents[0];
  const componentDef = componentDefinitions.find(c => c.id === firstComponent.componentId);

  if (!componentDef) return null;

  const handlePropertyChange = (property: keyof CanvasComponent, value: any) => {
    selectedComponents.forEach(component => {
      onUpdateComponent(component.id, { [property]: value });
    });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Properties</h3>
      
      {isMultiSelection && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <div className="text-sm text-blue-800 font-medium">Multiple Selection</div>
          <div className="text-xs text-blue-600">{selectedComponents.length} components selected</div>
        </div>
      )}

      <div className="space-y-6">
        {/* Component Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Component Information</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Item Code:</span>
              <div className="font-medium">{componentDef.itemCode}</div>
            </div>
            <div>
              <span className="text-gray-600">Description:</span>
              <div className="font-medium">{componentDef.description}</div>
            </div>
            <div>
              <span className="text-gray-600">Category:</span>
              <div className="font-medium">{componentDef.category}</div>
            </div>
            <div>
              <span className="text-gray-600">Dimensions:</span>
              <div className="font-medium">
                {componentDef.dimensions.width} × {componentDef.dimensions.height} mm
              </div>
            </div>
          </div>
        </div>

        {/* Position & Transform */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Position & Transform</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">X Position (px)</label>
                <input
                  type="number"
                  value={isMultiSelection ? '' : Math.round(firstComponent.position.x)}
                  onChange={(e) => handlePropertyChange('position', { 
                    ...firstComponent.position, 
                    x: parseInt(e.target.value) || 0 
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder={isMultiSelection ? 'Mixed' : ''}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Y Position (px)</label>
                <input
                  type="number"
                  value={isMultiSelection ? '' : Math.round(firstComponent.position.y)}
                  onChange={(e) => handlePropertyChange('position', { 
                    ...firstComponent.position, 
                    y: parseInt(e.target.value) || 0 
                  })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder={isMultiSelection ? 'Mixed' : ''}
                />
              </div>
            </div>

            {componentDef.isRotatable && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">Rotation (degrees)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={isMultiSelection ? '' : firstComponent.rotation}
                    onChange={(e) => handlePropertyChange('rotation', parseInt(e.target.value) || 0)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                    placeholder={isMultiSelection ? 'Mixed' : ''}
                    step="90"
                  />
                  <button
                    onClick={() => handlePropertyChange('rotation', (firstComponent.rotation + 90) % 360)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Component Settings */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Settings</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Custom Name</label>
              <input
                type="text"
                value={isMultiSelection ? '' : (firstComponent.customName || '')}
                onChange={(e) => handlePropertyChange('customName', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                placeholder={isMultiSelection ? 'Mixed' : 'Enter custom name...'}
              />
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">Layer</label>
              <input
                type="number"
                value={isMultiSelection ? '' : firstComponent.layer}
                onChange={(e) => handlePropertyChange('layer', parseInt(e.target.value) || 1)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                min="1"
                max="10"
                placeholder={isMultiSelection ? 'Mixed' : ''}
              />
            </div>

            <div className="flex space-x-4">
              <label className="flex items-center space-x-2 text-sm">
                <button
                  onClick={() => handlePropertyChange('isLocked', !firstComponent.isLocked)}
                  className={`p-1 rounded ${firstComponent.isLocked ? 'text-red-600' : 'text-gray-400'}`}
                >
                  {firstComponent.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <span className="text-gray-700">
                  {firstComponent.isLocked ? 'Locked' : 'Unlocked'}
                </span>
              </label>

              <label className="flex items-center space-x-2 text-sm">
                <button
                  onClick={() => handlePropertyChange('isVisible', !firstComponent.isVisible)}
                  className={`p-1 rounded ${firstComponent.isVisible ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {firstComponent.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <span className="text-gray-700">
                  {firstComponent.isVisible ? 'Visible' : 'Hidden'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Electrical Ratings */}
        {componentDef.electricalRatings && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Electrical Ratings</h4>
            <div className="space-y-2 text-sm">
              {componentDef.electricalRatings.voltage && (
                <div>
                  <span className="text-gray-600">Voltage:</span>
                  <div className="font-medium">{componentDef.electricalRatings.voltage}</div>
                </div>
              )}
              {componentDef.electricalRatings.current && (
                <div>
                  <span className="text-gray-600">Current:</span>
                  <div className="font-medium">{componentDef.electricalRatings.current}</div>
                </div>
              )}
              {componentDef.electricalRatings.power && (
                <div>
                  <span className="text-gray-600">Power:</span>
                  <div className="font-medium">{componentDef.electricalRatings.power}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};