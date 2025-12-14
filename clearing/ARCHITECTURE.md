# Clearing Page Architecture Plan

## Requirements Summary
- **Two States**: Load (artifacts visible) → Focus (centered column with text + scaled artifact)
- **Infinite Canvas**: Pan capability (zoom removed for simplicity)
- **Interactive Artifacts**: Click + drag to reposition before selection
- **Focus Mode**: Click artifact → opens centered column, scales to fill width, shows blurb above
- **Per-Artifact Width**: Each artifact has `focusWidth` percentage (0-100) for column width
- **Maintainable**: Easy to add/remove/update artifacts via JSON
- **Scalable**: Simple architecture that doesn't get complex as it grows

---

## High-Level Approach Options

### Option 1: **Vanilla JS + Interact.js** ⭐ RECOMMENDED
**Pros:**
- Lightweight (~20KB)
- Excellent drag physics (momentum, constraints, snapping)
- Works with DOM elements (easier to style/maintain)
- No framework overhead
- Perfect for Figma-like interactions
- Easy to persist positions (localStorage/JSON)

**Cons:**
- Need to handle pan/zoom separately (panzoom library)
- More manual state management

**Best for:** Your use case - simple, performant, maintainable

---

### Option 2: **Fabric.js or Konva.js** (Canvas-based)
**Pros:**
- Full control over rendering
- Built-in pan/zoom
- Good performance for many objects

**Cons:**
- Canvas = harder to style with CSS
- More complex API
- Overkill for 7-20 images
- Harder to maintain (everything is programmatic)

**Best for:** Complex graphics, many objects (100+), custom rendering needs

---

### Option 3: **React + react-zoom-pan-pinch + react-draggable**
**Pros:**
- Component-based (easy to add/remove artifacts)
- React ecosystem
- Good state management

**Cons:**
- Framework overhead for a single page
- More complex build setup
- Heavier bundle size

**Best for:** If you're already using React elsewhere

---

### Option 4: **Paper.js** (Vector graphics)
**Pros:**
- Beautiful vector interactions
- Great for graphics-heavy projects

**Cons:**
- Overkill for images
- Steeper learning curve
- Canvas-based (CSS limitations)

**Best for:** Vector art, complex graphics, animation-heavy

---

## Recommended Architecture: Option 1 (Vanilla JS + Libraries)

### Core Libraries
1. **Interact.js** - Drag physics for artifacts
2. **Vanilla JS** - State management, transitions, pan handling

### Why This Works Best
- ✅ **Simple**: DOM elements = easy CSS styling
- ✅ **Maintainable**: Data-driven (JSON config for artifacts)
- ✅ **Performant**: Lightweight, smooth 60fps
- ✅ **Figma-like**: Interact.js has momentum, snapping, constraints
- ✅ **Scalable**: Add artifacts = add JSON entry

---

## Architecture Design

### File Structure
```
clearing/
├── index.html
├── styles.css
├── script.js
├── artifacts.json          # Data source for all artifacts
└── artifacts/              # Image folder
    ├── artifact-1.png
    ├── artifact-2.png
    └── ...
```

### Data Model (artifacts.json)
**Key Principle: Store only canonical world transforms + metadata. No derived UI state.**

```json
{
  "artifacts": [
    {
      "id": "artifact-1",
      "label": "Project Alpha",
      "blurb": "Two-sentence description of the artifact",
      "x": 0,           // World position (number, not CSS string)
      "y": 0,           // World position (number, not CSS string)
      "rotation": 15,   // Degrees (number)
      "z": 0,           // Z-order (number, deterministic)
      "width": 150,     // Dimensions
      "height": 150,
      "color": "#ff0000", // For colored boxes (or image path for images)
      "focusWidth": 50  // Percentage (0-100) of viewport width for focus column
    },
    // ... more artifacts
  ]
}
```

