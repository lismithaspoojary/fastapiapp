import os
from SQlalchemy.ext.asyncio import create_async_engine, Async_Sessionmaker,AsyncSession

from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv
load_dotenv()

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "lismitha@12345")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 5432))
DB_NAME = os.getenv("DB_NAME", "student_db")
DATABASE_URL = os.getenv("DATABASE_URL")


def make_url(database: str) -> URL:
    return URL.create(
        drivername="postgresql+psycopg2",
        username=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT,
        database=database,
    )


def make_database_url(database: str) -> str:
    return make_url(database).render_as_string(hide_password=False)


def ensure_database_exists() -> None:
    if DATABASE_URL:
        return

    admin_url = make_url("postgres")
    try:
        admin_engine = create_engine(admin_url, isolation_level="AUTOCOMMIT")
        with admin_engine.connect() as conn:
            exists = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :name"),
                {"name": DB_NAME},
            ).scalar()
            if not exists:
                conn.execute(text(f'CREATE DATABASE "{DB_NAME}"'))
        admin_engine.dispose()
    except Exception:
        # Let the application continue if the database server is not available yet.
        return


SQLALCHEMY_DATABASE_URL = DATABASE_URL or make_database_url(DB_NAME)
ensure_database_exists()
engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()