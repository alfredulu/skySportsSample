from sqlalchemy import String, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from .db import Base
from datetime import datetime

class Article(Base):
    __tablename__ = "articles"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    summary: Mapped[str | None] = mapped_column(Text(), nullable=True)
    sport: Mapped[str] = mapped_column(String(50), default="football")
    source: Mapped[str | None] = mapped_column(String(120), nullable=True)
    image_url: Mapped[str | None] = mapped_column(Text(), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
)
