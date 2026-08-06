from fastapi import APIRouter
from app.models.request_models import QueryRequest, QueryResponse
from app.services.embedding import create_query_embedding
from app.services.vector_store import query_embeddings
from app.services.llm import generate_answer

router = APIRouter()

@router.post("/query", response_model = QueryResponse)
def query_documents(request: QueryRequest):

    # Convert the user's question into an embedding
    query_embedding = create_query_embedding(request.question)

    # Retrieve the most relevant chunks from ChromaDB and handle empty chunks
    results = query_embeddings(query_embedding)
    documents = results.get("documents", [])
    if not documents or not documents[0]:
        return QueryResponse (
            answer = "I couldn't find any relevant information in the uploaded documents.",
            sources = []
        )

    # Extract the retrieved document chunks
    chunks = documents[0]

    # Remove duplicate chunks while preserving order
    chunks = list(dict.fromkeys(chunks))

    # Distinguish each chunk visually
    context = ""
    for index, chunk in enumerate(chunks, start=1):
        context += f"===== DOCUMENT CHUNK {index} =====\n"
        context += chunk
        context += "\n\n"

    # Generate the final answer using Gemini and handle technical errors
    try:
        answer = generate_answer(context, request.question)

    except Exception as e:
        print(e)
        return QueryResponse (
            answer = "Sorry, something went wrong while generating the answer.",
            sources = []
        )

    return QueryResponse(
        answer = answer,
        sources = chunks
    )
    