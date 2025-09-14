import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MovementSystem } from '../MovementSystem';
import { Camera } from 'three';

describe('MovementSystem Integration', () => {
  let system: MovementSystem;
  let mockCanvas: HTMLCanvasElement;
  let mockCamera: Camera;

  beforeEach(() => {
    mockCanvas = document.createElement('canvas');
    mockCamera = new Camera();
    system = new MovementSystem(mockCamera, mockCanvas);
  });

  describe('Pointer Lock Flow', () => {
    it('should enable input when pointer lock is acquired', () => {
      // This integration test would have caught the callback issue!
      const inputManager = system.getInputManager();
      const enableSpy = vi.spyOn(inputManager, 'enable');
      
      // Simulate pointer lock
      Object.defineProperty(document, 'pointerLockElement', {
        value: mockCanvas,
        writable: true
      });
      
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Input manager should be enabled
      expect(enableSpy).toHaveBeenCalled();
      expect(inputManager.getIsEnabled()).toBe(true);
    });

    it('should process movement when input is enabled and keys pressed', () => {
      // Enable the system
      Object.defineProperty(document, 'pointerLockElement', {
        value: mockCanvas,
        writable: true
      });
      document.dispatchEvent(new Event('pointerlockchange'));
      
      // Press W key
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
      
      // Get initial position
      const startPos = mockCamera.position.clone();
      
      // Update the system (simulate game loop)
      system.update(16); // 16ms = ~60fps
      
      // Camera should have moved forward
      expect(mockCamera.position.z).not.toBe(startPos.z);
    });
  });
});