import secrets

from sqlalchemy.orm import Session

from app.models.api_key import ApiKey


def _mask(key: str) -> str:
    return f"nc_{'•' * 24}{key[-4:]}"


def list_keys(db: Session, owner_id: str) -> list[dict]:
    keys = db.query(ApiKey).filter(ApiKey.owner_id == owner_id).order_by(ApiKey.created_at.desc()).all()
    return [{**k.__dict__, "masked_key": _mask(k.key)} for k in keys]


def create_key(db: Session, owner_id: str, name: str) -> ApiKey:
    raw_key = f"nc_{secrets.token_hex(16)}"
    key = ApiKey(owner_id=owner_id, name=name, key=raw_key)
    db.add(key)
    db.commit()
    db.refresh(key)
    return key


def revoke_key(db: Session, owner_id: str, key_id: str) -> ApiKey | None:
    key = db.query(ApiKey).filter(ApiKey.id == key_id, ApiKey.owner_id == owner_id).first()
    if not key:
        return None
    key.revoked = True
    db.commit()
    db.refresh(key)
    return key
