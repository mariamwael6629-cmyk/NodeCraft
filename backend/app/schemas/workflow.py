from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class WorkflowCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str = ""
    nodes: list[dict[str, Any]] = Field(default_factory=list)
    edges: list[dict[str, Any]] = Field(default_factory=list)


class WorkflowUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    status: str | None = None
    nodes: list[dict[str, Any]] | None = None
    edges: list[dict[str, Any]] | None = None


class WorkflowOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    owner_id: str
    name: str
    description: str
    status: str
    runs: int
    success_rate: float
    errors: int
    last_run: datetime | None
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]
    created_at: datetime
    updated_at: datetime


class WorkflowRunResult(BaseModel):
    workflow: WorkflowOut
    executed_nodes: list[str]
    log: list[str]
