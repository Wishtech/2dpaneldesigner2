import React, { useState, useMemo } from 'react';
import { QuotationItem, QuotationTemplate, Component } from '../../types';
import { Plus, Save, Upload, Trash2, Calculator } from 'lucide-react';

interface QuotationTabProps {
  quotation: QuotationItem[];
  templates: QuotationTemplate[];
  components: Component[]; // Add components prop
  onAddItem: (item: Omit<QuotationItem, 'id' | 'totalPrice' | 'addedToCanvas'>) => void;
  onUpdateItem: (id: string, updates: Partial<QuotationItem>) => void;
  onDeleteItem: (id: string) => void;
  onSaveTemplate: (name: string, description: string) => void;
  onLoadTemplate: (template: QuotationTemplate) => void;
}

export const QuotationTab: React.FC<QuotationTabProps> = ({
  quotation,
  templates,
  components,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onSaveTemplate,
  onLoadTemplate
}) => {
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');

  // Create quotation items from all components in database
  const quotationItems = useMemo(() => {
    return components.map(component => {
      // Find existing quotation item or create new one
      const existingItem = quotation.find(q => q.itemCode === component.itemCode);
      
      return existingItem || {
        id: `quote-${component.id}`,
        itemCode: component.itemCode,
        description: component.description,
        quantity: 0, // Default quantity is 0
        unitPrice: 0,
        totalPrice: 0,
        addedToCanvas: 0
      };
    });
  }, [components, quotation]);

  const totalValue = quotationItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalQuantity = quotationItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemsWithQuantity = quotationItems.filter(item => item.quantity > 0);

  const handleQuantityChange = (itemCode: string, quantity: number) => {
    const existingItem = quotation.find(q => q.itemCode === itemCode);
    const component = components.find(c => c.itemCode === itemCode);
    
    if (!component) return;

    if (existingItem) {
      // Update existing item
      onUpdateItem(existingItem.id, { quantity });
    } else if (quantity > 0) {
      // Create new item
      onAddItem({
        itemCode: component.itemCode,
        description: component.description,
        quantity,
        unitPrice: 0
      });
    }
  };

  const handleUnitPriceChange = (itemCode: string, unitPrice: number) => {
    const existingItem = quotation.find(q => q.itemCode === itemCode);
    if (existingItem) {
      onUpdateItem(existingItem.id, { unitPrice });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Project Quotation</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSaveTemplate(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Template</span>
          </button>
        </div>
      </div>

      {/* Quotation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Components</div>
          <div className="text-2xl font-bold text-gray-900">{components.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Items with Quantity</div>
          <div className="text-2xl font-bold text-blue-600">{itemsWithQuantity.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Quantity</div>
          <div className="text-2xl font-bold text-gray-900">{totalQuantity}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600">Total Value</div>
          <div className="text-2xl font-bold text-gray-900">${totalValue.toFixed(2)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quotation Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Components from Database</h3>
              <p className="text-sm text-gray-600 mt-1">Update quantities for components you need in your project</p>
            </div>
            
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotationItems.map((item) => {
                    const component = components.find(c => c.itemCode === item.itemCode);
                    return (
                      <tr key={item.itemCode} className={`hover:bg-gray-50 ${item.quantity > 0 ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-6 bg-gray-100 rounded border flex items-center justify-center">
                              {component?.svgPath ? (
                                <div 
                                  className="w-full h-full"
                                  dangerouslySetInnerHTML={{ __html: component.svgPath }}
                                />
                              ) : (
                                <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.itemCode}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{item.description}</div>
                          <div className="text-xs text-gray-500">
                            {component?.category} • {component?.dimensions.width}×{component?.dimensions.height}mm
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.itemCode, parseInt(e.target.value) || 0)}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center"
                            min="0"
                            placeholder="0"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => handleUnitPriceChange(item.itemCode, parseFloat(e.target.value) || 0)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-center"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            disabled={item.quantity === 0}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-medium text-gray-900">
                            ${item.totalPrice.toFixed(2)}
                          </div>
                          {item.addedToCanvas > 0 && (
                            <div className="text-xs text-green-600">
                              {item.addedToCanvas} on canvas
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {components.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <div className="text-lg mb-2">No components in database</div>
                <div className="text-sm">Add components to the database first</div>
              </div>
            )}
          </div>
        </div>

        {/* Templates */}
        <div>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Saved Templates</h3>
            </div>
            
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{template.description}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        {template.items.length} items • Created {template.createdAt.toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => onLoadTemplate(template)}
                      className="ml-2 p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Load Template"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {templates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-sm">No saved templates</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Components with qty &gt; 0:</span>
                <span className="font-medium">{itemsWithQuantity.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total items needed:</span>
                <span className="font-medium">{totalQuantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Items on canvas:</span>
                <span className="font-medium text-green-600">
                  {quotationItems.reduce((sum, item) => sum + item.addedToCanvas, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Remaining to add:</span>
                <span className="font-medium text-orange-600">
                  {quotationItems.reduce((sum, item) => sum + Math.max(0, item.quantity - item.addedToCanvas), 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Template Form */}
      {showSaveTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Save as Template</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter template description..."
                />
              </div>

              <div className="bg-gray-50 rounded p-3">
                <div className="text-sm text-gray-600">
                  This template will save {itemsWithQuantity.length} components with quantities.
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowSaveTemplate(false);
                    setTemplateName('');
                    setTemplateDescription('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (templateName.trim()) {
                      onSaveTemplate(templateName.trim(), templateDescription.trim());
                      setShowSaveTemplate(false);
                      setTemplateName('');
                      setTemplateDescription('');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={!templateName.trim()}
                >
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};