from datetime import datetime
from pydantic import BaseModel, ConfigDict


class ArticleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    summary: str | None
    sport: str
    source: str | None
    image_url: str | None
    created_at: datetime
    body: str | None = None


class ArticlesPage(BaseModel):
    items: list[ArticleOut]
    total: int
    limit: int
    offset: int
