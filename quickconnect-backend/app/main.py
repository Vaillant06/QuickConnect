from fastapi import FastAPI
from app.routes import needs, volunteers, match, assignments
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(needs.router, prefix="/needs")
app.include_router(volunteers.router, prefix="/volunteers")
app.include_router(match.router)
app.include_router(assignments.router)