from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.services.match_service import match_volunteers_logic

router = APIRouter()

@router.post("/match/{need_id}")
def match_volunteers(need_id: int, db: Session = Depends(get_db)):

    # 1. Check if already assigned
    existing = db.query(models.Assignment).filter(
        models.Assignment.need_id == need_id
    ).first()

    if existing:
        return {"message": "Need already assigned"}

    # 2. Get need
    need = db.query(models.Need).filter(
        models.Need.id == need_id
    ).first()

    if not need:
        return {"error": "Need not found"}

    # 3. Get volunteers
    volunteers = db.query(models.Volunteer).filter(
        models.Volunteer.availability == "available"
    ).all()

    if not volunteers:
        return {"error": "No volunteers available"}

    # Call service
    scored_list = match_volunteers_logic(need, volunteers)

    if not scored_list:
        return {"message": "No suitable volunteers found"}

    top_volunteers = scored_list[:3]

    assigned_list = []

    for item in top_volunteers:
        v = item["volunteer"]

        assignment = models.Assignment(
            need_id=need.id,
            volunteer_id=v.id,
            status="assigned"
        )
        db.add(assignment)

        assigned_list.append({
            "need_id": need.id,
            "volunteer_id": v.id,
            "name": v.name,
            "score": item["score"],
            "distance_km": round(item["distance"], 2) if item["distance"] else None,
            "latitude": v.latitude,
            "longitude": v.longitude
        })

    # Update need
    need.status = "assigned"

    db.commit()

    return {
        "message": "Top volunteers assigned",
        "assigned": assigned_list
    }