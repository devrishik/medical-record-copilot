# Healthcare AI

## Current Architecture

```mermaid
sequenceDiagram
    participant Client
    participant FastAPI
    participant Database

    Client->>FastAPI: POST /cases
    FastAPI->>Database: Create new case
    Database-->>FastAPI: Case created
    FastAPI-->>Client: Return case details

    Client->>FastAPI: GET /cases/{case_id}
    FastAPI->>Database: Retrieve case by ID
    Database-->>FastAPI: Return case details
    FastAPI-->>Client: Send case details
```

## Proposed Architecture

```mermaid
graph TB
    subgraph Client
        FE[Frontend App]
    end

    subgraph Backend["Backend Service (FastAPI)"]
        API[API Layer]
        Routes["/cases, /upload"]
        Models["Models (Pydantic)"]
        DB_Layer["Database Layer (SQLModel)"]
        FileHandler["File Handler"]
        
        API --> Routes
        Routes --> Models
        Routes --> FileHandler
        Models --> DB_Layer
    end

    subgraph Storage
        DB[(PostgreSQL)]
        Files[File Storage]
        VectorDB[FAISS Vector DB]
    end

    subgraph AI["AI Processing"]
        LLM[LLM Service]
        VLM["Vision LM<br/>(Future)"]
        PDF["PDF Processor<br/>(Future)"]
    end

    FE <--> API
    DB_Layer --> DB
    FileHandler --> Files
    Models --> VectorDB
    Routes --> LLM
    Routes --> VLM
    Routes --> PDF

    style Backend fill:#f5f5f5,stroke:#333,stroke-width:2px
    style Storage fill:#e6f3ff,stroke:#333,stroke-width:2px
    style AI fill:#f0fff0,stroke:#333,stroke-width:2px
    style Client fill:#fff5e6,stroke:#333,stroke-width:2px
```

## Getting Started

### Backend Setup 🚀

1. **Clone the Repository**
   ```bash
   git clone git@github.com:devrishik/medical-record-copilot.git
   cd medical-record-copilot/backend
   ```

2. **Configure Environment**
   ```bash
   # Add your PostgreSQL connection string to .env file
   cp .env.example .env
   # Edit .env with your database credentials
   DATABASE_URL="postgresql://postgres:password@host:5432/medical_record_copilot"
   GROQ_API_KEY="gsk_2b0a0b3e-1234-4b1a-9b3a-1222e1"
   ```

3. **Install Dependencies**
   ```bash
   rye sync --update-all
   ```

4. **Start the Server**
   ```bash
   rye run server
   ```

   The FastAPI server will be running at `http://localhost:8000` 🌐

### Frontend Setup 💻

1. **Navigate to Frontend on a separate Terminal**
   ```bash
   cd ../frontend
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   # Set API URL in .env
   NEXT_PUBLIC_API_URL="localhost:8000"
   ```

3. **Install & Run**
   ```bash
   npm i
   npm run dev
   ```

   The Next.js app will be available at `http://localhost:3000` ✨