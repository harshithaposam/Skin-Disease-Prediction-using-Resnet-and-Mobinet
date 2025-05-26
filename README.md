This project develops a deep learning-based system to classify skin diseases using advanced models like ResNet and MobileNet. The goal is to aid early and accurate diagnosis by healthcare professionals, especially dermatologists, through an AI-powered diagnostic tool. The system includes a user-friendly frontend where users can upload images of skin conditions to receive predictions along with information on prevention and diet.

Key steps involve collecting publicly available data, performing exploratory data analysis, preprocessing images with normalization and augmentation, and training convolutional neural networks using PyTorch and TensorFlow. The system achieves high accuracy, with MobileNet reaching 91.15% and ResNet 87.67% on validation data, outperforming existing methods in precision, recall, and F1-score. Visualization tools like confusion matrices help interpret model performance. Overall, this project provides an effective AI-driven solution to improve dermatological diagnostics and accessibility to quality healthcare.

**To Run Backend:**
cd backend
python app.py

**To Run Frontend:**
cd frontend
npm start
