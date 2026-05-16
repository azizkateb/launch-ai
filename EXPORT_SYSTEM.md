# Export System Documentation

## Overview

The export system allows users to download generated landing pages as complete, production-ready projects in multiple frameworks:

- **HTML**: Pure static HTML/CSS/JS (no build step required)
- **React**: React 18 + Vite + TypeScript
- **Angular**: Angular 17 with standalone components

Each export is automatically compressed into a ZIP file for easy download.

## Architecture

### Service-Based Design

The export system follows a modular, service-based architecture:

```
controllers/
  exportController.js       # Request orchestration only
  
services/export/
  generator.js              # Central project orchestrator
  html.js                   # HTML project generator
  react.js                  # React project generator
  angular.js                # Angular project generator
  zip.js                    # ZIP compression utility
  
routes/
  export.js                 # Express route definitions
```

### Key Principles

1. **Single Responsibility**: Each service handles one task
   - Generators create project files
   - Zip service compresses folders
   - Controller orchestrates workflow

2. **Framework Isolation**: Each framework has its own generator
   - No cross-framework code pollution
   - Easy to add new frameworks (Vue, Svelte, etc.)

3. **No AI Logic**: Generators use provided data only
   - No image.prompt references
   - Direct image.url usage with /placeholder.jpg fallback
   - All data properly sanitized

4. **Production-Ready Output**:
   - Valid, runnable code (not pseudo-code)
   - Proper project structure
   - Includedpackage.json with correct dependencies
   - README files with setup instructions

## API Endpoints

### POST /api/export

Generate and download a landing page export.

**Request Body:**
```json
{
  "data": { /* LandingPageData object */ },
  "framework": "html" | "react" | "angular"
}
```

**Response:**
```json
{
  "success": true,
  "framework": "react",
  "downloadUrl": "http://localhost:5000/exports/project_1703456789.zip",
  "fileName": "project_1703456789.zip",
  "size": 245621
}
```

### GET /api/export/frameworks

List all supported export frameworks.

**Response:**
```json
{
  "frameworks": ["html", "react", "angular"],
  "description": "Supported export frameworks"
}
```

### GET /api/export/status

Check export system status and list recent exports.

**Response:**
```json
{
  "exportsDir": "/absolute/path/to/public/exports",
  "files": [
    {
      "name": "project_1703456789.zip",
      "path": "/exports/project_1703456789.zip",
      "size": 245621
    }
  ],
  "count": 5
}
```

## Frontend Integration

### ExportDialog Component

Located at: `frontend/src/components/ExportDialog.tsx`

Features:
- Framework selection UI
- Loading state with spinner
- Error handling and display
- Success confirmation with retry option
- Auto-download on success

### Generator Integration

The export button appears automatically after generation in the Generator component:

```tsx
{generatedContent && (
  <Button onClick={() => setShowExportDialog(true)}>
    📥 Export & Download
  </Button>
)}

<ExportDialog 
  generatedContent={generatedContent}
  isOpen={showExportDialog}
  onClose={() => setShowExportDialog(false)}
/>
```

## Generated Project Structures

### HTML Export

```
html-<timestamp>-<random>/
├── index.html          # Main page
├── style.css           # All styles
└── script.js           # Basic interactivity
```

**Features:**
- Responsive CSS Grid layout
- Full navbar/hero/sections/footer
- Hero image from `data.hero.image.url`
- Form submission handling
- No build step needed - open index.html in browser

### React Export

```
react-<timestamp>-<random>/
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Root component
│   ├── index.css       # Global styles
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Projects.jsx
│   │   ├── About.jsx
│   │   ├── Testimonials.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   └── hooks/          # Custom hooks (empty)
├── public/
│   └── index.html      # HTML shell
├── package.json        # Dependencies
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript config
└── .gitignore
```

**Features:**
- Component-based architecture
- Data injection via window.__DATA__
- Standalone components with TypeScript
- Vite for fast dev/build
- npm run dev → http://localhost:3000
- npm run build → dist/

### Angular Export

```
angular-<timestamp>-<random>/
├── src/
│   ├── main.ts         # Bootstrap entry
│   ├── index.html      # Angular shell
│   ├── styles.css      # Global styles
│   └── app/
│       ├── app.component.ts
│       ├── app.component.html
│       ├── app.component.css
│       └── components/
│           ├── navbar/
│           ├── hero/
│           ├── features/
│           ├── projects/
│           ├── about/
│           ├── testimonials/
│           ├── contact/
│           └── footer/
├── angular.json        # Angular CLI config
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── .gitignore
```

