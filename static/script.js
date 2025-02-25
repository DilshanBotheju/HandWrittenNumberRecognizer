// Initialize all canvases
const canvases = [1, 2, 3, 4].reduce((acc, num) => {
    acc[`canvas${num}`] = initCanvas(`canvas${num}`);
    return acc;
}, {});

function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Ensure a clean canvas initially
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    // Event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        document.getElementById(`prediction${canvasId.slice(-1)}`).textContent = '-';
    }

    function draw(e) {
        if (!isDrawing) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    return canvas;
}

function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Completely clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById(`prediction${canvasId.slice(-1)}`).textContent = '-';
}

function isCanvasBlank(canvas) {
    const ctx = canvas.getContext('2d');
    const pixelBuffer = new Uint32Array(
        ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    );

    return !pixelBuffer.some((pixel) => pixel !== 0xFFFFFFFF);
}

async function predictDigits() {
    try {
        const formData = new FormData();
        let hasDrawing = false;

        for (let num of [1, 2, 3, 4]) {
            const canvas = document.getElementById(`canvas${num}`);
            const predictionElement = document.getElementById(`prediction${num}`);

            if (isCanvasBlank(canvas)) {
                predictionElement.textContent = '-'; // No drawing detected
                continue;
            }

            hasDrawing = true;
            const dataURL = canvas.toDataURL('image/png');
            const blob = await fetch(dataURL).then(res => res.blob());
            formData.append(`image${num}`, blob, `digit${num}.png`);
        }

        if (!hasDrawing) {
            alert("No drawings detected!");
            return;
        }

        const response = await fetch('/predict', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error("Server error");

        const data = await response.json();
        [1, 2, 3, 4].forEach((num, index) => {
            document.getElementById(`prediction${num}`).textContent = data.predictions[index] || '-';
        });

    } catch (error) {
        console.error('Prediction error:', error);
        [1, 2, 3, 4].forEach(num => {
            document.getElementById(`prediction${num}`).textContent = 'Error!';
        });
    }
}

// Function to load an image into a canvas
function loadImage(event, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = function() {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = reader.result;
    };

    reader.readAsDataURL(event.target.files[0]);
}
