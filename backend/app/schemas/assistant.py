from typing import Any

from pydantic import BaseModel


class AssistantRequest(BaseModel):
    message: str


class AssistantResponse(BaseModel):
    reply: str
    nodes: list[dict[str, Any]] | None = None
    edges: list[dict[str, Any]] | None = None
