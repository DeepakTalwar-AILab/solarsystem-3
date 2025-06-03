import * as THREE from 'three';

export function createDottedOrbitLine(radius, color = 0x555555, segments = 128) {
    const points = [];
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    const material = new THREE.LineDashedMaterial({
        color: color,
        linewidth: 1, // Note: linewidth might not have an effect on all systems/drivers
        dashSize: radius / 15, // Make dash size proportional to orbit size
        gapSize: radius / 20,  // Make gap size proportional to orbit size
        scale: 1 // This is for texture scaling, not directly for dash/gap of LineDashedMaterial
    });

    const line = new THREE.Line(geometry, material);
    line.computeLineDistances(); // Crucial for dashed lines to appear correctly

    return line;
} 