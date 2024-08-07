from pydantic import BaseModel
from fastapi import APIRouter, status

from api.models import Workout
from api.deps import db_dependency, user_dependency

router = APIRouter(
    prefix="/workouts",
    tags=["workouts"],
)


class WorkoutBase(BaseModel):
    name: str
    description: str | None = None


class WorkoutCreate(WorkoutBase):
    pass


@router.get("/")
def get_workout(
    db: db_dependency, user: user_dependency, workout_id: int
):  # we require user to be authenticated for this endpoint
    return db.query(Workout).filter(Workout.id == workout_id).first()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_workout(db: db_dependency, user: user_dependency, workout: WorkoutCreate):
    db_workout = Workout(**workout.model_dump(), user_id=user.get("id"))
    db.add(db_workout)
    db.commit()
    db.refresh(db_workout)
    return db_workout


@router.delete("/")
def delete_workout(db: db_dependency, user: user_dependency, workout_id: int):
    db_workout = db.query(Workout).filter(Workout.id == workout_id).first()
    if db_workout:
        db.delete(db_workout)
        db.commit()
    return db_workout


@router.get("/workouts")
def get_workouts(db: db_dependency, user: user_dependency):
    return db.query(Workout).all()
