/**
 * Input state tracking for WASD movement and modifiers
 */
export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  run: boolean;
  escape: boolean;
}

/**
 * Manages keyboard input for player movement
 */
export class InputManager {
  private state: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    escape: false,
  };

  private listeners: Array<(state: InputState) => void> = [];
  private isEnabled: boolean = false;
  
  // Store bound event handlers for cleanup
  private boundHandleKeyDown: (e: KeyboardEvent) => void;
  private boundHandleKeyUp: (e: KeyboardEvent) => void;
  
  // Track pressed keys to handle repeats
  private pressedKeys: Set<string> = new Set();

  constructor() {
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    this.boundHandleKeyUp = this.handleKeyUp.bind(this);
    this.setupKeyBindings();
  }

  /**
   * Set up raw keyboard event handlers for reliable keydown/keyup
   */
  private setupKeyBindings(): void {
    // Use raw keyboard events for more reliable game input
    document.addEventListener('keydown', this.boundHandleKeyDown);
    document.addEventListener('keyup', this.boundHandleKeyUp);
    console.log('[InputManager] Keyboard event listeners attached');
  }
  
  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) {
      // console.log('[InputManager] Key ignored - input disabled:', event.code);
      return;
    }
    
    // Ignore key repeats
    if (this.pressedKeys.has(event.code)) return;
    
    console.log('[InputManager] Key down:', event.code);
    this.pressedKeys.add(event.code);
    
    let stateChanged = false;
    
    switch(event.code) {
      case 'KeyW':
      case 'ArrowUp':
        if (!this.state.forward) {
          this.state.forward = true;
          stateChanged = true;
          // console.log('[InputManager] Forward pressed');
        }
        event.preventDefault();
        break;
        
      case 'KeyS':
      case 'ArrowDown':
        if (!this.state.backward) {
          this.state.backward = true;
          stateChanged = true;
          // console.log('[InputManager] Backward pressed');
        }
        event.preventDefault();
        break;
        
      case 'KeyA':
      case 'ArrowLeft':
        if (!this.state.left) {
          this.state.left = true;
          stateChanged = true;
          // console.log('[InputManager] Left pressed');
        }
        event.preventDefault();
        break;
        
      case 'KeyD':
      case 'ArrowRight':
        if (!this.state.right) {
          this.state.right = true;
          stateChanged = true;
          // console.log('[InputManager] Right pressed');
        }
        event.preventDefault();
        break;
        
      case 'ShiftLeft':
      case 'ShiftRight':
        if (!this.state.run) {
          this.state.run = true;
          stateChanged = true;
          // console.log('[InputManager] Shift pressed (run)');
        }
        event.preventDefault();
        break;
        
      case 'Escape':
        if (!this.state.escape) {
          this.state.escape = true;
          stateChanged = true;
          console.log('[InputManager] Escape pressed');
          // Reset escape state after a short delay
          setTimeout(() => {
            this.state.escape = false;
            this.notifyListeners();
          }, 100);
        }
        break;
    }
    
    if (stateChanged) {
      this.notifyListeners();
    }
  }
  
  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.isEnabled && event.code !== 'Escape') return;
    
    this.pressedKeys.delete(event.code);
    
    let stateChanged = false;
    
    switch(event.code) {
      case 'KeyW':
      case 'ArrowUp':
        if (this.state.forward) {
          this.state.forward = false;
          stateChanged = true;
          // console.log('[InputManager] Forward released');
        }
        event.preventDefault();
        break;
        
      case 'KeyS':
      case 'ArrowDown':
        if (this.state.backward) {
          this.state.backward = false;
          stateChanged = true;
          // console.log('[InputManager] Backward released');
        }
        event.preventDefault();
        break;
        
      case 'KeyA':
      case 'ArrowLeft':
        if (this.state.left) {
          this.state.left = false;
          stateChanged = true;
          // console.log('[InputManager] Left released');
        }
        event.preventDefault();
        break;
        
      case 'KeyD':
      case 'ArrowRight':
        if (this.state.right) {
          this.state.right = false;
          stateChanged = true;
          // console.log('[InputManager] Right released');
        }
        event.preventDefault();
        break;
        
      case 'ShiftLeft':
      case 'ShiftRight':
        if (this.state.run) {
          this.state.run = false;
          stateChanged = true;
          // console.log('[InputManager] Shift released');
        }
        event.preventDefault();
        break;
    }
    
    if (stateChanged) {
      this.notifyListeners();
    }
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Get current input state
   */
  public getState(): InputState {
    return { ...this.state };
  }

  /**
   * Add listener for input state changes
   */
  public addListener(listener: (state: InputState) => void): void {
    this.listeners.push(listener);
  }

  /**
   * Remove listener
   */
  public removeListener(listener: (state: InputState) => void): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Reset all input states
   */
  public reset(): void {
    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      run: false,
      escape: false,
    };
    this.notifyListeners();
  }

  /**
   * Enable input handling
   */
  public enable(): void {
    console.log('[InputManager] Enabling input');
    this.isEnabled = true;
    this.reset();
  }

  /**
   * Disable input handling
   */
  public disable(): void {
    console.log('[InputManager] Disabling input');
    this.isEnabled = false;
    this.reset();
  }

  /**
   * Check if input is enabled
   */
  public getIsEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Clean up
   */
  public dispose(): void {
    // Remove keyboard event listeners
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    document.removeEventListener('keyup', this.boundHandleKeyUp);
    this.pressedKeys.clear();
    this.listeners = [];
    this.reset();
  }
}