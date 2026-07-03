import secrets

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.team import TeamActivity
from app.models.user import User
from app.models.workflow import Workflow
from app.schemas.team import InviteRequest


def list_members(db: Session) -> list[dict]:
    users = db.query(User).all()
    result = []
    for user in users:
        workflow_count = db.query(Workflow).filter(Workflow.owner_id == user.id).count()
        result.append({**user.__dict__, "workflows": workflow_count})
    return result


def invite_member(db: Session, inviter: User, payload: InviteRequest) -> User:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise ValueError("A member with this email already exists")

    initials = "".join([p[0].upper() for p in payload.full_name.split()[:2]]) or "NC"
    member = User(
        email=payload.email,
        hashed_password=hash_password(secrets.token_urlsafe(16)),
        full_name=payload.full_name,
        role=payload.role,
        initials=initials,
        status="offline",
    )
    db.add(member)
    db.flush()
    db.add(
        TeamActivity(
            user_id=inviter.id,
            action=f"invited {payload.email}",
            icon="✉️",
        )
    )
    db.commit()
    db.refresh(member)
    return member


def list_activity(db: Session, limit: int = 20) -> list[TeamActivity]:
    return db.query(TeamActivity).order_by(TeamActivity.created_at.desc()).limit(limit).all()
