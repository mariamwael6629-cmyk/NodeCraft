from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.pricing import PricingPlan
from app.schemas.pricing import PricingPlanOut

router = APIRouter(prefix="/api/pricing", tags=["pricing"])


@router.get("", response_model=list[PricingPlanOut])
def list_plans(db: Session = Depends(get_db)):
    return db.query(PricingPlan).all()
