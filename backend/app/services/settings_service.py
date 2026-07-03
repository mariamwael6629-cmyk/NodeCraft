from sqlalchemy.orm import Session

from app.models.settings import WorkspaceSettings
from app.schemas.settings import SettingsUpdate


def get_or_create_settings(db: Session, owner_id: str) -> WorkspaceSettings:
    settings = db.query(WorkspaceSettings).filter(WorkspaceSettings.owner_id == owner_id).first()
    if not settings:
        settings = WorkspaceSettings(owner_id=owner_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def update_settings(db: Session, settings: WorkspaceSettings, payload: SettingsUpdate) -> WorkspaceSettings:
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(settings, field, value)
    db.commit()
    db.refresh(settings)
    return settings
