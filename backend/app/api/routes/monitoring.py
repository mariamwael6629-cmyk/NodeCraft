from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.models.workflow import Workflow
from app.schemas.activity import ActivityOut
from app.schemas.monitoring import MonitoringStats
from app.schemas.workflow import WorkflowOut
from app.services import monitoring_service

router = APIRouter(prefix="/api/monitoring", tags=["monitoring"])


@router.get("/stats", response_model=MonitoringStats)
def stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return monitoring_service.get_monitoring_stats(db, current_user.id)


@router.get("/workflows", response_model=list[WorkflowOut])
def workflow_status(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Workflow).filter(Workflow.owner_id == current_user.id).all()


@router.get("/activity", response_model=list[ActivityOut])
def activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return monitoring_service.get_activity_timeline(db, current_user.id)
