# Handwritten Digit Recognition

## Overview
This project is a web-based **Handwritten Digit Recognition** system that allows users to draw digits on a canvas or upload an image containing handwritten digits. The system then processes the input and predicts the digit using a machine learning model.

## Features
- **Canvas Drawing:** Users can draw digits on a canvas.
- **Image Upload:** Users can upload an image of a handwritten digit, which will be displayed on the canvas.
- **Clear Canvas:** Users can erase their drawing and start fresh.
- **Digit Prediction:** The system predicts the handwritten digit using a trained model.

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Flask (Python)
- **Machine Learning Model:** CNN (Convolutional Neural Network) for digit recognition

## Installation
### Prerequisites
Ensure you have the following installed:
- Python 3.12.1
- Flask
- TensorFlow/Keras (for ML model)
- OpenCV (for image processing)

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/handwritten-digit-recognition.git
   cd handwritten-digit-recognition
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```bash
   python app.py
   ```
4. Open a browser and visit:
   ```
   http://127.0.0.1:5000
   ```

## Usage
1. **Drawing a Digit:** Use the mouse to draw a digit on the canvas.
2. **Uploading an Image:** Click on "Add Image" to upload a handwritten digit image.
3. **Clearing the Canvas:** Click the "Clear" button to erase the drawing.
4. **Predicting a Digit:** Click the "Predict All Digits" button to get predictions.

## File Structure
```
/handwritten-digit-recognition
│── /static
│   ├── style.css       # Stylesheet
│   ├── script.js       # Frontend logic
│── /templates
│   ├── index.html      # Main interface
│── app.py              # Flask backend
│── model.py            # ML Model for digit recognition
│── requirements.txt    # Dependencies
│── README.md           # Project Documentation
```

## Future Enhancements
- **Support for multiple digits in one image**
- **Improved model accuracy using more datasets**
- **User authentication for storing predictions**



