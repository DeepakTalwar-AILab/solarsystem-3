import * as THREE from 'three';
import { createCelestialBody } from './celestialBody.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { createPlanetLabel, updateLabelPosition } from './PlanetLabel.js';
import { createDottedOrbitLine } from './OrbitLine.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();

// Skybox (Temporarily Disabled)
/*
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    'public/textures/skybox/px.jpg', // Right
    'public/textures/skybox/nx.jpg', // Left
    'public/textures/skybox/py.jpg', // Top
    'public/textures/skybox/ny.jpg', // Bottom
    'public/textures/skybox/pz.jpg', // Front
    'public/textures/skybox/nz.jpg'  // Back
]);
scene.background = texture;
*/

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // Reverted far plane
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000); // Set background to black
document.body.appendChild(renderer.domElement);

const labelContainer = document.getElementById('label-container');
const infoPanel = document.getElementById('info-panel');
console.log('infoPanel element:', infoPanel); // Log if infoPanel is found

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 200;
controls.target.set(0, 0, 0); // Ensure controls orbit around the center (Sun)

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333); // Adjusted ambient light
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 0); // Adjusted point light intensity
// scene.add(pointLight); // Will be positioned at the Sun's location

// Texture loader for Saturn's rings (ensure it's defined if not using lensflare's)
const textureLoader = new THREE.TextureLoader(); 

// Celestial Bodies Data (simplified radii and distances for now)
// Radii are not to scale with distances for better visualization
const sunData = { name: 'Sun', radius: 5, color: 0xFFFF00, textureURL: 'public/textures/2k_sun.jpg' }; // Ensured bright yellow
const planetData = [
    { name: 'Mercury', radius: 0.5, color: 0x999999, distance: 10, orbitSpeed: 0.8, rotationSpeed: 0.5, textureURL: 'public/textures/2k_mercury.jpg', description: 'The smallest planet, closest to the Sun. Swift and heavily cratered.', avgRealDistanceAU: 0.39, funFact: "I'm the closest planet to the Sun and super speedy!", clue: "I'm the smallest planet and I like to go fast!" },
    { name: 'Venus', radius: 0.8, color: 0xE6D2B5, distance: 15, orbitSpeed: 0.6, rotationSpeed: 0.25, textureURL: 'public/textures/2k_venus_surface.jpg', description: 'Earth\'s "sister planet" due to similar size, but with a thick, toxic atmosphere.', avgRealDistanceAU: 0.72, funFact: "I'm the hottest planet, even though I'm not the closest to the Sun!", clue: "I'm super hot and sometimes called Earth's twin." },
    { 
        name: 'Earth', radius: 1, color: 0x4A90E2, distance: 20, orbitSpeed: 0.4, rotationSpeed: 1.0, 
        textureURL: 'public/textures/2k_earth_daymap.jpg', 
        description: 'Our home world, teeming with life and featuring vast oceans and diverse landmasses.', 
        avgRealDistanceAU: 1.00,
        funFact: "I'm your home! The only planet known to have yummy ice cream.",
        clue: "You live on me! I have lots of water and yummy ice cream.",
        moons: [
            { name: 'Moon', radius: 0.27, distance: 2, orbitSpeed: 0.15, rotationSpeed: 0.001, textureURL: 'public/textures/2k_moon.jpg' }
        ]
    },
    { name: 'Mars', radius: 0.7, color: 0xD06A3F, distance: 25, orbitSpeed: 0.3, rotationSpeed: 0.9, textureURL: 'public/textures/2k_mars.jpg', description: 'The "Red Planet," known for its rusty color, polar ice caps, and potential for past life.', avgRealDistanceAU: 1.52, funFact: "I'm the 'Red Planet' and have the tallest volcano in the solar system!", clue: "I'm known as the 'Red Planet'." },
    { name: 'Jupiter', radius: 3, color: 0xFFA500, distance: 35, orbitSpeed: 0.2, rotationSpeed: 2.0, textureURL: 'public/textures/2k_jupiter.jpg', description: 'The largest planet, a gas giant with a Great Red Spot and many moons.', avgRealDistanceAU: 5.20, funFact: "I'm a gas giant and so big, all other planets could fit inside me!", clue: "I'm the biggest planet and have a Great Red Spot." },
    { name: 'Saturn', radius: 2.5, color: 0xE0D8C0, distance: 45, orbitSpeed: 0.16, rotationSpeed: 0.02, textureURL: 'public/textures/2k_saturn.jpg', description: 'Famous for its stunning ring system, a gas giant with a hazy yellow hue.', avgRealDistanceAU: 9.58, funFact: "I'm famous for my beautiful, icy rings!", clue: "My beautiful rings make me famous!" },
    { name: 'Uranus', radius: 1.5, color: 0x7FFFD4, distance: 55, orbitSpeed: 0.12, rotationSpeed: 1.25, textureURL: 'public/textures/2k_uranus.jpg', description: 'An ice giant tilted on its side, with a pale blue-green color.', avgRealDistanceAU: 19.22, funFact: "I'm an ice giant and I spin on my side, like a rolling ball!", clue: "I'm an ice giant that spins on its side." },
    { name: 'Neptune', radius: 1.4, color: 0x3B5998, distance: 65, orbitSpeed: 0.1, rotationSpeed: 1.1, textureURL: 'public/textures/2k_neptune.jpg', description: 'The most distant planet, a cold and windy ice giant with a deep blue color.', avgRealDistanceAU: 30.05, funFact: "I'm the windiest planet and very, very cold!", clue: "I'm the windiest planet and very far from the Sun." },
];

