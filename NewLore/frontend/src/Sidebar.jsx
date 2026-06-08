import React, { useRef } from 'react';
import { Trash2, FileText, UploadCloud, BookOpen, Check } from 'lucide-react';

export default function Sidebar({ documents, onFileUpload, onDeleteFile, isUploading, selectedDocs, onToggleDoc }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="w-80 bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <BookOpen className="text-indigo-400" size={20} />
          NewLore Researcher
        </h1>
        <p className="text-xs text-slate-400 mt-1">Local Document Intelligence</p>
      </div>

      {/* Upload Zone Panel */}
      <div className="p-4">
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 bg-slate-800/40 group ${
            isUploading 
              ? 'border-slate-700 cursor-not-allowed opacity-80' 
              : 'border-slate-700 hover:border-indigo-500 cursor-pointer'
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400 mx-auto mb-3"></div>
              <p className="text-sm font-medium text-indigo-400">Analyzing...</p>
            </div>
          ) : (
            <>
              <UploadCloud className="mx-auto text-slate-400 group-hover:text-indigo-400 transition-colors mb-2" size={32} />
              <p className="text-sm font-medium text-slate-200">Upload Knowledge</p>
              <p className="text-xs text-slate-500 mt-1">PDF, TXT, or MD</p>
            </>
          )}
        </div>
      </div>

      {/* File Tracking Index List */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 px-2">
          Active Knowledge ({documents.length})
        </p>
        <div className="space-y-2">
          {documents.length === 0 ? (
            <div className="px-2 py-8 text-center border border-dashed border-slate-800 rounded-xl bg-slate-800/20">
              <p className="text-xs text-slate-500">No documents indexed yet.</p>
            </div>
          ) : (
            documents.map((doc) => {
              const isSelected = selectedDocs.has(doc.name);
              return (
                <div 
                  key={doc.id || doc.name} 
                  className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/10 border-indigo-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                  onClick={() => onToggleDoc(doc.name)}
                >
                  {/* Selection Indicator */}
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all ${
                    isSelected 
                      ? 'bg-indigo-500 border-indigo-500' 
                      : 'bg-slate-700 border-slate-600'
                  }`}>
                    {isSelected && <Check size={10} className="text-white" />}
                  </div>

                  <FileText size={18} className={isSelected ? 'text-indigo-400' : 'text-slate-500'} />
                  
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-medium truncate pr-6">{doc.name}</p>
                    <p className="text-[10px] uppercase text-slate-500">{doc.size}</p>
                  </div>

                  {/* Delete Button - Visible on Hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFile(doc.name);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all text-slate-500"
                    title="Remove from knowledge base"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Selection Info Footer */}
      {selectedDocs.size > 0 && (
        <div className="p-4 bg-slate-800/80 border-t border-slate-700">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Search Filter</p>
          <p className="text-xs text-indigo-400 font-medium">
            Active: {selectedDocs.size} {selectedDocs.size === 1 ? 'file' : 'files'}
          </p>
        </div>
      )}
    </div>
  );
}