**Features:**
- Standalone components (Angular 17+)
- Property binding {{ }} for data
- Component-based structure
- ng serve → http://localhost:4200
- ng build → dist/

## Image Handling

All frameworks use the same image resolution pattern:

```javascript
// If image provided with URL:
<img src={data.hero.image?.url || "/placeholder.jpg"} />

// If image missing or invalid:
<img src="/placeholder.jpg" />
```

**Important**: 
- No image.prompt references anywhere
- Direct image.url usage only
- Fallback to /placeholder.jpg always safe

## Data Normalization

The generators handle missing/malformed data gracefully:

1. **Testimonials**:
   - Default name: "Anonymous"
   - Content truncated to 420 chars
   - Initials pre-generated from name

2. **Sections**:
   - Fallback: data.sections.* or data.*
   - Empty arrays if missing
   - Title defaults to section name

3. **Images**:
   - Type, URL, alt validated
   - Fallback to /placeholder.jpg
   - No broken images

## Server Configuration

### Body Size Limit

Default: 25mb (configurable)

```javascript
// Set via environment variable
BODY_LIMIT=50mb npm start
```

Needed for:
- Base64 image uploads in generation requests
- Large JSON data in export requests

### Static File Serving

```
/uploads/         → backend/public/uploads/
/exports/         → backend/public/exports/
```

Directories created automatically on first use.

## Error Handling

### Generator Errors

```
❌ "Unsupported framework: vue"
✓ Supported: html, react, angular
```

### Missing Data Errors

```
❌ "Missing required field: data"
❌ "Missing required field: framework"
```

### File System Errors

```
❌ "Folder not found: /path/to/folder"
❌ "Failed to write zip: permission denied"
```

All errors logged to console and returned to client.

## Performance

- HTML generation: ~50ms
- React generation: ~150ms
- Angular generation: ~150ms
- ZIP compression: ~500ms (depends on size)
- Total request time: <1-2 seconds

## Cleanup

Temporary project folders are automatically cleaned up after ZIP creation:

```javascript
// Cleanup is non-blocking
setImmediate(async () => {
  await cleanupFolder(folderPath);
});
```

Only ZIP files persist in `/public/exports/`.

## Adding New Frameworks

To add a new framework (e.g., Vue):

1. **Create generator**: `services/export/vue.js`

```javascript
export async function generateVueProject(data, outputDir) {
  // Create project structure
  // Write all files
  return outputDir;
}
```

2. **Register framework**: Update `services/export/generator.js`

```javascript
import { generateVueProject } from "./vue.js";

const FRAMEWORKS = {
  // ... existing frameworks
  vue: {
    name: "vue",
    generator: generateVueProject,
    folderName: (timestamp) => `vue-${timestamp}`,
  },
};
```

3. **Test**: `POST /api/export` with `{"data": {...}, "framework": "vue"}`

That's it! The controller and ZIP logic work with any generator.

## Testing Export Locally

### Using cURL

```bash
curl -X POST http://localhost:5000/api/export \
  -H "Content-Type: application/json" \
  -d '{
    "framework": "react",
    "data": {
      "navbar": {"logo": {"text": "MyApp"}},
      "hero": {"title": "Welcome", "image": {"url": "https://..."}},
      "features": [
        {"title": "Feature 1", "description": "Desc 1"}
      ]
    }
  }'
```

### Using Frontend

1. Generate a landing page in UI
2. Click "📥 Export & Download"
3. Select framework
4. Click "Export & Download"
5. ZIP automatically downloads

## Troubleshooting

### Export button not showing
- Ensure landing page generation succeeded
- Check browser console for errors
- Verify `generatedContent` state is set

### Download fails with 413
- Increase `BODY_LIMIT` environment variable
- Default 25mb should handle most projects

### Missing files in export
- Check `/public/exports/` directory exists
- Verify write permissions on /public/exports/
- Check disk space available

### Generator produces invalid code
- Verify data structure matches LandingPageData type
- Check all strings are properly sanitized
- Test with minimal data first

## Future Enhancements

Potential improvements:

1. **More Frameworks**: Vue, Svelte, Next.js, Remix
2. **Customization**: Branding, domain routing, CMS integration
3. **Hosting**: Direct deploy to Vercel/Netlify buttons
4. **Analytics**: Tracking exports, framework popularity
5. **Preview**: In-browser preview before export
6. **Batch Export**: Download all frameworks at once

## Version History

- **v1.0** (Initial): HTML, React, Angular support with ZIP download
