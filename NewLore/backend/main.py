import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
import shutil
from typing import Optional, List
import json

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
INDEX_PATH = "faiss_index"
METADATA_PATH = "metadata.json"

# Initialize local embeddings
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Initialize local LLM via Ollama
llm = OllamaLLM(model="llama3.2")

# Global storage for document matching
vector_store = None
indexed_files = {} # filename -> {size: str, id: int}

def save_state():
    global vector_store, indexed_files
    if vector_store:
        vector_store.save_local(INDEX_PATH)
    with open(METADATA_PATH, "w") as f:
        json.dump(indexed_files, f)

def load_state():
    global vector_store, indexed_files
    # Check if the directory exists AND contains the required index file
    index_file = os.path.join(INDEX_PATH, "index.faiss")
    if os.path.exists(INDEX_PATH) and os.path.exists(index_file):
        try:
            vector_store = FAISS.load_local(INDEX_PATH, embeddings, allow_dangerous_deserialization=True)
            print("Successfully loaded existing FAISS index.")
        except Exception as e:
            print(f"Warning: Failed to load FAISS index: {e}")
            vector_store = None
            
    if os.path.exists(METADATA_PATH):
        try:
            with open(METADATA_PATH, "r") as f:
                indexed_files = json.load(f)
            print(f"Loaded metadata for {len(indexed_files)} files.")
        except Exception as e:
            print(f"Warning: Failed to load metadata: {e}")
            indexed_files = {}

# Load existing data on startup
load_state()

@app.get("/files")
async def list_files():
    return [{"name": name, "size": info["size"], "id": info["id"]} for name, info in indexed_files.items()]

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global vector_store, indexed_files
    temp_path = f"temp_{file.filename}"
    
    try:
        # Check if already indexed
        if file.filename in indexed_files:
             return {"status": "success", "filename": file.filename, "message": "Already indexed"}

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        if file.filename.lower().endswith('.pdf'):
            loader = PyPDFLoader(temp_path)
        elif file.filename.lower().endswith(('.txt', '.md')):
            loader = TextLoader(temp_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported format.")
        
        docs = loader.load()
        for doc in docs:
            doc.metadata["source"] = file.filename

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_documents(docs)
        
        if vector_store is None:
            vector_store = FAISS.from_documents(chunks, embeddings)
        else:
            vector_store.add_documents(chunks)
        
        # Track file metadata
        file_size = os.path.getsize(temp_path)
        if file_size > 1024 * 1024:
            size_str = f"{round(file_size / (1024 * 1024), 1)} MB"
        else:
            size_str = f"{round(file_size / 1024, 1)} KB"
        
        indexed_files[file.filename] = {
            "size": size_str,
            "id": int(os.path.getmtime(temp_path) * 1000)
        }
        
        save_state()
        return {"status": "success", "filename": file.filename}
        
    except Exception as e:
        print(f"Upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.delete("/files/{filename}")
async def delete_file(filename: str):
    global vector_store, indexed_files
    if filename not in indexed_files:
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        # FAISS doesn't support easy deletion by metadata in some versions.
        # A common workaround is to rebuild the index without the deleted file
        # or filter during search (which we already do). 
        # For a truly 'clean' index, we rebuild:
        del indexed_files[filename]
        
        # If no files left, clear vector store
        if not indexed_files:
            vector_store = None
            if os.path.exists(INDEX_PATH):
                shutil.rmtree(INDEX_PATH)
        else:
            # Re-filtering is expensive but safe for small local collections.
            # Alternative: FAISS supports delete(ids) if we store ids.
            # For this MVP, we'll keep the documents in the index but they won't 
            # be searchable because of the UI filtering and 'list_files' exclusion.
            # To actually remove them from disk index:
            all_docs = []
            # This is slow but thorough for an MVP with few files.
            # In a real app, we'd use a vector DB like Chroma or Qdrant.
            # However, since we don't store the original documents, we can't easily rebuild.
            # Let's just rely on the search filter for now, or use the 'delete' method if supported.
            
            # Attempt to delete by source metadata if possible
            try:
                # Get all doc IDs where source == filename
                doc_ids = [doc_id for doc_id, doc in vector_store.docstore._dict.items() if doc.metadata.get("source") == filename]
                if doc_ids:
                    vector_store.delete(doc_ids)
            except Exception as e:
                print(f"Warning: Could not surgically delete from FAISS: {e}")
                # Fallback: Just save metadata, search filter will handle the rest
        
        save_state()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_docs(message: str = Form(...), filenames: Optional[str] = Form(None)):
    global vector_store
    
    if vector_store is None:
        return {"response": "Please upload a document first so I have something to reference!"}
    
    try:
        search_kwargs = {}
        if filenames:
            selected_files = [f.strip() for f in filenames.split(",")]
            # Only search files that actually exist in our metadata
            selected_files = [f for f in selected_files if f in indexed_files]
            if not selected_files:
                return {"response": "The selected files are no longer available."}
            
            search_kwargs["filter"] = lambda metadata: metadata.get("source") in selected_files

        docs = vector_store.similarity_search(message, k=4, **search_kwargs)
        
        if not docs:
            return {"response": "I couldn't find any information about that in the selected documents."}

        context_chunks = []
        for doc in docs:
            filename = doc.metadata.get("source", "Unknown")
            page = doc.metadata.get("page", None)
            tag = f"[{filename}" + (f", p.{page+1}]" if page is not None else "]")
            context_chunks.append(f"SOURCE_TAG: {tag}\nCONTENT: {doc.page_content}")
        
        labeled_context = "\n\n".join(context_chunks)
        
        prompt = f"""
        You are a precise research assistant. Use the provided context to answer the question.
        
        CITATION RULE:
        - For every sentence that uses information from the context, you MUST end it with the exact SOURCE_TAG provided in the context (e.g., [manual.pdf, p.5]).
        - DO NOT summarize multiple sources into one tag. Use separate tags for each fact.
        - If the answer is not in the context, say you don't know. Do not use outside knowledge.

        CONTEXT:
        {labeled_context}
        
        QUESTION:
        {message}
        
        ANSWER:
        """
        
        response = llm.invoke(prompt)
        return {"response": response}
        
    except Exception as e:
        print(f"Chat error: {str(e)}")
        return {"response": f"Error: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
