import { Camera } from 'three';
import { InputManager } from '@/input/InputManager';
import { PointerLockManager } from '@/input/PointerLockManager';
import { PlayerController } from '@/player/PlayerController';

/**
 * Integrates all movement components into a cohesive system
 */
export class MovementSystem {
  private inputManager: InputManager;
  private pointerLockManager: PointerLockManager;
  private playerController: PlayerController;
  private camera: Camera;
  private isActive: boolean = false;

  constructor(camera: Camera, canvas: HTMLCanvasElement) {
    console.log('[MovementSystem] Initializing');
    this.camera = camera;
    
    // Initialize components
    this.inputManager = new InputManager();
    this.pointerLockManager = new PointerLockManager(camera, canvas);
    this.playerController = new PlayerController(camera.position.clone());
    
    // Set up component interactions
    this.setupComponentCallbacks();
    console.log('[MovementSystem] Initialized successfully');
  }

  /**
   * Set up callbacks between components
   */
  private setupComponentCallbacks(): void {
    // Enable/disable input based on pointer lock state
    this.pointerLockManager.setOnLockChange((locked: boolean) => {
      console.log('[MovementSystem] Lock state changed:', locked);
      if (locked) {
        console.log('[MovementSystem] Enabling input manager');
        this.inputManager.enable();
        this.isActive = true;
      } else {
        console.log('[MovementSystem] Disabling input manager');
        this.inputManager.disable();
        this.isActive = false;
      }
    });
    
    // Handle escape key to release pointer lock
    this.inputManager.addListener((state) => {
      if (state.escape) {
        console.log('[MovementSystem] Escape pressed, unlocking pointer');
        this.pointerLockManager.unlock();
      }
    });
  }

  /**
   * Update movement system each frame
   */
  public update(deltaTime: number): void {
    if (!this.isActive) {
      return;
    }
    
    // Update mouse look
    this.pointerLockManager.updateCameraRotation();
    
    // Get current input state
    const inputState = this.inputManager.getState();
    
    // Log if there's any movement input (disabled for performance)
    // if (inputState.forward || inputState.backward || inputState.left || inputState.right) {
    //   console.log('[MovementSystem] Update called with deltaTime:', deltaTime, 'Input:', {
    //     forward: inputState.forward,
    //     backward: inputState.backward,
    //     left: inputState.left,
    //     right: inputState.right,
    //     run: inputState.run
    //   });
    // }
    
    // Get camera direction vectors
    const forwardVector = this.pointerLockManager.getForwardVector();
    const rightVector = this.pointerLockManager.getRightVector();
    
    // Log direction vectors when there's input (disabled for performance)
    // if (inputState.forward || inputState.backward || inputState.left || inputState.right) {
    //   console.log('[MovementSystem] Direction vectors:', {
    //     forward: forwardVector.toArray(),
    //     right: rightVector.toArray()
    //   });
    // }
    
    // Store old position for comparison (disabled for performance)
    // const oldPosition = this.camera.position.clone();
    
    // Update player movement
    this.playerController.update(deltaTime, inputState, forwardVector, rightVector);
    
    // Update camera position to follow player
    const playerPosition = this.playerController.getPosition();
    this.camera.position.copy(playerPosition);
    
    // Log if position actually changed (disabled for performance)
    // if (!oldPosition.equals(this.camera.position)) {
    //   console.log('[MovementSystem] Camera moved from', oldPosition.toArray(), 'to', this.camera.position.toArray(), 'distance:', oldPosition.distanceTo(this.camera.position));
    // }
  }

  /**
   * Get current player state
   */
  public getPlayerState() {
    return this.playerController.getState();
  }

  /**
   * Check if movement system is active (pointer locked)
   */
  public getIsActive(): boolean {
    return this.isActive;
  }

  /**
   * Check if pointer is locked
   */
  public getIsPointerLocked(): boolean {
    return this.pointerLockManager.getIsLocked();
  }

  /**
   * Get input manager for external access
   */
  public getInputManager(): InputManager {
    return this.inputManager;
  }

  /**
   * Get pointer lock manager for external access
   */
  public getPointerLockManager(): PointerLockManager {
    return this.pointerLockManager;
  }

  /**
   * Get player controller for external access
   */
  public getPlayerController(): PlayerController {
    return this.playerController;
  }

  /**
   * Reset movement system
   */
  public reset(): void {
    this.inputManager.reset();
    this.playerController.reset();
    this.pointerLockManager.unlock();
    this.isActive = false;
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.inputManager.dispose();
    this.pointerLockManager.dispose();
    this.reset();
  }
}