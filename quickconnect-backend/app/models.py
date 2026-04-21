from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base


class Need(Base):
    __tablename__ = "needs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)
    urgency = Column(String)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(TIMESTAMP, server_default=func.now())


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String)
    skills = Column(Text)
    availability = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(TIMESTAMP, server_default=func.now())


class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(Integer, primary_key=True, index=True)
    need_id = Column(Integer, ForeignKey("needs.id"))
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"))
    status = Column(String, default="pending")
    assigned_at = Column(TIMESTAMP, server_default=func.now())
    score = Column(Integer, nullable=True)
    distance = Column(Float, nullable=True)