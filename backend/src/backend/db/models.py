from datetime import datetime
from enum import Enum
from typing import List, Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import JSON, Column
from uuid import uuid4


class FileType(str, Enum):
    medical_record = "medical_record"
    guidelines = "guidelines"


class CaseStatus(str, Enum):
    submitted = "submitted"
    processing = "processing"
    complete = "complete"
    success = "success"
    failed = "failed"


class UploadedFile(SQLModel, table=True):
    __tablename__ = "uploaded_files"
    __table_args__ = {'extend_existing': True}  
    
    id: str = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    filename: str
    type: FileType


class LogicRule(SQLModel):
    text: str
    selected: bool


class Evidence(SQLModel):
    content: str
    page_number: int
    pdf_id: Optional[str] = None
    event_datetime: Optional[datetime] = None
    confidence: Optional[float] = None


class StepOption(SQLModel):
    text: str
    next_step: Optional[str] = None
    selected: bool
    key: str


class Step(SQLModel):
    key: str
    question: str
    decision: str
    options: List[StepOption] = Field(sa_column=Column(JSON))
    selected: Optional[str] = None
    next_step: Optional[str] = None
    reasoning: Optional[str] = None
    evidence: List[Evidence] = Field(default_factory=list, sa_column=Column(JSON))
    logic: Optional[List[LogicRule]] = Field(default=None, sa_column=Column(JSON))


class Case(SQLModel, table=True):
    __tablename__ = "cases"
    __table_args__ = {'extend_existing': True}
    
    case_id: str = Field(
        default_factory=lambda: str(uuid4()),
        primary_key=True
    )
    medical_record_id: str = Field(foreign_key="uploaded_files.id", index=True)
    guidelines_id: str = Field(foreign_key="uploaded_files.id", index=True)
    procedure_name: Optional[str] = None
    cpt_codes: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    summary: Optional[str] = None
    status: CaseStatus = Field(default=CaseStatus.submitted)
    is_met: bool = Field(default=False)
    is_complete: bool = Field(default=False)
    steps: List[Step] = Field(default_factory=list, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.now)
