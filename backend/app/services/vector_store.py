import chromadb
import os
from dotenv import load_dotenv

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="pdf_documents"
)

def store_embeddings(chunks, embeddings, document_id, filename, user_id):
    ids = [
        f"{document_id}_chunk_{i}" for i in range(len(chunks))
    ]

    metadatas = [
        {
            "document_id": document_id,
            "filename": filename,
            "user_id": user_id
        }
        for _ in chunks
    ]

    collection.add(
        documents = chunks,
        embeddings = embeddings.tolist(),
        ids = ids,
        metadatas = metadatas
    )

load_dotenv()
top_k = int(os.getenv("TOP_K", 5))

def query_embeddings(query_embedding, user_id):

    results = collection.query(
        query_embeddings= [query_embedding],
        n_results= top_k,
        where = {
            "user_id" : user_id
        }
    )
    return results