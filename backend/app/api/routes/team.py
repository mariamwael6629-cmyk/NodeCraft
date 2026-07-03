from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.team import InviteRequest, TeamActivityOut, TeamMemberOut
from app.services import team_service

router = APIRouter(prefix="/api/team", tags=["team"])


@router.get("/members", response_model=list[TeamMemberOut])
def list_members(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return team_service.list_members(db)


@router.post("/members/invite", response_model=TeamMemberOut, status_code=status.HTTP_201_CREATED)
def invite_member(
    payload: InviteRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    try:
        member = team_service.invite_member(db, current_user, payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return {**member.__dict__, "workflows": 0}


@router.get("/activity", response_model=list[TeamActivityOut])
def activity(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return team_service.list_activity(db)
