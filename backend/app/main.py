from fastapi import FastAPI

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