**What NOT to store:**
- ❌ `focusedScale`, `focusedPosition` (derived UI state)
- ❌ CSS transform strings (generate at render time)
- ❌ View-specific transforms (handle in view layer)

### State Management
```javascript
const state = {
  mode: 'load' | 'focus',
  focusedArtifact: null,
  artifacts: [], // Loaded from JSON (canonical transforms only)
  canvasTransform: { x: 0, y: 0 }, // Pan transform (no scale - zoom removed)
  zCounter: 0 // Increments on "bring to front"
}
```

**Critical Separation:**
- **World Transform** (in artifact data): Canonical position/rotation - NEVER mutated by focus mode
- **Focus Container**: Separate DOM container - clones artifact, doesn't touch original

### Component Structure
1. **Canvas Container** - Infinite scrollable area with pan
2. **Artifact Component** - Draggable image/box with position/rotation
3. **Focus Overlay** - Semi-transparent backdrop (blur + opacity)
4. **Focus Container** - Centered column holding cloned artifact + text (siblings in DOM)
5. **State Manager** - Handles transitions between states

---

## Implementation Strategy

## Implementation Status

### ✅ Completed
- **Foundation**: Canvas with pan (zoom removed for simplicity)
- **Artifact Loading**: JSON-based, canonical transforms only
- **Dragging**: Interact.js with 1:1 coordinate mapping
- **Focus State**: Separate container approach - clones artifact, simple DOM stacking
- **Per-Artifact Width**: Each artifact has `focusWidth` percentage for column width
- **Text Labels**: 1.5rem Times, positioned above artifact in focus container
- **Background Fade**: Semi-transparent overlay mask + non-focused artifacts at 30% opacity
- **Exit Focus**: Click anywhere (including content) or ESC key
- **Scrolling**: Focus container scrolls if content is tall

### 🔄 In Progress / Future
- Image artifacts (currently using colored boxes)
- Position persistence (localStorage)
- Mobile touch support

---

## Key Implementation Details

### Transform Architecture (CRITICAL)

**Principle: Numbers → CSS at render time, never store CSS strings**

```javascript
// Artifact data (canonical)
{
  x: 100,        // number
  y: 200,        // number
  rotation: 15,  // number (degrees)
  z: 0           // number (z-index base)
}

// Render function (generates CSS)
function renderArtifact(artifact, viewTransform = null) {
  const worldTransform = {
    x: artifact.x,
    y: artifact.y,
    rotation: artifact.rotation,
    scale: 1
  };
  
  // Apply view transform if in focus mode (doesn't mutate artifact)
  const finalTransform = viewTransform 
    ? applyViewTransform(worldTransform, viewTransform)
    : worldTransform;
  
  // Generate CSS string at render time
  element.style.transform = `
    translate(${finalTransform.x}px, ${finalTransform.y}px)
    rotate(${finalTransform.rotation}deg)
    scale(${finalTransform.scale})
  `;
  element.style.zIndex = artifact.z + (viewTransform ? 1000 : 0);
}
```

**Focus Mode:**
- Focus creates a **view transform** (separate object)
- World transform **never mutates** during focus
- Render applies view transform on top of world transform
- Exit focus = discard view transform, render world transform only

### Coordinate Math

**Simplified: 1:1 pixel mapping (zoom removed)**

```javascript
// Convert screen coordinates to world coordinates
function screenToWorld(screenX, screenY) {
  return {
    x: screenX - canvasTransform.x,
    y: screenY - canvasTransform.y
  };
}

// Convert world coordinates to screen coordinates
function worldToScreen(worldX, worldY) {
  return {
    x: worldX + canvasTransform.x,
    y: worldY + canvasTransform.y
  };
}
```

### Canvas & Panning
- Pan-only (zoom removed for simplicity)
- Transform the container, not individual artifacts
- Artifacts positioned absolutely within container
- Drag uses direct pixel movement (no scale conversion)

### Focus State Implementation (Current Architecture)

