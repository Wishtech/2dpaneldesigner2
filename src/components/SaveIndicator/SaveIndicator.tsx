import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Loader2 } from 'lucide-react';

interface SaveIndicatorProps {
  hasUnsavedChanges: boolean;
  lastSaved: Date;
  onSave: () => Promise<{ success: boolean; message: string }> | { success: boolean; message: string };
}

export const SaveIndicator: React.FC<SaveIndicatorProps> = ({
  hasUnsavedChanges,
  lastSaved,
  onSave
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const result = await onSave();
      setSaveStatus(result.success ? 'success' : 'error');
      setSaveMessage(result.message);
      
      // Clear status after 3 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('An unexpected error occurred');
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveMessage('');
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const formatLastSaved = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = () => {
    if (isSaving) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (saveStatus === 'success') return <Check className="w-4 h-4 text-green-600" />;
    if (saveStatus === 'error') return <AlertCircle className="w-4 h-4 text-red-600" />;
    return <Save className="w-4 h-4" />;
  };

  const getButtonStyle = () => {
    if (saveStatus === 'success') return 'bg-green-600 hover:bg-green-700 text-white';
    if (saveStatus === 'error') return 'bg-red-600 hover:bg-red-700 text-white';
    if (hasUnsavedChanges) return 'bg-blue-600 hover:bg-blue-700 text-white';
    return 'bg-gray-100 hover:bg-gray-200 text-gray-600';
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="text-sm text-gray-600">
        {hasUnsavedChanges ? (
          <span className="text-orange-600 font-medium">Unsaved changes</span>
        ) : (
          <span>Last saved: {formatLastSaved(lastSaved)}</span>
        )}
      </div>
      
      <button
        onClick={handleSave}
        disabled={isSaving || (!hasUnsavedChanges && saveStatus === 'idle')}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle()}`}
        title={hasUnsavedChanges ? 'Save changes' : 'No changes to save'}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
        </span>
      </button>
      
      {saveMessage && (
        <div className={`text-sm ${saveStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};