from pydantic import BaseModel


class NeedCreate(BaseModel):
    title: str
    description: str
    category: str
    urgency: str
    location: str
    latitude: float
    longitude: float

class VolunteerCreate(BaseModel):
    name: str
    email: str
    phone: str
    skills: str
    availability: str
    latitude: float
    longitude: float