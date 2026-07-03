from pydantic import BaseModel, ConfigDict


class SettingsOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    workspace_name: str
    timezone: str
    concurrency: int
    max_duration: int
    notify_email: bool
    notify_slack: bool
    notify_sms: bool
    accent_color: str
    canvas_theme: str


class SettingsUpdate(BaseModel):
    workspace_name: str | None = None
    timezone: str | None = None
    concurrency: int | None = None
    max_duration: int | None = None
    notify_email: bool | None = None
    notify_slack: bool | None = None
    notify_sms: bool | None = None
    accent_color: str | None = None
    canvas_theme: str | None = None
