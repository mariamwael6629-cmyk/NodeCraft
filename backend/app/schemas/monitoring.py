from pydantic import BaseModel


class StatCard(BaseModel):
    label: str
    val: str
    delta: str
    icon: str


class HealthBreakdown(BaseModel):
    running: int
    paused: int
    error: int
    overall_success_rate: float


class MonitoringStats(BaseModel):
    stats: list[StatCard]
    health: HealthBreakdown
    success_history: list[float]
