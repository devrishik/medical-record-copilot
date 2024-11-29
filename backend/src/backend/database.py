from datetime import datetime, timedelta
import json
from typing import Dict, List, Optional
from .models import Case, CaseStatus, UploadedFile, FileType, LogicRule, Step

# In-memory database for demonstration
cases: Dict[str, Case] = {}
files: Dict[str, UploadedFile] = {}

def create_uploaded_file(filename: str, file_type: str, url: str) -> UploadedFile:
    uploaded_file = UploadedFile(
        filename=filename,
        file_type=FileType(file_type),
        url=url
    )
    files[uploaded_file.id] = uploaded_file
    return uploaded_file

def get_file(file_id: str) -> Optional[UploadedFile]:
    return files.get(file_id)

def create_case(medical_record_id: str, guidelines_id: str) -> Case:
    # Verify files exist
    medical_record = get_file(medical_record_id)
    guidelines = get_file(guidelines_id)
    if not medical_record or not guidelines:
        raise ValueError("Invalid file IDs")
    
    if medical_record.file_type != FileType.MEDICAL_RECORD:
        raise ValueError(f"File {medical_record_id} is not a medical record")
    
    if guidelines.file_type != FileType.GUIDELINES:
        raise ValueError(f"File {guidelines_id} is not a guidelines file")
    
    case = Case(
        medical_record_id=medical_record_id,
        guidelines_id=guidelines_id
    )
    cases[case.case_id] = case
    return case

def get_case(case_id: str) -> Optional[Case]:
    case = cases.get(case_id)
    if not case:
        return None
    
    # Simulate status changes based on time elapsed
    time_elapsed = datetime.now() - case.created_at
    
    if time_elapsed < timedelta(seconds=10):
        # Clear fields that shouldn't be present yet
        case.summary = None
        case.steps = []
        with open("assets/response-1.json") as f:
            data = json.load(f)
            case.status = data["status"]
            case.procedure_name = data["procedure_name"]
            # case.cpt_codes = data["cpt_codes"]
    elif time_elapsed < timedelta(seconds=30):
        # Load partial response from example-response-2.json
        with open("assets/response-2.json") as f:
            data = json.load(f)
            case.status = data["status"]
            case.procedure_name = data["procedure_name"]
            case.cpt_codes = data["cpt_codes"]
            case.summary = data["summary"]
            case.steps = []  # Still no steps in processing state
    else:
        # Load complete response from example-response-3.json
        with open("assets/response-3.json") as f:
            data = json.load(f)
            case.status = data["status"]
            case.procedure_name = data["procedure_name"]
            case.cpt_codes = data["cpt_codes"]
            case.summary = data["summary"]
            case.is_met = data["is_met"]
            case.is_complete = data["is_complete"]
            case.steps = [Step(**step) for step in data["steps"]]
    
    return case

def get_cases() -> List[Case]:
    return [get_case(case_id) for case_id in cases.keys()]
