from fastapi import FastAPI
from routers import upload_file,face_detection,object_detection

app = FastAPI()

app.include_router(upload_file.router, prefix="/upload")
app.include_router(face_detection.router, prefix="/face")
app.include_router(object_detection.router, prefix="/object")

@app.get("/")
async def root():
    return {"route_type" : "master_route"}
