# CHANGELOG

## 2025-09-06

### Fixed

#### Movement System Critical Fixes
- **Pointer Lock Callbacks**: Fixed callback overwrite preventing input enable
- **Keyboard Input**: Replaced hotkeys-js with raw keyboard event handlers for reliable keydown/keyup detection
  - hotkeys-js doesn't properly support continuous keydown/keyup states needed for game movement
  - Now using event.code for consistent key detection across keyboard layouts
  - Added proper key repeat prevention using Set to track pressed keys
  
- **Mouse Look**: Fixed mouse rotation accumulation issue in PointerLockManager
  - Changed from replacing to accumulating mouse deltas to prevent lost movements between frames
  - Mouse movements now properly accumulate until processed in the update loop
  
- **Render Loop**: Fixed deltaTime calculation issues
  - Removed frame limiting that was causing jerky movement
  - Now runs at full refresh rate for smoother input response
  - Properly initializes lastTime on first frame

- **Performance**: Disabled verbose debug logging for production performance
  - Commented out per-frame logging while keeping initialization logs
  - Reduced console spam for better game performance

### Previously Fixed
- Pointer lock WrongDocumentError from overlay conflict
- WASD movement not working due to hotkeys-js configuration
- **ControlsOverlay**: Fixed overlay blocking canvas click events by:
  - Changed pointer-events from 'none' to 'auto' on main overlay
  - Added click handler to overlay that forwards clicks to canvas
  - Properly hides overlay when pointer lock is engaged

- **PointerLockManager**: Fixed memory leaks and event handling by:
  - Stored bound function references for proper event listener cleanup
  - Fixed dispose() method to remove listeners correctly
  - Added debug logging to track pointer lock state changes
  - Added proper keyboard event handler for ESC key

- **InputManager**: Fixed input handling issues by:
  - Added enabled state check to all hotkey handlers
  - Fixed memory leak in dispose() by storing bound function reference
  - Added debug logging for enable/disable state changes
  - Ensured input only processes when pointer is locked

- **MovementSystem**: Added comprehensive debug logging to track:
  - System initialization
  - Lock state changes
  - Input detection
  - Update loop execution

### Added
- **DebugTester**: Created comprehensive debug testing utility that:
  - Tests DOM elements (canvas, overlay)
  - Tests pointer lock capability
  - Verifies event listeners are attached
  - Provides manual testing instructions
  - Exposes debug functions to browser console via `window.voomDebug`

- **Debug Logging**: Added detailed console logging throughout the movement system to help diagnose issues:
  - Pointer lock request/state changes
  - Input manager enable/disable
  - Movement system initialization
  - Main render loop status
  - Input detection

### Changed
- **index.html**: Added z-index to canvas element to ensure proper layering
- **main.ts**: Exposed game instance and debug tester to window object for console debugging
