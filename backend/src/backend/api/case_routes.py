import json
from datetime import datetime, timedelta
from typing import List
from pydantic import BaseModel

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from backend.app.logger import logger, log_traceback
from backend.db.database import create_case, get_case, get_cases
from backend.db.models import Case
from backend.db.session import get_session

router = APIRouter(prefix="/cases", tags=["cases"])


class CreateCaseRequest(BaseModel):
    medical_record_id: str
    guidelines_id: str


def process_case_status(case):
    """Process case status based on elapsed time"""
    time_elapsed = datetime.now() - case.created_at
    
    try:
        if time_elapsed < timedelta(seconds=15):
            # Load initial response from example-response-1.json
            with open("assets/response-1.json") as f:
                data = json.load(f)
                case.status = data["status"]
                case.cpt_codes = []
                case.procedure_name = data["procedure_name"]
        elif time_elapsed < timedelta(seconds=30):
            # Load partial response from example-response-2.json
            with open("assets/response-2.json") as f:
                data = json.load(f)
                case.status = data["status"]
                case.summary = data["summary"]
                case.cpt_codes = data["cpt_codes"]
                case.steps = data["steps"]
                case.procedure_name = data["procedure_name"]
        else:
            # Load complete response from example-response-3.json
            with open("assets/response-3.json") as f:
                data = json.load(f)
                case.status = data["status"]
                case.cpt_codes = data["cpt_codes"]
                case.summary = data["summary"]
                case.steps = data["steps"]
                case.procedure_name = data["procedure_name"]
                case.is_complete = data["is_complete"]
                case.is_met = data["is_met"]
        return case
    except Exception as e:
        log_traceback(e, f"Error processing case status for case {case.case_id}")
        raise HTTPException(status_code=500, detail=f"Error processing case status: {str(e)}")


@router.post("", response_model=Case)
async def create_new_case(
    request: CreateCaseRequest,
    session: Session = Depends(get_session)
):
    """Create a new case from medical record and guidelines"""
    try:
        case = create_case(request.medical_record_id, request.guidelines_id, session)
        case = process_case_status(case)
        logger.info(f"Successfully created case with ID {case.case_id}")
        return case
    except ValueError as e:
        logger.warning(f"Invalid input for case creation: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.exception(traceback.format_exc())
        log_traceback(e, f"create_new_case endpoint - medical_record_id={request.medical_record_id}, guidelines_id={request.guidelines_id}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{case_id}", response_model=Case)
async def get_case_status(case_id: str, session: Session = Depends(get_session)):
    """Get status and details of a specific case"""
    try:
        case = get_case(case_id, session)
        if not case:
            logger.warning(f"Case not found: {case_id}")
            raise HTTPException(status_code=404, detail="Case not found")
        case = process_case_status(case)
        logger.info(f"Successfully retrieved case {case_id}")
        return case
    except HTTPException:
        raise
    except Exception as e:
        log_traceback(e, f"get_case_status endpoint - case_id={case_id}")
        raise HTTPException(status_code=500, detail=str(e))


# @router.get("", response_model=List[Case])
# async def list_cases(
#     skip: int = 0,
#     limit: int = 100,
#     session: Session = Depends(get_session)
# ):
#     """List all cases with pagination"""
#     try:
#         cases = get_cases(session, skip=skip, limit=limit)
#         return cases
#     except Exception as e:
#         log_traceback(e, "list_cases endpoint")
#         raise HTTPException(status_code=500, detail=str(e))
