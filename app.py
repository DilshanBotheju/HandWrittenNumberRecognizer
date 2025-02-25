from flask import Flask, render_template, request, jsonify
import numpy as np
import cv2
from tensorflow.keras.models import load_model

app = Flask(__name__)
model = load_model("model/digit_recognizer.h5")

@app.route('/')
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    predictions = []
    for i in range(1, 5): 
        file_key = f'image{i}'
        if file_key not in request.files:
            continue

        # Get the image file from the request
        file = request.files[file_key]
        image = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_GRAYSCALE)

        # Preprocess the image
        image = cv2.resize(image, (28, 28))
        image = cv2.bitwise_not(image)  
        image = image.astype('float32') / 255.0 
        image = np.expand_dims(image, axis=(0, -1))

        # Predict
        prediction = model.predict(image)
        predicted_digit = str(np.argmax(prediction))
        predictions.append(predicted_digit)

    return jsonify({'predictions': predictions})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)