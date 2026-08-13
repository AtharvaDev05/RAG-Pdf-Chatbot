from fastapi import APIRouter, UploadFile, File, HTTPException, Depends

from app.utils.pdf_reader import extract_text_from_pdf
from app.utils.text_splitter import split_text
from app.services.embedding import create_embeddings
from app.services.vector_store import store_embeddings

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.db_models import User, Document

import shutil
import uuid


router = APIRouter()

@router.get("/")
def upload_page():
    return {
        "message" : "Upload route is Working!"
    }

@router.post("/")
def upload_pdf (
    file: UploadFile = File(...),
    current_user : User = Depends(get_current_user),
    db : Session = Depends(get_db) 
):
    

    #Validate that uploaded file is pdf
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed"
        )

    # Generate unique document ID
    document_id = str(uuid.uuid4())

    document = Document(
        filename = file.filename,
        document_id = document_id,
        user_id = current_user.id
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    #Generate unique filename
    unique_filename = f"{document_id}_{file.filename}"

    file_path = f"uploads/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = extract_text_from_pdf(file_path)
    chunks = split_text(text)
    print(f"Total chunks : {len(chunks)}")

    embeddings = create_embeddings(chunks)
    print(embeddings.shape)

    store_embeddings(chunks, embeddings, document_id, file.filename, current_user.id)
    
    return {
        "message": "File uploaded successfully!",
        "original_filename": file.filename,
        "stored_filename": unique_filename,
        "document_id": document_id
    }