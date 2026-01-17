# da-moon — Project Summary

Date: 2026-01-17

## Goal

Create a small, maintainable Three.js scene that reproduces a simple solar system: Sun (light source), Earth (textured + clouds + atmospheric glow + city lights), and Moon orbiting Earth. Include a starfield and camera navigation (drag/zoom). Provide UI controls to adjust simulation speeds with realistic defaults.

## Environment

- OS: macOS
- Tooling: Vite (project configured in `package.json`), TypeScript, `three` and `gsap` installed

Run dev server:

```
bun install    # or `npm install`
bun run dev    # or `npm run dev` (starts Vite)
```

## Project structure (relevant files)

- `index.html` — main HTML file (contains `#da-moon-entry` and the inlined speed panel markup)
- `src/style.css` — global styles including speed-panel UI styles
- `src/main.ts` — application bootstrap and animation loop
- `src/scene/SceneManager.ts` — encapsulates renderer, camera, OrbitControls, and resize handling
- `src/objects/Sun.ts` — Sun mesh + glow + directional light
- `src/objects/Earth.ts` — Earth (icosahedron geometry) with:
  - day texture, bump, specular
  - separate city-lights mesh (additive)
  - cloud layer
  - Fresnel atmospheric glow (shader material in `src/shaders/FresnelMaterial.ts`)
- `src/objects/Moon.ts` — Moon mesh + basic material
- `src/objects/Starfield.ts` — distant stars (Points)
- `src/systems/OrbitSystem.ts` — hierarchical groups for Earth and Moon orbits
- `src/ui/SpeedController.ts` — wires UI sliders (existing DOM panel) to a `SpeedSettings` model
- `speed-panel.html` — (temporary) standalone copy of the speed panel markup (panel is also injected into `index.html`)

Textures are stored under `public/textures/` (Earth maps, moon maps, star sprite).

## What is implemented

- Scene graph with Sun, Earth, Moon, and distant stars
- Earth rendering:
  - Diffuse, bump, specular maps
  - Cloud layer with alpha map
  - City lights as a separate additive mesh
  - Fresnel atmospheric glow (custom shader)
- Sun rendering: mesh + glow + directional light (DirectionalLight used for nicer shading)
- Starfield positioned far away (radius ~800–1200) to avoid crowding near sun
- Orbit hierarchy: Earth orbits sun, Moon orbits Earth
- Camera: `OrbitControls` with damping, min/max distance
- Auto-centering: the controls' target lerps toward Earth's world position when the user is not interacting (smooth, non-jittery)
- Speed controls panel (UI in `index.html`) with sliders for: timeScale, Earth orbit, Moon orbit, Earth rotation, Moon rotation — defaults set to slow/realistic values
- SpeedController wiring: app reads settings each frame; `onChange` hook available for immediate reactions

## Known issues & decisions

- Shadows: shadow casting/receiving are present on some meshes, but shadow map tuning may be needed for visual quality and performance.
- Tone mapping: ACES Filmic tone mapping and Linear SRGB output are enabled for more cinematic colors. Confirm in-browser rendering pipeline on your target devices.
- Some previous iterations created multiple copies of the speed panel; the app now relies on the inlined panel in `index.html`. `src/ui/SpeedController.ts` assumes the DOM elements exist and wires them at construction.
- The `OrbitSystem` currently reads speeds from `SpeedController` each frame; if you want to react instantly on change (e.g., re-center when hitting reset), hook into `SpeedController.onChange` (placeholder wired in `src/main.ts`).

## Remaining / Suggested improvements (next tasks)

- Polish lighting and materials:
  - Tune `DirectionalLight` shadow camera and intensity for realistic day/night terminator
  - Consider adding a subtle ambient/probe or environment map for fill lighting
- Performance & LOD:
  - Reduce geometry complexity or use LOD for lower-end devices
  - Optimize star particle count and material settings for mobile
- UI enhancements:
  - Make the speed panel mobile-friendly and collapsible by default
  - Add a "Center on System" button to instantly snap the camera target to Earth/Sun
  - Add presets (Realistic / Fast time-lapse / Demo)
- Visual enhancements:
  - Add realistic sunlight scattering for atmosphere (or integrate a post-process pass)
  - Improve cloud shading and add volumetric feel
  - Add orbit path helpers (optional) and labels
- Testing & verification:
  - Verify textures load correctly via Vite dev server and check console for missing assets
  - Test on multiple resolutions and ensure camera behaves (no drift) when zooming/panning

## How I tested locally

- I ran the Vite dev server (`bun run dev`) and observed scene rendering, adjusted speeds via sliders, and validated that auto-centering respects user interaction (controls' `start`/`end` events).

## Next steps I can do for you (pick any):

- Tune light intensity and shadow settings for a more dramatic day/night appearance
- Add immediate behavior on speed reset (e.g., re-center camera) and wire it into `SpeedController.onChange`
- Add more controls (presets or camera controls) and a dedicated debug panel
- Implement post-processing (bloom, tonemapping tweak) for extra glow on the Sun

If you want, I can implement one of the suggested improvements now — tell me which and I will update the code and run quick validation.
