from functools import lru_cache
from typing import Optional

from pydantic import AnyHttpUrl, PostgresDsn, ValidationError, field_validator, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: PostgresDsn = Field(..., validation_alias="DATABASE_URL")
    groq_api_key: str = Field(..., validation_alias="GROQ_API_KEY")
    
    @field_validator("database_url", mode="before")
    def validate_database_url(cls, v: str) -> str:
        if not v:
            raise ValueError("DATABASE_URL is required")
        if not str(v).startswith("postgresql://"):
            raise ValueError("DATABASE_URL must be a PostgreSQL connection string")
        return v

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    try:
        return Settings()
    except ValidationError as e:
        raise ValueError(f"Missing or invalid configuration: {str(e)}")