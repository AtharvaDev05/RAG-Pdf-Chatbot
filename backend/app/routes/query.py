from fastapi import APIRouter
from app.models.request_models import QueryRequest
from app.services.embedding import create_query_embedding
from app.services.vector_store import query_embeddings

router = APIRouter()

@router.post("/query")
def query_documents(request: QueryRequest):

    query_embedding = create_query_embedding(request.question)

    results = query_embeddings(query_embedding)

    return results