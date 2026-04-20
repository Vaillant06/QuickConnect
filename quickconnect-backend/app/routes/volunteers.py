from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models, schemas

router = APIRouter()


@router.post("/")
def create_volunteer(volunteer: schemas.VolunteerCreate, db: Session = Depends(get_db)):

    new_volunteer = models.Volunteer(
        name=volunteer.name,
        email=volunteer.email,
        phone=volunteer.phone,
        skills=volunteer.skills,
        availability=volunteer.availability,
        latitude=volunteer.latitude,
        longitude=volunteer.longitude,
    )

    db.add(new_volunteer)
    db.commit()
    db.refresh(new_volunteer)

    return {
        "message": "Volunteer created",
        "data": new_volunteer
    }



@router.get("/")
def get_volunteers(db: Session = Depends(get_db)):

    volunteers = db.query(models.Volunteer).all()

    return {
        "data": volunteers
    }


@router.get("/available")
def get_available_volunteers(db: Session = Depends(get_db)):

    volunteers = db.query(models.Volunteer).filter(
        models.Volunteer.availability == "available"
    ).all()

    return {"data": volunteers}