from fastapi import FastAPI
from app.routes.uploads import router as upload_router
from app.routes.query import router as query_router

app = FastAPI(
    title="RAG PDF Chatbot",
    version="1.0.0",
    description="A chatbot that answers questions from uploaded PDFs."
)


@app.get("/")
def root():
    return {
        "message": "Backend is running!"
    }

app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(query_router, prefix="/query", tags=["Query"])