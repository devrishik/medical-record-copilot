import pytest
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from src.backend.db.models import FileType, UploadedFile
from src.backend.db.database import save_file, get_file

@pytest.fixture(name="engine")
def engine_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Clear any existing metadata
    SQLModel.metadata.clear()
    
    # Register models
    SQLModel.metadata.reflect(bind=engine)
    
    # Create fresh tables
    SQLModel.metadata.create_all(engine)
    
    yield engine
    
    SQLModel.metadata.drop_all(engine)
    engine.dispose()

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

def test_save_and_get_file(session: Session):
    # Create a test file record
    file_id = "test-file-id"
    test_file = save_file(
        file_id=file_id,
        filename="test.txt",
        file_type=FileType.medical_record,
        session=session
    )

    # Test getting file metadata
    retrieved_file = get_file(file_id, session)
    assert retrieved_file.id == file_id
    assert retrieved_file.filename == "test.txt"
    assert retrieved_file.type == FileType.medical_record