import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! Please upload a document in the sidebar, and I will help you research and extract information from it.' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Use a configurable URL (defaults to localhost if not specified in .env)
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch initial files from backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/files`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data);
          // By default, select all loaded documents
          setSelectedDocs(new Set(data.map(doc => doc.name)));
        }
      } catch (error) {
        console.error("Failed to fetch initial files:", error);
      }
    };
    fetchFiles();
  }, []);

  const toggleDocumentSelection = (filename) => {
    setSelectedDocs((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      return next;
    });
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        // Refresh document list from server to get accurate IDs and sizes
        const filesRes = await fetch(`${API_BASE_URL}/files`);
        const filesData = await filesRes.json();
        setDocuments(filesData);
        
        setSelectedDocs((prev) => new Set(prev).add(file.name));
        setMessages((prev) => [...prev, {
          id: Date.now(),
          sender: 'ai',
          text: `Successfully processed and indexed "${file.name}". You can now ask questions about its content!`
        }]);
      } else {
        throw new Error(data.detail || "Unknown backend error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessages((prev) => [...prev, {
        id: Date.now(),
        sender: 'ai',
        text: `Error uploading file: ${error.message}.`
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteFile = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDocuments((prev) => prev.filter(doc => doc.name !== filename));
        setSelectedDocs((prev) => {
          const next = new Set(prev);
          next.delete(filename);
          return next;
        });
        setMessages((prev) => [...prev, {
          id: Date.now(),
          sender: 'ai',
          text: `Successfully removed "${filename}" from the knowledge base.`
        }]);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { id: Date.now(), sender: 'ai', text: 'Chat history cleared. How can I help you with your documents?' }
    ]);
  };

  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    const formData = new FormData();
    formData.append("message", text);
    
    if (selectedDocs.size > 0) {
      formData.append("filenames", Array.from(selectedDocs).join(","));
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: data.response }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: "Sorry, I had trouble connecting to the document processing engine." }
      ]);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-enterprise-50 text-enterprise-800 font-sans overflow-hidden">
      <Sidebar 
        documents={documents} 
        onFileUpload={handleFileUpload} 
        onDeleteFile={handleDeleteFile}
        isUploading={isUploading} 
        selectedDocs={selectedDocs}
        onToggleDoc={toggleDocumentSelection}
      />
      
      <ChatArea 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        onClearChat={handleClearChat}
      />
    </div>
  );
}
