import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

/**
 * Creates a celestial body (planet or sun).
 * @param {object} options - The options for the celestial body.
 * @param {number} options.radius - The radius of the sphere.
 * @param {number} options.color - The color of the material.
 * @param {string} [options.textureURL] - The URL of the texture image.
 * @param {number} [options.x=0] - The x position.
 * @param {number} [options.y=0] - The y position.
 * @param {number} [options.z=0] - The z position.
 * @returns {THREE.Mesh} The celestial body mesh.
 */
export function createCelestialBody({ radius, color, textureURL, x = 0, y = 0, z = 0 }) {
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const materialProperties = { color: color };
    if (textureURL) {
        materialProperties.map = textureLoader.load(textureURL);
    }
    const material = new THREE.MeshBasicMaterial(materialProperties);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    return mesh;
} 