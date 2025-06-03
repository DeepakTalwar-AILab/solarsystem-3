export function createPlanetLabel(text, parentElement) {
    const label = document.createElement('div');
    label.style.position = 'absolute';
    label.style.padding = '2px 5px';
    label.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    label.style.color = 'white';
    label.style.fontFamily = 'Arial, sans-serif';
    label.style.fontSize = '12px';
    label.style.pointerEvents = 'none'; // So it doesn't interfere with mouse events on the canvas
    label.textContent = text;
    parentElement.appendChild(label);
    return label;
}

export function updateLabelPosition(label, object3D, camera, canvas) {
    const vector = object3D.position.clone();
    vector.project(camera);

    const x = (vector.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (vector.y * -0.5 + 0.5) * canvas.clientHeight;

    // Adjust position slightly to be next to the object, not directly on top
    label.style.left = `${x + 15}px`;
    label.style.top = `${y - 10}px`; // Move up a bit from the center

    // Hide label if it's behind the camera
    if (vector.z > 1) {
        label.style.display = 'none';
    } else {
        label.style.display = 'block';
    }
} 