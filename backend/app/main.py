from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.uploads import router as upload_router
from app.routes.query import router as query_router

app = FastAPI(
    title="RAG PDF Chatbot",
    version="1.0.0",
    description="A chatbot that answers questions from uploaded PDFs."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Backend is running!"
    }

app.include_router(upload_router, prefix="/upload", tags=["Upload"])
app.include_router(query_router, prefix="/query", tags=["Query"])