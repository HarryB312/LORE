# NewLore Researcher: Private Local Document Intelligence

NewLore Researcher is a professional RAG (Retrieval-Augmented Generation) tool that runs **100% locally**. It uses your computer's hardware to index documents and provide answers using local LLMs via Ollama. No data ever leaves your machine, and no API keys are required.

## Key Features
- **Privacy First:** Entirely local processing. Ideal for sensitive business documents.
- **Precise Citations:** Every answer includes exact source tags like `[document.pdf, p.5]`.
- **Document Selection:** Select exactly which files the AI should research to avoid cross-document confusion.
- **Fast Local Search:** Powered by FAISS (vector database) and HuggingFace embeddings running on your CPU.

## Prerequisites
1.  **Ollama:** Download and install from [ollama.com](https://ollama.com/).
2.  **Llama 3.2:** Open your terminal and run:
    ```bash
    ollama run llama3.2
    ```

## Installation & Setup

### 1. Backend (Python Researcher Engine)
The backend manages the document indexing and the AI logic.

```bash
cd backend
python3 -m venv venv

# Activate (macOS/Linux):
source venv/bin/activate
# Activate (Fish Shell):
source venv/bin/activate.fish
# Activate (Windows):
# venv\Scripts\activate

pip install -r requirements.txt
python3 main.py
```

### 2. Frontend (React UI)
The interactive dashboard for research.

```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` to start researching.

## Deployment for Teams
For business use, you don't need to install this on every computer. You can set up a **Shared Research Server**:
1.  Install the backend and Ollama on one powerful central machine.
2.  Set `OLLAMA_HOST=0.0.0.0` on that server.
3.  Users can access the researcher dashboard via the server's IP address.
*See [DEPLOYMENT.md](./DEPLOYMENT.md) for more technical details.*

## How to use
1.  **Upload:** Use the sidebar to upload PDF, TXT, or MD files.
2.  **Filter:** Click the documents in the sidebar to select which ones the AI should focus on.
3.  **Chat:** Ask questions. The AI will provide answers and tell you exactly which page/file it used for its facts.
