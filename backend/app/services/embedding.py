from typing import List
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(chunks: List[str]) -> List[List[str]]: #type hint
    embeddings = model.encode(chunks)

    return embeddings

def create_query_embedding(question : str):
    embedding = model.encode(question)
    return embedding