from .db import SessionLocal
from .models import Article
from .db import engine
from .models import Base
Base.metadata.create_all(bind=engine)


def run():
    db = SessionLocal()
    try:
        # only seed if empty
        if db.query(Article).count() > 0:
            return

        db.add_all(
            [
                Article(
                    title="Late winner stuns rivals in dramatic derby",
                    summary="A stoppage-time strike sealed the points after a tense second half.",
                    sport="football",
                    source="SkySportsSample",
                    image_url=None,
                ),
                Article(
                    title="Transfer watch: club in talks over star midfielder",
                    summary="Negotiations continue as the window approaches its final week.",
                    sport="football",
                    source="SkySportsSample",
                    image_url=None,
                ),
                Article(
                    title="Formula 1: team unveils upgrades ahead of weekend GP",
                    summary="Engineers are confident the new package will improve race pace.",
                    sport="f1",
                    source="SkySportsSample",
                    image_url=None,
                ),
            ]
        )
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    run()
