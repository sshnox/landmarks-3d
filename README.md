# 3D Landmarks

A browser-based Three.js viewer adapted from the code in [Shoaib's shared DeepSeek conversation](https://chat.deepseek.com/share/oz95851nu45x0xfls3).

Explore simplified procedural models of the Eiffel Tower, Great Wall of China, Forbidden City, and Colosseum. Drag to orbit and scroll to zoom. The camera rotates gently when idle.

## Open the viewer

1. Download this repository using **Code → Download ZIP**.
2. Extract the ZIP.
3. Double-click `index.html` to open it in a modern browser.

No installation or build step is required. Internet access is required to load the pinned Three.js dependency from jsDelivr. Browser caching does not guarantee offline availability. WebGL must be supported and enabled.

## Files

- `index.html`: complete standalone viewer from the final code block, with accessibility, mobile layout, pointer cancellation, dependency failure messaging, and model disposal improvements.
- `reference/landmarks-original.html`: unchanged standalone code from the uploaded transcript.
- `reference/harness-plugin/`: original plugin draft from the conversation, retained for reference.
- `RESOURCES.md`: source and resource links.

## Harness plugin status

The earlier plugin draft is **unverified and not the recommended entry point**. It assumes a global React object and a particular Harness slot API, loads an old Three.js script path, and has initialization and cleanup issues. It has not been installed or tested inside DeepSeek Harness. Its included installation command is historical reference, not verified deployment guidance.

The standalone viewer is independent of Harness. Models are stylized approximations made from basic geometry, not accurate architectural reconstructions or downloaded 3D assets.

## Hosting

`index.html` can be served by any static host. This repository does not automatically publish a site or enable GitHub Pages.

## Provenance and licensing

Project code originated in the linked AI conversation. The reference plugin manifest declared MIT; that original declaration is preserved. No new blanket license or third-party ownership claim is added here. Three.js is an external dependency under its own MIT license.
