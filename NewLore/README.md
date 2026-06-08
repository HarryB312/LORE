# NewLore Researcher: Private Local Document Intelligence

NewLore Researcher is a professional RAG (Retrieval-Augmented Generation) tool that runs **100% locally**. It uses your computer's hardware to index documents and provide answers using local LLMs via Ollama. No data ever leaves your machine, and no API keys are required.

---

## 🚀 Quick Start (One-Click Launch)

### **Windows**
1. **Launch:** Double-click `LORE.bat` in the `NewLore` folder.
2. **Access:** Open your browser to `http://localhost:5173`.

### **macOS**
1. **Launch:** Double-click `LORE.command` in the `NewLore` folder.
   * *Note: If macOS blocks it, Right-Click -> Open -> Click "Open" again.*
2. **Access:** Open your browser to `http://localhost:5173`.

---

## 🛠 Prerequisites

Before running the app, ensure you have these installed:

1.  **Ollama**: Download from [ollama.com](https://ollama.com/).
2.  **Llama 3.2**: Open your terminal and run:
    ```bash
    ollama pull llama3.2
    ```
3.  **Python 3.10+**: For the backend processing engine.
4.  **Node.js & npm**: For the user interface.

---

## 📖 Manual Startup (Developer Mode)

If you prefer to run the components separately for debugging:

### **1. Start the AI Engine**
```bash
ollama serve
```

### **2. Start the Backend (Python)**
Navigate to the `backend` folder:
```bash
cd NewLore/backend
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate   # Windows

# Install dependencies and run
pip install -r requirements.txt
python main.py
```

### **3. Start the Frontend (Vite)**
Navigate to the `frontend` folder:
```bash
cd NewLore/frontend
npm install
npm run dev -- --host
```

---

## ✨ Key Features
- **Privacy First:** Entirely local processing. Ideal for sensitive business documents.
- **Persistent Knowledge Base:** Your uploaded documents and vector indices are saved to disk automatically (`faiss_index/`).
- **Precise Citations:** Every answer includes exact source tags like `[document.pdf, p.5]`.
- **File Management:** Select exactly which files the AI should research or delete them permanently via the sidebar.
- **Zero API Costs:** No monthly fees, no tokens to buy.

---

## 📂 Project Structure
```text
NewLore/
├── LORE.command        # macOS One-Click Launcher
├── LORE.bat            # Windows One-Click Launcher
├── backend/            # FastAPI, FAISS, and LangChain logic
│   ├── main.py         # Primary API server
│   └── faiss_index/    # Your local vector database
└── frontend/           # React + Vite user interface
    └── src/            # UI Components (Sidebar, Chat, etc.)
```

---

## 🏢 Business & Team Use
### Shared Office Server
You can run NewLore on one powerful computer and allow your entire team to access it via Wi-Fi:
1. Run the app on the server computer.
2. Find the server's local IP address (e.g., `192.168.1.50`).
3. Team members can access it via: `http://192.168.1.50:5173`

---

## ❓ Troubleshooting
- **Ollama Error:** Ensure `ollama serve` is running in the background.
- **Port 5173 Busy:** If the frontend won't start, another app is using that port. The terminal will usually suggest an alternative like `5174`.
- **Module Not Found:** Run `pip install -r requirements.txt` (backend) or `npm install` (frontend) to refresh dependencies.
