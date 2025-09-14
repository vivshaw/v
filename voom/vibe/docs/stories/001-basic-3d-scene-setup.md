# Story 001: Basic 3D Scene Setup

## Story ID
**ID:** 1.1.1  
**Epic:** 1.1 - Core Movement and Rendering  
**Phase:** 1 - Foundation

## User Story
**As a** player  
**I want** to see a 3D first-person view when the game loads  
**So that** I can experience the game world from the correct perspective

## Acceptance Criteria

### Required
- [ ] Canvas element renders full viewport (100vw x 100vh)
- [ ] Three.js scene initializes with WebGLRenderer
- [ ] PerspectiveCamera configured with appropriate FOV (75-90 degrees)
- [ ] Camera positioned at standard DOOM eye level (~41 units)
- [ ] Scene renders at 60fps on mid-range hardware
- [ ] Responsive canvas resizing on window resize
- [ ] Clear color/skybox visible as background
- [ ] Basic lighting setup (ambient + directional light)
- [ ] Pixelated rendering style applied (nearest neighbor filtering)

### Nice to Have
- [ ] FPS counter visible in dev mode
- [ ] Basic debug axes helper in dev mode
- [ ] Tweakpane integration for camera settings adjustment

## Technical Approach

### Implementation Steps

1. **Initialize Vite Project Structure**
   - Ensure TypeScript entrypoint at `src/main.ts`
   - Configure canvas element in `index.html`
   - Set up proper viewport meta tags

2. **Create Core Renderer Module**
   ```typescript
   // src/renderer/SceneManager.ts
   - Initialize WebGLRenderer with antialias: false
   - Set pixelRatio for retina displays
   - Configure shadow mapping (PCFSoftShadowMap)
   - Set clear color to dark gray (#1a1a1a)
   ```

3. **Configure Camera System**
   ```typescript
   // src/renderer/CameraController.ts
   - PerspectiveCamera with FOV: 75
   - Aspect ratio from window dimensions
   - Near plane: 0.1, Far plane: 1000
   - Initial position: (0, 41, 0) for DOOM eye level
   ```

4. **Set Up Lighting**
   ```typescript
   // src/renderer/LightingSetup.ts
   - AmbientLight with low intensity (0.3)
   - DirectionalLight for main illumination
   - Configure shadow casting for directional light
   ```

5. **Implement Resize Handler**
   - Listen to window resize events
   - Update camera aspect ratio
   - Update renderer size
   - Maintain pixel-perfect scaling

6. **Apply Retro Visual Style**
   - Set texture filtering to NearestFilter
   - Configure CSS `image-rendering: pixelated`
   - Optional: RenderPixelatedPass for post-processing

7. **Add Dev Tools (Dev Build Only)**
   - Integrate stats.js for FPS monitoring
   - Add conditional Tweakpane for runtime adjustments
   - Include AxesHelper for orientation debugging

### File Structure
```
src/
├── main.ts                 # Entry point, initialize scene
├── renderer/
│   ├── SceneManager.ts     # Three.js scene setup
│   ├── CameraController.ts # Camera configuration
│   └── LightingSetup.ts    # Lighting configuration
├── utils/
│   └── DevTools.ts         # Dev-only tools (FPS, debug)
└── types/
    └── renderer.types.ts   # TypeScript interfaces
```

## Dependencies

### External Libraries
- three.js (core 3D rendering)
- stats.js (FPS monitoring - dev only)
- tweakpane (runtime adjustments - dev only)

### Project Dependencies
- Vite configuration must be set up
- TypeScript configuration in place
- Basic HTML template with canvas element

## Definition of Done

### Code Quality
- [ ] All TypeScript types properly defined (no `any` types)
- [ ] Code passes `yarn typecheck` without errors
- [ ] No console errors or warnings in browser
- [ ] Code follows existing project patterns

### Testing
- [ ] Scene renders in Chrome, Firefox, Safari (2020+ versions)
- [ ] Maintains 60fps on test hardware
- [ ] Window resizing maintains correct aspect ratio
- [ ] Pixelated rendering style clearly visible

### Documentation
- [ ] Inline comments for complex calculations
- [ ] JSDoc comments for public methods
- [ ] README updated with run instructions if needed

## Estimated Effort
**Time:** 2-4 hours  
**Complexity:** Low-Medium  
**Risk:** Low (foundational web tech)

