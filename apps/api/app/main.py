from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from .db import SessionLocal, engine
from .models import Article, Base
from .schemas import ArticlesPage, ArticleOut

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


@app.get("/v1/articles", response_model=ArticlesPage)
def list_articles(
    db: Session = Depends(get_db),
    sport: str | None = Query(default=None, min_length=1, max_length=50),
    limit: int = Query(default=20, ge=1, le=50),
    offset: int = Query(default=0, ge=0),
):
    q = db.query(Article)

    if sport:
        q = q.filter(Article.sport == sport)

    total = q.count()

    articles = (
        q.order_by(Article.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return ArticlesPage(
        items=[ArticleOut.model_validate(a) for a in articles],
        total=total,
        limit=limit,
        offset=offset,
    )

