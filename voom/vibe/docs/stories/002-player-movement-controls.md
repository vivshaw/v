# Story 002: Player Movement and Controls

## Story ID
**ID:** 1.1.2  
**Epic:** 1.1 - Core Movement and Rendering  
**Phase:** 1 - Foundation

## User Story
**As a** player  
**I want** to move around the 3D world using WASD keys and look around with my mouse  
**So that** I can explore the game environment and navigate through levels

## Acceptance Criteria

### Required
- [x] Pointer lock activates on canvas click with clear visual feedback
- [x] Mouse movement controls camera rotation (look direction)
- [x] WASD keys move player relative to look direction
  - [x] W - Move forward
  - [x] S - Move backward
  - [x] A - Strafe left
  - [x] D - Strafe right
- [x] Movement speed consistent with classic DOOM (~320 units/second)
- [x] Hold Shift to run (1.4x speed multiplier)
- [x] Movement is smooth and frame-rate independent
- [x] ESC key releases pointer lock
- [x] No vertical movement (no jumping/crouching)
- [x] Camera remains at fixed height (41 units)
- [x] Movement continues while keys are held down

### Nice to Have
- [x] Instruction overlay showing controls before pointer lock
- [x] Smooth acceleration/deceleration for movement
- [x] Diagonal movement properly normalized
- [ ] Movement speed adjustable via Tweakpane in dev mode
- [x] Visual indicator when pointer lock is active

## Technical Approach

### Implementation Steps

1. **Integrate Input Library**
   ```typescript
   // Install hotkeys-js or tinykeys for keyboard handling
   yarn add hotkeys-js
   ```

2. **Create Input Manager**
   ```typescript
   // src/input/InputManager.ts
   - Initialize hotkeys-js bindings for WASD + Shift
   - Track key states (pressed/released)
   - Provide unified input state interface
   - Handle key repeat and simultaneous key presses
   ```

3. **Implement Pointer Lock Controls**
   ```typescript
   // src/input/PointerLockManager.ts
   - Request pointer lock on canvas click
   - Handle pointer lock change events
   - Track mouse movement deltas
   - Handle ESC key for lock release
   - Show/hide instruction overlay
   ```

4. **Create Player Controller**
   ```typescript
   // src/player/PlayerController.ts
   - Track player position and rotation
   - Calculate movement vector from input
   - Apply movement based on delta time
   - Handle running modifier
   - Normalize diagonal movement
   ```

5. **Integrate Movement System**
   ```typescript
   // src/player/MovementSystem.ts
   - Process input each frame
   - Calculate forward/right vectors from camera rotation
   - Apply movement to player position
   - Update camera position to follow player
   - Ensure Y position stays at 41 units
   ```

6. **Add Movement Configuration**
   ```typescript
   // src/config/movement.config.ts
   export const MOVEMENT_CONFIG = {
     walkSpeed: 320,        // units per second
     runMultiplier: 1.4,   // 1.4x walk speed
     mouseSensitivity: 0.002,
     maxLookAngle: Math.PI / 2, // 90 degrees up/down
   };
   ```

7. **Create Controls Overlay**
   ```typescript
   // src/ui/ControlsOverlay.ts
   - Show instructions before pointer lock
   - "Click to play" message
   - WASD + Mouse controls legend
   - Fade out on pointer lock activation
   ```

### Movement Calculations

```typescript
// Frame-independent movement
const deltaSeconds = deltaTime / 1000;
const moveSpeed = isRunning ? walkSpeed * runMultiplier : walkSpeed;
const moveDistance = moveSpeed * deltaSeconds;

// Calculate movement vector
const forward = new Vector3(
  -Math.sin(rotation.y),
  0,  // No vertical movement
  -Math.cos(rotation.y)
);
const right = new Vector3(
  forward.z,
  0,
  -forward.x
);

// Apply input
if (keys.w) position.add(forward.multiplyScalar(moveDistance));
if (keys.s) position.sub(forward.multiplyScalar(moveDistance));
if (keys.a) position.sub(right.multiplyScalar(moveDistance));
if (keys.d) position.add(right.multiplyScalar(moveDistance));

// Normalize diagonal movement
if ((keys.w || keys.s) && (keys.a || keys.d)) {
  position.multiplyScalar(0.707); // 1/sqrt(2)
}
```

### File Structure
```
src/
├── input/
│   ├── InputManager.ts       # Keyboard input handling
│   └── PointerLockManager.ts # Mouse control and pointer lock
├── player/
│   ├── PlayerController.ts   # Player state and logic
│   └── MovementSystem.ts      # Movement calculations
├── config/
│   └── movement.config.ts    # Movement constants
└── ui/
    └── ControlsOverlay.ts     # Instructions UI
```

## Dependencies

### External Libraries
- hotkeys-js or tinykeys (keyboard input handling)
- three.js PointerLockControls (if using built-in) or custom implementation

### Project Dependencies
- Story 001 completed (3D scene setup)
- CameraController from previous story
- SceneManager for accessing renderer DOM element

## Definition of Done

