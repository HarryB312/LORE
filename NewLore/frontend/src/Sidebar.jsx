import React, { useRef } from 'react';

export default function Sidebar({ documents, onFileUpload, isUploading, selectedDocs, onToggleDoc }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-80 bg-enterprise-950 text-enterprise-100 flex flex-col h-full border-r border-enterprise-900">
      {/* Brand Header */}
      <div className="p-6 border-b border-enterprise-900">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          {/* BookOpen SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-light">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
            <path d="M8 7h6" />
            <path d="M8 11h8" />
            <path d="M8 15h6" />
          </svg>
          NewLore Researcher
        </h1>
        <p className="text-xs text-enterprise-400 mt-1">Local Document Intelligence</p>
      </div>

      {/* Upload Zone Panel */}
      <div className="p-4">
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 bg-enterprise-900/40 group ${
            isUploading 
              ? 'border-enterprise-800 cursor-not-allowed opacity-80' 
              : 'border-enterprise-800 hover:border-brand-primary cursor-pointer'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.txt,.md"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="py-2">
              {/* Native Tailwind Spin Loop */}
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-light mx-auto mb-3"></div>
              <p className="text-sm font-medium text-brand-light">Analyzing Document...</p>
              <p className="text-xs text-enterprise-500 mt-1">Building Vector Indices</p>
            </div>
          ) : (
            <>
              {/* UploadCloud SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-enterprise-400 group-hover:text-brand-light transition-colors mb-2">
                <path d="M17.5 19A5.5 5.5 0 0 0 13 10h-1.5a6.5 6.5 0 0 0 -12 3.5c0 2.6 1.8 4.8 4.3 5.4" />
                <path d="M12 12v9" /><path d="m15 15-3-3-3 3" />
              </svg>
              <p className="text-sm font-medium text-enterprise-200">Upload Knowledge</p>
              <p className="text-xs text-enterprise-500 mt-1">PDF, TXT, or MD up to 10MB</p>
            </>
          )}
        </div>
      </div>

      {/* File Tracking Index List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-enterprise-500 mb-3 px-2">
          Active Knowledge ({documents.length})
        </p>
        <div className="space-y-2">
          {documents.length === 0 ? (
            <div className="px-2 py-8 text-center border border-dashed border-enterprise-900 rounded-xl bg-enterprise-900/20">
              <p className="text-xs text-enterprise-500">No documents indexed yet.</p>
            </div>
          ) : (
            documents.map((doc) => {
              const isSelected = selectedDocs.has(doc.name);
              return (
                <div 
                  key={doc.id} 
                  onClick={() => onToggleDoc(doc.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 text-white shadow-inner'
                      : 'bg-slate-200 border-slate-300 text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {/* Custom Checkbox UI */}
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-white border-slate-400'
                  }`}>
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  {/* FileText SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isSelected ? 'text-indigo-400' : 'text-slate-500'} shrink-0`}>
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
                  </svg>
                  <div className="overflow-hidden flex-1">
                    <p className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{doc.name}</p>
                    <p className={`text-[10px] uppercase tracking-tight ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{doc.size}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Selection Info Footer */}
      {selectedDocs.size > 0 && (
        <div className="p-4 bg-enterprise-900/80 border-t border-enterprise-800">
          <p className="text-[10px] text-enterprise-400 uppercase tracking-widest font-bold mb-1">Search Filter</p>
          <p className="text-xs text-brand-light font-medium">
            Searching in {selectedDocs.size} {selectedDocs.size === 1 ? 'file' : 'files'}
          </p>
        </div>
      )}
    </div>
  );
}
