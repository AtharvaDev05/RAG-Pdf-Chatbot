import chromadb

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