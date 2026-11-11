/**
 * Minimal Interactive Dating Profile Local Server
 * 
 * Provides:
 * - Static file serving (index.html, photos, profile.json)
 * - Persistent Bio and Profile editing (saved directly to profile.json on disk)
 * - Interactive photo upload (saved directly to photos/ on disk)
 * - Interactive photo deletion (removed from photos/ and profile.json)
 * - Zero external dependencies (built on standard Node.js libraries)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;
const PHOTOS_DIR = path.join(ROOT_DIR, 'photos');
const PROFILE_FILE = path.join(ROOT_DIR, 'profile.json');
const EXAMPLE_FILE = path.join(ROOT_DIR, 'profile.example.json');

// Ensure photos directory exists
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

// Ensure profile.json exists (initialize from example if missing)
if (!fs.existsSync(PROFILE_FILE)) {
  if (fs.existsSync(EXAMPLE_FILE)) {
    fs.copyFileSync(EXAMPLE_FILE, PROFILE_FILE);
  } else {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify({
      name: "Alex",
      age: 27,
      bio: "Add your bio here...",
      imageOrder: [],
      photos: []
    }, null, 2));
  }
}

/**
 * Read current profile from profile.json
 */
function readProfile() {
  try {
    if (fs.existsSync(PROFILE_FILE)) {
      const content = fs.readFileSync(PROFILE_FILE, 'utf8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading profile.json:', err.message);
  }
  return {};
}

/**
 * Save profile object to profile.json
 */
function saveProfile(data) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving profile.json:', err.message);
    return false;
  }
}

/**
 * MIME types dictionary
 */
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

/**
 * Parse incoming JSON body
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    if (req.headers['content-length'] === '0') {
      resolve({});
      return;
    }
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // 50MB max body limit for large photo uploads
      if (body.length > 50 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Request payload too large (max 50MB)'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        reject(new Error('Invalid JSON: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate'
  });
  res.end(JSON.stringify(data));
}

/**
 * Serve static file
 */
function serveStaticFile(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      sendJson(res, 404, { success: false, error: 'File not found' });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
}

