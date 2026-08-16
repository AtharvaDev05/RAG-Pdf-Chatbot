from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.routes.uploads import router as upload_router
from app.routes.query import router as query_router
from app.routes.auth import router as auth_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="RAG PDF Chatbot",
    version="1.0.0",
    description="A chatbot that answers questions from uploaded PDFs."
)

app.add_middleware(
    SessionMiddleware,
    secret_key = os.getenv("SESSION_SECRET")
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
app.include_router(auth_router)