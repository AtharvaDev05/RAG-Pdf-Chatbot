from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.pdf_reader import extract_text_from_pdf
from app.utils.text_splitter import split_text
from app.services.embedding import create_embeddings
from app.services.vector_store import store_embeddings
import shutil
import uuid

router = APIRouter()

@router.get("/")
def upload_page():
    return {
        "message" : "Upload route is Working!"
    }

@router.post("/")
def upload_pdf(file: UploadFile = File(...)):

    #Validate that uploaded file is pdf
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    #Generate unique filename
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = f"uploads/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)
    chunks = split_text(text)
    print(f"Total chunks : {len(chunks)}")

    embeddings = create_embeddings(chunks)
    print(embeddings.shape)

    document_id = unique_filename.split("_")[0]
    store_embeddings(chunks, embeddings, document_id)


    # for index, chunk in enumerate(chunks[:3], start=1):
    #     print(f"\n------Chunk {index} ------")
    #     print(chunk)
    
    return {
        "message": "File uploaded successfully!",
        "original_filename": file.filename,
        "stored_filename": unique_filename
    }