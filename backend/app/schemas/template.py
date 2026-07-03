from typing import Any

from pydantic import BaseModel, ConfigDict


class TemplateOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    category: str
    description: str
    icon: str
    color: str
    node_count: int
    uses: int


class TemplateDetail(TemplateOut):
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]
