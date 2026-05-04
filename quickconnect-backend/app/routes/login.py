from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import bcrypt
from jose import jwt

from app.database import get_db
from app import models, schemas

router = APIRouter()

SECRET_KEY = "quickconnect-secret-key"
ALGORITHM = "HS256"


@router.post("/login")
def login(credentials: schemas.VolunteerLogin, db: Session = Depends(get_db)):
    volunteer = db.query(models.Volunteer).filter(models.Volunteer.email == credentials.email).first()

    if not volunteer or not volunteer.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(credentials.password.encode("utf-8"), volunteer.password_hash.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({"sub": str(volunteer.id), "email": volunteer.email}, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}
