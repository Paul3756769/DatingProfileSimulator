# Dating Profile Preview Sandbox

[Page](https://paul3756769.github.io/DatingProfileSimulator/)

A standalone, 100% serverless, client-side web application designed to preview, craft, and fine-tune dating profiles (Tinder / Hinge style) in an authentic mobile viewport mockup.

Hosted directly via **GitHub Pages** or run locally by opening `index.html` in any browser.

---

## ✨ Features

- **100% Client-Side & Serverless**: Zero backend dependencies, zero Node.js server required. Runs directly on GitHub Pages or local `file://`.
- **Upload from Local Disk**: Drag-and-drop or pick photos and `profile.json` directly from your computer.
- **IndexedDB Photo Persistence**: Uploaded photos are stored safely in browser IndexedDB, persisting across page reloads without re-uploading.
- **Manual Photo Framing & Zoom**: Visually adjust focal position (X / Y) and zoom for each photo so faces and key elements are perfectly framed in the phone viewport.
- **Automatic Fallback**: If no images or config are found, seamlessly loads `default_photos/default_hero.jpg` and a rich example profile.
- **Full In-Browser Customization**:
  - Bio, name, age, pronouns, verified badge, job, school, location, distance
  - Dynamic Dating App Prompts (add, delete, reorder, choose from 25+ prompt ideas or type your own)
  - Essentials / Lifestyle Badges (search, height, zodiac, drinking, smoking, pets, communication, etc.)
  - Interests & Passions tags
  - Spotify Anthem widget
  - Photo Gallery ordering and captions
- **Instant JSON Export**: One-click download of your customized `profile.json` with clean relative photo paths.
- **Authentic Dating App Aesthetics**: Mobile mockup with interactive photo carousel, progress indicators, like/pass/superlike actions, and keyboard navigation (`←`/`→`, `↑`/`↓`, `X`, `L`, `S`).

---

## 🚀 How to Host on GitHub Pages

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure GitHub Pages sandbox"
   git push origin master
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub: `https://github.com/<your-username>/<repo-name>`
   - Click **Settings** (tab at the top).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `master` (or `main`) and `/ (root)`.
   - Click **Save**.

3. **Open Your Live Site**:
   - Within 1–2 minutes, GitHub Pages will deploy your site to:
     `https://<your-username>.github.io/<repo-name>/`

---

## 🛠️ Usage Guide

### Loading Your Profile & Photos
- **Load Config**: Click **Load JSON** in the top bar to select your `profile.json` file from disk (or drag-and-drop it anywhere onto the page).
- **Upload Photos**: Open **Quick Edit**, scroll to the photo manager, and drag-and-drop or select multiple photos from your disk.
- **Frame Photos**: Click **Frame** on any photo to adjust focal position and zoom.
- **Export Config**: Click **Export JSON** to save your updated configuration back to your disk.

---

## 📄 License
MIT License
