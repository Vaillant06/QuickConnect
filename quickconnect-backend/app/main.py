from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from app import models
from app import schemas
from app.database import engine, get_db
from app.utils import calculate_distance

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def root():
    return {"message": "QuickConnect API running"}


@app.post("/needs")
def create_need(need: schemas.NeedCreate, db: Session = Depends(get_db)):
    new_need = models.Need(
        title=need.title,
        description=need.description,
        category=need.category,
        urgency=need.urgency,
        location=need.location,
        latitude=need.latitude,
        longitude=need.longitude,
    )

    db.add(new_need)
    db.commit()
    db.refresh(new_need)

    return {"message": "Need created", "data": new_need}


@app.get("/needs")
def get_needs(db: Session = Depends(get_db)):
    needs = db.query(models.Need).all()
    return {"data": needs}


@app.post("/volunteers")
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

    return {"message": "Volunteer created", "data": new_volunteer}


@app.get("/volunteers")
def get_volunteers(db: Session = Depends(get_db)):
    volunteers = db.query(models.Volunteer).all()
    return {"data": volunteers}


@app.post("/match/{need_id}")
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

    # 3. Get available volunteers
    volunteers = db.query(models.Volunteer).filter(
        models.Volunteer.availability == "available"
    ).all()

    if not volunteers:
        return {"error": "No volunteers available"}

    scored_volunteers = {}

    # 4. Score each volunteer
    for v in volunteers:
        score = 0
        distance = None

        # Skill match
        if need.category and v.skills:
            skills_list = [s.strip() for s in v.skills.lower().split(",")]
            if need.category.lower() in skills_list:
                score += 40

        # Availability bonus
        if v.availability == "available":
            score += 30

        # Distance scoring
        if (
            need.latitude is not None and need.longitude is not None and
            v.latitude is not None and v.longitude is not None
        ):
            distance = calculate_distance(
                need.latitude, need.longitude,
                v.latitude, v.longitude
            )

            print(distance)

            if distance < 5:
                score += 30
            elif distance < 10:
                score += 20
            elif distance < 50:
                score += 5
            else:
                score += 1

        # Store only valid matches
        if score > 0:
            scored_volunteers[v.id] = {
                "volunteer": v,
                "score": score,
                "distance": distance + 0.1
            }

    if not scored_volunteers:
        return {"message": "No suitable volunteers found"}

    # 5. Sort by score
    scored_list = list(scored_volunteers.values())
    scored_list.sort(
        key=lambda x: (-x["score"], x["distance"])
    )

    # 6. Pick top 3
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
            "volunteer_id": v.id,
            "name": v.name,
            "score": item["score"],
            "distance_km": round(item["distance"], 2) if item["distance"] else None
        })

    # 7. Update need status
    need.status = "assigned"

    db.commit()

    return {
        "message": "Top volunteers assigned",
        "assigned": assigned_list
    }


@app.get("/assignments")
def get_assignments(db: Session = Depends(get_db)):
    assignments = db.query(models.Assignment).all()
    return {"data": assignments}