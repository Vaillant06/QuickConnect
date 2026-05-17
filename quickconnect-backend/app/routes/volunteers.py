from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import bcrypt

from app.database import get_db
from app import models, schemas

router = APIRouter()


@router.post("/")
def create_volunteer(volunteer: schemas.VolunteerCreate, db: Session = Depends(get_db)):

    password_hash = bcrypt.hashpw(volunteer.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    new_volunteer = models.Volunteer(
        name=volunteer.name,
        email=volunteer.email,
        phone=volunteer.phone,
        skills=volunteer.skills,
        availability=volunteer.availability,
        latitude=volunteer.latitude,
        longitude=volunteer.longitude,
        password_hash=password_hash,
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
    
    
@router.get("/{id}")
def get_single_volunteer(id: int, db: Session = Depends(get_db)):

    volunteer = db.query(models.Volunteer).filter(models.Volunteer.id == id).first()

    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    return {"data": volunteer}


@router.get("/available")
def get_available_volunteers(db: Session = Depends(get_db)):

    volunteers = db.query(models.Volunteer).filter(
        models.Volunteer.availability == "available"
    ).all()

    return {"data": volunteers}