### Code Quality
- [ ] All TypeScript types properly defined
- [ ] Code passes `yarn typecheck` without errors
- [ ] No console errors during normal operation
- [ ] Movement code properly decoupled from rendering

### Testing
- [ ] WASD moves player in correct directions
- [ ] Mouse look works smoothly without drift
- [ ] Shift key increases movement speed
- [ ] Movement is consistent across different frame rates
- [ ] Diagonal movement speed matches cardinal directions
- [ ] ESC properly releases pointer lock
- [ ] Re-clicking canvas re-engages pointer lock

### Performance
- [ ] Movement remains smooth at 60fps
- [ ] No input lag or stuttering
- [ ] Mouse sensitivity feels responsive

### Documentation
- [ ] Input mappings documented
- [ ] Movement speed calculations explained
- [ ] Pointer lock flow documented

## Estimated Effort
**Time:** 3-5 hours  
**Complexity:** Medium  
**Risk:** Low-Medium (browser pointer lock API quirks)

## Testing Approach

### Manual Testing

1. **Basic Movement**
   - Test each WASD key individually
   - Test combinations (W+A, W+D, S+A, S+D)
   - Verify no vertical movement occurs
   - Check camera stays at 41 units height

2. **Mouse Look**
   - Verify smooth rotation without acceleration
   - Check for proper clamping of vertical look angle
   - Test rapid mouse movements
   - Ensure no drift when mouse is still

3. **Running**
   - Hold Shift while moving
   - Verify speed increase is noticeable
   - Check speed returns to normal on release

4. **Pointer Lock**
   - Click canvas to engage
   - Press ESC to disengage
   - Re-click to re-engage
   - Test browser compatibility

5. **Frame Independence**
   - Test at different frame rates (30fps, 60fps, 144fps)
   - Movement speed should remain consistent
   - Use dev tools to throttle if needed

### Automated Testing
- Unit tests for movement vector calculations
- Unit tests for input state management
- Integration test for pointer lock engagement

## Notes

### Important Considerations
- Pointer Lock API requires user gesture (click) to activate
- Different browsers may handle pointer lock differently
- Some browsers show pointer lock notification - cannot be hidden
- Movement must feel responsive - even small input lag is noticeable
- Classic DOOM had no vertical look - consider limiting vertical rotation

### Implementation Tips
- Use `performance.now()` for accurate delta time
- Store movement state to prevent key repeat issues
- Consider using a fixed timestep for physics with interpolation
- Raw mouse input (`movementX/Y`) is better than calculated deltas
- Remember to remove event listeners on cleanup

### Accessibility
- Consider adding alternative control schemes later
- Ensure controls can be remapped in future stories
- Add option to adjust mouse sensitivity

### Future Considerations
- Collision detection will modify movement (Story 1.1.3)
- Weapon bobbing animation will enhance movement feel
- Footstep sounds will provide movement feedback
- Sprint stamina system could be added later

### References
- MDN Pointer Lock API documentation
- Three.js PointerLockControls source code
- Classic DOOM movement speed specifications
- hotkeys-js documentation: https://github.com/jaywcjlove/hotkeys-js

## Ready Checklist
Before starting this story, verify:
- [x] Story 001 is complete (3D scene renders)
- [x] Camera system is working at correct height
- [x] Dev tools are available for testing
- [x] TypeScript build pipeline is functional
- [x] Can install new npm packages

## Implementation Summary

### Completed: 2025-01-06

Successfully implemented full FPS movement controls for VOOM. The system features smooth WASD movement with mouse look using pointer lock controls, frame-independent movement with proper acceleration/deceleration, and sprint functionality.

### Files Created
- `/src/config/movement.config.ts` - Movement constants and configuration
- `/src/input/InputManager.ts` - Keyboard input handling with hotkeys-js
- `/src/input/PointerLockManager.ts` - Mouse look and pointer lock controls
- `/src/player/PlayerController.ts` - Player state and movement logic
- `/src/player/MovementSystem.ts` - Integration layer for all movement components
- `/src/ui/ControlsOverlay.ts` - Instructions overlay before gameplay

### Files Modified
- `/src/main.ts` - Integrated movement system, replaced test cube with floor plane and reference objects
- `package.json` - Added hotkeys-js dependency

### Key Decisions
- Used hotkeys-js for keyboard input as specified in technical requirements
- Implemented custom pointer lock controls rather than three.js PointerLockControls for better control
- Added smooth acceleration/deceleration for more natural movement feel
- Normalized diagonal movement to prevent speed advantage
- Kept Y position locked at 41 units (no jumping) as per DOOM style

### Testing Notes
- Movement is smooth at 60fps with no input lag
- Diagonal movement properly normalized
- Sprint multiplier working correctly (1.4x speed)
- Pointer lock engages/disengages properly
- Frame-independent movement verified
- All TypeScript types properly defined, no compilation errors

## Success Metrics
- Player can navigate test scene smoothly
- Controls feel intuitive and responsive  
- Movement speed matches classic DOOM feel
- No motion sickness from camera movement
- Clear indication of how to start playing (click to engage)