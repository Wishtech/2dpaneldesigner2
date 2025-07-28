import { useState, useCallback, useRef } from 'react';
import { AppState, CanvasState, CanvasComponent, Component, QuotationItem } from '../types';
import { mockComponents } from '../data/mockComponents';

const initialCanvasState: CanvasState = {
  components: [],
  zoom: 1,
  pan: { x: 0, y: 0 },
  gridSize: 10,
  showGrid: true,
  showRulers: true,
  showLabels: true,
  snapToGrid: false // Always false now
};

const initialAppState: AppState = {
  canvas: initialCanvasState,
  components: mockComponents,
  quotation: [],
  quotationTemplates: [],
  activeTab: 'design',
  selectedComponentIds: [],
  undoStack: [],
  redoStack: [],
  hasUnsavedChanges: false,
  lastSaved: new Date()
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialAppState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const saveChanges = useCallback(() => {
    try {
      const dataToSave = {
        canvas: state.canvas,
        components: state.components,
        quotation: state.quotation,
        quotationTemplates: state.quotationTemplates,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem('electrical-panel-designer-data', JSON.stringify(dataToSave));
      
      setState(prev => ({
        ...prev,
        hasUnsavedChanges: false,
        lastSaved: new Date()
      }));
      
      return { success: true, message: 'Changes saved successfully!' };
    } catch (error) {
      console.error('Failed to save changes:', error);
      return { success: false, message: 'Failed to save changes. Please try again.' };
    }
  }, [state]);

  const loadSavedData = useCallback(() => {
    try {
      const savedData = localStorage.getItem('electrical-panel-designer-data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setState(prev => ({
          ...prev,
          canvas: parsedData.canvas || initialCanvasState,
          components: parsedData.components || mockComponents,
          quotation: parsedData.quotation || [],
          quotationTemplates: parsedData.quotationTemplates || [],
          hasUnsavedChanges: false,
          lastSaved: new Date(parsedData.savedAt)
        }));
        return { success: true, message: 'Data loaded successfully!' };
      }
    } catch (error) {
      console.error('Failed to load saved data:', error);
      return { success: false, message: 'Failed to load saved data.' };
    }
    return { success: false, message: 'No saved data found.' };
  }, []);

  const resetApplication = useCallback(() => {
    setState({
      ...initialAppState,
      components: state.components, // Keep the component database
      lastSaved: new Date()
    });
    
    localStorage.removeItem('electrical-panel-designer-data');
    
    return { success: true, message: 'Application reset successfully!' };
  }, [state.components]);

  const saveToUndoStack = useCallback(() => {
    setState(prev => ({
      ...prev,
      undoStack: [...prev.undoStack.slice(-9), prev.canvas],
      redoStack: [],
      hasUnsavedChanges: true
    }));
  }, []);

  const updateCanvas = useCallback((updates: Partial<CanvasState>) => {
    setState(prev => ({
      ...prev,
      canvas: { ...prev.canvas, ...updates },
      hasUnsavedChanges: true
    }));
  }, []);

  const addComponentToCanvas = useCallback((component: Component, position: { x: number; y: number }) => {
    const newCanvasComponent: CanvasComponent = {
      id: `canvas-${Date.now()}-${Math.random()}`,
      componentId: component.id,
      position,
      rotation: 0,
      scale: { x: 1, y: 1 },
      layer: 1,
      isLocked: false,
      isVisible: true,
      isSelected: false
    };

    saveToUndoStack();
    setState(prev => {
      const updatedCanvas = {
        ...prev.canvas,
        components: [...prev.canvas.components, newCanvasComponent]
      };

      // Update or create quotation item
      let updatedQuotation = [...prev.quotation];
      const existingQuotationItem = updatedQuotation.find(item => item.itemCode === component.itemCode);
      
      if (existingQuotationItem) {
        updatedQuotation = updatedQuotation.map(item => 
          item.itemCode === component.itemCode 
            ? { 
                ...item, 
                addedToCanvas: item.addedToCanvas + 1,
                quantity: Math.max(item.quantity, item.addedToCanvas + 1)
              }
            : item
        );
      } else {
        const newQuotationItem: QuotationItem = {
          id: `quote-${Date.now()}-${Math.random()}`,
          itemCode: component.itemCode,
          description: component.description,
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
          addedToCanvas: 1
        };
        updatedQuotation.push(newQuotationItem);
      }

      return {
        ...prev,
        canvas: updatedCanvas,
        quotation: updatedQuotation,
        hasUnsavedChanges: true
      };
    });
  }, [saveToUndoStack]);

  const updateCanvasComponent = useCallback((id: string, updates: Partial<CanvasComponent>) => {
    setState(prev => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        components: prev.canvas.components.map(comp =>
          comp.id === id ? { ...comp, ...updates } : comp
        )
      },
      hasUnsavedChanges: true
    }));
  }, []);

  const selectComponents = useCallback((ids: string[], addToSelection = false) => {
    setState(prev => {
      const newSelectedIds = addToSelection 
        ? [...new Set([...prev.selectedComponentIds, ...ids])]
        : ids;
      
      const updatedComponents = prev.canvas.components.map(comp => ({
        ...comp,
        isSelected: newSelectedIds.includes(comp.id)
      }));

      return {
        ...prev,
        selectedComponentIds: newSelectedIds,
        canvas: {
          ...prev.canvas,
          components: updatedComponents
        }
      };
    });
  }, []);

  const deleteSelectedComponents = useCallback(() => {
    if (state.selectedComponentIds.length === 0) return;
    
    saveToUndoStack();
    setState(prev => {
      const deletedComponents = prev.canvas.components.filter(comp => comp.isSelected);
      
      const updatedQuotation = prev.quotation.map(quotationItem => {
        const deletedCount = deletedComponents.filter(canvasComp => {
          const component = prev.components.find(c => c.id === canvasComp.componentId);
          return component?.itemCode === quotationItem.itemCode;
        }).length;
        
        return {
          ...quotationItem,
          addedToCanvas: Math.max(0, quotationItem.addedToCanvas - deletedCount)
        };
      });

      return {
        ...prev,
        selectedComponentIds: [],
        quotation: updatedQuotation,
        canvas: {
          ...prev.canvas,
          components: prev.canvas.components.filter(comp => !comp.isSelected)
        },
        hasUnsavedChanges: true
      };
    });
  }, [state.selectedComponentIds.length, saveToUndoStack]);

  const undo = useCallback(() => {
    setState(prev => {
      const lastState = prev.undoStack[prev.undoStack.length - 1];
      if (!lastState) return prev;

      return {
        ...prev,
        canvas: lastState,
        undoStack: prev.undoStack.slice(0, -1),
        redoStack: [prev.canvas, ...prev.redoStack.slice(0, 9)],
        hasUnsavedChanges: true
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      const nextState = prev.redoStack[0];
      if (!nextState) return prev;

      return {
        ...prev,
        canvas: nextState,
        undoStack: [...prev.undoStack, prev.canvas].slice(-10),
        redoStack: prev.redoStack.slice(1),
        hasUnsavedChanges: true
      };
    });
  }, []);

  const setActiveTab = useCallback((tab: AppState['activeTab']) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  }, []);

  const addQuotationItem = useCallback((item: Omit<QuotationItem, 'id' | 'totalPrice' | 'addedToCanvas'>) => {
    const newItem: QuotationItem = {
      ...item,
      id: `quote-${Date.now()}-${Math.random()}`,
      totalPrice: item.quantity * item.unitPrice,
      addedToCanvas: 0
    };

    setState(prev => ({
      ...prev,
      quotation: [...prev.quotation.filter(q => q.itemCode !== item.itemCode), newItem],
      hasUnsavedChanges: true
    }));
  }, []);

  const updateQuotationItem = useCallback((id: string, updates: Partial<QuotationItem>) => {
    setState(prev => ({
      ...prev,
      quotation: prev.quotation.map(item => 
        item.id === id 
          ? { 
              ...item, 
              ...updates, 
              totalPrice: (updates.quantity ?? item.quantity) * (updates.unitPrice ?? item.unitPrice) 
            }
          : item
      ),
      hasUnsavedChanges: true
    }));
  }, []);

  const addComponent = useCallback((componentData: Omit<Component, 'id'>) => {
    const newComponent: Component = {
      ...componentData,
      id: `comp-${Date.now()}-${Math.random()}`
    };
    
    setState(prev => ({
      ...prev,
      components: [...prev.components, newComponent],
      hasUnsavedChanges: true
    }));
  }, []);

  const updateComponent = useCallback((id: string, updates: Partial<Component>) => {
    setState(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      ),
      hasUnsavedChanges: true
    }));
  }, []);

  const deleteComponent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      components: prev.components.filter(comp => comp.id !== id),
      hasUnsavedChanges: true
    }));
  }, []);

  return {
    state,
    actions: {
      updateCanvas,
      addComponentToCanvas,
      updateCanvasComponent,
      selectComponents,
      deleteSelectedComponents,
      undo,
      redo,
      setActiveTab,
      addQuotationItem,
      updateQuotationItem,
      addComponent,
      updateComponent,
      deleteComponent,
      saveToUndoStack,
      saveChanges,
      loadSavedData,
      resetApplication
    }
  };
};