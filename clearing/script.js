class ArtifactGallery {
  constructor() {
    this.state = {
      mode: 'load',
      focusedArtifact: null,
      viewTransform: null
    };
    this.artifacts = [];
    this.canvasTransform = { x: 0, y: 0 };
    this.zCounter = 0;
    this.canvas = null;
    this.canvasContainer = null;
  }

  async init() {
    await this.loadArtifacts();
    this.setupCanvas();
    // Wait for canvas setup to complete before rendering
    requestAnimationFrame(() => {
      this.render();
      // Setup interactions after render so elements exist
      requestAnimationFrame(() => {
        this.setupInteractions();
      });
    });
  }

  async loadArtifacts() {
    try {
      const response = await fetch('/clearing/artifacts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.artifacts = data.artifacts.map(artifact => ({
        ...artifact,
        element: null // Will be created in render
      }));
      this.zCounter = Math.max(...this.artifacts.map(a => a.z), 0);
      console.log('Loaded artifacts:', this.artifacts.length);
    } catch (error) {
      console.error('Error loading artifacts:', error);
    }
  }

  setupCanvas() {
    this.canvasContainer = document.getElementById('canvas-container');
    this.canvas = document.getElementById('canvas');
    
    if (!this.canvasContainer || !this.canvas) {
      console.error('Canvas elements not found!');
      return;
    }
    
    // Wait for layout to calculate proper dimensions
    requestAnimationFrame(() => {
      const rect = this.canvasContainer.getBoundingClientRect();
      // Center the canvas on the first artifact (at 0,0)
      this.canvasTransform.x = rect.width / 2;
      this.canvasTransform.y = rect.height / 2;
      this.updateCanvasTransform();
      
      console.log('Canvas setup complete:', {
        containerSize: { width: rect.width, height: rect.height },
        transform: this.canvasTransform
      });
    });
    
    // Panning disabled - only artifacts move
  }

  updateCanvasTransform() {
    this.canvas.style.transform = `translate(${this.canvasTransform.x}px, ${this.canvasTransform.y}px)`;
    this.render(); // Re-render artifacts with new canvas transform
  }

  // Convert screen coordinates to world coordinates
  screenToWorld(screenX, screenY) {
    return {
      x: screenX - this.canvasTransform.x,
      y: screenY - this.canvasTransform.y
    };
  }

  // Convert world coordinates to screen coordinates
  worldToScreen(worldX, worldY) {
    return {
      x: worldX + this.canvasTransform.x,
      y: worldY + this.canvasTransform.y
    };
  }

  // Transform numbers to CSS string
  transformToCSS(transform) {
    return `
      translate(${transform.x}px, ${transform.y}px)
      rotate(${transform.rotation}deg)
      scale(${transform.scale || 1})
    `;
  }

  // Apply view transform on top of world transform
  applyViewTransform(worldTransform, viewTransform) {
    if (!viewTransform) return worldTransform;
    
    return {
      x: worldTransform.x + viewTransform.x,
      y: worldTransform.y + viewTransform.y,
      rotation: worldTransform.rotation + (viewTransform.rotation || 0),
      scale: (worldTransform.scale || 1) * (viewTransform.scale || 1)
    };
  }

  render() {
    if (!this.canvas || this.artifacts.length === 0) {
      console.log('Cannot render:', {
        hasCanvas: !!this.canvas,
        artifactCount: this.artifacts.length
      });
      return;
    }

    console.log('Rendering', this.artifacts.length, 'artifacts');

    // Sort by z-order
    const sortedArtifacts = [...this.artifacts].sort((a, b) => a.z - b.z);

    sortedArtifacts.forEach((artifact, index) => {
      // Create element if it doesn't exist
      if (!artifact.element) {
        artifact.element = document.createElement('div');
        artifact.element.className = 'artifact';
        artifact.element.id = artifact.id;
        
        const box = document.createElement('div');
        box.className = 'artifact-box';
        box.style.width = artifact.width + 'px';
        box.style.height = artifact.height + 'px';
        box.style.backgroundColor = artifact.color;
        artifact.element.appendChild(box);
        
        this.canvas.appendChild(artifact.element);
        console.log('Created element for', artifact.id);
      }

      // Get world transform (canonical, never mutated by focus)
      const worldTransform = {
        x: artifact.x - (artifact.width / 2),
        y: artifact.y - (artifact.height / 2),
        rotation: artifact.rotation || 0,
        scale: 1
      };

      // In focus mode, the focused artifact is being animated to focus state
      // Don't override its transform (it's being animated in enterFocusMode)
      if (this.state.mode === 'focus' && this.state.focusedArtifact?.id === artifact.id) {
        // Transform is being handled by enterFocusMode animation
        return;
      }

      // Generate CSS from numbers
      const cssTransform = this.transformToCSS(worldTransform);
      artifact.element.style.transform = cssTransform;
      artifact.element.style.zIndex = index;
      
      // Only set opacity/pointerEvents in normal mode (focus mode handles its own)
      if (this.state.mode === 'load') {
        artifact.element.style.opacity = '1';
        artifact.element.style.pointerEvents = 'auto';
      }
      
      console.log(`Rendered ${artifact.id} at`, worldTransform, 'CSS:', cssTransform);
    });
  }

  setupInteractions() {
    this.artifacts.forEach(artifact => {
      if (!artifact.element) return;

      let wasDragging = false;

      // Use Interact.js for dragging
      interact(artifact.element)
        .draggable({
          listeners: {
            start: (event) => {
              // Don't allow dragging in focus mode
              if (this.state.mode === 'focus') {
                event.preventDefault();
                return;
              }
              wasDragging = false;
              artifact.element.classList.add('dragging');
              // Bring to front when dragging starts
              this.bringToFront(artifact);
            },
            move: (event) => {
              // Don't allow dragging in focus mode
              if (this.state.mode === 'focus') {
                return;
              }
              wasDragging = true; // Mark that we actually dragged
              // Get current world position
              const currentWorldX = artifact.x;
              const currentWorldY = artifact.y;
              
              // Drag delta is already in world coordinates (1:1 mapping)
              const deltaWorldX = event.dx;
              const deltaWorldY = event.dy;
              
              // Update artifact's world position (canonical transform)
              artifact.x = currentWorldX + deltaWorldX;
              artifact.y = currentWorldY + deltaWorldY;
              
              // Re-render
              this.render();
            },
            end: (event) => {
              artifact.element.classList.remove('dragging');
            }
          }
        });

      // Click handler for focus mode (only if not dragging)
      artifact.element.addEventListener('click', (e) => {
        // Don't focus if we just dragged
        if (wasDragging) {
          wasDragging = false;
          return;
        }
        
        if (this.state.mode === 'load') {
          e.stopPropagation(); // Prevent bubbling to exit handler
          this.enterFocusMode(artifact);
        } else if (this.state.mode === 'focus') {
          // In focus mode, clicking any artifact exits focus
          e.stopPropagation(); // Prevent double-trigger
          this.exitFocusMode();
        }
      });
    });

    // Click anywhere to exit focus mode (handled by focus container now)
    // Keep overlay click handler for clicking outside container
    const handleClick = (e) => {
      if (this.state.mode === 'focus') {
        // Only exit if clicking overlay (not container, which has its own handler)
        if (!e.target.closest('#focus-container')) {
          this.exitFocusMode();
        }
      }
    };

    // Click on overlay to exit
    const overlay = document.getElementById('focus-overlay');
    if (overlay) {
      overlay.addEventListener('click', handleClick);
    }

    // Click on canvas container to exit
    this.canvasContainer.addEventListener('click', handleClick);
    
    // Click anywhere in focus container to exit
    const focusContainer = document.getElementById('focus-container');
    if (focusContainer) {
      focusContainer.addEventListener('click', (e) => {
        // Clicking anywhere (including content) exits focus
        if (this.state.mode === 'focus') {
          this.exitFocusMode();
        }
      });
    }

    // ESC key to exit focus mode
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.mode === 'focus') {
        this.exitFocusMode();
      }
    });
  }

  bringToFront(artifact) {
    artifact.z = ++this.zCounter;
    this.render();
  }

  enterFocusMode(artifact) {
    this.state.mode = 'focus';
    this.state.focusedArtifact = artifact;
    
    const focusContainer = document.getElementById('focus-container');
    const overlay = document.getElementById('focus-overlay');
    
    if (!focusContainer || !overlay) return;
    
    // Show overlay immediately
    overlay.classList.add('active');
    
    // Get focus width percentage from artifact (default to 50% if not specified)
    const focusWidthPercent = artifact.focusWidth || 50;
    const gutterPercent = (100 - focusWidthPercent) / 2; // Equal gutters on each side
    
    // Calculate column width based on artifact's focusWidth percentage
    const rect = this.canvasContainer.getBoundingClientRect();
    const columnWidth = rect.width * (focusWidthPercent / 100);
    
    // Clone the artifact element for focus view
    const artifactClone = artifact.element.cloneNode(true);
    artifactClone.classList.add('focus-artifact');
    
    // Calculate scale to fill column width (maintain aspect ratio)
    const scale = columnWidth / artifact.width;
    const scaledHeight = artifact.height * scale;
    
    // Set explicit dimensions to fill column
    artifactClone.style.width = columnWidth + 'px';
    artifactClone.style.height = scaledHeight + 'px';
    artifactClone.style.maxWidth = '100%';
    artifactClone.style.transform = `rotate(0deg)`; // Straighten it
    
    // Update the inner box to fill the clone (override fixed pixel dimensions)
    const box = artifactClone.querySelector('.artifact-box');
    if (box) {
      box.style.width = '100%';
      box.style.height = '100%';
    }
    
    // Set container padding based on calculated gutters
    focusContainer.style.paddingLeft = gutterPercent + '%';
    focusContainer.style.paddingRight = gutterPercent + '%';
    
    // Create text label
    const label = document.createElement('div');
    label.className = 'focus-label';
    label.textContent = artifact.blurb || artifact.label;
    
    // Add to focus container (text first, then artifact - simple stack)
    focusContainer.innerHTML = ''; // Clear any previous content
    focusContainer.appendChild(label);
    focusContainer.appendChild(artifactClone);
    focusContainer.classList.add('active');
    
    // Hide the original artifact immediately
    artifact.element.style.opacity = '0';
    artifact.element.style.pointerEvents = 'none';
    
    // Fade other artifacts immediately
    this.artifacts.forEach(a => {
      if (a.id !== artifact.id && a.element) {
        a.element.style.opacity = '0.3';
        a.element.style.pointerEvents = 'none';
      }
    });
  }

  exitFocusMode() {
    this.state.mode = 'load';
    this.state.focusedArtifact = null;
    this.state.viewTransform = null;
    
    // Hide focus container and overlay immediately
    const focusContainer = document.getElementById('focus-container');
    const overlay = document.getElementById('focus-overlay');
    
    if (focusContainer) {
      focusContainer.classList.remove('active');
      focusContainer.innerHTML = ''; // Clear content
      focusContainer.style.paddingLeft = '';
      focusContainer.style.paddingRight = '';
    }
    if (overlay) {
      overlay.classList.remove('active');
    }
    
    // Restore all artifacts to normal state immediately
    this.artifacts.forEach(artifact => {
      if (artifact.element) {
        artifact.element.style.opacity = '1';
        artifact.element.style.pointerEvents = 'auto';
      }
    });
    
    // Re-render to ensure everything is back to normal
    this.render();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing gallery...');
  const gallery = new ArtifactGallery();
  gallery.init().catch(error => {
    console.error('Error initializing gallery:', error);
  });
});