console.log("main.js version: v4, Earth texture: " + planetData[2].textureURL);

// Create Sun
const sun = createCelestialBody(sunData);
scene.add(sun);
pointLight.position.copy(sun.position);
scene.add(pointLight); // Add point light without lensflare for now

// Add Lensflare to Sun/PointLight (Temporarily Disabled)
/*
const textureLoader = new THREE.TextureLoader();
const textureFlare0 = textureLoader.load('public/textures/lensflare0.png');

const lensflare = new Lensflare();
lensflare.addElement(new LensflareElement(textureFlare0, 700, 0, pointLight.color));
lensflare.addElement(new LensflareElement(textureFlare0, 60, 0.6));
lensflare.addElement(new LensflareElement(textureFlare0, 70, 0.7));
lensflare.addElement(new LensflareElement(textureFlare0, 120, 0.9));
lensflare.addElement(new LensflareElement(textureFlare0, 70, 1.0));

pointLight.add(lensflare);
scene.add(pointLight);
*/

// Array to store planet meshes and their data for animation
const planetsWithData = [];
const raycastableProxies = []; // New array for invisible click proxies

// Create Planets
planetData.forEach(data => {
    const planet = createCelestialBody({
        radius: data.radius,
        color: data.color,
        textureURL: data.textureURL,
        x: data.distance // Simple initial positioning along x-axis
    });
    scene.add(planet);

    // Create a larger, invisible click proxy for each planet
    const proxyRadiusMultiplier = 5; // Make click targets significantly larger for testing
    const proxyRadius = data.radius * proxyRadiusMultiplier;
    const actualProxyRadius = Math.max(proxyRadius, 1.0); 
    const proxyGeometry = new THREE.SphereGeometry(actualProxyRadius, 16, 16);
    const proxyMaterial = new THREE.MeshBasicMaterial({ visible: false });
    const planetProxy = new THREE.Mesh(proxyGeometry, proxyMaterial);
    planetProxy.userData.isProxy = true;
    planetProxy.userData.planetMesh = planet;
    planetProxy.userData.planetData = data;
    scene.add(planetProxy);
    raycastableProxies.push(planetProxy);

    // Prepare the object to be stored, including an array for its moons
    const currentPlanetEntry = { 
        mesh: planet, 
        data: data, 
        label: null, // Will be assigned later
        proxy: planetProxy, 
        childMoons: [] // Initialize for moons
    };

    // Create and add orbit line for the planet
    const orbitLine = createDottedOrbitLine(data.distance, 0x444444);
    scene.add(orbitLine);

    if (data.name === 'Saturn') {
        const ringTexture = textureLoader.load('public/textures/8k_saturn_ring_alpha.png');
        const ringGeometry = new THREE.RingGeometry(data.radius + 0.5, data.radius + 2.5, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2 + THREE.MathUtils.degToRad(26.7);
        planet.add(ringMesh);
    }

    // Create Moons if any
    if (data.moons && data.moons.length > 0) {
        data.moons.forEach(moonData => {
            const moon = createCelestialBody({
                radius: moonData.radius,
                color: 0xaaaaaa, 
                textureURL: moonData.textureURL,
            });
            planet.add(moon); // Add moon as a child of the planet
            currentPlanetEntry.childMoons.push({ mesh: moon, data: moonData }); // Add moon to parent's list
        });
    }

    const planetLabel = createPlanetLabel(data.name, labelContainer);
    planetLabel.style.display = 'none'; 
    currentPlanetEntry.label = planetLabel; // Assign label to the prepared entry
    planetsWithData.push(currentPlanetEntry); // Add the complete planet entry
});

// Camera Position
camera.position.z = 70;
camera.position.y = 20;
camera.lookAt(scene.position);

const initialCameraPosition = camera.position.clone();
const initialControlsTarget = controls.target.clone();

// Animation Loop
const clock = new THREE.Clock();

// Raycaster for picking objects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Helper to shuffle an array (Fisher-Yates shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to display full planet info (called after correct quiz answer)
function displayFullPlanetInfo(planetInfoData, showWellDone = false) {
    let wellDoneMessage = '';
    if (showWellDone) {
        wellDoneMessage = `<p style="color: green; font-weight: bold;">Well Done! You guessed it!</p>`;
    }

    const info = `
        ${wellDoneMessage}
        <h3>${planetInfoData.name}</h3>
        <p>Diameter: ${planetInfoData.radius * 2} (visual units)</p>
        <p>Simulated Distance from Sun: ${planetInfoData.distance} (visual units)</p>
        <p>Avg. Real Distance from Sun: ${planetInfoData.avgRealDistanceAU} AU</p>
        <p><em>${planetInfoData.description}</em></p>
        <p><strong>Fun Fact:</strong> ${planetInfoData.funFact || 'This planet is super mysterious!'}</p>
    `;
    infoPanel.innerHTML = info;
    infoPanel.style.display = 'block';
    console.log('Full info displayed for:', planetInfoData.name);

    // Ensure the correct label is visible (this was part of original onMouseClick logic)
    const planetDisplayData = planetsWithData.find(p => p.data.name === planetInfoData.name);
    if (planetDisplayData) {
        planetsWithData.forEach(p => {
            if (p.label) p.label.style.display = 'none';
        });
        if (planetDisplayData.label) {
            planetDisplayData.label.style.display = 'block';
            // updateLabelPosition is called in the main animate loop for visible labels
        }
    }
}

// Function to handle the quiz answer
function handleQuizAnswer(isCorrect, planetData, feedbackEl, choicesEl) {
    if (isCorrect) {
        displayFullPlanetInfo(planetData, true); // Pass flag to show "Well Done!"
    } else {
        feedbackEl.textContent = 'Oops! Try Again!';
        // Optionally, disable the clicked button:
        // event.target.disabled = true; // (if event is passed)
    }
}

// Function to display the quiz
function displayPlanetQuiz(planetToGuessData) {
    if (!infoPanel) {
        console.error("Info panel not found, cannot display quiz.");
        return;
    }
    infoPanel.innerHTML = ''; // Clear previous content
    infoPanel.style.display = 'block';

    const clueElement = document.createElement('p');
    clueElement.innerHTML = `<strong>Clue:</strong> ${planetToGuessData.clue || 'Can you guess my name?'}`;
    infoPanel.appendChild(clueElement);

    const feedbackElement = document.createElement('p'); // For "Try Again"
    feedbackElement.id = 'quiz-feedback';
    feedbackElement.style.minHeight = '1em'; // Reserve space for message
    infoPanel.appendChild(feedbackElement);

    const choicesContainer = document.createElement('div');
    choicesContainer.id = 'quiz-choices';

    const incorrectNames = planetData
        .filter(p => p.name !== planetToGuessData.name)
        .map(p => p.name);
    shuffleArray(incorrectNames);
    
    const choiceNames = [planetToGuessData.name]; // Start with the correct name
    // Ensure we get 2 unique incorrect names
    let count = 0;
    for (let i = 0; i < incorrectNames.length && count < 2; i++) {
        if (!choiceNames.includes(incorrectNames[i])) {
            choiceNames.push(incorrectNames[i]);
            count++;
        }
    }
    // If not enough unique incorrect names (e.g., very few planets total), this might result in fewer than 3 choices.
    // For our 8 planets, this is fine.

    shuffleArray(choiceNames); // Shuffle all choices

    choiceNames.forEach(name => {
        const button = document.createElement('button');
        button.textContent = name;
        button.style.margin = '5px'; // Basic styling
        button.onclick = (event) => { // Pass event to potentially disable button
            handleQuizAnswer(name === planetToGuessData.name, planetToGuessData, feedbackElement, choicesContainer);
            if (name !== planetToGuessData.name) { // If incorrect, disable button
                 event.target.disabled = true;
            }
        };
        choicesContainer.appendChild(button);
    });
    infoPanel.appendChild(choicesContainer);
    console.log('Quiz displayed for:', planetToGuessData.name);
}

function onMouseClick(event) {
    console.log('Canvas clicked'); // Log when a click occurs
    // Calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Raycast against the invisible proxies only
    const intersects = raycaster.intersectObjects(raycastableProxies, false); // No need for recursive if proxies are direct scene children
    console.log('Raycaster intersects with proxies:', intersects);

    if (intersects.length > 0) {
        const clickedProxy = intersects[0].object;
        // Retrieve the actual planet data and mesh from the proxy\'s userData
        const clickedPlanetInfoData = clickedProxy.userData.planetData;
        const actualPlanetMesh = clickedProxy.userData.planetMesh;

        console.log('Clicked proxy:', clickedProxy);
        console.log('Retrieved planet data from proxy:', clickedPlanetInfoData);
        console.log('Actual planet mesh from proxy:', actualPlanetMesh);

        if (clickedPlanetInfoData && actualPlanetMesh) {
            const planetDisplayData = planetsWithData.find(p => p.data.name === clickedPlanetInfoData.name); // Get the full planet object for label etc.
            
            // Animate camera to the actual clicked planet
            const targetPosition = new THREE.Vector3();
            actualPlanetMesh.getWorldPosition(targetPosition);

            const offset = new THREE.Vector3(0, clickedPlanetInfoData.radius * 1.5, clickedPlanetInfoData.radius * 4);
            const cameraTargetPosition = targetPosition.clone().add(offset);
            
            const duration = 1000;
            const startPosition = camera.position.clone();
            const startTarget = controls.target.clone();
            let startTime = null;

            function animateCameraToPlanet(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);

                camera.position.lerpVectors(startPosition, cameraTargetPosition, progress);
                controls.target.lerpVectors(startTarget, targetPosition, progress);
                controls.update();

                if (progress < 1) {
                    requestAnimationFrame(animateCameraToPlanet);
                } else {
                    controls.target.copy(targetPosition);
                    controls.update();

                    // Hide all labels, then show the current one
                    planetsWithData.forEach(p => {
                        if (p.label) p.label.style.display = 'none';
                    });
                    if (planetDisplayData && planetDisplayData.label) {
                        planetDisplayData.label.style.display = 'block';
                        // Ensure its position is updated immediately
                        updateLabelPosition(planetDisplayData.label, actualPlanetMesh, camera, renderer.domElement);
                    }

                    // --- MODIFIED PART: Display quiz instead of full info ---
                    displayPlanetQuiz(clickedPlanetInfoData); 
                    // console.log('Info panel should be visible now for:', clickedPlanetInfoData.name); // This log is now in displayPlanetQuiz
                }
            }
            requestAnimationFrame(animateCameraToPlanet);
        }
    }
}

