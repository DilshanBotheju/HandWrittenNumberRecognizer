// Initialize all canvases
const canvases = [1, 2, 3, 4].reduce((acc, num) => {
    acc[`canvas${num}`] = initCanvas(`canvas${num}`);
    return acc;
}, {});

function initCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Setup drawing context
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
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById(`prediction${canvasId.slice(-1)}`).textContent = '-';
}

async function predictDigits() {
    try {
        const formData = new FormData();
        
        // Convert all canvases to blobs
        const blobPromises = [1, 2, 3, 4].map(num => 
            new Promise(resolve => {
                const canvas = document.getElementById(`canvas${num}`);
                canvas.toBlob(blob => {
                    resolve({ num, blob });
                }, 'image/png');
            })
        );

        // Wait for all blobs to be created
        const blobs = await Promise.all(blobPromises);
        
        // Add blobs to form data
        blobs.forEach(({ num, blob }) => {
            if (blob) formData.append(`image${num}`, blob, `digit${num}.png`);
        });

        // Send to backend
        const response = await fetch('/predict', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        
        // Update predictions
        data.predictions.forEach((pred, index) => {
            const predictionElement = document.getElementById(`prediction${index + 1}`);
            predictionElement.textContent = pred || '?';
            predictionElement.style.color = pred ? '#27ae60' : '#e74c3c';
        });

    } catch (error) {
        console.error('Prediction error:', error);
        [1, 2, 3, 4].forEach(num => {
            document.getElementById(`prediction${num}`).textContent = 'Error!';
            document.getElementById(`prediction${num}`).style.color = '#e74c3c';
        });
    }
}