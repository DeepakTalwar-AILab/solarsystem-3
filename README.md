# 3D Solar System

A simple interactive 3D model of our solar system built with web technologies.

## Tech Stack

*   **HTML:** For the basic structure of the web page.
*   **CSS:** For styling the page elements.
*   **JavaScript:** For the core logic and interactivity.
*   **Three.js:** A JavaScript library for creating and displaying 3D computer graphics in a web browser.

## Milestones

Here's a breakdown of the project into manageable milestones:

### Milestone 1: Static Solar System Display
*   **Goal:** Render the Sun and the planets of our solar system in their approximate positions.
*   **Key Tasks:**
    *   Set up a basic HTML page.
    *   Initialize a Three.js scene, camera, and renderer.
    *   Create spherical geometries for the Sun and each planet (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune).
    *   Apply basic materials/colors to each celestial body.
    *   Position the planets around the Sun (no orbits yet, just static placement).
    *   Add a light source (e.g., a point light emanating from the Sun).

### Milestone 2: Dynamic Orbits & Basic Camera Controls
*   **Goal:** Animate the planets orbiting the Sun and allow basic user interaction with the camera.
*   **Key Tasks:**
    *   Implement elliptical orbit paths for each planet.
    *   Animate the planets moving along their respective orbits.
    *   Implement basic camera controls (e.g., zoom in/out, pan the view using mouse or keyboard).
    *   (Optional) Add axial tilt to planets where appropriate.
    * Add textures to the planets using image files

### Milestone 3: Information Display & Visual Polish
*   **Goal:** Enhance the user experience by providing information about the celestial bodies and improving visual fidelity.
*   **Key Tasks:**
    *   Display planet names (e.g., on hover or as persistent labels).
    *   Show basic information about a planet when it's clicked or hovered over by zooming in (e.g., diameter, distance from Sun).
    *   polish visuals (lighting, backgrounds)
    *   (Optional) Add rings for Saturn.
    *   (Optional) Add a starry background/skybox.
    *   (Optional) Implement more advanced camera controls (e.g., focus on a specific planet).

## Getting Started

To run this project locally, you need a simple HTTP server to serve the static files (HTML, CSS, JavaScript). Here are a couple of common ways:

**1. Using Node.js (with npx):**
   * Open your terminal or command prompt.
   * Navigate to the root directory of the project.
   * Run the command: `npx http-server .`
   * This will typically start a server on `http://localhost:8080`. Open this URL in your web browser.

**2. Using Python:**
   * Make sure you have Python installed.
   * Open your terminal or command prompt.
   * Navigate to the root directory of the project.
   * If you have Python 3, run: `python -m http.server`
   * If you have Python 2, run: `python -m SimpleHTTPServer`
   * This will start a server, usually on `http://localhost:8000` or `http://localhost:8080`. Check the terminal output for the exact address and open it in your web browser.

After starting the server, open the provided URL in your browser to view the 3D solar system.

## Contributing

*(To be added: Guidelines for contributing to the project, if applicable.)* 