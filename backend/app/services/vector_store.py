import chromadb
import os
from dotenv import load_dotenv

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="pdf_documents"
)

def store_embeddings(chunks, embeddings, document_id):
    ids = [
        f"{document_id}_chunk_{i}" for i in range(len(chunks))
    ]

    collection.add(
        documents = chunks,
        embeddings = embeddings.tolist(),
        ids = ids
    )

load_dotenv()
top_k = int(os.getenv("TOP_K", 5))

def query_embeddings(query_embedding):

    results = collection.query(
        query_embeddings= [query_embedding],
        n_results= top_k
    )
    return results