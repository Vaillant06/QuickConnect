from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.services.ai_service import get_ai_classification

router = APIRouter()

@router.post("/")
def create_need(need: schemas.NeedCreate, db: Session = Depends(get_db)):

    ai_data = get_ai_classification(need.description)

    new_need = models.Need(
        title=need.title,
        description=need.description,
        category=ai_data["category"],
        urgency=ai_data["urgency"],
        location=need.location,
        latitude=need.latitude,
        longitude=need.longitude,
    )

    db.add(new_need)
    db.commit()
    db.refresh(new_need)

    return {"data": new_need}


@router.get("/")
def get_needs(db: Session = Depends(get_db)):
    needs = db.query(models.Need).all()
    return {"data": needs}