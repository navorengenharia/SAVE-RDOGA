
import React from 'react';

interface DraftNoticeProps {
  hasDraft: boolean;
  isDraftSaved: boolean;
  loadSavedDraft: () => void;
  clearSavedDraft: () => void;
}

const DraftNotice: React.FC<DraftNoticeProps> = ({ 
  hasDraft, 
  isDraftSaved, 
  loadSavedDraft, 
  clearSavedDraft 
}) => {
  if (!hasDraft && !isDraftSaved) return null;
  
  if (isDraftSaved) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-2 mb-4 rounded text-green-700 text-sm">
        Rascunho salvo automaticamente
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-amber-700">
            Há um rascunho não salvo do último registro que você estava criando.
            <button 
              onClick={loadSavedDraft}
              className="ml-2 font-medium text-amber-700 underline"
            >
              Restaurar rascunho
            </button>
            <button 
              onClick={clearSavedDraft}
              className="ml-2 font-medium text-amber-700 underline"
            >
              Descartar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DraftNotice;
