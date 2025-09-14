import { Camera, Euler, Vector3 } from 'three';
import { MOVEMENT_CONFIG } from '@/config/movement.config';

export interface MouseState {
  deltaX: number;
  deltaY: number;
  isLocked: boolean;
}

/**
 * Manages pointer lock and mouse look controls
 */
export class PointerLockManager {
  private camera: Camera;
  private canvas: HTMLCanvasElement;
  private isLocked: boolean = false;
  private euler: Euler = new Euler(0, 0, 0, 'YXZ');
  private mouseState: MouseState = {
    deltaX: 0,
    deltaY: 0,
    isLocked: false,
  };
  
  // Callbacks - support multiple listeners
  private lockChangeCallbacks: Array<(locked: boolean) => void> = [];
  private onEscapePress?: () => void;
  
  // Store bound functions for proper cleanup
  private boundHandlePointerLockChange: () => void;
  private boundHandlePointerLockError: () => void;
  private boundHandleMouseMove: (e: MouseEvent) => void;
  private boundHandleKeyDown: (e: KeyboardEvent) => void;

  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    this.camera = camera;
    this.canvas = canvas;
    
    // Bind functions once for reuse
    this.boundHandlePointerLockChange = this.handlePointerLockChange.bind(this);
    this.boundHandlePointerLockError = this.handlePointerLockError.bind(this);
    this.boundHandleMouseMove = this.handleMouseMove.bind(this);
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);
    
    this.setupEventListeners();
  }

  /**
   * Set up pointer lock event listeners
   */
  private setupEventListeners(): void {
    // Don't add click listener to canvas - overlay handles initial lock request
    // This prevents conflicts with the overlay's direct pointer lock request
    
    // Pointer lock state changes
    document.addEventListener('pointerlockchange', this.boundHandlePointerLockChange);
    document.addEventListener('pointerlockerror', this.boundHandlePointerLockError);
    
    // Mouse movement
    document.addEventListener('mousemove', this.boundHandleMouseMove);
    
    // Handle escape key through pointer lock API
    document.addEventListener('keydown', this.boundHandleKeyDown);
  }
  
  /**
   * Handle keyboard input
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.isLocked) {
      this.onEscapePress?.();
    }
  }


  /**
   * Handle pointer lock state changes
   */
  private handlePointerLockChange(): void {
    this.isLocked = document.pointerLockElement === this.canvas;
    this.mouseState.isLocked = this.isLocked;
    console.log('[PointerLock] Lock state changed:', this.isLocked);
    
    if (!this.isLocked) {
      // Reset mouse deltas when unlocked
      this.mouseState.deltaX = 0;
      this.mouseState.deltaY = 0;
    }
    
    // Notify all callbacks
    this.lockChangeCallbacks.forEach(callback => callback(this.isLocked));
  }

  /**
   * Handle pointer lock errors
   */
  private handlePointerLockError(): void {
    console.error('[PointerLock] Pointer lock failed');
  }

  /**
   * Handle mouse movement
   */
  private handleMouseMove(event: MouseEvent): void {
    if (!this.isLocked) return;
    
    // Get raw mouse movement
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    
    // Log significant mouse movements (disabled for performance)
    // if (Math.abs(movementX) > 0 || Math.abs(movementY) > 0) {
    //   console.log('[PointerLock] Mouse move:', movementX, movementY);
    // }
    
    // Accumulate deltas instead of replacing them
    // This prevents losing mouse movements between frames
    this.mouseState.deltaX += movementX;
    this.mouseState.deltaY += movementY;
  }

  /**
   * Update camera rotation based on mouse input
   * Should be called each frame
   */
  public updateCameraRotation(): void {
    if (!this.isLocked) return;
    
    // Skip if no mouse movement
    if (this.mouseState.deltaX === 0 && this.mouseState.deltaY === 0) return;
    
    // Apply mouse sensitivity
    const deltaX = this.mouseState.deltaX * MOVEMENT_CONFIG.mouseSensitivity;
    const deltaY = this.mouseState.deltaY * MOVEMENT_CONFIG.mouseSensitivity;
    
    // console.log('[PointerLock] Applying rotation:', { deltaX, deltaY, rawX: this.mouseState.deltaX, rawY: this.mouseState.deltaY });
    
    // Update euler angles
    this.euler.setFromQuaternion(this.camera.quaternion);
    // const oldY = this.euler.y;
    // const oldX = this.euler.x;
    
    // Horizontal rotation (Y axis)
    this.euler.y -= deltaX;
    
    // Vertical rotation (X axis) with clamping
    this.euler.x -= deltaY;
    this.euler.x = Math.max(
      -MOVEMENT_CONFIG.maxLookAngleVertical,
      Math.min(MOVEMENT_CONFIG.maxLookAngleVertical, this.euler.x)
    );
    
    // console.log('[PointerLock] Euler angles:', { 
    //   oldX, oldY, 
    //   newX: this.euler.x, newY: this.euler.y,
    //   deltaX: this.euler.x - oldX, deltaY: this.euler.y - oldY
    // });
    
    // Apply rotation to camera
    this.camera.quaternion.setFromEuler(this.euler);
    
    // Reset deltas after processing
    this.mouseState.deltaX = 0;
    this.mouseState.deltaY = 0;
  }

  /**
   * Get current lock state
   */
  public getIsLocked(): boolean {
    return this.isLocked;
  }

  /**
   * Get current mouse state
   */
  public getMouseState(): Readonly<MouseState> {
    return { ...this.mouseState };
  }

  /**
   * Force unlock pointer
   */
  public unlock(): void {
    if (this.isLocked && document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  /**
   * Add callback for lock state changes (supports multiple callbacks)
   */
  public setOnLockChange(callback: (locked: boolean) => void): void {
    this.lockChangeCallbacks.push(callback);
  }

  /**
   * Set callback for escape key press
   */
  public setOnEscapePress(callback: () => void): void {
    this.onEscapePress = callback;
  }

  /**
   * Get camera forward direction (for movement)
   */
  public getForwardVector(): Vector3 {
    const forward = new Vector3(0, 0, -1);
    forward.applyQuaternion(this.camera.quaternion);
    forward.y = 0; // Remove vertical component for ground movement
    forward.normalize();
    return forward;
  }

  /**
   * Get camera right direction (for strafing)
   */
  public getRightVector(): Vector3 {
    const right = new Vector3(1, 0, 0);
    right.applyQuaternion(this.camera.quaternion);
    right.y = 0; // Remove vertical component for ground movement
    right.normalize();
    return right;
  }

  /**
   * Clean up event listeners
   */
  public dispose(): void {
    // Canvas click listener removed since overlay handles pointer lock
    document.removeEventListener('pointerlockchange', this.boundHandlePointerLockChange);
    document.removeEventListener('pointerlockerror', this.boundHandlePointerLockError);
    document.removeEventListener('mousemove', this.boundHandleMouseMove);
    document.removeEventListener('keydown', this.boundHandleKeyDown);
    
    // Ensure pointer is unlocked
    this.unlock();
  }
}