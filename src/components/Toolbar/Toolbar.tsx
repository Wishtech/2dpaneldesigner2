import React from 'react';
import { 
  Undo2, 
  Redo2, 
  Copy, 
  Clipboard, 
  Trash2, 
  Grid3X3, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Eye,
  EyeOff,
  Ruler,
  RotateCcw
} from 'lucide-react';

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  showGrid: boolean;
  showRulers: boolean;
  showLabels: boolean;
  snapToGrid: boolean;
  selectedCount: number;
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onToggleGrid: () => void;
  onToggleRulers: () => void;
  onToggleLabels: () => void;
  onToggleSnap: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  canUndo,
  canRedo,
  showGrid,
  showRulers,
  showLabels,
  selectedCount,
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onDelete,
  onToggleGrid,
  onToggleRulers,
  onToggleLabels,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  onReset
}) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Left Side - Essential Tools */}
          <div className="flex items-center space-x-1">
            {/* Edit Tools */}
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Clipboard Tools */}
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
              <button
                onClick={onCopy}
                disabled={selectedCount === 0}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Copy (Ctrl+C)"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={onPaste}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                title="Paste (Ctrl+V)"
              >
                <Clipboard className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                disabled={selectedCount === 0}
                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-red-600 transition-colors"
                title="Delete (Del)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* View Tools - Removed Snap */}
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
              <button
                onClick={onToggleGrid}
                className={`p-2 rounded transition-colors ${
                  showGrid 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
                title={`${showGrid ? 'Hide' : 'Show'} Grid (G)`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleRulers}
                className={`p-2 rounded transition-colors ${
                  showRulers 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
                title={`${showRulers ? 'Hide' : 'Show'} Rulers (R)`}
              >
                <Ruler className="w-4 h-4" />
              </button>

              <button
                onClick={onToggleLabels}
                className={`p-2 rounded transition-colors ${
                  showLabels 
                    ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
                title={`${showLabels ? 'Hide' : 'Show'} Component Labels (L)`}
              >
                {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>

            {/* Zoom Tools */}
            <div className="flex items-center space-x-1 border-r border-gray-200 pr-3 mr-3">
              <button
                onClick={onZoomOut}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={onZoomIn}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={onFitToScreen}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
                title="Fit to Screen (F)"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Tool */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onReset}
                className="p-2 rounded hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                title="Reset Canvas & Quotation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Side - Status Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            {selectedCount > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
                <span className="font-medium text-blue-700">
                  {selectedCount} selected
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-1 ${showGrid ? 'text-blue-600' : 'text-gray-500'}`}>
                <Grid3X3 className="w-3 h-3" />
                <span className="text-xs">Grid</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-400">
                <span className="text-xs">Free Drag Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};