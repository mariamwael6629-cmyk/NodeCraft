from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.template import Template
from app.models.user import User
from app.schemas.workflow import WorkflowCreate, WorkflowOut, WorkflowRunResult, WorkflowUpdate
from app.services import workflow_service

router = APIRouter(prefix="/api/workflows", tags=["workflows"])


@router.get("", response_model=list[WorkflowOut])
def list_workflows(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return workflow_service.list_workflows(db, current_user.id)


@router.post("", response_model=WorkflowOut, status_code=status.HTTP_201_CREATED)
def create_workflow(
    payload: WorkflowCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    return workflow_service.create_workflow(db, current_user.id, payload)


@router.post("/from-template/{template_id}", response_model=WorkflowOut, status_code=status.HTTP_201_CREATED)
def create_from_template(
    template_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    template = db.get(Template, template_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return workflow_service.create_from_template(db, current_user.id, template)


def _get_owned_workflow(db: Session, current_user: User, workflow_id: str):
    workflow = workflow_service.get_workflow(db, current_user.id, workflow_id)
    if not workflow:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    return workflow


@router.get("/{workflow_id}", response_model=WorkflowOut)
def get_workflow(workflow_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return _get_owned_workflow(db, current_user, workflow_id)


@router.put("/{workflow_id}", response_model=WorkflowOut)
def update_workflow(
    workflow_id: str,
    payload: WorkflowUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    workflow = _get_owned_workflow(db, current_user, workflow_id)
    return workflow_service.update_workflow(db, workflow, payload)


@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow(workflow_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workflow = _get_owned_workflow(db, current_user, workflow_id)
    workflow_service.delete_workflow(db, workflow)


@router.post("/{workflow_id}/run", response_model=WorkflowRunResult)
def run_workflow(workflow_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    workflow = _get_owned_workflow(db, current_user, workflow_id)
    workflow, executed_nodes, log = workflow_service.run_workflow(db, workflow)
    return WorkflowRunResult(workflow=workflow, executed_nodes=executed_nodes, log=log)
