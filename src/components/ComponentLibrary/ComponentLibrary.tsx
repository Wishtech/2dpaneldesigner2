import React, { useState, useMemo } from 'react';
import { Search, Grid, List, Plus } from 'lucide-react';
import { Component, QuotationItem } from '../../types';
import { componentCategories } from '../../data/mockComponents';

interface ComponentLibraryProps {
  components: Component[];
  quotation: QuotationItem[];
  onComponentAdd: (component: Component) => void;
  onAddToQuotation: (component: Component) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  components,
  quotation,
  onComponentAdd,
  onAddToQuotation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Show all components from database, not just those in quotation
  const filteredComponents = useMemo(() => {
    return components
      .filter(component => !component.isToolbarItem) // Exclude toolbar items
      .filter(component => {
        const matchesSearch = 
          component.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          component.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = 
          selectedCategory === 'All' || component.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      });
  }, [components, searchTerm, selectedCategory]);

  const getQuotationInfo = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    const quotationItem = quotation.find(q => q.itemCode === component?.itemCode);
    return quotationItem || null;
  };

  const ComponentRow: React.FC<{ component: Component }> = ({ component }) => {
    const quotationInfo = getQuotationInfo(component.id);
    const remaining = quotationInfo ? Math.max(0, quotationInfo.quantity - quotationInfo.addedToCanvas) : 0;

    return (
      <tr className="hover:bg-gray-50 border-b border-gray-200">
        <td className="px-4 py-3">
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
        <td className="px-4 py-3">
          <div className="font-medium text-sm">{component.itemCode}</div>
          <div className="text-xs text-gray-600 truncate max-w-48">{component.description}</div>
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {component.category}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">
          {component.dimensions.width}×{component.dimensions.height}mm
        </td>
        <td className="px-4 py-3 text-center">
          {quotationInfo ? (
            <div className="text-sm">
              <div className="font-medium">{quotationInfo.quantity}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">Not in quotation</div>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {quotationInfo ? (
            <div className="text-sm">
              <div className="text-green-600 font-medium">{quotationInfo.addedToCanvas}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">0</div>
          )}
        </td>
        <td className="px-4 py-3 text-center">
          {quotationInfo && remaining > 0 ? (
            <div className="text-sm">
              <div className="text-orange-600 font-medium">{remaining}</div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">-</div>
          )}
        </td>
        <td className="px-4 py-3">
          <button
            onClick={() => onComponentAdd(component)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Add to Canvas"
          >
            <Plus className="w-4 h-4" />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="h-80 bg-white border-t border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">Component Library</h3>
          <div className="text-sm text-gray-600">
            All components from database ({filteredComponents.length} items)
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Categories</option>
            {componentCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-48 overflow-y-auto">
        {filteredComponents.length > 0 ? (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Preview</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Required</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Added</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Remaining</th>
                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComponents.map(component => (
                <ComponentRow key={component.id} component={component} />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg mb-2">No components found</div>
            <div className="text-sm">Try adjusting your search or category filter</div>
          </div>
        )}
      </div>
    </div>
  );
};