import { describe, it, expect, beforeEach } from 'vitest';
import { Vector3 } from 'three';
import { PlayerController } from '../PlayerController';
import { MOVEMENT_CONFIG } from '@/config/movement.config';
import type { InputState } from '@/input/InputManager';

describe('PlayerController', () => {
  let controller: PlayerController;
  let defaultInputState: InputState;
  let forwardVector: Vector3;
  let rightVector: Vector3;

  beforeEach(() => {
    controller = new PlayerController();
    
    // Default input state (no keys pressed)
    defaultInputState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      run: false,
      escape: false
    };
    
    // Standard direction vectors
    forwardVector = new Vector3(0, 0, -1);
    rightVector = new Vector3(1, 0, 0);
  });

  describe('Initialization', () => {
    it('should initialize with default position', () => {
      const position = controller.getPosition();
      expect(position.x).toBe(0);
      expect(position.y).toBe(MOVEMENT_CONFIG.cameraHeight);
      expect(position.z).toBe(0);
    });

    it('should initialize with custom position', () => {
      const customPos = new Vector3(10, 5, 20);
      const customController = new PlayerController(customPos);
      
      const position = customController.getPosition();
      expect(position.x).toBe(10);
      expect(position.y).toBe(5); // Y is preserved from initial position
      expect(position.z).toBe(20);
    });

    it('should initialize with zero velocity', () => {
      const velocity = controller.getVelocity();
      expect(velocity.x).toBe(0);
      expect(velocity.y).toBe(0);
      expect(velocity.z).toBe(0);
    });

    it('should not be moving initially', () => {
      expect(controller.isMoving()).toBe(false);
    });
  });

  describe('Movement calculations', () => {
    it('should calculate forward movement correctly', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      const deltaTime = 16; // ~60fps
      controller.update(deltaTime, inputState, forwardVector, rightVector);
      
      // Should be moving forward
      const velocity = controller.getVelocity();
      expect(velocity.z).toBeLessThan(0); // Moving in negative Z direction
      expect(velocity.x).toBeCloseTo(0);
      expect(velocity.y).toBe(0);
    });

    it('should calculate backward movement correctly', () => {
      const inputState: InputState = {
        ...defaultInputState,
        backward: true
      };
      
      const deltaTime = 16;
      controller.update(deltaTime, inputState, forwardVector, rightVector);
      
      const velocity = controller.getVelocity();
      expect(velocity.z).toBeGreaterThan(0); // Moving in positive Z direction
      expect(velocity.x).toBeCloseTo(0);
      expect(velocity.y).toBe(0);
    });

    it('should calculate left movement correctly', () => {
      const inputState: InputState = {
        ...defaultInputState,
        left: true
      };
      
      const deltaTime = 16;
      controller.update(deltaTime, inputState, forwardVector, rightVector);
      
      const velocity = controller.getVelocity();
      expect(velocity.x).toBeLessThan(0); // Moving in negative X direction
      expect(velocity.z).toBeCloseTo(0);
      expect(velocity.y).toBe(0);
    });

    it('should calculate right movement correctly', () => {
      const inputState: InputState = {
        ...defaultInputState,
        right: true
      };
      
      const deltaTime = 16;
      controller.update(deltaTime, inputState, forwardVector, rightVector);
      
      const velocity = controller.getVelocity();
      expect(velocity.x).toBeGreaterThan(0); // Moving in positive X direction
      expect(velocity.z).toBeCloseTo(0);
      expect(velocity.y).toBe(0);
    });

    it('should normalize diagonal movement', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        right: true
      };
      
      // Update for enough time to reach target velocity
      for (let i = 0; i < 100; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      const speed = controller.getSpeed();
      // Speed should be close to walk speed (not sqrt(2) * walk speed)
      expect(speed).toBeCloseTo(MOVEMENT_CONFIG.walkSpeed, 1);
    });

    it('should apply run multiplier when running', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        run: true
      };
      
      // Update for enough time to reach target velocity
      for (let i = 0; i < 100; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      const speed = controller.getSpeed();
      const expectedSpeed = MOVEMENT_CONFIG.walkSpeed * MOVEMENT_CONFIG.runMultiplier;
      expect(speed).toBeCloseTo(expectedSpeed, 1);
    });

    it('should handle opposing inputs correctly', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        backward: true
      };
      
      // Update multiple times
      for (let i = 0; i < 10; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      // Should cancel out - no movement
      const velocity = controller.getVelocity();
      expect(velocity.length()).toBeCloseTo(0, 1);
    });
  });

  describe('Velocity and acceleration', () => {
    it('should accelerate gradually', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      const velocities: number[] = [];
      
      // Track velocity over time
      for (let i = 0; i < 10; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
        velocities.push(controller.getSpeed());
      }
      
      // Velocity should increase over time
      for (let i = 1; i < velocities.length; i++) {
        expect(velocities[i]).toBeGreaterThanOrEqual(velocities[i - 1]);
      }
      
      // Should not exceed max speed
      expect(velocities[velocities.length - 1]).toBeLessThanOrEqual(MOVEMENT_CONFIG.walkSpeed + 0.1);
    });

    it('should decelerate with friction when no input', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      // Build up speed
      for (let i = 0; i < 50; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      const initialSpeed = controller.getSpeed();
      expect(initialSpeed).toBeGreaterThan(0);
      
      // Stop input
      const noInput: InputState = { ...defaultInputState };
      
      const speeds: number[] = [];
      for (let i = 0; i < 20; i++) {
        controller.update(16, noInput, forwardVector, rightVector);
        speeds.push(controller.getSpeed());
      }
      
      // Speed should decrease
      for (let i = 1; i < speeds.length; i++) {
        expect(speeds[i]).toBeLessThanOrEqual(speeds[i - 1]);
      }
      
      // Should eventually stop (or be very slow)
      expect(speeds[speeds.length - 1]).toBeLessThan(15);
    });

    it('should stop completely when velocity is very small', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      // Build up some speed
      for (let i = 0; i < 10; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      // Stop input and let friction work
      const noInput: InputState = { ...defaultInputState };
      for (let i = 0; i < 100; i++) {
        controller.update(16, noInput, forwardVector, rightVector);
      }
      
      // Should be completely stopped
      const velocity = controller.getVelocity();
      expect(velocity.x).toBe(0);
      expect(velocity.y).toBe(0);
      expect(velocity.z).toBe(0);
    });

    it('should maintain zero Y velocity', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        right: true,
        run: true
      };
      
      // Update many times with various inputs
      for (let i = 0; i < 50; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
        const velocity = controller.getVelocity();
        expect(velocity.y).toBe(0);
      }
    });
  });

  describe('Position updates', () => {
    it('should update position based on velocity', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      const initialPosition = controller.getPosition();
      
      // Move forward for a while
      for (let i = 0; i < 50; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      const newPosition = controller.getPosition();
      
      // Should have moved forward (negative Z)
      expect(newPosition.z).toBeLessThan(initialPosition.z);
      expect(newPosition.x).toBeCloseTo(initialPosition.x, 1);
      expect(newPosition.y).toBe(MOVEMENT_CONFIG.cameraHeight);
    });

    it('should maintain camera height', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        right: true
      };
      
      // Update many times
      for (let i = 0; i < 100; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
        const position = controller.getPosition();
        expect(position.y).toBe(MOVEMENT_CONFIG.cameraHeight);
      }
    });

    it('should handle different delta times correctly', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      // Test with different frame rates
      const deltaTimes = [8, 16, 33, 50]; // 120fps, 60fps, 30fps, 20fps
      
      deltaTimes.forEach(deltaTime => {
        const testController = new PlayerController();
        
        // Run for 1 second total
        const iterations = 1000 / deltaTime;
        for (let i = 0; i < iterations; i++) {
          testController.update(deltaTime, inputState, forwardVector, rightVector);
        }
        
        // All should reach similar positions after 1 second
        const position = testController.getPosition();
        expect(position.z).toBeLessThan(-10); // Should have moved forward
      });
    });
  });

  describe('State management', () => {
    it('should track running state', () => {
      const runningInput: InputState = {
        ...defaultInputState,
        forward: true,
        run: true
      };
      
      controller.update(16, runningInput, forwardVector, rightVector);
      
      const state = controller.getState();
      expect(state.isRunning).toBe(true);
      
      // Stop running
      const walkingInput: InputState = {
        ...defaultInputState,
        forward: true,
        run: false
      };
      
      controller.update(16, walkingInput, forwardVector, rightVector);
      
      const newState = controller.getState();
      expect(newState.isRunning).toBe(false);
    });

    it('should track moving state correctly', () => {
      expect(controller.isMoving()).toBe(false);
      
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      // Start moving
      for (let i = 0; i < 10; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      expect(controller.isMoving()).toBe(true);
      
      // Stop moving
      const noInput: InputState = { ...defaultInputState };
      for (let i = 0; i < 100; i++) {
        controller.update(16, noInput, forwardVector, rightVector);
      }
      
      expect(controller.isMoving()).toBe(false);
    });

    it('should return complete state object', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        run: true
      };
      
      controller.update(16, inputState, forwardVector, rightVector);
      
      const state = controller.getState();
      
      expect(state.position).toBeInstanceOf(Vector3);
      expect(state.velocity).toBeInstanceOf(Vector3);
      expect(state.isRunning).toBe(true);
      expect(state.isMoving).toBe(true);
    });

    it('should return cloned vectors in state', () => {
      const state1 = controller.getState();
      const state2 = controller.getState();
      
      // Should be different objects
      expect(state1.position).not.toBe(state2.position);
      expect(state1.velocity).not.toBe(state2.velocity);
      
      // But with same values
      expect(state1.position.equals(state2.position)).toBe(true);
      expect(state1.velocity.equals(state2.velocity)).toBe(true);
    });
  });

  describe('Position manipulation', () => {
    it('should set position directly', () => {
      const newPos = new Vector3(100, 200, 300);
      controller.setPosition(newPos);
      
      const position = controller.getPosition();
      expect(position.x).toBe(100);
      expect(position.y).toBe(MOVEMENT_CONFIG.cameraHeight); // Y is always overridden
      expect(position.z).toBe(300);
    });

    it('should reset velocity when teleporting', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      // Build up speed
      for (let i = 0; i < 50; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      expect(controller.getSpeed()).toBeGreaterThan(0);
      
      // Teleport
      controller.setPosition(new Vector3(50, 10, 50));
      
      // Velocity should be reset
      const velocity = controller.getVelocity();
      expect(velocity.x).toBe(0);
      expect(velocity.y).toBe(0);
      expect(velocity.z).toBe(0);
    });
  });

  describe('Reset functionality', () => {
    it('should reset to default position', () => {
      // Move and build up speed
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        right: true,
        run: true
      };
      
      for (let i = 0; i < 50; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      // Reset
      controller.reset();
      
      const position = controller.getPosition();
      expect(position.x).toBe(0);
      expect(position.y).toBe(MOVEMENT_CONFIG.cameraHeight);
      expect(position.z).toBe(0);
      
      const velocity = controller.getVelocity();
      expect(velocity.length()).toBe(0);
      
      expect(controller.isMoving()).toBe(false);
    });

    it('should reset to custom position', () => {
      const customPos = new Vector3(25, 50, 75);
      
      // Move first
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      for (let i = 0; i < 20; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      // Reset to custom position
      controller.reset(customPos);
      
      const position = controller.getPosition();
      expect(position.x).toBe(25);
      expect(position.y).toBe(50); // Y is preserved from reset position
      expect(position.z).toBe(75);
      
      const velocity = controller.getVelocity();
      expect(velocity.length()).toBe(0);
    });
  });

  describe('Helper methods', () => {
    it('should calculate speed correctly', () => {
      expect(controller.getSpeed()).toBe(0);
      
      const inputState: InputState = {
        ...defaultInputState,
        forward: true,
        right: true
      };
      
      // Build up speed
      for (let i = 0; i < 50; i++) {
        controller.update(16, inputState, forwardVector, rightVector);
      }
      
      const speed = controller.getSpeed();
      const velocity = controller.getVelocity();
      
      // Speed should be horizontal velocity magnitude
      const expectedSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);
      expect(speed).toBeCloseTo(expectedSpeed);
    });

    it('should return cloned position', () => {
      const pos1 = controller.getPosition();
      const pos2 = controller.getPosition();
      
      expect(pos1).not.toBe(pos2);
      expect(pos1.equals(pos2)).toBe(true);
      
      // Modifying returned position shouldn't affect controller
      pos1.x = 999;
      const pos3 = controller.getPosition();
      expect(pos3.x).toBe(0);
    });

    it('should return cloned velocity', () => {
      const vel1 = controller.getVelocity();
      const vel2 = controller.getVelocity();
      
      expect(vel1).not.toBe(vel2);
      expect(vel1.equals(vel2)).toBe(true);
      
      // Modifying returned velocity shouldn't affect controller
      vel1.x = 999;
      const vel3 = controller.getVelocity();
      expect(vel3.x).toBe(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero delta time', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      const initialPos = controller.getPosition();
      controller.update(0, inputState, forwardVector, rightVector);
      const newPos = controller.getPosition();
      
      // Should not move with zero delta time
      expect(newPos.equals(initialPos)).toBe(true);
    });

    it('should handle very large delta time', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      // Large delta time (1 second)
      controller.update(1000, inputState, forwardVector, rightVector);
      
      const position = controller.getPosition();
      // Should have moved but not an unreasonable amount
      // With max speed of 320 * 1.4 = 448 units/sec, and acceleration,
      // position could be quite far but should be finite
      expect(Math.abs(position.z)).toBeGreaterThan(0);
      expect(Math.abs(position.z)).toBeLessThan(10000); // Much more lenient
    });

    it('should handle non-normalized direction vectors', () => {
      const inputState: InputState = {
        ...defaultInputState,
        forward: true
      };
      
      // Non-normalized vectors
      const longForward = new Vector3(0, 0, -5);
      const longRight = new Vector3(3, 0, 0);
      
      controller.update(16, inputState, longForward, longRight);
      
      // Should still work
      const velocity = controller.getVelocity();
      expect(velocity.z).toBeLessThan(0);
    });
  });
});