## Testing Approach

### Manual Testing
1. **Visual Verification**
   - Load page, verify 3D scene renders
   - Check background color/clear color
   - Verify pixelated visual style
   - Confirm full viewport coverage

2. **Performance Testing**
   - Monitor FPS counter (should maintain 60fps)
   - Test on multiple screen sizes
   - Verify no memory leaks over time

3. **Resize Testing**
   - Resize browser window
   - Check canvas scales correctly
   - Verify no distortion or stretching

4. **Browser Compatibility**
   - Test in Chrome (latest)
   - Test in Firefox (latest)
   - Test in Safari (if available)
   - Verify WebGL support detection

### Automated Testing
- TypeScript compilation: `yarn typecheck`
- Consider adding basic unit tests for camera calculations

## Notes

### Important Considerations
- This is the foundation for all other features - must be solid
- Performance baseline established here affects entire project
- Camera settings (FOV, position) should match classic DOOM feel
- Renderer configuration impacts all future visual features

### Future Considerations
- Scene structure will need to support level loading
- Camera will need PointerLockControls integration (Story 1.1.2)
- Renderer may need optimization passes later (frustum culling)
- Consider modular architecture for easy feature addition

### References
- Three.js documentation: https://threejs.org/docs/
- Classic DOOM technical specs for camera height/FOV
- WebGL best practices for performance

## Implementation Summary

### Completed: 2025-09-06

**What was built:**
Successfully implemented a complete 3D scene setup with Three.js, featuring a WebGL renderer, perspective camera positioned at DOOM eye level, and full viewport rendering with pixelated aesthetic. The implementation includes responsive resizing, dev tools for monitoring, and a 60fps frame-limited render loop.

### Files Created/Modified

1. **Project Configuration:**
   - `package.json` - Added dependencies and scripts
   - `tsconfig.json` - TypeScript configuration with strict mode
   - `vite.config.ts` - Vite bundler configuration
   - `index.html` - HTML template with canvas and pixelated CSS

2. **Core Rendering System:**
   - `src/main.ts` - Main application entry point and game loop
   - `src/renderer/SceneManager.ts` - Three.js scene and renderer management
   - `src/renderer/CameraController.ts` - Camera setup with DOOM-style FOV and positioning
   - `src/renderer/LightingSetup.ts` - Ambient and directional lighting configuration

3. **Utilities:**
   - `src/utils/DevTools.ts` - Development tools (FPS counter, Tweakpane controls)
   - `src/types/renderer.types.ts` - TypeScript interfaces for type safety
   - `src/vite-env.d.ts` - Vite environment type definitions

### Key Decisions

1. **90-degree FOV:** Chose classic DOOM FOV for authentic feel
2. **41 unit eye height:** Matches original DOOM player perspective
3. **Modular architecture:** Separated concerns into distinct manager classes
4. **Dev-only tools:** Used import.meta.env.DEV to conditionally load dev tools
5. **Frame limiting:** Implemented 60fps cap using requestAnimationFrame timing
6. **Pixelated rendering:** Disabled antialiasing and applied CSS image-rendering

### Testing Notes

- TypeScript compilation passes with no errors (`yarn typecheck`)
- Dev server runs successfully on port 3000
- Visual verification shows:
  - Gray background (0x1a1a1a)
  - Green test cube rotating at eye level
  - FPS counter showing ~60fps
  - Tweakpane controls functional
  - Axes helper visible in scene
- Window resizing maintains proper aspect ratio
- Pixelated aesthetic applied correctly

### Completion Status

#### Required Acceptance Criteria:
- ✅ Canvas element renders full viewport (100vw x 100vh)
- ✅ Three.js scene initializes with WebGLRenderer
- ✅ PerspectiveCamera configured with 90-degree FOV
- ✅ Camera positioned at DOOM eye level (41 units)
- ✅ Scene renders at 60fps (frame-limited)
- ✅ Responsive canvas resizing on window resize
- ✅ Clear color visible as background (#1a1a1a)
- ✅ Basic lighting setup (ambient + directional)
- ✅ Pixelated rendering style applied

#### Nice to Have:
- ✅ FPS counter visible in dev mode
- ✅ Basic debug axes helper in dev mode
- ✅ Tweakpane integration for camera settings adjustment

All acceptance criteria have been met. The foundation is ready for adding player movement and controls.