renderer.domElement.addEventListener('click', onMouseClick);

function onDoubleClick() {
    // Animate camera back to the initial overview state
    const duration = 1000; // 1 second
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    let startTime = null;

    function animateCameraToOverview(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        camera.position.lerpVectors(startPosition, initialCameraPosition, progress);
        controls.target.lerpVectors(startTarget, initialControlsTarget, progress);
        controls.update();

        if (progress < 1) {
            requestAnimationFrame(animateCameraToOverview);
        } else {
            controls.target.copy(initialControlsTarget);
            controls.update();
        }
    }
    requestAnimationFrame(animateCameraToOverview);

    // Hide info panel and all planet labels
    infoPanel.style.display = 'none';
    planetsWithData.forEach(p => {
        if (p.label) p.label.style.display = 'none';
    });
}

renderer.domElement.addEventListener('dblclick', onDoubleClick);

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    // console.log("elapsedTime: " + elapsedTime); // Log elapsedTime once per frame

    // Animate Planets
    planetsWithData.forEach(p => {
        // Orbit calculation for planet
        const newX = Math.cos(elapsedTime * p.data.orbitSpeed) * p.data.distance;
        const newZ = Math.sin(elapsedTime * p.data.orbitSpeed) * p.data.distance;
        p.mesh.position.x = newX;
        p.mesh.position.z = newZ;

        // Update the planet's proxy's position to match the planet
        if (p.proxy) {
            p.proxy.position.copy(p.mesh.position);
        }

        // Self-rotation for planet
        p.mesh.rotation.y += p.data.rotationSpeed;

        // Animate Moons if any
        if (p.childMoons && p.childMoons.length > 0) {
            p.childMoons.forEach(moonObj => {
                const moonOrbitRadius = moonObj.data.distance;
                const moonOrbitSpeed = moonObj.data.orbitSpeed;
                // Orbit calculation for moon (relative to parent planet)
                const moonX = Math.cos(elapsedTime * moonOrbitSpeed) * moonOrbitRadius;
                const moonZ = Math.sin(elapsedTime * moonOrbitSpeed) * moonOrbitRadius;
                moonObj.mesh.position.set(moonX, 0, moonZ); // Position is relative to parent (Earth)

                // Self-rotation for moon
                moonObj.mesh.rotation.y += moonObj.data.rotationSpeed;
            });
        }

        // Update label position only if it's supposed to be visible
        // The main visibility is controlled by zoom state now, but updateLabelPosition also hides if behind camera.
        if (p.label.style.display === 'block') {
            updateLabelPosition(p.label, p.mesh, camera, renderer.domElement);
        }
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