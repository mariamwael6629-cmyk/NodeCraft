from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.api_key import ApiKeyCreate, ApiKeyCreated, ApiKeyOut
from app.services import api_key_service

router = APIRouter(prefix="/api/api-keys", tags=["api-keys"])


@router.get("", response_model=list[ApiKeyOut])
def list_keys(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return api_key_service.list_keys(db, current_user.id)


@router.post("", response_model=ApiKeyCreated, status_code=status.HTTP_201_CREATED)
def create_key(payload: ApiKeyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    key = api_key_service.create_key(db, current_user.id, payload.name)
    return ApiKeyCreated(id=key.id, name=key.name, key=key.key, created_at=key.created_at)


@router.delete("/{key_id}", response_model=ApiKeyOut)
def revoke_key(key_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    key = api_key_service.revoke_key(db, current_user.id, key_id)
    if not key:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="API key not found")
    return {**key.__dict__, "masked_key": api_key_service._mask(key.key)}
