from fastapi import APIRouter,UploadFile

router = APIRouter()

@router.get("/")
async def root():
    return {"route_name" : "object_detection_route"}

@router.post("/detect-object")
async def detect_object():
    return {"object" : "gun"}