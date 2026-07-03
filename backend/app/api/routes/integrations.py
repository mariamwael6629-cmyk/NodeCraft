from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.integration import Integration
from app.models.user import User
from app.schemas.integration import IntegrationOut

router = APIRouter(prefix="/api/integrations", tags=["integrations"])


@router.get("", response_model=list[IntegrationOut])
def list_integrations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Integration).all()


@router.post("/{integration_id}/toggle", response_model=IntegrationOut)
def toggle_integration(
    integration_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    integration = db.get(Integration, integration_id)
    if not integration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Integration not found")
    integration.connected = not integration.connected
    db.commit()
    db.refresh(integration)
    return integration
