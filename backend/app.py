from flask import Flask, request, jsonify
import torch
import torchvision.transforms as transforms
from PIL import Image
import io
import numpy as np
import cv2
from flask_cors import CORS
from torchvision.models import mobilenet_v2

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

print("OpenCV Version:", cv2.__version__)

# Load MobileNetV2 model
mobilenet_model = mobilenet_v2(pretrained=False)
state_dict = torch.load("mobinet_model.pth", map_location=torch.device("cpu"))
mobilenet_model.load_state_dict(state_dict)
mobilenet_model.eval()

# Define class names (update based on your dataset)
class_names = ["akiec", "bcc", "bkl", "df", "nv", "vasc", "mel"]


# Image preprocessing for MobileNetV2
def transform_image(image_bytes):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return transform(image).unsqueeze(0)


# Check if image contains enough skin pixels
def is_skin_image(image_bytes):
    image = np.array(Image.open(io.BytesIO(image_bytes)).convert("RGB"))

    # Convert to HSV color space
    hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)

    # Define skin color range in HSV
    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([20, 255, 255], dtype=np.uint8)

    # Create a binary mask where skin pixels are white
    skin_mask = cv2.inRange(hsv, lower_skin, upper_skin)

    # Calculate skin pixel percentage
    skin_ratio = (cv2.countNonZero(skin_mask) / (image.shape[0] * image.shape[1])) * 100

    return skin_ratio > 5  # Adjust threshold if needed


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    image_bytes = file.read()

    # Check if image contains enough skin pixels
    if not is_skin_image(image_bytes):
        return jsonify({"error": "Uploaded image does not appear to be a skin-related image"}), 400

    try:
        # Process image and predict disease
        image_tensor = transform_image(image_bytes)

        with torch.no_grad():
            outputs = mobilenet_model(image_tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0).numpy()

        # Prepare JSON response
        results = {class_names[i]: round(float(probabilities[i] * 100), 2) for i in range(len(class_names))}

        return jsonify({"predictions": results})

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500  # Catch unexpected errors


if __name__ == "__main__":
    app.run(debug=True)
