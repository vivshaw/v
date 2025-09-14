import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputManager, InputState } from '../InputManager';

describe('InputManager', () => {
  let manager: InputManager;
  let mockListener: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    manager = new InputManager();
    mockListener = vi.fn();
  });

  afterEach(() => {
    manager.dispose();
  });

  describe('Input enable/disable', () => {
    it('should start with input disabled', () => {
      expect(manager.getIsEnabled()).toBe(false);
    });

    it('should enable input when enable() is called', () => {
      manager.enable();
      expect(manager.getIsEnabled()).toBe(true);
    });

    it('should disable input when disable() is called', () => {
      manager.enable();
      expect(manager.getIsEnabled()).toBe(true);
      
      manager.disable();
      expect(manager.getIsEnabled()).toBe(false);
    });

    it('should reset state when enabling', () => {
      // Set up a state with keys pressed (bypassing disabled check)
      manager.enable();
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event);
      
      let state = manager.getState();
      expect(state.forward).toBe(true);
      
      // Disable and re-enable
      manager.disable();
      manager.enable();
      
      // State should be reset
      state = manager.getState();
      expect(state.forward).toBe(false);
      expect(state.backward).toBe(false);
      expect(state.left).toBe(false);
      expect(state.right).toBe(false);
      expect(state.run).toBe(false);
    });

    it('should ignore input when disabled', () => {
      manager.addListener(mockListener);
      
      // Ensure disabled
      expect(manager.getIsEnabled()).toBe(false);
      
      // Try various inputs
      const events = [
        new KeyboardEvent('keydown', { code: 'KeyW' }),
        new KeyboardEvent('keydown', { code: 'KeyA' }),
        new KeyboardEvent('keydown', { code: 'KeyS' }),
        new KeyboardEvent('keydown', { code: 'KeyD' }),
        new KeyboardEvent('keydown', { code: 'ShiftLeft' })
      ];
      
      events.forEach(event => document.dispatchEvent(event));
      
      // State should remain unchanged
      const state = manager.getState();
      expect(state.forward).toBe(false);
      expect(state.backward).toBe(false);
      expect(state.left).toBe(false);
      expect(state.right).toBe(false);
      expect(state.run).toBe(false);
      
      // Listener should not have been called
      expect(mockListener).not.toHaveBeenCalled();
    });

    it('should process input when enabled', () => {
      manager.enable();
      manager.addListener(mockListener);
      
      // Press W key
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event);
      
      // State should be updated
      const state = manager.getState();
      expect(state.forward).toBe(true);
      
      // Listener should have been called
      expect(mockListener).toHaveBeenCalledWith(expect.objectContaining({
        forward: true
      }));
    });
  });

  describe('Key state management', () => {
    beforeEach(() => {
      manager.enable();
      manager.addListener(mockListener);
    });

    it('should handle W key for forward movement', () => {
      // Press W
      const downEvent = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(downEvent);
      
      let state = manager.getState();
      expect(state.forward).toBe(true);
      expect(mockListener).toHaveBeenCalledWith(expect.objectContaining({ forward: true }));
      
      // Release W
      mockListener.mockClear();
      const upEvent = new KeyboardEvent('keyup', { code: 'KeyW' });
      document.dispatchEvent(upEvent);
      
      state = manager.getState();
      expect(state.forward).toBe(false);
      expect(mockListener).toHaveBeenCalledWith(expect.objectContaining({ forward: false }));
    });

    it('should handle S key for backward movement', () => {
      // Press S
      const downEvent = new KeyboardEvent('keydown', { code: 'KeyS' });
      document.dispatchEvent(downEvent);
      
      let state = manager.getState();
      expect(state.backward).toBe(true);
      
      // Release S
      const upEvent = new KeyboardEvent('keyup', { code: 'KeyS' });
      document.dispatchEvent(upEvent);
      
      state = manager.getState();
      expect(state.backward).toBe(false);
    });

    it('should handle A key for left movement', () => {
      // Press A
      const downEvent = new KeyboardEvent('keydown', { code: 'KeyA' });
      document.dispatchEvent(downEvent);
      
      let state = manager.getState();
      expect(state.left).toBe(true);
      
      // Release A
      const upEvent = new KeyboardEvent('keyup', { code: 'KeyA' });
      document.dispatchEvent(upEvent);
      
      state = manager.getState();
      expect(state.left).toBe(false);
    });

    it('should handle D key for right movement', () => {
      // Press D
      const downEvent = new KeyboardEvent('keydown', { code: 'KeyD' });
      document.dispatchEvent(downEvent);
      
      let state = manager.getState();
      expect(state.right).toBe(true);
      
      // Release D
      const upEvent = new KeyboardEvent('keyup', { code: 'KeyD' });
      document.dispatchEvent(upEvent);
      
      state = manager.getState();
      expect(state.right).toBe(false);
    });

    it('should handle Shift key for running', () => {
      // Press Shift
      const downEvent = new KeyboardEvent('keydown', { code: 'ShiftLeft' });
      document.dispatchEvent(downEvent);
      
      let state = manager.getState();
      expect(state.run).toBe(true);
      
      // Release Shift
      const upEvent = new KeyboardEvent('keyup', { code: 'ShiftLeft' });
      document.dispatchEvent(upEvent);
      
      state = manager.getState();
      expect(state.run).toBe(false);
    });

    it('should handle arrow keys as alternatives', () => {
      // Test arrow keys
      const tests = [
        { down: 'ArrowUp', up: 'ArrowUp', field: 'forward' as keyof InputState },
        { down: 'ArrowDown', up: 'ArrowDown', field: 'backward' as keyof InputState },
        { down: 'ArrowLeft', up: 'ArrowLeft', field: 'left' as keyof InputState },
        { down: 'ArrowRight', up: 'ArrowRight', field: 'right' as keyof InputState }
      ];
      
      tests.forEach(test => {
        // Press
        const downEvent = new KeyboardEvent('keydown', { code: test.down });
        document.dispatchEvent(downEvent);
        
        let state = manager.getState();
        expect(state[test.field]).toBe(true);
        
        // Release
        const upEvent = new KeyboardEvent('keyup', { code: test.up });
        document.dispatchEvent(upEvent);
        
        state = manager.getState();
        expect(state[test.field]).toBe(false);
      });
    });

    it('should handle Escape key specially', () => {
      const escapeDown = new KeyboardEvent('keydown', { code: 'Escape' });
      document.dispatchEvent(escapeDown);
      
      // Escape should be set temporarily
      let state = manager.getState();
      expect(state.escape).toBe(true);
      
      // Wait for automatic reset
      return new Promise<void>(resolve => {
        setTimeout(() => {
          state = manager.getState();
          expect(state.escape).toBe(false);
          resolve();
        }, 150);
      });
    });

    it('should ignore key repeats', () => {
      mockListener.mockClear();
      
      // First press
      const event1 = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event1);
      expect(mockListener).toHaveBeenCalledTimes(1);
      
      // Simulate key repeat (same key without keyup)
      const event2 = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event2);
      
      // Should not trigger another state change
      expect(mockListener).toHaveBeenCalledTimes(1);
    });

    it('should prevent default on movement keys', () => {
      const keys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft'];
      
      keys.forEach(code => {
        const event = new KeyboardEvent('keydown', { code, cancelable: true });
        const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
        
        document.dispatchEvent(event);
        expect(preventDefaultSpy).toHaveBeenCalled();
      });
    });
  });

  describe('Multiple simultaneous keys', () => {
    beforeEach(() => {
      manager.enable();
      manager.addListener(mockListener);
    });

    it('should handle multiple keys pressed simultaneously', () => {
      // Press W and D together
      const wDown = new KeyboardEvent('keydown', { code: 'KeyW' });
      const dDown = new KeyboardEvent('keydown', { code: 'KeyD' });
      
      document.dispatchEvent(wDown);
      document.dispatchEvent(dDown);
      
      const state = manager.getState();
      expect(state.forward).toBe(true);
      expect(state.right).toBe(true);
      expect(state.backward).toBe(false);
      expect(state.left).toBe(false);
    });

    it('should handle all movement keys at once', () => {
      // Press all movement keys
      const keys = [
        { code: 'KeyW', field: 'forward' as keyof InputState },
        { code: 'KeyA', field: 'left' as keyof InputState },
        { code: 'KeyS', field: 'backward' as keyof InputState },
        { code: 'KeyD', field: 'right' as keyof InputState },
        { code: 'ShiftLeft', field: 'run' as keyof InputState }
      ];
      
      // Press all keys
      keys.forEach(key => {
        const event = new KeyboardEvent('keydown', { code: key.code });
        document.dispatchEvent(event);
      });
      
      // All should be active
      const state = manager.getState();
      keys.forEach(key => {
        if (key.field !== 'escape') {
          expect(state[key.field]).toBe(true);
        }
      });
      
      // Release one key at a time
      keys.forEach(key => {
        const event = new KeyboardEvent('keyup', { code: key.code });
        document.dispatchEvent(event);
        
        const currentState = manager.getState();
        expect(currentState[key.field]).toBe(false);
      });
    });

    it('should handle opposing keys correctly', () => {
      // Press forward and backward simultaneously
      const wDown = new KeyboardEvent('keydown', { code: 'KeyW' });
      const sDown = new KeyboardEvent('keydown', { code: 'KeyS' });
      
      document.dispatchEvent(wDown);
      document.dispatchEvent(sDown);
      
      const state = manager.getState();
      expect(state.forward).toBe(true);
      expect(state.backward).toBe(true);
      
      // Release forward
      const wUp = new KeyboardEvent('keyup', { code: 'KeyW' });
      document.dispatchEvent(wUp);
      
      const state2 = manager.getState();
      expect(state2.forward).toBe(false);
      expect(state2.backward).toBe(true);
    });
  });

  describe('Listener management', () => {
    it('should add and notify listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      manager.addListener(listener1);
      manager.addListener(listener2);
      
      manager.enable();
      
      // Trigger a state change
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event);
      
      // Both listeners should be called
      expect(listener1).toHaveBeenCalledWith(expect.objectContaining({ forward: true }));
      expect(listener2).toHaveBeenCalledWith(expect.objectContaining({ forward: true }));
    });

    it('should remove listeners correctly', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      manager.addListener(listener1);
      manager.addListener(listener2);
      
      // Remove first listener
      manager.removeListener(listener1);
      
      manager.enable();
      
      // Trigger a state change
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event);
      
      // Only second listener should be called
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should handle removing non-existent listener gracefully', () => {
      const listener = vi.fn();
      
      // Should not throw
      expect(() => manager.removeListener(listener)).not.toThrow();
    });

    it('should notify listeners only on state changes', () => {
      const listener = vi.fn();
      manager.addListener(listener);
      manager.enable();
      
      // Enable() triggers a reset which notifies listeners
      expect(listener).toHaveBeenCalledTimes(1);
      listener.mockClear();
      
      // Press W
      const wDown = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(wDown);
      expect(listener).toHaveBeenCalledTimes(1);
      
      // Press W again (should be ignored as repeat)
      document.dispatchEvent(wDown);
      expect(listener).toHaveBeenCalledTimes(1);
      
      // Press A (different key)
      const aDown = new KeyboardEvent('keydown', { code: 'KeyA' });
      document.dispatchEvent(aDown);
      expect(listener).toHaveBeenCalledTimes(2);
    });
  });

  describe('State management', () => {
    it('should return a copy of state, not reference', () => {
      const state1 = manager.getState();
      const state2 = manager.getState();
      
      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it('should reset all states correctly', () => {
      manager.enable();
      
      // Set multiple keys
      const keys = ['KeyW', 'KeyA', 'ShiftLeft'];
      keys.forEach(code => {
        const event = new KeyboardEvent('keydown', { code });
        document.dispatchEvent(event);
      });
      
      // Verify keys are set
      let state = manager.getState();
      expect(state.forward).toBe(true);
      expect(state.left).toBe(true);
      expect(state.run).toBe(true);
      
      // Reset
      manager.reset();
      
      // All should be false
      state = manager.getState();
      expect(state.forward).toBe(false);
      expect(state.backward).toBe(false);
      expect(state.left).toBe(false);
      expect(state.right).toBe(false);
      expect(state.run).toBe(false);
      expect(state.escape).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on dispose', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
      
      manager.dispose();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
      
      removeEventListenerSpy.mockRestore();
    });

    it('should clear pressed keys on dispose', () => {
      manager.enable();
      
      // Press some keys
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event);
      
      manager.dispose();
      
      // Create new manager and enable
      const newManager = new InputManager();
      newManager.enable();
      
      // Old key state should not affect new manager
      const state = newManager.getState();
      expect(state.forward).toBe(false);
      
      newManager.dispose();
    });

    it('should remove all listeners on dispose', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      manager.addListener(listener1);
      manager.addListener(listener2);
      manager.enable();
      
      // Clear any calls from enable()
      listener1.mockClear();
      listener2.mockClear();
      
      manager.dispose();
      
      // Try to trigger state change (should not work)
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event);
      
      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).not.toHaveBeenCalled();
    });

    it('should reset state on dispose', () => {
      manager.enable();
      
      // Set some state
      const event = new KeyboardEvent('keydown', { code: 'KeyW' });
      document.dispatchEvent(event);
      
      manager.dispose();
      
      // State should be reset (can't test directly after dispose, but can test side effects)
      // Creating a new manager should have clean state
      const newManager = new InputManager();
      const state = newManager.getState();
      
      expect(state.forward).toBe(false);
      expect(state.backward).toBe(false);
      expect(state.left).toBe(false);
      expect(state.right).toBe(false);
      expect(state.run).toBe(false);
      expect(state.escape).toBe(false);
      
      newManager.dispose();
    });
  });
});