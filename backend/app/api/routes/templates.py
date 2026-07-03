from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.template import Template
from app.schemas.template import TemplateOut

router = APIRouter(prefix="/api/templates", tags=["templates"])


@router.get("", response_model=list[TemplateOut])
def list_templates(category: str | None = None, search: str | None = None, db: Session = Depends(get_db)):
    query = db.query(Template)
    if category and category != "All":
        query = query.filter(Template.category == category)
    if search:
        query = query.filter(Template.name.ilike(f"%{search}%"))
    return query.all()
