from sqlmodel import Session, SQLModel, create_engine

from backend.app.settings import get_settings

try:
    # Get database URL from settings with validation
    settings = get_settings()
    
    # only needed for psycopg 3 - replace postgresql
    # with postgresql+psycopg in settings.DATABASE_URL
    connection_string = str(settings.database_url).replace(
        "postgresql", "postgresql+psycopg"
    )

    # recycle connections after 5 minutes
    # to correspond with the compute scale down
    engine = create_engine(
        connection_string,
        connect_args={"sslmode": "require"},
        pool_recycle=300
    )
except ValueError as e:
    raise RuntimeError(f"Failed to initialize database connection: {str(e)}")


def create_db_and_tables():
    """Create all database tables"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session"""
    with Session(engine) as session:
        yield session