/**
 * Main Request Handler
 */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS headers for local flexibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // API: Get Status / Health
  // -------------------------------------------------------------
  if (pathname === '/api/status' && method === 'GET') {
    sendJson(res, 200, {
      success: true,
      mode: 'interactive',
      uptime: process.uptime(),
      persistent: true
    });
    return;
  }

  // -------------------------------------------------------------
  // API: Get Profile
  // -------------------------------------------------------------
  if (pathname === '/api/profile' && method === 'GET') {
    const profile = readProfile();
    sendJson(res, 200, { success: true, profile });
    return;
  }

  // -------------------------------------------------------------
  // API: Update Profile (Persistent Bio & Text Changes)
  // -------------------------------------------------------------
  if (pathname === '/api/profile' && (method === 'POST' || method === 'PUT')) {
    try {
      const updates = await parseJsonBody(req);
      const current = readProfile();

      // Safely merge updates
      const updated = Object.assign({}, current, updates);
      
      // Ensure photos & imageOrder stay synchronized
      if (Array.isArray(updates.imageOrder)) {
        updated.imageOrder = updates.imageOrder;
      }
      if (Array.isArray(updates.photos)) {
        updated.photos = updates.photos;
      }

      if (saveProfile(updated)) {
        sendJson(res, 200, {
          success: true,
          message: 'Profile saved permanently to disk',
          profile: updated
        });
      } else {
        sendJson(res, 500, { success: false, error: 'Failed to write profile.json' });
      }
    } catch (err) {
      sendJson(res, 400, { success: false, error: err.message });
    }
    return;
  }

  // -------------------------------------------------------------
  // API: Photo Upload
  // -------------------------------------------------------------
  if (pathname === '/api/photos/upload' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { filename, data, caption } = body;

      if (!filename || !data) {
        sendJson(res, 400, { success: false, error: 'Missing filename or data' });
        return;
      }

      // Extract Base64 binary
      let base64Data = data;
      const commaIdx = data.indexOf(',');
      if (commaIdx !== -1) {
        base64Data = data.slice(commaIdx + 1);
      }
      const buffer = Buffer.from(base64Data, 'base64');

      // Sanitize filename
      const originalExt = path.extname(filename).toLowerCase() || '.jpg';
      const baseName = path.basename(filename, originalExt).replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeFilename = `${Date.now()}_${baseName}${originalExt}`;
      const destPath = path.join(PHOTOS_DIR, safeFilename);

      // Write photo file to photos/
      fs.writeFileSync(destPath, buffer);

      // Update profile.json
      const relativeUrl = `photos/${safeFilename}`;
      const profile = readProfile();
      profile.photos = profile.photos || [];
      profile.imageOrder = profile.imageOrder || [];

      const newPhotoObj = { url: relativeUrl, caption: caption || "" };
      profile.photos.push(newPhotoObj);
      profile.imageOrder.push(relativeUrl);

      saveProfile(profile);

      sendJson(res, 200, {
        success: true,
        message: 'Photo uploaded and saved successfully',
        photo: newPhotoObj,
        profile
      });
    } catch (err) {
      console.error('Upload error:', err);
      sendJson(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // -------------------------------------------------------------
  // API: Photo Delete
  // -------------------------------------------------------------
  if (pathname === '/api/photos' && method === 'DELETE') {
    try {
      let targetUrl = parsedUrl.query.url;
      if (!targetUrl) {
        const body = await parseJsonBody(req);
        targetUrl = body.url;
      }

      if (!targetUrl) {
        sendJson(res, 400, { success: false, error: 'Missing photo url parameter' });
        return;
      }

      // Security check: ensure path does not escape photos directory
      const cleanPath = targetUrl.replace(/^[/\\]+/, '');
      const fullPath = path.resolve(ROOT_DIR, cleanPath);
      const photosResolved = path.resolve(PHOTOS_DIR);

      if (!fullPath.startsWith(photosResolved)) {
        sendJson(res, 403, { success: false, error: 'Forbidden: invalid photo path' });
        return;
      }

      // Delete file from disk if it exists
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
        } catch (unlinkErr) {
          console.warn('Could not delete physical file:', unlinkErr.message);
        }
      }

      // Remove from profile.json
      const profile = readProfile();
      if (Array.isArray(profile.photos)) {
        profile.photos = profile.photos.filter(p => {
          const u = typeof p === 'string' ? p : p.url;
          return u !== targetUrl && u !== cleanPath;
        });
      }
      if (Array.isArray(profile.imageOrder)) {
        profile.imageOrder = profile.imageOrder.filter(u => u !== targetUrl && u !== cleanPath);
      }

      saveProfile(profile);

      sendJson(res, 200, {
        success: true,
        message: 'Photo deleted permanently',
        profile
      });
    } catch (err) {
      console.error('Delete error:', err);
      sendJson(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // -------------------------------------------------------------
  // API: Photo Reorder
  // -------------------------------------------------------------
  if (pathname === '/api/photos/reorder' && method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { imageOrder } = body;

      if (!Array.isArray(imageOrder)) {
        sendJson(res, 400, { success: false, error: 'imageOrder must be an array' });
        return;
      }

      const profile = readProfile();
      profile.imageOrder = imageOrder;

      // Reorder photos array to match imageOrder
      if (Array.isArray(profile.photos)) {
        const photoMap = new Map();
        profile.photos.forEach(p => {
          const u = typeof p === 'string' ? p : p.url;
          photoMap.set(u, typeof p === 'string' ? { url: p, caption: '' } : p);
        });

        const ordered = [];
        imageOrder.forEach(u => {
          if (photoMap.has(u)) {
            ordered.push(photoMap.get(u));
            photoMap.delete(u);
          } else {
            ordered.push({ url: u, caption: '' });
          }
        });
        photoMap.forEach(p => ordered.push(p));
        profile.photos = ordered;
      }

      saveProfile(profile);
      sendJson(res, 200, { success: true, profile });
    } catch (err) {
      sendJson(res, 500, { success: false, error: err.message });
    }
    return;
  }

  // -------------------------------------------------------------
  // STATIC FILE SERVING
  // -------------------------------------------------------------
  let reqPath = pathname;
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  // Prevent directory traversal
  const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(ROOT_DIR, safePath);

  // Check if file is within ROOT_DIR
  if (!filePath.startsWith(ROOT_DIR)) {
    sendJson(res, 403, { success: false, error: 'Forbidden' });
    return;
  }

  serveStaticFile(req, res, filePath);
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🔥 Dating Profile Sandbox (Interactive Mode)`);
  console.log(`======================================================`);
  console.log(`📍 Web URL:      http://localhost:${PORT}`);
  console.log(`💾 Data File:    profile.json (Persistent & Git-ignored)`);
  console.log(`📁 Photos Dir:   photos/ (Persistent & Git-ignored)`);
  console.log(`🔒 Privacy:      Zero private info tracked in git`);
  console.log(`======================================================\n`);
});
