# 3D Landmarks

An interactive 3D gallery of four famous landmarks, built with Three.js and simple procedural geometry.

I built this project to explore how recognizable buildings can be represented with basic shapes and viewed interactively in a browser. The goal is a lightweight, approachable 3D experience: choose a landmark, orbit around it, and zoom in to inspect its structure.

**[Try the live demo](https://sshnox.github.io/landmarks-3d/)**

## Features

- Four procedurally generated landmarks.
- A dropdown for switching between models.
- Drag-to-orbit and scroll-to-zoom controls.
- Gentle camera rotation when idle.
- Lighting, shadows, a ground plane, and a reference grid.
- Geometry and material cleanup when switching models.
- Loading guidance when the graphics engine or WebGL is unavailable.
- No build step, backend, accounts, or API keys.

## The landmarks

| Landmark | Representation |
| --- | --- |
| Eiffel Tower, Paris | Four tapered legs, platforms, a narrowing center, and a spire. |
| Great Wall of China | Connected wall segments with watchtowers. |
| Forbidden City, Beijing | Red structures, golden roofs, halls, and corner pavilions. |
| Colosseum, Rome | Elliptical tiers of pillars, horizontal bands, and an arena floor. |

These are stylized geometric approximations, not accurate architectural reconstructions. The models are generated in JavaScript; no external 3D model files are downloaded.

## Getting started

### Open the demo

Visit the [live site](https://sshnox.github.io/landmarks-3d/) in a modern browser with WebGL enabled.

### Run locally

```bash
git clone https://github.com/sshnox/landmarks-3d.git
cd landmarks-3d
python3 -m http.server 8000
```

Open `http://localhost:8000`. You can also download the repository ZIP, extract it, and double-click `index.html`.

Internet access is required to load Three.js from jsDelivr. Browser caching does not guarantee offline availability.

## Controls

| Action | Control |
| --- | --- |
| Change the building | Choose a landmark from the dropdown. |
| Rotate the view | Drag inside the 3D area. |
| Zoom | Scroll over the 3D area. |

The camera resumes its gentle rotation when you stop dragging. The app does not save the selected landmark or camera position across reloads.

## Tech stack

- HTML, CSS, and plain JavaScript
- Three.js 0.128.0, loaded from jsDelivr
- WebGL rendering
- GitHub Pages for static hosting

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Standalone viewer and procedural models. |
| `RESOURCES.md` | Third-party dependencies and licenses. |
| `README.md` | Setup, controls, and project overview. |

## How it works

Each model builder creates a Three.js group from boxes, cylinders, cones, and shared materials. The viewer adds the selected group to a scene with lights and a ground plane. Pointer input adjusts the camera's orbit, while the mouse wheel changes its distance from the target.

Switching landmarks removes the previous group and disposes of its geometries and materials to release graphics resources.

## Deployment

GitHub Pages publishes the root of the `main` branch. Changes pushed to `main` are automatically redeployed. Both the repository and the live site are public.

## Troubleshooting and limitations

- **The toolbar appears but the model does not:** check your internet connection and whether WebGL is supported and enabled.
- **A graphics error appears:** try a current browser with hardware acceleration available.
- **The model looks simplified:** that is intentional; these are small procedural studies, not photorealistic assets.

JavaScript syntax was checked during setup. The deployment and dependency loading were verified, but 3D rendering could not be visually verified in the cloud browser because it could not create a WebGL context.

## Author and acknowledgments

Built and maintained by **Shoaib Shah** ([sshnox](https://github.com/sshnox)).

Three.js is provided by its contributors under the MIT license. 

## Contributing

Suggestions, model improvements, and browser compatibility fixes are welcome. Open an issue with your browser details and a description of the behavior, or submit a focused pull request. Include screenshots for visual changes.
