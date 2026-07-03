import random
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.activity import ActivityLog
from app.models.template import Template
from app.models.workflow import Workflow
from app.schemas.workflow import WorkflowCreate, WorkflowUpdate


def list_workflows(db: Session, owner_id: str) -> list[Workflow]:
    return db.query(Workflow).filter(Workflow.owner_id == owner_id).order_by(Workflow.updated_at.desc()).all()


def get_workflow(db: Session, owner_id: str, workflow_id: str) -> Workflow | None:
    return db.query(Workflow).filter(Workflow.id == workflow_id, Workflow.owner_id == owner_id).first()


def create_workflow(db: Session, owner_id: str, payload: WorkflowCreate) -> Workflow:
    workflow = Workflow(
        owner_id=owner_id,
        name=payload.name,
        description=payload.description,
        nodes=payload.nodes,
        edges=payload.edges,
        status="draft",
    )
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


def create_from_template(db: Session, owner_id: str, template: Template) -> Workflow:
    workflow = Workflow(
        owner_id=owner_id,
        name=template.name,
        description=template.description,
        nodes=template.nodes,
        edges=template.edges,
        status="draft",
    )
    template.uses += 1
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    return workflow


def update_workflow(db: Session, workflow: Workflow, payload: WorkflowUpdate) -> Workflow:
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(workflow, field, value)
    db.commit()
    db.refresh(workflow)
    return workflow


def delete_workflow(db: Session, workflow: Workflow) -> None:
    db.delete(workflow)
    db.commit()


def run_workflow(db: Session, workflow: Workflow) -> tuple[Workflow, list[str], list[str]]:
    """Simulates execution across the workflow's nodes and records activity."""
    node_labels = [n.get("label", n.get("type", "node")) for n in workflow.nodes]
    log = []
    succeeded = random.random() > 0.08

    for label in node_labels:
        log.append(f"✓ {label} executed successfully")

    workflow.runs += 1
    workflow.last_run = datetime.now(timezone.utc)
    if succeeded:
        workflow.status = "running"
        workflow.success_rate = round(min(100.0, (workflow.success_rate * (workflow.runs - 1) + 100) / workflow.runs), 1)
        event = f"{workflow.name} executed successfully"
        event_type = "success"
    else:
        workflow.status = "error"
        workflow.errors += 1
        workflow.success_rate = round((workflow.success_rate * (workflow.runs - 1)) / workflow.runs, 1)
        event = f"{workflow.name} failed during execution"
        event_type = "error"
        log.append("✗ Execution failed")

    db.add(ActivityLog(workflow_id=workflow.id, event=event, type=event_type))
    db.commit()
    db.refresh(workflow)
    return workflow, node_labels, log
