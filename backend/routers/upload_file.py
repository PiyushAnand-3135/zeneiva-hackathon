from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    print(f"Received file: {file.filename}")  # Debug log
    return {"message": "Image upload success", "filename": file.filename}
