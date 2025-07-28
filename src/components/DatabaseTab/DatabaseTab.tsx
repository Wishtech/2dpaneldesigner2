import React, { useState } from 'react';
import { Component, ComponentCategory } from '../../types';
import { componentCategories } from '../../data/mockComponents';
import { Plus, Edit, Trash2, Upload, Download, Image } from 'lucide-react';

interface DatabaseTabProps {
  components: Component[];
  onAddComponent: (component: Omit<Component, 'id'>) => void;
  onUpdateComponent: (id: string, updates: Partial<Component>) => void;
  onDeleteComponent: (id: string) => void;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({
  components,
  onAddComponent,
  onUpdateComponent,
  onDeleteComponent
}) => {
  const [editingComponent, setEditingComponent] = useState<Component | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const ComponentForm: React.FC<{ 
    component?: Component; 
    onSave: (data: Omit<Component, 'id'>) => void; 
    onCancel: () => void 
  }> = ({ component, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Component, 'id'>>({
      itemCode: component?.itemCode || '',
      description: component?.description || '',
      dimensions: component?.dimensions || { width: 0, height: 0, widthPx: 0, heightPx: 0 },
      category: component?.category || 'Other',
      isRotatable: component?.isRotatable || false,
      isDraggable: component?.isDraggable || true,
      isResizable: component?.isResizable || false,
      isToolbarItem: component?.isToolbarItem || false,
      electricalRatings: component?.electricalRatings || {},
      svgPath: component?.svgPath || ''
    });

    const handleDimensionChange = (field: 'width' | 'height', value: number) => {
      const pixelRatio = 2; // 2px = 1mm
      const newDimensions = {
        ...formData.dimensions,
        [field]: value,
        [`${field}Px`]: value * pixelRatio
      };
      setFormData({ ...formData, dimensions: newDimensions });
    };

    const handleSvgUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const svgContent = e.target?.result as string;
          setFormData({ ...formData, svgPath: svgContent });
        };
        reader.readAsText(file);
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">
            {component ? 'Edit Component' : 'Add New Component'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Code *
                    </label>
                    <input
                      type="text"
                      value={formData.itemCode}
                      onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as ComponentCategory })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {componentCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Width (mm) *
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.width}
                      onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Pixels: {formData.dimensions.widthPx}px
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (mm) *
                    </label>
                    <input
                      type="number"
                      value={formData.dimensions.height}
                      onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.1"
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Pixels: {formData.dimensions.heightPx}px
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Behavior Settings</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isRotatable}
                        onChange={(e) => setFormData({ ...formData, isRotatable: e.target.checked })}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm">Rotatable</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isDraggable}
                        onChange={(e) => setFormData({ ...formData, isDraggable: e.target.checked })}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm">Draggable</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isResizable}
                        onChange={(e) => setFormData({ ...formData, isResizable: e.target.checked })}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm">Resizable</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.isToolbarItem}
                        onChange={(e) => setFormData({ ...formData, isToolbarItem: e.target.checked })}
                        className="rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm">Show in Toolbar</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Electrical Ratings</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Voltage"
                      value={formData.electricalRatings?.voltage || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        electricalRatings: { ...formData.electricalRatings, voltage: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Current"
                      value={formData.electricalRatings?.current || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        electricalRatings: { ...formData.electricalRatings, current: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Power"
                      value={formData.electricalRatings?.power || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        electricalRatings: { ...formData.electricalRatings, power: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - SVG Upload */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Component SVG Image
                  </label>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.svgPath ? (
                      <div className="space-y-4">
                        <div className="w-full h-48 bg-gray-50 rounded border flex items-center justify-center overflow-hidden">
                          <div 
                            className="max-w-full max-h-full flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: formData.svgPath }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, svgPath: '' })}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove SVG
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Image className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <label className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-800 font-medium">
                              Click to upload SVG
                            </span>
                            <input
                              type="file"
                              accept=".svg,image/svg+xml"
                              onChange={handleSvgUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            SVG files only, max 1MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
                  <div 
                    className="bg-white border rounded p-4 flex items-center justify-center overflow-hidden"
                    style={{
                      width: Math.max(formData.dimensions.widthPx, 60),
                      height: Math.max(formData.dimensions.heightPx, 40),
                      maxWidth: '200px',
                      maxHeight: '120px'
                    }}
                  >
                    {formData.svgPath ? (
                      <div 
                        className="max-w-full max-h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: formData.svgPath }} 
                      />
                    ) : (
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        {formData.itemCode || 'ITEM'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {component ? 'Update' : 'Add'} Component
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Component Database</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Component</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Upload className="w-4 h-4" />
            <span>Import CSV</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pixel Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Properties
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {components.map((component) => (
                <tr key={component.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-12 h-8 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                      {component.svgPath ? (
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                          dangerouslySetInnerHTML={{ __html: component.svgPath }}
                        />
                      ) : (
                        <div className="w-6 h-4 bg-blue-500 rounded-sm"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {component.itemCode}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">{component.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {component.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {component.dimensions.width} × {component.dimensions.height} mm
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {component.dimensions.widthPx} × {component.dimensions.heightPx} px
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-1">
                      {component.isRotatable && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">R</span>}
                      {component.isResizable && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">S</span>}
                      {component.isToolbarItem && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">T</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingComponent(component)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteComponent(component.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddForm && (
        <ComponentForm
          onSave={(data) => {
            onAddComponent(data);
            setShowAddForm(false);
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingComponent && (
        <ComponentForm
          component={editingComponent}
          onSave={(data) => {
            onUpdateComponent(editingComponent.id, data);
            setEditingComponent(null);
          }}
          onCancel={() => setEditingComponent(null)}
        />
      )}
    </div>
  );
};