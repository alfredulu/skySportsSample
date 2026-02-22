from fastapi import FastAPI, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
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
    q: str | None = Query(default=None, min_length=1, max_length=100),
    limit: int = Query(default=20, ge=1, le=50),
    offset: int = Query(default=0, ge=0),
):
    query = db.query(Article)

    if sport:
        query = query.filter(Article.sport == sport)

    if q:
        term = f"%{q.strip}%"
        query = query.filter(
            or_(
                Article.title.ilike(term),
                Article.summary.ilike(term),
                Article.body.ilike(term),
            )
        )

    total = query.count()

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

@app.get("/v1/articles/{article_id}", response_model=ArticleOut)
def get_article(article_id: int, db: Session = Depends(get_db)):
    article = db.get(Article, article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
