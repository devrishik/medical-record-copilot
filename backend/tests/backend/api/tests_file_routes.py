import os
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from src.backend.api.file_routes import router
from src.backend.db.models import FileType, UploadedFile
from src.backend.db.database import save_file, get_session, engine as prod_engine
from src.backend.app.main import app

# Create test database
@pytest.fixture(name="engine")
def engine_fixture(monkeypatch):
    # Create test engine
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Clear any existing metadata
    SQLModel.metadata.clear()
    
    # Create fresh tables
    SQLModel.metadata.create_all(test_engine)
    
    # Replace production engine with test engine
    import src.backend.db.database as db_module
    monkeypatch.setattr(db_module, "engine", test_engine)
    
    yield test_engine
    
    # Clean up
    SQLModel.metadata.drop_all(test_engine)
    test_engine.dispose()

@pytest.fixture(name="session")
def session_fixture(engine):
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    app.include_router(router)
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

def test_upload_file(client: TestClient, tmp_path):
    # Create a temporary file for testing
    test_file_content = b"test file content"
    test_file_path = tmp_path / "test.txt"
    test_file_path.write_bytes(test_file_content)

    # Test file upload
    with open(test_file_path, "rb") as f:
        response = client.post(
            "/files",
            files={"file": ("test.txt", f, "text/plain")},
            params={"file_type": FileType.medical_record.value}
        )
    
    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "test.txt"
    assert data["type"] == FileType.medical_record.value
    assert "id" in data

    # Verify file was saved
    upload_path = os.path.join("uploads", data["id"])
    assert os.path.exists(upload_path)
    with open(upload_path, "rb") as f:
        assert f.read() == test_file_content

    # Cleanup
    os.remove(upload_path)

def test_upload_file_invalid_type(client: TestClient, tmp_path):
    # Create a temporary file for testing
    test_file_path = tmp_path / "test.txt"
    test_file_path.write_bytes(b"test content")

    # Test file upload with invalid file type
    with open(test_file_path, "rb") as f:
        response = client.post(
            "/files",
            files={"file": ("test.txt", f, "text/plain")},
            params={"file_type": "invalid_type"}
        )
    
    assert response.status_code == 422  # Validation error

def test_get_file_metadata(client: TestClient, session: Session):
    # Create a test file record
    file_id = "test-file-id"
    test_file = save_file(
        file_id=file_id,
        filename="test.txt",
        file_type=FileType.medical_record,
        session=session
    )

    # Test getting file metadata
    response = client.get(f"/files/{file_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == file_id
    assert data["filename"] == "test.txt"
    assert data["type"] == FileType.medical_record.value

def test_get_nonexistent_file(client: TestClient):
    response = client.get("/files/nonexistent-id")
    assert response.status_code == 404
    assert response.json()["detail"] == "File not found"
