from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ActivityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    workflow_id: str | None
    event: str
    type: str
    created_at: datetime
