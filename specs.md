# Specification: Personal Dating Profile Preview App

## 1. Overview & Objective
The goal is to build a minimal, single-file web application that serves as a local sandbox for testing and refining a single personal dating profile. The application will be viewed on a **desktop browser** and will render a **centered smartphone mockup viewport** to accurately simulate how photos, bio text, and prompt responses will appear on a mobile device (e.g., Tinder, Hinge) before publishing.

---

## 2. Technical Requirements
- **Format**: Strictly a single HTML file containing all structural HTML, embedded CSS (`<style>`), and inline JavaScript (`<script>`).
- **Dependencies**: Zero external dependencies, build tools, or server requirements. Must run directly in any browser by opening the `.html` file locally (`file://`).
- **Target Viewport**: Desktop browser display featuring a styled phone container centered on screen with fixed aspect ratio/dimensions.

---

## 3. Data & File Structure
The app loads profile data either dynamically from `profile.json` or from the fallback configuration object in the `<script>` tag:

### Configuration File (`profile.json`)
- External JSON file allowing direct editing of all profile texts, prompts, and image order without modifying code.
- Includes `imageOrder` array configuring the exact sequence of photo paths.

### Image Assets
- Local image files in `photos/` (e.g. `photos/1.jpg`, `photos/2.jpg`, `photos/3.jpg`, `photos/4.jpg`).
- Configurable image order setting (`imageOrder`) supported in both `profile.json` and via the interactive in-browser Quick Edit manager.

### In-Browser Quick Edit & JSON Export
- **Quick Edit Drawer**: Live modal drawer to adjust texts, bio, prompts, and reorder photos via Up/Down buttons.
- **Export JSON**: One-click download of the updated settings to `profile.json`.
- **Load JSON**: File picker to import any `profile.json` locally when running on `file://`.

### Text Content
- **Header Data**: Name, age, pronouns, distance/location, job, school.
- **Bio Text**: Main personal description.
- **Prompt Blocks**: Structured Question & Answer pairs matching real dating app formats (e.g., *Prompt*: "Two truths and a lie", *Answer*: "...").
- **Essentials & Interests**: Lifestyle badges and interest tags.
- **Anthem**: Spotify anthem widget.

---

## 4. UI & Layout Specifications

### Desktop Container & Mobile Mockup Frame
- **Page Layout**: Subtle desktop background (dark mode or neutral grey) with the phone frame strictly centered both horizontally and vertically.
- **Smartphone Frame**:
  - Fixed dimensions mimicking a modern smartphone screen (e.g., 375px–412px width, rounded corners, soft shadow, notch/bezel styling).
  - Internal scroll container representing the app interface while keeping the outer phone frame stationary.

### Mobile Profile Screen (Inside Phone Frame)
- **Photo Carousel / Stacking**:
  - Full-width image display within the phone screen bounds.
  - Progress bar segments across the top edge indicating current photo index.
  - Interactive tap areas (left/right halves) or arrow buttons to cycle through photos.
- **Profile Content Section**:
  - Floating profile overlay containing Name, Age, and Location badge.
  - Scrollable feed below the main photo rendering the bio block and styled prompt card containers.
- **Action Bar (Simulated UI)**:
  - Fixed bottom bar inside the phone screen displaying action buttons (Pass, Like, Super Like) to maintain authentic dating app aesthetics.

---

## 5. Scope & Out-of-Scope

### In Scope
- Single-profile rendering within a desktop-hosted phone viewport mockup.
- Photo carousel controls (keyboard navigation, mouse clicks, or touch events).
- Clean, responsive inner layout mimicking iOS/Android dating app UI.

### Out of Scope
- Multiple user profiles or swiping algorithms.
- Backend server, database, or API integrations.
- Real swipe physics, analytics, or session logging. 