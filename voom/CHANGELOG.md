# CHANGELOG

## [0.1.0] - 2025-09-06

### Added
- Basic first-person movement with WASD controls and mouse look
- Pointer lock controls with on-screen instructions overlay
- Debug testing utilities accessible via browser console

### Fixed
- Fixed mouse input accumulation causing lost movements between frames
- Fixed keyboard input not registering continuous key presses
- Fixed controls overlay blocking canvas pointer lock activation
- Fixed memory leaks in event listener cleanup on dispose

### Changed
- Replaced hotkeys-js with native keyboard event handlers for better game input support
