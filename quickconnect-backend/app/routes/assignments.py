from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter()

# Get all assignments with volunteer details

@router.get("/assignments")
def get_assignments(db: Session = Depends(get_db)):

    assignments = db.query(models.Assignment).all()

    result = []

    for a in assignments:
        volunteer = db.query(models.Volunteer).filter(
            models.Volunteer.id == a.volunteer_id
        ).first()

        result.append({
            "id": a.id,
            "need_id": a.need_id,
            "volunteer_id": a.volunteer_id,
            "status": a.status,
            "name": volunteer.name if volunteer else None,
            "latitude": volunteer.latitude if volunteer else None,
            "longitude": volunteer.longitude if volunteer else None
        })

    return {"data": result}