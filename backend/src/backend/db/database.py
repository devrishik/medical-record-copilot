from datetime import datetime
import os
from typing import Optional, List
from sqlmodel import SQLModel, Session, create_engine, select
from backend.db.models import Case, CaseStatus, UploadedFile, FileType
from backend.app.settings import get_settings

# PostgreSQL connection URL - should be moved to config
engine = create_engine(str(get_settings().database_url))

def init_database():
    """Initialize database with table reflection check"""
    # First reflect existing tables
    SQLModel.metadata.reflect(bind=engine)
    
    # Create only tables that don't exist yet
    SQLModel.metadata.create_all(engine, checkfirst=True)

# Initialize database on module import
with engine.begin() as conn:
    init_database()


def get_session():
    """Get a database session"""
    with Session(engine) as session:
        yield session


def save_file(file_id: str, filename: str, file_type: FileType, session: Session) -> UploadedFile:
    """Save a file record to the database"""
    uploaded_file = UploadedFile(id=file_id, filename=filename, type=file_type)
    session.add(uploaded_file)
    session.commit()
    session.refresh(uploaded_file)
    return uploaded_file


def get_file(file_id: str, session: Session) -> Optional[UploadedFile]:
    """Get a file record from the database"""
    return session.get(UploadedFile, file_id)


def create_case(medical_record_id: str, guidelines_id: str, session: Session) -> Case:
    """Create a new case in the database"""
    # Validate files exist and are of correct type
    medical_record = get_file(medical_record_id, session)
    if not medical_record or medical_record.type != FileType.medical_record:
        raise ValueError(f"File {medical_record_id} is not a medical record")

    guidelines = get_file(guidelines_id, session)
    if not guidelines or guidelines.type != FileType.guidelines:
        raise ValueError(f"File {guidelines_id} is not a guidelines file")
    
    # Create new case - most fields will use model defaults
    case = Case(
        medical_record_id=medical_record_id,
        guidelines_id=guidelines_id,
    )
    
    session.add(case)
    session.commit()
    session.refresh(case)
    return case


def get_case(case_id: str, session: Session) -> Optional[Case]:
    """Get a case from the database"""
    return session.get(Case, case_id)


def get_cases(session: Session, skip: int = 0, limit: int = 100) -> List[Case]:
    """Get a list of cases with pagination"""
    statement = select(Case).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_case(case: Case, session: Session) -> Case:
    """Update a case in the database"""
    session.add(case)
    session.commit()
    session.refresh(case)
    return case
