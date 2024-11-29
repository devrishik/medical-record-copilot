import os
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import Case, CaseCreate, CaseResponse, UploadResponse
from .database import create_case, get_case, get_cases, create_uploaded_file

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/{file_type}")
async def upload_file(file_type: str, file: UploadFile = File(...)) -> UploadResponse:
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    uploaded_file = create_uploaded_file(
        filename=file.filename,
        file_type=file_type,
        url=file_path
    )
    print(f"Created file record: {uploaded_file}")
    return uploaded_file

@app.post("/cases", response_model=CaseResponse)
async def create_case_endpoint(case_data: CaseCreate) -> Case:
    print(f"Received case data: {case_data}")
    try:
        case = create_case(
            medical_record_id=case_data.medical_record_id,
            guidelines_id=case_data.guidelines_id
        )
        print(f"Created case: {case}")
        return case
    except ValueError as e:
        print(f"Error creating case: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/cases/{case_id}", response_model=CaseResponse)
async def get_case_endpoint(case_id: str) -> Case:
    case = get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@app.get("/cases", response_model=List[CaseResponse])
async def get_cases_endpoint() -> List[Case]:
    return get_cases()

@app.get("/")
async def root():
    return {"message": "Hello World"}