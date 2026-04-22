from fastapi import FastAPI
from app.routes import needs, volunteers, match, assignments
from app.utils.seed import seed_data
from app.database import SessionLocal, Base, engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://quick-connect-zeta.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(needs.router, prefix="/needs")
app.include_router(volunteers.router, prefix="/volunteers")
app.include_router(match.router)
app.include_router(assignments.router)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        seed_data(db)
    finally:
        db.close()