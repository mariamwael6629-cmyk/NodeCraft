from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.settings import WorkspaceSettings
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest


class AuthError(Exception):
    pass


def register_user(db: Session, payload: RegisterRequest) -> tuple[User, str]:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise AuthError("An account with this email already exists")

    initials = "".join([p[0].upper() for p in payload.full_name.split()[:2]]) or "NC"
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role="Admin",
        initials=initials,
        status="online",
    )
    db.add(user)
    db.flush()

    db.add(WorkspaceSettings(owner_id=user.id, workspace_name=f"{payload.full_name}'s Workspace"))
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return user, token


def authenticate_user(db: Session, payload: LoginRequest) -> tuple[User, str]:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise AuthError("Invalid email or password")
    token = create_access_token(user.id)
    return user, token
