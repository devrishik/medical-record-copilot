# Backend Service

A FastAPI-based backend service for medical case processing and file management.


## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Pydantic**: Data validation using Python type annotations
- **SQLModel**: SQL database interaction with type safety
- **PostgreSQL**: Robust, production-ready database

## Setup Instructions

1. Install Rye (Python Package Manager)
   ```bash
   # Follow Rye installation instructions from: https://rye-up.com/
   ```

2. Install Dependencies
   ```bash
   rye sync --update-all
   ```

3. Start the Server
   ```bash
   rye run server
   ```

The server will start at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- API documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

## Future Work

- **PDF Processing**:
  - Implement PDF text extraction using `pdfplumber`
  - Add LLM-based inference for medical text analysis
  - Integrate VLMs (Vision Language Models) for processing image-based medical records

- **Database Optimization**:
  - Add indexing for faster queries
  - Implement faiss for efficient vector search
  - Add database migrations

- **Security**:
  - Add authentication/authorization
  - Implement rate limiting
  - Add input validation and sanitization
