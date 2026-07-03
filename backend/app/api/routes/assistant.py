from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.assistant_service import generate_workflow

router = APIRouter(prefix="/api/assistant", tags=["assistant"])


@router.post("/chat", response_model=AssistantResponse)
def chat(payload: AssistantRequest, current_user: User = Depends(get_current_user)):
    reply, nodes, edges = generate_workflow(payload.message)
    return AssistantResponse(reply=reply, nodes=nodes, edges=edges)
