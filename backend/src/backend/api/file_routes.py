import os
from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlmodel import Session

from backend.app.logger import logger, log_traceback
from backend.db.database import get_file, save_file
from backend.db.models import FileType, UploadedFile
from backend.db.session import get_session

router = APIRouter(tags=["files"])


@router.post("/upload/{file_type}", response_model=UploadedFile)
async def upload_file(
    file_type: str,
    file: UploadFile = File(...),
    session: Session = Depends(get_session)
):
    """Upload a file and save its metadata"""
    try:
        # Convert string file_type to enum
        try:
            file_type_enum = FileType(file_type.replace("-", "_"))
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid file type: {file_type}")

        # Generate unique ID for the file
        file_id = str(uuid4())
        
        # Save file to disk
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        file_path = os.path.join(upload_dir, file_id)
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Save file metadata to database
        uploaded_file = save_file(file_id, file.filename, file_type_enum, session)
        logger.info(f"Successfully uploaded file {file_id}")
        return uploaded_file
        
    except Exception as e:
        # Clean up file if saved
        if "file_path" in locals() and os.path.exists(file_path):
            os.remove(file_path)
        log_traceback(e, f"upload_file endpoint - filename={file.filename}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{file_id}", response_model=UploadedFile)
async def get_file_metadata(file_id: str, session: Session = Depends(get_session)):
    """Get file metadata"""
    try:
        file = get_file(file_id, session)
        if not file:
            logger.warning(f"File not found: {file_id}")
            raise HTTPException(status_code=404, detail="File not found")
        return file
    except HTTPException:
        raise
    except Exception as e:
        log_traceback(e, f"get_file_metadata endpoint - file_id={file_id}")
        raise HTTPException(status_code=500, detail=str(e))
