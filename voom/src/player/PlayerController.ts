import { Vector3 } from 'three';
import { MOVEMENT_CONFIG } from '@/config/movement.config';
import type { InputState } from '@/input/InputManager';

/**
 * Player state and properties
 */
export interface PlayerState {
  position: Vector3;
  velocity: Vector3;
  isRunning: boolean;
  isMoving: boolean;
}

/**
 * Controls player movement and state
 */
export class PlayerController {
  private position: Vector3;
  private velocity: Vector3;
  private targetVelocity: Vector3;
  private isRunning: boolean = false;

  constructor(initialPosition?: Vector3) {
    this.position = initialPosition || new Vector3(0, MOVEMENT_CONFIG.cameraHeight, 0);
    this.velocity = new Vector3(0, 0, 0);
    this.targetVelocity = new Vector3(0, 0, 0);
  }

  /**
   * Update player movement based on input
   */
  public update(
    deltaTime: number,
    inputState: InputState,
    forwardVector: Vector3,
    rightVector: Vector3
  ): void {
    const deltaSeconds = deltaTime / 1000;
    
    // Update running state
    this.isRunning = inputState.run;
    
    // Calculate target velocity based on input
    this.calculateTargetVelocity(inputState, forwardVector, rightVector);
    
    // Apply acceleration/deceleration
    this.applyAcceleration(deltaSeconds);
    
    // Update position
    this.updatePosition(deltaSeconds);
    
    // Ensure player stays at correct height
    this.position.y = MOVEMENT_CONFIG.cameraHeight;
  }

  /**
   * Calculate target velocity from input
   */
  private calculateTargetVelocity(
    inputState: InputState,
    forwardVector: Vector3,
    rightVector: Vector3
  ): void {
    // Reset target velocity
    this.targetVelocity.set(0, 0, 0);
    
    // Calculate movement direction
    const moveVector = new Vector3(0, 0, 0);
    
    if (inputState.forward) {
      moveVector.add(forwardVector);
    }
    if (inputState.backward) {
      moveVector.sub(forwardVector);
    }
    if (inputState.left) {
      moveVector.sub(rightVector);
    }
    if (inputState.right) {
      moveVector.add(rightVector);
    }
    
    // Normalize diagonal movement
    if (moveVector.length() > 0) {
      moveVector.normalize();
      
      // Apply movement speed
      const speed = this.isRunning 
        ? MOVEMENT_CONFIG.walkSpeed * MOVEMENT_CONFIG.runMultiplier
        : MOVEMENT_CONFIG.walkSpeed;
      
      this.targetVelocity.copy(moveVector.multiplyScalar(speed));
      // console.log('[PlayerController] Target velocity set to:', this.targetVelocity.clone(), 'speed:', speed);
    }
  }

  /**
   * Apply acceleration/deceleration to velocity
   */
  private applyAcceleration(deltaSeconds: number): void {
    // Calculate acceleration factor
    const accelFactor = MOVEMENT_CONFIG.acceleration * deltaSeconds;
    const frictionFactor = MOVEMENT_CONFIG.friction * deltaSeconds;
    
    // If we have a target velocity, accelerate towards it
    if (this.targetVelocity.length() > 0) {
      // Smooth acceleration
      this.velocity.x += (this.targetVelocity.x - this.velocity.x) * accelFactor;
      this.velocity.z += (this.targetVelocity.z - this.velocity.z) * accelFactor;
    } else {
      // Apply friction when no input
      this.velocity.x *= Math.max(0, 1 - frictionFactor);
      this.velocity.z *= Math.max(0, 1 - frictionFactor);
      
      // Stop completely when velocity is very small
      if (this.velocity.length() < 1) {
        this.velocity.set(0, 0, 0);
      }
    }
    
    // No vertical velocity (no jumping)
    this.velocity.y = 0;
  }

  /**
   * Update position based on velocity
   */
  private updatePosition(deltaSeconds: number): void {
    const movement = this.velocity.clone().multiplyScalar(deltaSeconds);
    if (movement.length() > 0.001) {
      // console.log('[PlayerController] Moving by:', movement.toArray(), 
      //   'velocity:', this.velocity.toArray(), 
      //   'deltaSeconds:', deltaSeconds,
      //   'new position will be:', this.position.clone().add(movement).toArray());
    }
    this.position.add(movement);
  }

  /**
   * Get current position
   */
  public getPosition(): Vector3 {
    return this.position.clone();
  }

  /**
   * Set position directly (for teleporting, respawning, etc.)
   */
  public setPosition(position: Vector3): void {
    this.position.copy(position);
    this.position.y = MOVEMENT_CONFIG.cameraHeight; // Ensure correct height
    this.velocity.set(0, 0, 0); // Reset velocity when teleporting
  }

  /**
   * Get current velocity
   */
  public getVelocity(): Vector3 {
    return this.velocity.clone();
  }

  /**
   * Get current speed (magnitude of horizontal velocity)
   */
  public getSpeed(): number {
    const horizontalVelocity = new Vector3(this.velocity.x, 0, this.velocity.z);
    return horizontalVelocity.length();
  }

  /**
   * Check if player is currently moving
   */
  public isMoving(): boolean {
    return this.velocity.length() > 0.1;
  }

  /**
   * Get current player state
   */
  public getState(): PlayerState {
    return {
      position: this.position.clone(),
      velocity: this.velocity.clone(),
      isRunning: this.isRunning,
      isMoving: this.isMoving(),
    };
  }

  /**
   * Reset player to initial state
   */
  public reset(position?: Vector3): void {
    this.position = position || new Vector3(0, MOVEMENT_CONFIG.cameraHeight, 0);
    this.velocity.set(0, 0, 0);
    this.targetVelocity.set(0, 0, 0);
    this.isRunning = false;
  }
}