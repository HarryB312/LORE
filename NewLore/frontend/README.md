# NewLore Researcher Frontend

This is the React-based frontend for the NewLore Researcher, a local document intelligence tool. It provides an intuitive interface for uploading documents and chatting with a local AI engine powered by Ollama.

## Project Architecture

```text
lore-app/                 <-- Main Project Root Folder
│
├── backend/              <-- Python FastAPI Server Environment
│   ├── main.py           <-- FastAPI App & LangChain/Ollama Logic
│   ├── requirements.txt  <-- Python dependency list
│   └── ...
│
├── frontend/             <-- React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx       <-- State Management & API Pipeline Handlers
│   │   ├── Sidebar.jsx   <-- Document Indexing Interface
│   │   ├── ChatArea.jsx  <-- AI Chat interface
│   │   └── ...
│   ├── package.json          
│   └── vite.config.js
```

## Prerequisites
Before setting up the repository locally, ensure you have the following installed on your system:
- Node.js (v18.x or higher) & npm
- Python (v3.11 or higher)
- **Ollama**: Installed and running with `llama3.2` model.

## Installation & Setup

### 1. Backend Server Configuration
Refer to the main `README.md` in the root directory for backend setup instructions.

### 2. Frontend Application Configuration

Navigate to the `frontend/` directory, install dependencies, and start the development server.

```bash
cd frontend

# Install client packages
npm install

# Start the local development server
npm run dev
```

Open your browser and navigate to the address provided by Vite (typically http://localhost:5173).

## Core Technologies Used
### Frontend
- **React** – Dynamic state parsing and message history logging.
- **Tailwind CSS** – Modern styling.
- **Vite** – Fast build tool.
- **Lucide React** – For iconography.

### Backend
- **FastAPI** – High-performance async endpoints.
- **LangChain & Ollama** – Local LLM integration.
- **HuggingFace Embeddings** – Local CPU-based vector generation.
- **FAISS** – Local vector database for efficient document retrieval.

## How It Works
1. **Document Injection**: Users upload a PDF, TXT, or MD file.
2. **Chunking & Indexing**: The server splits text into segments, generates local embeddings, and stores them in FAISS.
3. **Contextual Retrieval**: When a user asks a question, the system finds relevant segments in the FAISS index.
4. **Local Generation**: Relevant text is sent to the local Ollama model to generate an answer based on the provided context. No data leaves your machine.
