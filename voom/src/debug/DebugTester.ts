/**
 * Debug tester to verify movement system functionality
 * Add this to window object in main.ts for browser console access
 */
export class DebugTester {
  private canvas: HTMLCanvasElement | null;
  private overlay: HTMLElement | null;
  
  constructor() {
    this.canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.overlay = document.getElementById('controls-overlay');
  }
  
  /**
   * Run all debug tests
   */
  public runAllTests(): void {
    console.log('=== VOOM Debug Test Suite ===');
    this.testDOMElements();
    this.testPointerLock();
    this.testEventListeners();
    this.logInstructions();
  }
  
  /**
   * Test DOM elements exist
   */
  private testDOMElements(): void {
    console.group('DOM Elements Test');
    console.log('Canvas found:', !!this.canvas);
    console.log('Canvas size:', this.canvas?.width, 'x', this.canvas?.height);
    console.log('Overlay found:', !!this.overlay);
    
    if (this.overlay) {
      const style = window.getComputedStyle(this.overlay);
      console.log('Overlay opacity:', style.opacity);
      console.log('Overlay pointer-events:', style.pointerEvents);
      console.log('Overlay z-index:', style.zIndex);
      console.log('Overlay display:', style.display);
    }
    console.groupEnd();
  }
  
  /**
   * Test pointer lock capability
   */
  private testPointerLock(): void {
    console.group('Pointer Lock Test');
    
    // Check if pointer lock is supported
    const supported = 'pointerLockElement' in document;
    console.log('Pointer lock supported:', supported);
    
    // Check current lock state
    console.log('Currently locked:', document.pointerLockElement === this.canvas);
    
    // Try to request pointer lock
    if (this.canvas && supported) {
      console.log('Requesting pointer lock...');
      this.canvas.requestPointerLock();
      
      setTimeout(() => {
        const locked = document.pointerLockElement === this.canvas;
        console.log('Lock request result:', locked ? 'SUCCESS' : 'FAILED');
        
        if (!locked) {
          console.warn('Pointer lock failed. Possible reasons:');
          console.warn('- Not triggered by user interaction');
          console.warn('- Browser security restrictions');
          console.warn('- Running in iframe without proper permissions');
        }
      }, 100);
    }
    
    console.groupEnd();
  }
  
  /**
   * Test event listeners are attached
   */
  private testEventListeners(): void {
    console.group('Event Listeners Test');
    
    // Test click handling
    if (this.canvas) {
      const hasClickListeners = this.canvas.onclick !== null || 
                                this.getEventListeners(this.canvas, 'click').length > 0;
      console.log('Canvas has click listeners:', hasClickListeners);
    }
    
    // Test document-level listeners
    console.log('Document has pointerlockchange listener:', 
                this.getEventListeners(document, 'pointerlockchange').length > 0);
    console.log('Document has mousemove listener:', 
                this.getEventListeners(document, 'mousemove').length > 0);
    console.log('Document has keydown listener:', 
                this.getEventListeners(document, 'keydown').length > 0);
    console.log('Document has keyup listener:', 
                this.getEventListeners(document, 'keyup').length > 0);
    
    console.groupEnd();
  }
  
  /**
   * Get event listeners for an element (Chrome DevTools only)
   */
  private getEventListeners(element: any, event: string): any[] {
    // This only works in Chrome DevTools console
    if (typeof (window as any).getEventListeners === 'function') {
      const listeners = (window as any).getEventListeners(element);
      return listeners[event] || [];
    }
    return [];
  }
  
  /**
   * Log test instructions
   */
  private logInstructions(): void {
    console.group('Manual Test Instructions');
    console.log('1. Click anywhere on the screen to engage pointer lock');
    console.log('2. Once locked, test the following:');
    console.log('   - W/↑: Move forward');
    console.log('   - S/↓: Move backward');
    console.log('   - A/←: Strafe left');
    console.log('   - D/→: Strafe right');
    console.log('   - SHIFT: Run (move faster)');
    console.log('   - Mouse: Look around');
    console.log('   - ESC: Release pointer lock');
    console.log('3. Check console for debug output');
    console.groupEnd();
  }
  
  /**
   * Force click on canvas
   */
  public forceCanvasClick(): void {
    if (this.canvas) {
      console.log('Forcing canvas click...');
      const event = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
      });
      this.canvas.dispatchEvent(event);
    }
  }
  
  /**
   * Hide overlay manually
   */
  public hideOverlay(): void {
    if (this.overlay) {
      console.log('Manually hiding overlay...');
      this.overlay.style.opacity = '0';
      this.overlay.style.pointerEvents = 'none';
    }
  }
  
  /**
   * Show current state
   */
  public showState(): void {
    console.group('Current State');
    console.log('Pointer locked:', document.pointerLockElement === this.canvas);
    console.log('Overlay visible:', this.overlay?.style.opacity !== '0');
    console.log('Canvas dimensions:', this.canvas?.width, 'x', this.canvas?.height);
    console.groupEnd();
  }
}