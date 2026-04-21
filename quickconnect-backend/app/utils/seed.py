from app import models
from sqlalchemy.orm import Session


def seed_data(db: Session):

    existing = db.query(models.Need).count()

    if existing > 0:
        return

    sample_needs = [
        models.Need(
            title="Flood Relief Food",
            description="Need food for 50 people affected by flood",
            category="food",
            urgency="high",
            location="Velachery",
            latitude=12.9755,
            longitude=80.2200,
            status="pending"
        ),
        models.Need(
            title="Medical Help",
            description="Elderly people need medicines urgently",
            category="medical",
            urgency="medium",
            location="Tambaram",
            latitude=12.9249,
            longitude=80.1000,
            status="pending"
        )
    ]

    db.add_all(sample_needs)

    volunteers = [
        models.Volunteer(
            name="Ravi",
            email="ravi@qc.com",
            phone="1234567890",
            skills="food, logistics",
            availability="available",
            latitude=12.9700,
            longitude=80.2100
        ),
        models.Volunteer(
            name="Priya",
            skills="medical, first aid",
            email="priya@qc.com",
            phone="1234567891",
            availability="available",
            latitude=13.0827,
            longitude=80.2707
        ),
        models.Volunteer(
            name="Arun",
            email="arun@qc.com",
            phone="1234567890",
            skills="rescue, food",
            availability="available",
            latitude=12.9532,
            longitude=80.1416
        )
    ]

    db.add_all(volunteers)

    db.commit()