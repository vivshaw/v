import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Camera, PerspectiveCamera, Quaternion, Vector3 } from 'three';
import { PointerLockManager } from '../PointerLockManager';

describe('PointerLockManager', () => {
  let camera: Camera;
  let canvas: HTMLCanvasElement;
  let manager: PointerLockManager;
  let originalPointerLockElement: Element | null;
  let originalExitPointerLock: () => void;

  beforeEach(() => {
    // Create mock camera
    camera = new PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.set(0, 0, 0);
    
    // Create mock canvas
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);
    
    // Store original pointer lock API
    originalPointerLockElement = document.pointerLockElement;
    originalExitPointerLock = document.exitPointerLock;
    
    // Mock pointer lock API
    Object.defineProperty(document, 'pointerLockElement', {
      value: null,
      writable: true,
      configurable: true
    });
    
    document.exitPointerLock = vi.fn();
    
    // Create manager
    manager = new PointerLockManager(camera, canvas);
  });

  afterEach(() => {
    // Clean up
    manager.dispose();
    document.body.removeChild(canvas);
    
    // Restore pointer lock API
    Object.defineProperty(document, 'pointerLockElement', {
      value: originalPointerLockElement,
      writable: true,
      configurable: true
    });
    document.exitPointerLock = originalExitPointerLock;
  });

  describe('Multiple callbacks support', () => {
    it('should support multiple lock change callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();
      
      // Register multiple callbacks
      manager.setOnLockChange(callback1);
      manager.setOnLockChange(callback2);
      manager.setOnLockChange(callback3);
      
      // Simulate pointer lock
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // All callbacks should be called with locked = true
      expect(callback1).toHaveBeenCalledWith(true);
      expect(callback2).toHaveBeenCalledWith(true);
      expect(callback3).toHaveBeenCalledWith(true);
      
      // Reset mocks
      callback1.mockClear();
      callback2.mockClear();
      callback3.mockClear();
      
      // Simulate pointer unlock
      Object.defineProperty(document, 'pointerLockElement', {
        value: null,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // All callbacks should be called with locked = false
      expect(callback1).toHaveBeenCalledWith(false);
      expect(callback2).toHaveBeenCalledWith(false);
      expect(callback3).toHaveBeenCalledWith(false);
    });

    it('should handle callbacks being added after lock state changes', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      // Register first callback
      manager.setOnLockChange(callback1);
      
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(callback1).toHaveBeenCalledWith(true);
      expect(callback2).not.toHaveBeenCalled();
      
      // Add second callback after lock
      manager.setOnLockChange(callback2);
      
      // Unlock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: null,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Both callbacks should be called
      expect(callback1).toHaveBeenCalledTimes(2);
      expect(callback2).toHaveBeenCalledWith(false);
    });
  });

  describe('Lock/unlock state changes', () => {
    it('should correctly track lock state', () => {
      expect(manager.getIsLocked()).toBe(false);
      
      // Simulate pointer lock
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(manager.getIsLocked()).toBe(true);
      
      // Simulate pointer unlock
      Object.defineProperty(document, 'pointerLockElement', {
        value: null,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(manager.getIsLocked()).toBe(false);
    });

    it('should call exitPointerLock when unlock() is called', () => {
      // Simulate locked state
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(manager.getIsLocked()).toBe(true);
      
      // Call unlock
      manager.unlock();
      
      expect(document.exitPointerLock).toHaveBeenCalled();
    });

    it('should not call exitPointerLock when already unlocked', () => {
      expect(manager.getIsLocked()).toBe(false);
      
      manager.unlock();
      
      expect(document.exitPointerLock).not.toHaveBeenCalled();
    });

    it('should handle pointer lock errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      document.dispatchEvent(new Event('pointerlockerror'));
      
      expect(consoleSpy).toHaveBeenCalledWith('[PointerLock] Pointer lock failed');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Mouse delta accumulation', () => {
    it('should accumulate mouse deltas when locked', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Initial state
      let mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(0);
      expect(mouseState.deltaY).toBe(0);
      expect(mouseState.isLocked).toBe(true);
      
      // Simulate mouse movements
      const event1 = new MouseEvent('mousemove');
      Object.defineProperty(event1, 'movementX', { value: 10, configurable: true });
      Object.defineProperty(event1, 'movementY', { value: 5, configurable: true });
      document.dispatchEvent(event1);
      
      mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(10);
      expect(mouseState.deltaY).toBe(5);
      
      // Second movement should accumulate
      const event2 = new MouseEvent('mousemove');
      Object.defineProperty(event2, 'movementX', { value: 15, configurable: true });
      Object.defineProperty(event2, 'movementY', { value: -3, configurable: true });
      document.dispatchEvent(event2);
      
      mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(25); // 10 + 15
      expect(mouseState.deltaY).toBe(2);  // 5 + (-3)
    });

    it('should not accumulate mouse deltas when unlocked', () => {
      // Ensure unlocked
      expect(manager.getIsLocked()).toBe(false);
      
      // Simulate mouse movement
      const event = new MouseEvent('mousemove');
      Object.defineProperty(event, 'movementX', { value: 10, configurable: true });
      Object.defineProperty(event, 'movementY', { value: 5, configurable: true });
      document.dispatchEvent(event);
      
      const mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(0);
      expect(mouseState.deltaY).toBe(0);
      expect(mouseState.isLocked).toBe(false);
    });

    it('should reset deltas after camera rotation update', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Accumulate some deltas
      const event = new MouseEvent('mousemove');
      Object.defineProperty(event, 'movementX', { value: 100, configurable: true });
      Object.defineProperty(event, 'movementY', { value: 50, configurable: true });
      document.dispatchEvent(event);
      
      let mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(100);
      expect(mouseState.deltaY).toBe(50);
      
      // Update camera rotation
      manager.updateCameraRotation();
      
      // Deltas should be reset
      mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(0);
      expect(mouseState.deltaY).toBe(0);
    });

    it('should reset deltas when pointer is unlocked', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Accumulate some deltas
      const event = new MouseEvent('mousemove');
      Object.defineProperty(event, 'movementX', { value: 50, configurable: true });
      Object.defineProperty(event, 'movementY', { value: 25, configurable: true });
      document.dispatchEvent(event);
      
      let mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(50);
      expect(mouseState.deltaY).toBe(25);
      
      // Unlock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: null,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Deltas should be reset
      mouseState = manager.getMouseState();
      expect(mouseState.deltaX).toBe(0);
      expect(mouseState.deltaY).toBe(0);
    });
  });

  describe('Camera rotation', () => {
    it('should apply mouse sensitivity to rotation', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Store initial rotation
      const initialQuaternion = camera.quaternion.clone();
      
      // Simulate mouse movement
      const event = new MouseEvent('mousemove');
      Object.defineProperty(event, 'movementX', { value: 100, configurable: true });
      Object.defineProperty(event, 'movementY', { value: 0, configurable: true });
      document.dispatchEvent(event);
      
      // Update rotation
      manager.updateCameraRotation();
      
      // Camera should have rotated
      expect(camera.quaternion.equals(initialQuaternion)).toBe(false);
    });

    it('should clamp vertical rotation', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Try to rotate beyond vertical limit
      const event = new MouseEvent('mousemove');
      Object.defineProperty(event, 'movementX', { value: 0, configurable: true });
      Object.defineProperty(event, 'movementY', { value: -50000, configurable: true }); // Large upward movement
      document.dispatchEvent(event);
      
      manager.updateCameraRotation();
      
      // Check that rotation is clamped
      const forward = new Vector3(0, 0, -1);
      forward.applyQuaternion(camera.quaternion);
      
      // The y component should not exceed the limit
      const angle = Math.asin(forward.y);
      expect(Math.abs(angle)).toBeLessThanOrEqual(Math.PI / 3 + 0.01); // Small epsilon for floating point
    });

    it('should not update rotation when unlocked', () => {
      // Ensure unlocked
      expect(manager.getIsLocked()).toBe(false);
      
      const initialQuaternion = camera.quaternion.clone();
      
      // Try to update rotation
      manager.updateCameraRotation();
      
      // Camera should not have rotated
      expect(camera.quaternion.equals(initialQuaternion)).toBe(true);
    });
  });

  describe('Escape key handling', () => {
    it('should trigger escape callback when pressed while locked', () => {
      const escapeCallback = vi.fn();
      manager.setOnEscapePress(escapeCallback);
      
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Press escape
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      
      expect(escapeCallback).toHaveBeenCalled();
    });

    it('should not trigger escape callback when unlocked', () => {
      const escapeCallback = vi.fn();
      manager.setOnEscapePress(escapeCallback);
      
      // Ensure unlocked
      expect(manager.getIsLocked()).toBe(false);
      
      // Press escape
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);
      
      expect(escapeCallback).not.toHaveBeenCalled();
    });
  });

  describe('Direction vectors', () => {
    it('should calculate correct forward vector', () => {
      // Set camera to look along negative Z (default)
      camera.quaternion.set(0, 0, 0, 1);
      
      const forward = manager.getForwardVector();
      
      // Should be pointing along negative Z with Y component removed
      expect(forward.x).toBeCloseTo(0);
      expect(forward.y).toBe(0);
      expect(forward.z).toBeCloseTo(-1);
      expect(forward.length()).toBeCloseTo(1); // Should be normalized
    });

    it('should calculate correct right vector', () => {
      // Set camera to look along negative Z (default)
      camera.quaternion.set(0, 0, 0, 1);
      
      const right = manager.getRightVector();
      
      // Should be pointing along positive X with Y component removed
      expect(right.x).toBeCloseTo(1);
      expect(right.y).toBe(0);
      expect(right.z).toBeCloseTo(0);
      expect(right.length()).toBeCloseTo(1); // Should be normalized
    });

    it('should update direction vectors based on camera rotation', () => {
      // Rotate camera 90 degrees around Y axis
      const quaternion = new Quaternion();
      quaternion.setFromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
      camera.quaternion.copy(quaternion);
      
      const forward = manager.getForwardVector();
      const right = manager.getRightVector();
      
      // Forward should now point along negative X
      expect(forward.x).toBeCloseTo(-1);
      expect(forward.y).toBe(0);
      expect(forward.z).toBeCloseTo(0);
      
      // Right should now point along positive Z (rotated 90 degrees clockwise)
      expect(right.x).toBeCloseTo(0);
      expect(right.y).toBe(0);
      expect(right.z).toBeCloseTo(-1);
    });
  });

  describe('Cleanup', () => {
    it('should remove all event listeners on dispose', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      manager.dispose();
      
      // Should remove all event listeners
      expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerlockchange', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('pointerlockerror', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('should unlock pointer on dispose', () => {
      // Lock pointer
      Object.defineProperty(document, 'pointerLockElement', {
        value: canvas,
        configurable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      expect(manager.getIsLocked()).toBe(true);
      
      manager.dispose();
      
      expect(document.exitPointerLock).toHaveBeenCalled();
    });
  });
});