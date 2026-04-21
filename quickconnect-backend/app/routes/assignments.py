from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter()


@router.get("/assignments")
def get_assignments(db: Session = Depends(get_db)):

    assignments = db.query(models.Assignment).all()
    assignments = sorted(assignments, key=lambda x: x.score, reverse=True)

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
            "longitude": volunteer.longitude if volunteer else None,
            "score": a.score,
            "distance_km": round(a.distance, 2) if a.distance else None
        })

    return {"data": result}


@router.delete("/assignments/{assignment_id}")
def delete_assignment(assignment_id: int, db: Session = Depends(get_db)):

    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()

    if not assignment:
        return {"error": "Assignment not found"}

    need = db.query(models.Need).filter(
        models.Need.id == assignment.need_id
    ).first()
    need.status = "pending"

    volunteer = db.query(models.Volunteer).filter(
        models.Volunteer.id == assignment.volunteer_id
    ).first()
    volunteer.availability = "available"

    db.delete(assignment)
    db.commit()

    return {"message": "Assignment deleted"}



@router.delete("/assignments/need/{need_id}")
def delete_assignments_by_need(need_id: int, db: Session = Depends(get_db)):

    assignments = db.query(models.Assignment).filter(
        models.Assignment.need_id == need_id
    ).all()

    if not assignments:
        return {"message": "No assignments found"}

    volunteer_ids = [a.volunteer_id for a in assignments]

    volunteers = db.query(models.Volunteer).filter(
        models.Volunteer.id.in_(volunteer_ids)
    ).all()

    for v in volunteers:
        v.availability = "available"

    for a in assignments:
        db.delete(a)

    need = db.query(models.Need).filter(
        models.Need.id == need_id
    ).first()

    if need:
        need.status = "pending"

    db.commit()

    return {
        "message": "All assignments deleted for this need and volunteers are freed",
        "data": assignments
    }


@router.delete("/assignments")
def delete_all_assignments(db: Session = Depends(get_db)):

    assignments = db.query(models.Assignment).all()

    if not assignments:
        return {"message": "No assignments found"}

    volunteer_ids = [a.volunteer_id for a in assignments]

    volunteers = db.query(models.Volunteer).filter(
        models.Volunteer.id.in_(volunteer_ids)
    ).all()

    for v in volunteers:
        v.availability = "available"

    need_ids = [a.need_id for a in assignments]

    needs = db.query(models.Need).filter(
        models.Need.id.in_(need_ids)
    ).all()

    for n in needs:
        n.status = "pending"

    db.query(models.Assignment).delete()

    db.commit()

    return {"message": "All assignments cleared"}