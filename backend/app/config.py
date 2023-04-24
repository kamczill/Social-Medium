from pydantic import BaseSettings

class Settings(BaseSettings):
    MONGODB_URL: str
    
    JWT_PUBLIC_KEY: str
    JWT_PRIVATE_KEY: str
    REFRESH_TOKEN_EXPIRES_IN: str
    ACCESS_TOKEN_EXPIRES_IN: int
    JWT_ALGORITHM: str
    
    class Config:
        env_file = ".env"
        
settings = Settings()