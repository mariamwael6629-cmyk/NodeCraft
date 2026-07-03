import uuid

from sqlalchemy import String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base


def _uuid() -> str:
    return uuid.uuid4().hex


class WorkspaceSettings(Base):
    __tablename__ = "workspace_settings"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    owner_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), unique=True, nullable=False)
    workspace_name: Mapped[str] = mapped_column(String(255), default="My Workspace")
    timezone: Mapped[str] = mapped_column(String(64), default="UTC-5 (Eastern)")
    concurrency: Mapped[int] = mapped_column(Integer, default=10)
    max_duration: Mapped[int] = mapped_column(Integer, default=300)
    notify_email: Mapped[bool] = mapped_column(Boolean, default=True)
    notify_slack: Mapped[bool] = mapped_column(Boolean, default=False)
    notify_sms: Mapped[bool] = mapped_column(Boolean, default=True)
    accent_color: Mapped[str] = mapped_column(String(16), default="#10B981")
    canvas_theme: Mapped[str] = mapped_column(String(32), default="Dark (Default)")
