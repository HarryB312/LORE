# Deployment Guide: NewLore Researcher

Deploying NewLore Researcher for business use involves managing three main components: the **Ollama LLM Engine**, the **Python Backend**, and the **React Frontend**.

## Deployment Strategies

### 1. The "Local Native" Path (Best for Individual Privacy)
Each computer runs its own instance of everything.
- **Requirement:** You must install Ollama on every target computer.
- **Pros:** Maximum privacy; no server costs; works offline.
- **Cons:** High system requirements for every user (needs decent RAM/GPU).
- **Steps:**
    1. Install Ollama and run `ollama pull llama3.2`.
    2. Clone the repo and run setup scripts (can be automated with a `.sh` or `.bat` file).

### 2. The "Shared Server" Path (Best for Teams)
Run Ollama and the Backend on one powerful machine (a "server"), and let users access the Frontend via their browser.
- **Requirement:** Only the server needs Ollama and Python installed.
- **Pros:** Users don't need powerful computers; one central "knowledge base" if configured.
- **Cons:** Requires a central machine that is always on.
- **Configuration:** 
    - Set `OLLAMA_HOST=0.0.0.0` on the server so it accepts remote connections.
    - Update the frontend `fetch` URLs from `localhost:8000` to the server's IP address.

### 3. The Docker Path (Best for Professional IT)
Package the entire app into a container for consistent deployment.
- **Pros:** "It just works" regardless of the OS; easy to scale.
- **Steps:**
    1. Create a `Dockerfile` for the backend and one for the frontend.
    2. Use `docker-compose` to link them with an Ollama container.

---

## Business Considerations

### Hardware Requirements
To run local AI smoothly, the target machines should ideally have:
- **Mac:** M1 chip or newer with 16GB+ RAM.
- **Windows/Linux:** 16GB+ RAM and a dedicated NVIDIA GPU (preferred) or a modern CPU.

### Security
Since this is a "Local-Only" version, it is highly secure for businesses as **data never leaves the internal network.** If using the "Shared Server" path, ensure the server is behind a VPN or internal firewall.

### Model Licensing
The `llama3.2` model is released under the Llama 3.2 Community License. It is generally free for business use unless you have more than 700 million monthly active users.
