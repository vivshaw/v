/**
 * Controls overlay that shows instructions before pointer lock
 */
export class ControlsOverlay {
  private overlay: HTMLDivElement;
  private isVisible: boolean = true;

  constructor() {
    this.overlay = this.createOverlay();
    document.body.appendChild(this.overlay);
  }

  /**
   * Create the overlay HTML element
   */
  private createOverlay(): HTMLDivElement {
    const overlay = document.createElement('div');
    overlay.id = 'controls-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      font-family: monospace;
      z-index: 1000;
      pointer-events: auto;
      transition: opacity 0.3s ease-in-out;
    `;

    // Main title
    const title = document.createElement('h1');
    title.textContent = 'VOOM';
    title.style.cssText = `
      font-size: 4rem;
      margin-bottom: 2rem;
      color: #ff6b6b;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    `;
    overlay.appendChild(title);

    // Click to play instruction
    const clickToPlay = document.createElement('div');
    clickToPlay.style.cssText = `
      font-size: 1.5rem;
      margin-bottom: 3rem;
      animation: pulse 2s infinite;
      cursor: pointer;
    `;
    clickToPlay.textContent = 'CLICK TO PLAY';
    overlay.appendChild(clickToPlay);
    
    // Make the entire overlay clickable and request pointer lock directly
    overlay.style.cursor = 'pointer';
    overlay.addEventListener('click', (e) => {
      e.stopPropagation();
      // Request pointer lock directly on the canvas
      const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
      if (canvas) {
        // Request pointer lock directly - must be from a user gesture
        canvas.requestPointerLock();
      }
    });

    // Controls container
    const controlsContainer = document.createElement('div');
    controlsContainer.style.cssText = `
      background: rgba(0, 0, 0, 0.8);
      border: 2px solid #333;
      padding: 2rem;
      border-radius: 8px;
      max-width: 400px;
    `;
    overlay.appendChild(controlsContainer);

    // Controls title
    const controlsTitle = document.createElement('h2');
    controlsTitle.textContent = 'CONTROLS';
    controlsTitle.style.cssText = `
      font-size: 1.5rem;
      margin-bottom: 1rem;
      text-align: center;
      color: #ff6b6b;
    `;
    controlsContainer.appendChild(controlsTitle);

    // Controls list
    const controls = [
      { key: 'W / ↑', action: 'Move Forward' },
      { key: 'S / ↓', action: 'Move Backward' },
      { key: 'A / ←', action: 'Strafe Left' },
      { key: 'D / →', action: 'Strafe Right' },
      { key: 'SHIFT', action: 'Run' },
      { key: 'MOUSE', action: 'Look Around' },
      { key: 'ESC', action: 'Release Cursor' },
    ];

    const controlsList = document.createElement('div');
    controlsList.style.cssText = `
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem 1.5rem;
      font-size: 1rem;
    `;

    controls.forEach(control => {
      const keySpan = document.createElement('span');
      keySpan.textContent = control.key;
      keySpan.style.cssText = `
        color: #ffcc00;
        font-weight: bold;
        text-align: right;
      `;
      
      const actionSpan = document.createElement('span');
      actionSpan.textContent = control.action;
      actionSpan.style.cssText = `
        color: #ccc;
      `;
      
      controlsList.appendChild(keySpan);
      controlsList.appendChild(actionSpan);
    });

    controlsContainer.appendChild(controlsList);

    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);

    return overlay;
  }

  /**
   * Show the overlay
   */
  public show(): void {
    this.overlay.style.opacity = '1';
    this.overlay.style.pointerEvents = 'auto';
    this.isVisible = true;
  }

  /**
   * Hide the overlay
   */
  public hide(): void {
    this.overlay.style.opacity = '0';
    this.overlay.style.pointerEvents = 'none';
    this.isVisible = false;
  }

  /**
   * Check if overlay is visible
   */
  public getIsVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Toggle overlay visibility
   */
  public toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Clean up the overlay
   */
  public dispose(): void {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
    }
  }
}