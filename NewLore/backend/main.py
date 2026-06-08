import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_ollama import OllamaLLM
import shutil
from typing import Optional

app = FastAPI()

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize local embeddings (runs on your CPU)
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Initialize local LLM via Ollama
llm = OllamaLLM(model="llama3.2")

# Global storage for document matching
vector_store = None

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    global vector_store
    temp_path = f"temp_{file.filename}"
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        if file.filename.lower().endswith('.pdf'):
            loader = PyPDFLoader(temp_path)
        elif file.filename.lower().endswith(('.txt', '.md')):
            loader = TextLoader(temp_path)
        else:
            raise HTTPException(status_code=400, detail="Unsupported format.")
        
        docs = loader.load()
        # Ensure 'source' metadata is just the filename for cleaner citations
        for doc in docs:
            doc.metadata["source"] = file.filename

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = text_splitter.split_documents(docs)
        
        if vector_store is None:
            vector_store = FAISS.from_documents(chunks, embeddings)
        else:
            vector_store.add_documents(chunks)
            
        return {"status": "success", "filename": file.filename}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/chat")
async def chat_with_docs(message: str = Form(...), filenames: Optional[str] = Form(None)):
    global vector_store
    
    if vector_store is None:
        return {"response": "Please upload a document first so I have something to reference!"}
    
    try:
        # 1. Search for relevant context
        # If specific filenames are provided, we filter the search
        search_kwargs = {}
        if filenames:
            selected_files = [f.strip() for f in filenames.split(",")]
            # FAISS in LangChain supports filtering via a callable or dict
            # We use a lambda to filter by 'source' metadata
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
