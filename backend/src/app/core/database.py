from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from .config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DB_ECHO,
    connect_args={"statement_cache_size": 0},
)

# Create a session factorythat will be used to create new sessions for interacting with the database. (using async_sessionmaker to create asynchronous sessions)
SessionLocal = async_sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


# Base class for all the models in the application. It inherits from DeclarativeBase, which is a base class provided by SQLAlchemy for defining models using the declarative syntax.
class Base(DeclarativeBase):
    pass


# Dependency function that can be used in FastAPI routes to get a database session. It uses the SessionLocal factory to create a new session and yields it. The session will be automatically closed after the request is completed.
async def get_db():
    async with SessionLocal() as session:
        yield session
