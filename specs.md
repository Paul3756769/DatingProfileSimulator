# Specification: Personal Dating Profile Preview App

## 1. Overview & Objective
The goal is to build a minimal, single-file web application that serves as a sandbox for testing and refining a single personal dating profile. The application will be viewed on a **desktop browser** and will render a **centered smartphone mockup viewport** to accurately simulate how photos, bio text, and prompt responses will appear on a mobile device (e.g., Tinder, Hinge) before publishing.

Hosted seamlessly on **GitHub Pages** or run locally via `file://` with **zero server dependencies**.

---

## 2. Technical Requirements
- **Format**: Strictly a single HTML file (`index.html`) containing all structural HTML, embedded CSS (`<style>`), and inline JavaScript (`<script>`).
- **Dependencies**: Zero external dependencies, build tools, or server requirements. Must run directly in any browser by opening `index.html` locally (`file://`) or via static GitHub Pages hosting.
- **Client Storage**: Browser IndexedDB for persisting uploaded photo assets across page reloads; LocalStorage for draft settings.
- **Target Viewport**: Desktop browser display featuring a styled phone container centered on screen with fixed aspect ratio/dimensions.

---

## 3. Data & File Structure
The app loads profile data dynamically with graceful fallback cascading:

### Configuration File (`profile.json`)
- External JSON file allowing direct editing of all profile texts, prompts, and image order without modifying code.
- Supports `imageOrder` array configuring the exact sequence of photo paths.
- If no `profile.json` is provided or on fresh visit, automatically falls back to `default_photos/default_hero.jpg` and a generated example JSON profile.

### Image Assets & Manual Framing
- Configurable image order setting (`imageOrder`) supported in `profile.json` and via the in-browser Quick Edit manager.
- **Manual Framing & Zoom**: Each photo supports manual focal positioning (`position: { x, y }`) and `zoom` scale factor, rendered via CSS `object-position` and `transform: scale(...)`.
- **Local Disk Uploads**: Direct drag-and-drop or file picker to upload photos from disk into browser IndexedDB.
- **Automatic Fallback**: If an image cannot be found, gracefully cascades to `default_photos/default_hero.jpg`, followed by an SVG vector portrait fallback.

### In-Browser Quick Edit & JSON Export
- **Quick Edit Drawer**: Live modal drawer to adjust:
  - Header data: Name, age, verified badge toggle, pronouns, distance/location, job, school.
  - Bio text with character counts.
  - Dynamic Dating App Prompts: Add, delete, reorder, choose from 25+ preset questions or type custom prompts, multi-line answers.
  - Essentials & Lifestyle Badges: Add, edit icon/label/value, delete.
  - Interests & Passions: Interactive tag chip manager.
  - Spotify Anthem: Track, artist, album art URL or local image upload.
  - Photo Gallery: Reorder, add by path/URL, replace file from disk, manual framing tool (focal crosshair + sliders), captions, delete.
- **Export JSON**: One-click download of the updated settings to `profile.json` with clean relative paths.
- **Load JSON**: File picker or drag-and-drop anywhere to import any `profile.json`.

---

## 4. UI & Layout Specifications

### Desktop Container & Mobile Mockup Frame
- **Page Layout**: Dark ambient mesh background with the phone frame centered horizontally and vertically.
- **Status Indicator**: Header badge indicating "Client Sandbox / GitHub Pages Ready".
- **Smartphone Frame**:
  - Fixed dimensions mimicking a modern smartphone screen (rounded corners, soft shadow, Dynamic Island notch styling).
  - Internal scroll container representing the app interface while keeping the outer phone frame stationary.

### Mobile Profile Screen (Inside Phone Frame)
- **Photo Carousel / Stacking**:
  - Full-width image display within the phone screen bounds with manual framing/zoom applied.
  - Progress bar segments across the top edge indicating current photo index.
  - Interactive tap areas (left/right halves) or arrow buttons to cycle through photos.
- **Profile Content Section**:
  - Floating profile overlay containing Name, Age, Pronouns, and Verified badge.
  - Scrollable feed below the main photo rendering the bio block, styled prompt card containers, lifestyle badges, and Spotify anthem.
- **Action Bar (Simulated UI)**:
  - Fixed bottom bar inside the phone screen displaying action buttons (Rewind, Pass, Super Like, Like, Boost) with animated stamp reactions.

---

## 5. Scope & Out-of-Scope

### In Scope
- Single-profile rendering within a desktop-hosted phone viewport mockup.
- 100% client-side operation with zero backend server.
- Photo carousel controls (keyboard navigation, mouse clicks, or touch events).
- In-browser photo framing, disk image uploading, IndexedDB persistence.
- JSON configuration import and export.

### Out of Scope
- Backend server, database, or API integrations.
- Multi-user authentication or server-side swiping algorithms.
