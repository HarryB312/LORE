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

## Quick Start (Business/Windows)
The easiest way to start NewLore is using the **One-Click Launcher**:
1.  **Prerequisites:** Install [Ollama](https://ollama.com) and run `ollama pull llama3.2`.
2.  **Launch:** Double-click `run_app.bat` in the root folder.
3.  **Access:** Open your browser to `http://localhost:5173`.

## 💰 Zero API Costs
Unlike ChatGPT or Claude, NewLore Researcher runs **100% locally** on your own hardware. 
- **No Monthly Fees:** You don't need to pay for API credits or subscriptions.
- **100% Private:** Your business documents never leave your computer or office network.

## 🏢 Business & Team Use
### Shared Office Server
You can run NewLore on one powerful "server" computer and allow your entire team to access it via your office Wi-Fi:
1.  Run `run_app.bat` on the server computer.
2.  Find the server's local IP address (e.g., `192.168.1.50`).
3.  Other team members can access the dashboard by typing `http://[SERVER_IP]:5173` into their browsers.

## Installation & Setup (Developer/Manual)
1.  **Upload:** Use the sidebar to upload PDF, TXT, or MD files.
2.  **Filter:** Click the documents in the sidebar to select which ones the AI should focus on.
3.  **Chat:** Ask questions. The AI will provide answers and tell you exactly which page/file it used for its facts.
