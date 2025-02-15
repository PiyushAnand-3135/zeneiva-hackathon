from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np
import os
from ultralytics import YOLO
from deepface import DeepFace

router = APIRouter()

model = YOLO("yolov8n-face.pt")

@router.post("/detect-verify-face")
async def detect_and_verify_face(file: UploadFile = File(...)):

    contents = await file.read()
    image = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)


    results = model(image)


    faces = []

    for result in results:
        for box in result.boxes.xyxy:
            x1, y1, x2, y2 = map(int, box.tolist())

            face_crop = image[y1:y2, x1:x2]
            temp_face_path = "temp_detected_face.jpg"
            cv2.imwrite(temp_face_path, face_crop)

            try:
                result = DeepFace.verify(
                    img1_path=r"D:\Pycharm Projects\PSI API\images\known_face.jpg",  # Path to stored face
                    img2_path=temp_face_path
                )
                verification_status = result["verified"]
                similarity_score = result["distance"]
            except Exception as e:
                verification_status = False
                similarity_score = None

            faces.append({
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                "verified": verification_status,
                "similarity_score": similarity_score
            })

            os.remove(temp_face_path)

    if faces:
        return {"status": "face_detected", "faces": faces}
    else:
        return {"status": "no_face_detected"}
