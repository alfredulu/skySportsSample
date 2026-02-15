from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .db import SessionLocal, engine
from .models import Article, Base

app = FastAPI(title="SkySportsSample API", version="0.1.0")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/v1/health")
def health():
    return {"status": "ok"}


@app.on_event("startup")
def on_startup():
    # Temporary for MVP: auto-create tables.
    # Later we will replace this with Alembic migrations.
    Base.metadata.create_all(bind=engine)


@app.get("/v1/articles")
def list_articles(db: Session = Depends(get_db)):
    articles = db.query(Article).order_by(Article.created_at.desc()).limit(20).all()
    return [
        {
            "id": a.id,
            "title": a.title,
            "summary": a.summary,
            "sport": a.sport,
            "source": a.source,
            "image_url": a.image_url,
            "created_at": a.created_at,
        }
        for a in articles
    ]
