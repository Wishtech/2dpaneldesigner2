import React, { useCallback, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import { Toolbar } from './components/Toolbar/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { ComponentLibrary } from './components/ComponentLibrary/ComponentLibrary';
import { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';
import { DatabaseTab } from './components/DatabaseTab/DatabaseTab';
import { QuotationTab } from './components/QuotationTab/QuotationTab';
import { SaveIndicator } from './components/SaveIndicator/SaveIndicator';
import { QuotationTemplate, Component } from './types';

function App() {
  const { state, actions } = useAppState();

  // Load saved data on app start
  useEffect(() => {
    actions.loadSavedData();
  }, []);

  // Auto-save every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (!state.hasUnsavedChanges) return;

    const autoSaveInterval = setInterval(() => {
      if (state.hasUnsavedChanges) {
        actions.saveChanges();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [state.hasUnsavedChanges, actions]);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);

  // Canvas interaction handlers
  const handleCanvasClick = useCallback((position: { x: number; y: number }) => {
    // Handle canvas click if needed
  }, []);

  const handleZoomChange = useCallback((zoom: number) => {
    actions.updateCanvas({ zoom });
  }, [actions]);

  const handlePanChange = useCallback((pan: { x: number; y: number }) => {
    actions.updateCanvas({ pan });
  }, [actions]);

  const handleToggleView = useCallback((property: string) => {
    switch (property) {
      case 'grid':
        actions.updateCanvas({ showGrid: !state.canvas.showGrid });
        break;
      case 'rulers':
        actions.updateCanvas({ showRulers: !state.canvas.showRulers });
        break;
      case 'labels':
        actions.updateCanvas({ showLabels: !state.canvas.showLabels });
        break;
    }
  }, [state.canvas, actions]);

  // Component library handler - handles all components from database
  const handleComponentLibraryAdd = useCallback((component: Component) => {
    const centerX = 200 + Math.random() * 200;
    const centerY = 200 + Math.random() * 200;
    actions.addComponentToCanvas(component, { x: centerX, y: centerY });
  }, [actions]);

  // Get selected canvas components
  const selectedCanvasComponents = state.canvas.components.filter(comp => comp.isSelected);

  const renderMainContent = () => {
    switch (state.activeTab) {
      case 'database':
        return (
          <DatabaseTab
            components={state.components}
            onAddComponent={actions.addComponent}
            onUpdateComponent={actions.updateComponent}
            onDeleteComponent={actions.deleteComponent}
          />
        );
      case 'quotation':
        return (
          <QuotationTab
            quotation={state.quotation}
            templates={state.quotationTemplates}
            components={state.components}
            onAddItem={actions.addQuotationItem}
            onUpdateItem={actions.updateQuotationItem}
            onDeleteItem={(id) => console.log('Delete quotation item:', id)}
            onSaveTemplate={(name, description) => console.log('Save template:', name, description)}
            onLoadTemplate={(template: QuotationTemplate) => console.log('Load template:', template)}
          />
        );
      default:
        return (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                <Canvas
                  canvasState={state.canvas}
                  components={state.components}
                  onComponentMove={actions.updateCanvasComponent}
                  onComponentSelect={actions.selectComponents}
                  onCanvasClick={handleCanvasClick}
                  onZoomChange={handleZoomChange}
                  onPanChange={handlePanChange}
                />
                <ComponentLibrary
                  components={state.components}
                  quotation={state.quotation}
                  onComponentAdd={handleComponentLibraryAdd}
                  onAddToQuotation={(component) => {
                    actions.addQuotationItem({
                      itemCode: component.itemCode,
                      description: component.description,
                      quantity: 1,
                      unitPrice: 0
                    });
                  }}
                />
              </div>
              <PropertiesPanel
                selectedComponents={selectedCanvasComponents}
                componentDefinitions={state.components}
                onUpdateComponent={actions.updateCanvasComponent}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Tab Navigation with Save Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex">
            <button
              onClick={() => actions.setActiveTab('design')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                state.activeTab === 'design'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Design Canvas
            </button>
            <button
              onClick={() => actions.setActiveTab('database')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                state.activeTab === 'database'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Component Database
            </button>
            <button
              onClick={() => actions.setActiveTab('quotation')}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                state.activeTab === 'quotation'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Project Quotation
            </button>
          </div>
          
          <div className="px-6 py-3">
            <SaveIndicator
              hasUnsavedChanges={state.hasUnsavedChanges}
              lastSaved={state.lastSaved}
              onSave={actions.saveChanges}
            />
          </div>
        </div>
      </div>

      {/* Clean Toolbar - only show on design tab */}
      {state.activeTab === 'design' && (
        <Toolbar
          canUndo={state.undoStack.length > 0}
          canRedo={state.redoStack.length > 0}
          showGrid={state.canvas.showGrid}
          showRulers={state.canvas.showRulers}
          showLabels={state.canvas.showLabels}
          snapToGrid={false}
          selectedCount={state.selectedComponentIds.length}
          onUndo={actions.undo}
          onRedo={actions.redo}
          onCopy={() => console.log('Copy')}
          onPaste={() => console.log('Paste')}
          onDelete={actions.deleteSelectedComponents}
          onToggleGrid={() => handleToggleView('grid')}
          onToggleRulers={() => handleToggleView('rulers')}
          onToggleLabels={() => handleToggleView('labels')}
          onToggleSnap={() => {}} // No-op since snap is disabled
          onZoomIn={() => handleZoomChange(state.canvas.zoom * 1.2)}
          onZoomOut={() => handleZoomChange(state.canvas.zoom * 0.8)}
          onFitToScreen={() => handleZoomChange(1)}
          onReset={actions.resetApplication}
        />
      )}

      {/* Main Content */}
      {renderMainContent()}
    </div>
  );
}

export default App;