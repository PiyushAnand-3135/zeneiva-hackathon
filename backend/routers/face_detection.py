from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np
import os
from ultralytics import YOLO
from deepface import DeepFace

router = APIRouter()

model = YOLO("yolov8n-face.pt")

KNOWN_FACES_DIR = r"D:\Pycharm Projects\PSI API\images\known_faces"  # Folder containing known images

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

            best_match = None
            best_score = float("inf")  # Lower is better for DeepFace distance
            best_match_filename = None

            for known_face in os.listdir(KNOWN_FACES_DIR):
                known_face_path = os.path.join(KNOWN_FACES_DIR, known_face)

                try:
                    result = DeepFace.verify(
                        img1_path=known_face_path, 
                        img2_path=temp_face_path
                    )
                    similarity_score = result["distance"]
                    if similarity_score < best_score:  # Keep the best match
                        best_score = similarity_score
                        best_match = known_face_path
                        best_match_filename = known_face  # Store the filename
                except Exception as e:
                    continue  # Skip image if an error occurs

            os.remove(temp_face_path)

            faces.append({
                "x1": x1, "y1": y1, "x2": x2, "y2": y2,
                "best_match": best_match_filename,  # Returning filename
                "similarity_score": best_score if best_match else None
            })

    if faces:
        return {"status": "face_detected", "faces": faces}
    else:
        return {"status": "no_face_detected"}
