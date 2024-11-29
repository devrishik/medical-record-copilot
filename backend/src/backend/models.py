from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class CaseStatus(str, Enum):
    SUBMITTED = "submitted"
    PROCESSING = "processing"
    COMPLETE = "complete"


class FileType(str, Enum):
    MEDICAL_RECORD = "medical-record"
    GUIDELINES = "guidelines"


class UploadedFile(BaseModel):
    id: str = Field(default_factory=lambda: f"file_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    filename: str
    file_type: FileType
    url: str
    created_at: datetime = Field(default_factory=datetime.now)


class Evidence(BaseModel):
    content: str
    page_number: int
    pdf_id: str = Field(alias="pdf_name")  # Map pdf_name to pdf_id
    event_datetime: Optional[datetime] = None


class StepOption(BaseModel):
    text: str
    next_step: Optional[str] = None
    selected: bool = False
    key: str


class LogicRule(BaseModel):
    text: str
    selected: bool = False


class Step(BaseModel):
    key: str
    question: str
    decision: str
    options: List[StepOption]
    selected: Optional[str] = None
    next_step: Optional[str] = None
    reasoning: Optional[str] = None
    evidence: List[Evidence] = []
    logic: Optional[List[LogicRule]] = None


class Case(BaseModel):
    case_id: str = Field(default_factory=lambda: f"case_{datetime.now().strftime('%Y%m%d_%H%M%S')}")
    created_at: datetime = Field(default_factory=datetime.now)
    status: CaseStatus = Field(default=CaseStatus.SUBMITTED)
    medical_record_id: str
    guidelines_id: str
    procedure_name: Optional[str] = None
    cpt_codes: List[str] = []
    summary: Optional[str] = None
    is_met: Optional[bool] = None
    is_complete: bool = False
    steps: List[Step] = []


class CaseCreate(BaseModel):
    medical_record_id: str
    guidelines_id: str


class CaseResponse(Case):
    pass


class UploadResponse(UploadedFile):
    pass
