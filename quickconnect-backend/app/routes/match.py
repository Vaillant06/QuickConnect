from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.services.match_service import match_volunteers_logic

router = APIRouter()


@router.post("/match/{need_id}")
def match_volunteers(need_id: int, db: Session = Depends(get_db)):

    existing = db.query(models.Assignment).filter(
        models.Assignment.need_id == need_id,
        models.Assignment.status.in_(["pending", "accepted"])
    ).first()

    if existing:
        return {"message": "Volunteers already notified or assigned"}

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

    # 4. Matching logic
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
            status="pending",
            score=item["score"],
            distance=item["distance"]
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

    need.status = "notified"

    db.commit()

    return {
        "message": "Top volunteers notified",
        "assigned": assigned_list
    }



@router.post("/accept/{assignment_id}")
def accept_assignment(assignment_id: int, db: Session = Depends(get_db)):

    # 1. Get assignment
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()

    if not assignment:
        return {"error": "Assignment not found"}

    # 2. Check if already taken
    already_accepted = db.query(models.Assignment).filter(
        models.Assignment.need_id == assignment.need_id,
        models.Assignment.status == "accepted"
    ).first()

    if already_accepted:
        return {"message": "Task already taken by another volunteer"}

    # 3. Accept this assignment
    assignment.status = "accepted"

    # 4. Mark volunteer as busy
    volunteer = db.query(models.Volunteer).filter(
        models.Volunteer.id == assignment.volunteer_id
    ).first()

    if volunteer:
        volunteer.availability = "busy"

    # 5. Reject others
    db.query(models.Assignment).filter(
        models.Assignment.need_id == assignment.need_id,
        models.Assignment.id != assignment.id
    ).update({"status": "rejected"})

    # 6. Update need
    need = db.query(models.Need).filter(
        models.Need.id == assignment.need_id
    ).first()

    if need:
        need.status = "assigned"

    db.commit()

    return {
        "message": "Volunteer accepted and assigned",
        "volunteer_id": assignment.volunteer_id
    }



@router.get("/pending/{need_id}")
def get_pending(need_id: int, db: Session = Depends(get_db)):

    data = db.query(models.Assignment).filter(
        models.Assignment.need_id == need_id,
        models.Assignment.status == "pending"
    ).all()

    return {"data": data}