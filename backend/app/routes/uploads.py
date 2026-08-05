from fastapi import APIRouter, UploadFile, File, HTTPException
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

    #Get the file extension .pdf
    file_extension = file.filename.split(".")[-1]

    #Generate unique filename
    unique_filename = f"{uuid.uuid4()}.{file_extension}"

    file_path = f"uploads/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    return {
        "message": "File uploaded successfully!",
        "original_filename": file.filename,
        "stored_filename": unique_filename
    }