import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState(new Set());
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello! Please upload a document in the sidebar, and I will help you research and extract information from it.' }
  ]);
  const [isUploading, setIsUploading] = useState(false);

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

  // Send binary document stream to the live FastAPI /upload endpoint
  const handleFileUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file); // Must match the Python parameter variable name exactly

    try {
      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok && data.status === "success") {
        const newDoc = {
          id: Date.now(),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        };
        setDocuments([...documents, newDoc]);
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
        text: `Error uploading file: ${error.message}. Make sure your local Python server is running.`
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  // Query your internal knowledge base engine via the /chat endpoint
  const handleSendMessage = async (text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);

    const formData = new FormData();
    formData.append("message", text);
    
    if (selectedDocs.size > 0) {
      formData.append("filenames", Array.from(selectedDocs).join(","));
    }

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: data.response }
      ]);
    } catch (error) {
      console.error("Chat engine connection error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: "Sorry, I had trouble connecting to the document processing engine." }
      ]);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-enterprise-50 text-enterprise-800 font-sans overflow-hidden">
      {/* Document Sidebar Panel */}
      <Sidebar 
        documents={documents} 
        onFileUpload={handleFileUpload} 
        isUploading={isUploading} 
        selectedDocs={selectedDocs}
        onToggleDoc={toggleDocumentSelection}
      />
      
      {/* Interactive AI Chat Panel */}
      <ChatArea messages={messages} onSendMessage={handleSendMessage} />
    </div>
  );
}