**Focus Container Approach:**
- Separate `#focus-container` DOM element (fixed position, z-index 2001)
- When entering focus: clone artifact element, add to container with text as siblings
- Simple flexbox column: text first, artifact below
- Original artifact hidden (opacity 0), not removed from canvas
- Same DOM plane - no z-index complexity

**Scaling & Layout:**
- Column width: `focusWidth` percentage of viewport (default 50%)
- Gutters: `(100 - focusWidth) / 2` on each side (centered)
- Artifact scales to fill column width, maintains aspect ratio
- Text: 1.5rem Times, full column width
- Container: flexbox column, scrollable if content is tall

**Interaction:**
- Click anywhere in focus container (including content) exits focus
- ESC key exits focus
- Original artifact world transform never mutated

### Z-Order (Deterministic)

```javascript
class ZOrderManager {
  constructor() {
    this.counter = 0;
  }
  
  bringToFront(artifact) {
    artifact.z = ++this.counter;
    this.render(); // Re-render to update z-index
  }
  
  render() {
    // Sort by z, assign CSS z-index
    this.artifacts
      .sort((a, b) => a.z - b.z)
      .forEach((artifact, index) => {
        artifact.element.style.zIndex = index;
      });
  }
}
```

### State Transitions
- CSS transitions for smooth animations
- **View transform** for focus state (doesn't mutate world data)
- Overlay for focus state (backdrop blur/opacity)
- Exit = discard view transform

### Maintainability
- **Single source of truth**: artifacts.json (canonical transforms only)
- **Separation of concerns**: Data (world) → View (render) → Interact
- **Easy updates**: Edit JSON, refresh page
- **No magic numbers**: All config in JSON
- **No derived state in data**: View transforms computed at render time

---

## Code Organization

```javascript
// script.js structure
class ArtifactGallery {
  constructor() {
    this.state = { 
      mode: 'load', 
      focusedArtifact: null,
      viewTransform: null // Separate from world transforms
    };
    this.artifacts = []; // Canonical world transforms only
    this.canvas = null;
    this.canvasTransform = { x: 0, y: 0, scale: 1 };
    this.zCounter = 0;
  }
  
  async init() {
    await this.loadArtifacts();
    this.setupCanvas();
    this.render(); // Single render function
    this.setupInteractions();
  }
  
  loadArtifacts() { 
    // Load from JSON, store canonical transforms (numbers only)
  }
  
  setupCanvas() { 
    // Initialize pan, track canvasTransform (no zoom)
  }
  
  render() {
    // Single render function
    // Converts number transforms → CSS strings
    // Applies view transform if in focus mode
    // Updates z-index deterministically
  }
  
  setupInteractions() { 
    // Interact.js setup for dragging
    // Click handlers for focus mode
    // ESC key and click-outside to exit focus
  }
  
  enterFocusMode(artifact) { 
    // Get focusWidth from artifact (default 50%)
    // Calculate column width and gutters
    // Clone artifact element
    // Scale clone to fill column width (maintain aspect ratio)
    // Create text label element
    // Add both to focus container (text first, artifact below)
    // Hide original artifact (opacity 0)
    // Fade other artifacts (opacity 0.3)
    // Show overlay and focus container
  }
  
  exitFocusMode() { 
    // Hide focus container and overlay
    // Clear focus container content
    // Restore all artifacts to full opacity
    // Re-render canvas
  }
  
  // Coordinate helpers
  screenToWorld(screenX, screenY) { /* ... */ }
  worldToScreen(worldX, worldY) { /* ... */ }
  
  // Transform helpers
  applyViewTransform(worldTransform, viewTransform) { /* ... */ }
  transformToCSS(transform) { /* numbers → CSS string */ }
}
```

**Key Principles:**
1. **Single render function** - One place that converts numbers → CSS
2. **View transform separate** - Never mutate world data for UI state
3. **Coordinate math helpers** - Screen ↔ World conversion
4. **Deterministic z-order** - Counter-based system

---

## Current Implementation

- ✅ Vanilla JS + Interact.js
- ✅ JSON-based artifact loading
- ✅ Pan-only canvas (zoom removed)
- ✅ Draggable artifacts with 1:1 coordinate mapping
- ✅ Focus container approach (separate DOM, cloned artifacts)
- ✅ Per-artifact focus width (focusWidth percentage)
- ✅ Text labels (1.5rem Times)
- ✅ Background fade (overlay + opacity)
- ✅ Smooth transitions (0.4s cubic-bezier)
- ✅ Click anywhere to exit focus

---

## Core Principles

1. ✅ **No derived UI in artifact data** - Store only canonical world transforms + metadata
2. ✅ **Focus never mutates world transform** - Use separate container with cloned artifact
3. ✅ **Transforms as numbers** - Generate CSS strings at render time only
4. ✅ **One renderer (DOM)** - Start simple, optimize only if needed
5. ✅ **Deterministic z-order** - Counter-based system with "bring to front"
6. ✅ **Simplified coordinates** - 1:1 pixel mapping (zoom removed)
7. ✅ **Simple DOM structure** - Focus container uses siblings, not complex transforms

## Decisions Made

- **Zoom**: Removed for simplicity (1:1 coordinate mapping)
- **Background Fade**: Semi-transparent overlay mask + opacity fade (not just fading objects)
- **Focus Architecture**: Separate container with cloned artifact (not view transform overlay)
- **Focus Width**: Per-artifact `focusWidth` percentage (default 50%)
- **Text**: 1.5rem Times, positioned above artifact in same container
- **Transitions**: 0.4s cubic-bezier for smooth animations
- **Click to Exit**: Clicking anywhere (including content) exits focus

---

## Prompt Notes (For Recreating This Implementation)

### Key Architecture Decisions

1. **Focus Container Approach** (not view transform overlay)
   - Separate DOM container (`#focus-container`) for focus state
   - Clone artifact element when entering focus (don't mutate original)
   - Text and artifact are siblings in same container (simple stacking)
   - Original artifact hidden but kept in canvas DOM
   - Benefits: Simple DOM structure, no z-index complexity, natural scrolling

2. **Per-Artifact Focus Width**
   - Each artifact has `focusWidth` property (0-100 percentage)
   - Calculates equal gutters: `(100 - focusWidth) / 2`
   - Sets container padding dynamically based on gutters
   - Artifact scales to fill column width, maintains aspect ratio

3. **Coordinate System**
   - 1:1 pixel mapping (zoom removed)
   - Artifacts positioned by center point (offset by half width/height)
   - Drag uses direct pixel movement (no scale conversion)

4. **State Management**
   - World transforms stored in artifact data (never mutated)
   - Focus state uses separate container (doesn't touch world data)
   - Single render function converts numbers → CSS

### Implementation Checklist

- [ ] Canvas with pan (no zoom)
- [ ] Artifacts load from JSON with canonical transforms
- [ ] Interact.js for dragging (1:1 coordinate mapping)
- [ ] Click artifact → enter focus mode
- [ ] Focus container: centered column with dynamic width
- [ ] Clone artifact, scale to fill column width
- [ ] Text label (1.5rem Times) above artifact
- [ ] Overlay backdrop (blur + opacity)
- [ ] Non-focused artifacts fade to 30% opacity
- [ ] Click anywhere → exit focus mode
- [ ] ESC key exits focus
- [ ] Focus container scrolls if content is tall

### Critical Code Patterns

**Enter Focus:**
```javascript
// Get focusWidth, calculate gutters
// Clone artifact element
// Scale clone to column width
// Create text element
// Add both to focus container
// Hide original, fade others
```

**Exit Focus:**
```javascript
// Hide focus container
// Clear content
// Restore all artifacts to full opacity
// Re-render
```

**Render:**
```javascript
// Convert world transform numbers → CSS
// Skip focused artifact (it's in focus container)
// Apply transforms to canvas artifacts only
```

