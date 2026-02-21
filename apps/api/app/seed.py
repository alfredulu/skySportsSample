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
                    body="""Late drama defined the derby as both sides traded momentum throughout the match.

The home side looked more dangerous after halftime, but struggled to convert chances until a stoppage-time winner changed everything.

Managers will point to tactical adjustments, but the decisive moment came from composure in the final third when it mattered most.""",
                    sport="football",
                    source="SkySportsSample",
                    image_url=None,
                ),
                Article(
                    title="Transfer watch: club in talks over star midfielder",
                    summary="Negotiations continue as the window approaches its final week.",
                    body="""Talks are ongoing between the two clubs as the transfer window enters a critical phase.

Sources close to the negotiations say personal terms are not expected to be a major obstacle, but the transfer fee structure remains under discussion.

The buying club wants the deal completed quickly to allow the midfielder to join training before the next fixture cycle.""",
                    sport="football",
                    source="SkySportsSample",
                    image_url=None,
                ),
                Article(
                    title="Formula 1: team unveils upgrades ahead of weekend GP",
                    summary="Engineers are confident the new package will improve race pace.",
                    body="""The team has introduced a new aerodynamic package aimed at improving balance through medium- and high-speed corners.

Drivers reported encouraging signs in simulator runs, with better stability under braking and improved traction on corner exit.

Engineers cautioned that final performance gains will depend on track conditions, but expectations are high going into the weekend.""",
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