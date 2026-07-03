from sqlalchemy.orm import Session

from app.models.activity import ActivityLog
from app.models.workflow import Workflow
from app.schemas.monitoring import HealthBreakdown, MonitoringStats, StatCard


def get_monitoring_stats(db: Session, owner_id: str) -> MonitoringStats:
    workflows = db.query(Workflow).filter(Workflow.owner_id == owner_id).all()

    total_runs = sum(w.runs for w in workflows)
    avg_success = round(sum(w.success_rate for w in workflows) / len(workflows), 1) if workflows else 100.0
    active = sum(1 for w in workflows if w.status == "running")
    running = sum(1 for w in workflows if w.status == "running")
    paused = sum(1 for w in workflows if w.status == "paused")
    errored = sum(1 for w in workflows if w.status == "error")

    stats = [
        StatCard(label="Total Runs", val=f"{total_runs:,}", delta="+0%", icon="⚡"),
        StatCard(label="Success Rate", val=f"{avg_success}%", delta="+0%", icon="✓"),
        StatCard(label="Avg Latency", val="42ms", delta="-0ms", icon="⏱"),
        StatCard(label="Active Flows", val=str(active), delta="+0", icon="🔄"),
    ]

    history = [w.success_rate for w in workflows[:12]] or [100.0]

    return MonitoringStats(
        stats=stats,
        health=HealthBreakdown(running=running, paused=paused, error=errored, overall_success_rate=avg_success),
        success_history=history,
    )


def get_activity_timeline(db: Session, owner_id: str, limit: int = 20) -> list[ActivityLog]:
    return (
        db.query(ActivityLog)
        .join(Workflow, Workflow.id == ActivityLog.workflow_id, isouter=True)
        .filter((Workflow.owner_id == owner_id) | (ActivityLog.workflow_id.is_(None)))
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
        .all()
    )
