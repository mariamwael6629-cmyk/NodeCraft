from pydantic import BaseModel, ConfigDict


class PricingPlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    price_monthly: float | None
    price_annual: float | None
    is_custom: bool
    description: str
    features: list[str]
    featured: bool
    cta: str
