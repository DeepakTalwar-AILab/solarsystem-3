import * as THREE from 'three';
import { createCelestialBody } from './celestialBody.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Set background to black
document.body.appendChild(renderer.domElement);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 200;
controls.target.set(0, 0, 0); // Ensure controls orbit around the center (Sun)

// Lighting
const ambientLight = new THREE.AmbientLight(0x202020); // Reduced ambient light for strong contrast
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 7.0, 0); // Dramatically increased point light intensity
scene.add(pointLight); // Will be positioned at the Sun's location

// Celestial Bodies Data (simplified radii and distances for now)
// Radii are not to scale with distances for better visualization
const sunData = { name: 'Sun', radius: 5, color: 0xFFFF00, textureURL: 'public/textures/2k_sun.jpg' }; // Ensured bright yellow
const planetData = [
    { name: 'Mercury', radius: 0.5, color: 0x999999, distance: 10, orbitSpeed: 0.8, rotationSpeed: 0.5, textureURL: 'public/textures/2k_mercury.jpg' },
    { name: 'Venus', radius: 0.8, color: 0xE6D2B5, distance: 15, orbitSpeed: 0.6, rotationSpeed: 0.25, textureURL: 'public/textures/2k_venus_surface.jpg' },
    { name: 'Earth', radius: 1, color: 0x4A90E2, distance: 20, orbitSpeed: 0.4, rotationSpeed: 1.0, textureURL: 'public/textures/2k_earth_daymap.jpg' },
    { name: 'Mars', radius: 0.7, color: 0xD06A3F, distance: 25, orbitSpeed: 0.3, rotationSpeed: 0.9, textureURL: 'public/textures/2k_mars.jpg' },
    { name: 'Jupiter', radius: 3, color: 0xFFA500, distance: 35, orbitSpeed: 0.2, rotationSpeed: 2.0, textureURL: 'public/textures/2k_jupiter.jpg' },
    { name: 'Saturn', radius: 2.5, color: 0xE0D8C0, distance: 45, orbitSpeed: 0.16, rotationSpeed: 1.75, textureURL: 'public/textures/2k_saturn.jpg' },
    { name: 'Uranus', radius: 1.5, color: 0x7FFFD4, distance: 55, orbitSpeed: 0.12, rotationSpeed: 1.25, textureURL: 'public/textures/2k_uranus.jpg' },
    { name: 'Neptune', radius: 1.4, color: 0x3B5998, distance: 65, orbitSpeed: 0.1, rotationSpeed: 1.1, textureURL: 'public/textures/2k_neptune.jpg' },
];

console.log("main.js version: v4, Earth texture: " + planetData[2].textureURL);

// Create Sun
const sun = createCelestialBody(sunData);
scene.add(sun);
// sun.material.emissive = new THREE.Color(0xFFFF00); // Ensure this is commented out for MeshBasicMaterial
// sun.material.emissiveIntensity = 1.5;          // Ensure this is commented out for MeshBasicMaterial
pointLight.position.copy(sun.position); // Position light at the sun

// Array to store planet meshes and their data for animation
const planetsWithData = [];

// Create Planets
planetData.forEach(data => {
    const planet = createCelestialBody({
        radius: data.radius,
        color: data.color,
        textureURL: data.textureURL,
        x: data.distance // Simple initial positioning along x-axis
    });
    scene.add(planet);
    planetsWithData.push({ mesh: planet, data: data });
});

// Camera Position
camera.position.z = 70; // Adjusted for a wider view of orbits
camera.position.y = 20; // Adjusted for a better top-down angle
camera.lookAt(scene.position);

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    // console.log("elapsedTime: " + elapsedTime); // Log elapsedTime once per frame

    // Animate Planets
    planetsWithData.forEach(p => {
        // Orbit calculation
        const newX = Math.cos(elapsedTime * p.data.orbitSpeed) * p.data.distance;
        const newZ = Math.sin(elapsedTime * p.data.orbitSpeed) * p.data.distance;
        p.mesh.position.x = newX;
        p.mesh.position.z = newZ;

        // Self-rotation
        p.mesh.rotation.y += p.data.rotationSpeed;

        // if (p.data.name === 'Earth') { // Removing this diagnostic log
        //     console.log(`Earth Orbit: t=${elapsedTime.toFixed(2)}, spd=${p.data.orbitSpeed}, dist=${p.data.distance}, X=${newX.toFixed(2)}, Z=${newZ.toFixed(2)}`);
        // }
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}); 