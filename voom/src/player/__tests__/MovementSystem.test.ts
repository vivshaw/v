import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { MovementSystem } from '../MovementSystem';
import { MOVEMENT_CONFIG } from '@/config/movement.config';

describe('MovementSystem', () => {
  let camera: PerspectiveCamera;
  let canvas: HTMLCanvasElement;
  let system: MovementSystem;
  let originalPointerLockElement: Element | null;
  let originalExitPointerLock: () => void;

  beforeEach(() => {
    // Create camera
    camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, MOVEMENT_CONFIG.cameraHeight, 0);
    
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    
    // Store and mock pointer lock API
    originalPointerLockElement = document.pointerLockElement;
    originalExitPointerLock = document.exitPointerLock;
    
    Object.defineProperty(document, 'pointerLockElement', {
      value: null,
      writable: true,
      configurable: true
    });
    
    document.exitPointerLock = vi.fn();
    
    // Create system
    system = new MovementSystem(camera, canvas);
  });

  afterEach(() => {
    // Clean up
    system.dispose();
    document.body.removeChild(canvas);
    
    // Restore pointer lock API
    Object.defineProperty(document, 'pointerLockElement', {
      value: originalPointerLockElement,
      writable: true,
      configurable: true
    });
    document.exitPointerLock = originalExitPointerLock;
  });

  describe('Initialization', () => {
    it('should initialize all components', () => {
      expect(system.getInputManager()).toBeDefined();
      expect(system.getPointerLockManager()).toBeDefined();
      expect(system.getPlayerController()).toBeDefined();
    });

    it('should start inactive', () => {
      expect(system.getIsActive()).toBe(false);
      expect(system.getIsPointerLocked()).toBe(false);
    });

    it('should have input disabled initially', () => {
      const inputManager = system.getInputManager();
      expect(inputManager.getIsEnabled()).toBe(false);
    });
  });

  describe('Pointer lock integration', () => {
    it('should enable input when pointer is locked', () => {
      const inputManager = system.getInputManager();
      
      expect(inputManager.getIsEnabled()).toBe(false);
      
      // Simulate pointer lock
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(inputManager.getIsEnabled()).toBe(true);
      expect(system.getIsActive()).toBe(true);
    });

    it('should disable input when pointer is unlocked', () => {
      const inputManager = system.getInputManager();
      
      // Lock first
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(inputManager.getIsEnabled()).toBe(true);
      
      // Unlock
      Object.defineProperty(document, 'pointerLockElement', {
        value: null,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(inputManager.getIsEnabled()).toBe(false);
      expect(system.getIsActive()).toBe(false);
    });

    it('should unlock pointer when escape is pressed', () => {
      // Lock pointer first
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Press escape
      const escapeEvent = new KeyboardEvent('keydown', { code: 'Escape' });
      document.dispatchEvent(escapeEvent);
      
      // Should call unlock
      expect(document.exitPointerLock).toHaveBeenCalled();
    });
  });

  describe('Movement flow integration', () => {
    it('should not update when inactive', () => {
      const initialPosition = camera.position.clone();
      
      // Try to update without pointer lock
      system.update(16);
      
      expect(camera.position.equals(initialPosition)).toBe(true);
    });

    it('should update camera position when keys are pressed', () => {
      // Lock pointer to activate system
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      const initialPosition = camera.position.clone();
      
      // Press W key
      const keyEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(keyEvent);
      
      // Update multiple times to build up movement
      for (let i = 0; i < 50; i++) {
        system.update(16);
      }
      
      // Camera should have moved
      expect(camera.position.equals(initialPosition)).toBe(false);
      expect(camera.position.z).toBeLessThan(initialPosition.z); // Moved forward
    });

    it('should handle multiple keys simultaneously', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      const initialPosition = camera.position.clone();
      
      // Press W and D keys
      const wEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      const dEvent = new KeyboardEvent('keydown', { code: 'KeyD' });
      document.dispatchEvent(wEvent);
      document.dispatchEvent(dEvent);
      
      // Update
      for (let i = 0; i < 50; i++) {
        system.update(16);
      }
      
      // Should move forward-right
      expect(camera.position.z).toBeLessThan(initialPosition.z); // Forward
      expect(camera.position.x).toBeGreaterThan(initialPosition.x); // Right
    });

    it('should apply run speed when shift is held', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Test walking speed first
      const walkStart = camera.position.clone();
      const wEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(wEvent);
      
      for (let i = 0; i < 30; i++) {
        system.update(16);
      }
      
      const walkEnd = camera.position.clone();
      const walkDistance = walkStart.distanceTo(walkEnd);
      
      // Release W
      const wUpEvent = new KeyboardEvent('keyup', { code: 'KeyW' });
      document.dispatchEvent(wUpEvent);
      
      // Wait for stop
      for (let i = 0; i < 100; i++) {
        system.update(16);
      }
      
      // Reset position
      camera.position.copy(walkStart);
      system.getPlayerController().reset(walkStart);
      
      // Test running speed
      const runStart = camera.position.clone();
      const shiftEvent = new KeyboardEvent('keydown', { code: 'ShiftLeft' });
      document.dispatchEvent(shiftEvent);
      document.dispatchEvent(wEvent);
      
      for (let i = 0; i < 30; i++) {
        system.update(16);
      }
      
      const runEnd = camera.position.clone();
      const runDistance = runStart.distanceTo(runEnd);
      
      // Running should be faster
      expect(runDistance).toBeGreaterThan(walkDistance);
    });
  });

  describe('Mouse look integration', () => {
    it('should update camera rotation from mouse movement', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      const initialQuaternion = camera.quaternion.clone();
      
      // Simulate mouse movement
      const mouseEvent = new MouseEvent('mousemove');
      Object.defineProperty(mouseEvent, 'movementX', { value: 100, configurable: true });
      Object.defineProperty(mouseEvent, 'movementY', { value: 50, configurable: true });
      document.dispatchEvent(mouseEvent);
      
      // Update system
      system.update(16);
      
      // Camera should have rotated
      expect(camera.quaternion.equals(initialQuaternion)).toBe(false);
    });

    it('should combine mouse look with movement', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Rotate camera to the right
      const mouseEvent = new MouseEvent('mousemove');
      Object.defineProperty(mouseEvent, 'movementX', { value: 1000, configurable: true });
      Object.defineProperty(mouseEvent, 'movementY', { value: 0, configurable: true });
      document.dispatchEvent(mouseEvent);
      
      system.update(16);
      
      const initialPosition = camera.position.clone();
      
      // Now move forward
      const wEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(wEvent);
      
      for (let i = 0; i < 50; i++) {
        system.update(16);
      }
      
      // Should have moved in the rotated direction
      expect(camera.position.x).not.toBeCloseTo(initialPosition.x, 1);
      expect(camera.position.z).not.toBeCloseTo(initialPosition.z, 1);
    });
  });

  describe('State management', () => {
    it('should return correct player state', () => {
      const state = system.getPlayerState();
      
      expect(state.position).toBeInstanceOf(Vector3);
      expect(state.velocity).toBeInstanceOf(Vector3);
      expect(state.isRunning).toBe(false);
      expect(state.isMoving).toBe(false);
    });

    it('should track movement state correctly', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Initially not moving
      let state = system.getPlayerState();
      expect(state.isMoving).toBe(false);
      
      // Start moving
      const wEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(wEvent);
      
      for (let i = 0; i < 20; i++) {
        system.update(16);
      }
      
      state = system.getPlayerState();
      expect(state.isMoving).toBe(true);
      
      // Stop moving
      const wUpEvent = new KeyboardEvent('keyup', { code: 'KeyW' });
      document.dispatchEvent(wUpEvent);
      
      for (let i = 0; i < 100; i++) {
        system.update(16);
      }
      
      state = system.getPlayerState();
      expect(state.isMoving).toBe(false);
    });
  });

  describe('Reset functionality', () => {
    it('should reset all components', () => {
      // Lock pointer and move
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      const wEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(wEvent);
      
      for (let i = 0; i < 30; i++) {
        system.update(16);
      }
      
      // Reset
      system.reset();
      
      expect(system.getIsActive()).toBe(false);
      // Note: reset() calls unlock() but doesn't immediately change the mock state
      // The real browser would handle this through the pointer lock API
      expect(document.exitPointerLock).toHaveBeenCalled();
      
      const inputManager = system.getInputManager();
      const inputState = inputManager.getState();
      expect(inputState.forward).toBe(false);
      
      const playerState = system.getPlayerState();
      expect(playerState.velocity.length()).toBe(0);
    });
  });

  describe('Performance considerations', () => {
    it('should handle rapid updates', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Simulate very high frame rate
      for (let i = 0; i < 1000; i++) {
        system.update(1); // 1ms updates
      }
      
      // Should not crash or produce invalid state
      const state = system.getPlayerState();
      expect(state.position).toBeDefined();
      expect(state.velocity).toBeDefined();
    });

    it('should handle variable delta times', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Press W
      const wEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(wEvent);
      
      // Variable frame times
      const deltaTimes = [16, 8, 33, 16, 50, 16, 10, 25];
      deltaTimes.forEach(dt => {
        system.update(dt);
      });
      
      // Should handle gracefully
      const state = system.getPlayerState();
      expect(state.isMoving).toBe(true);
    });
  });

  describe('Component interaction bugs', () => {
    it('should handle multiple lock change callbacks correctly', () => {
      const pointerLockManager = system.getPointerLockManager();
      const additionalCallback = vi.fn();
      
      // Add another callback
      pointerLockManager.setOnLockChange(additionalCallback);
      
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Both the system's callback and our additional callback should work
      expect(system.getIsActive()).toBe(true);
      expect(additionalCallback).toHaveBeenCalledWith(true);
      
      // Input should still be enabled (system's callback still works)
      const inputManager = system.getInputManager();
      expect(inputManager.getIsEnabled()).toBe(true);
    });

    it('should maintain input state across lock/unlock cycles', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Press keys
      const wEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(wEvent);
      
      // Unlock
      Object.defineProperty(document, 'pointerLockElement', {
        value: null,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Input should be reset
      const inputManager = system.getInputManager();
      const state = inputManager.getState();
      expect(state.forward).toBe(false);
      
      // Lock again
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Input should start fresh
      const newState = inputManager.getState();
      expect(newState.forward).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should dispose all components', () => {
      const inputManager = system.getInputManager();
      const pointerLockManager = system.getPointerLockManager();
      
      const inputDisposeSpy = vi.spyOn(inputManager, 'dispose');
      const pointerDisposeSpy = vi.spyOn(pointerLockManager, 'dispose');
      
      system.dispose();
      
      expect(inputDisposeSpy).toHaveBeenCalled();
      expect(pointerDisposeSpy).toHaveBeenCalled();
    });

    it('should unlock pointer on dispose', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      system.dispose();
      
      expect(document.exitPointerLock).toHaveBeenCalled();
    });
  });
});