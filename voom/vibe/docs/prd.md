# Product Requirements Document (PRD)

## Vision Recap

**Project:** VOOM - Browser-Based DOOM Clone
**Goal:** Deliver a faithful recreation of classic DOOM's E1M1 level as a browser-based game, demonstrating that complex 3D action games can run entirely client-side with modern web technologies.

## Core Requirements

### Functional Requirements

- **FR1:** First-person perspective with smooth WASD movement, mouse-look controls, and no jumping (staying true to classic DOOM)
- **FR2:** Hitscan-based combat system with multiple weapons, each with distinct damage, fire rate, and ammo consumption
- **FR3:** Enemy AI using A* pathfinding to actively hunt the player through the level
- **FR4:** Pickup system including health packs, armor, ammunition, weapons, and key cards for progression
- **FR5:** Complete recreation of DOOM's E1M1 level layout with proper collision detection and interactive elements

### Technical Requirements

- **Performance:** Consistent 60fps on mid-range hardware (2018+ devices), under 3 second load time on 4G
- **Browser Support:** Chrome, Firefox, Safari (2020+ versions) with WebGL support
- **Architecture:** Pure client-side application with no backend dependencies, deployable to static hosting
- **Testing:** All TypeScript code must pass type checking, comprehensive playtesting for game balance

## Tech Stack

- **Language:** TypeScript
- **Framework:** Vite for build tooling and development
- **Build Tools:** Vite bundler with hot module replacement
- **Testing:** yarn typecheck for type safety
- **Other:** three.js (3D rendering), detect-collisions (physics), easystar.js (AI pathfinding), hotkeys-js/tinykeys (input), Tiled (level editing)

## Implementation Roadmap

### Phase 1: Foundation
*Get the basics working*

**Epic 1.1: Core Movement and Rendering**
- Story 1.1.1: Set up three.js scene with WebGLRenderer and PerspectiveCamera
- Story 1.1.2: Implement WASD movement with PointerLockControls
- Story 1.1.3: Create test level from Tiled JSON with textured walls

**Epic 1.2: Basic Combat**
- Story 1.2.1: Implement pistol weapon with hitscan shooting via Raycaster
- Story 1.2.2: Add single enemy type with basic AI movement
- Story 1.2.3: Implement health system and death states for player and enemies

### Phase 2: Core Features
*Build the main functionality*

**Epic 2.1: Combat System**
- Story 2.1.1: Add shotgun with spread pattern mechanics
- Story 2.1.2: Implement 2-3 enemy types with varied behaviors and stats
- Story 2.1.3: Add damage feedback effects (screen flash, knockback)

**Epic 2.2: Pickup System**
- Story 2.2.1: Implement health and ammo pickups with collection mechanics
- Story 2.2.2: Add armor system with damage reduction calculations
- Story 2.2.3: Create weapon pickups to expand player arsenal

**Epic 2.3: Level Systems**
- Story 2.3.1: Implement key card system with locked doors
- Story 2.3.2: Add level exit trigger and victory condition
- Story 2.3.3: Create HUD showing health, armor, ammo, and keys

### Phase 3: Polish
*Make it ship-ready*

**Epic 3.1: E1M1 Recreation**
- Story 3.1.1: Convert full E1M1 layout to Tiled format with proper scale
- Story 3.1.2: Place all enemies, pickups, and secrets throughout level
- Story 3.1.3: Implement secret areas with bonus items

**Epic 3.2: Final Polish**
- Story 3.2.1: Add remaining weapons (chaingun, rocket launcher)
- Story 3.2.2: Implement sound effects and ambient audio
- Story 3.2.3: Add particle effects for impacts and explosions
- Story 3.2.4: Optimize rendering with frustum culling and LOD

## Notes

### Game Mechanics Details

**Movement System:**
- First-person camera height at standard DOOM eye level
- Movement speed with run modifier for tactical control
- 2D grid-based collision detection (no vertical collision needed)
- No jumping or crouching to maintain classic DOOM feel

**Combat Mechanics:**
- Instant hitscan weapons using three.js Raycaster from camera position
- Projectile weapons (rocket launcher) with visible projectiles and splash damage
- Enemy states: idle, alert, attacking, hurt, dead
- Line-of-sight checks for enemy awareness
- Damage calculation based on weapon type and distance

**Pickup Values:**
- Small health: +10 HP
- Medium health: +25 HP  
- Large health: +100 HP
- Green armor: 100 points, 1/3 damage reduction
- Blue armor: 200 points, 1/2 damage reduction
- Ammo pickups scaled per weapon type

**Enemy Types:**
- Zombie/Former Human: Slow, hitscan pistol, 20 HP
- Shotgun Guy: Medium speed, shotgun blast, 30 HP
- Imp: Fast, fireball projectile, 60 HP
- Demon/Pinky: Very fast, melee only, 150 HP
- Additional types in later phases

### Development Priorities

1. **Performance First:** Always maintain 60fps target, profile early and often
2. **Faithful Feel:** Movement and combat must feel like classic DOOM
3. **Progressive Enhancement:** Start simple, layer complexity
4. **No Scope Creep:** Single-player only, no multiplayer, no level editor
5. **Asset Efficiency:** Use texture atlases, compress appropriately

### Risk Mitigations

**Performance Risks:**
- Use frustum culling to limit rendered geometry
- Implement LOD system for distant objects
- Limit active AI entities to visible range
- Cache pathfinding results when possible

**Compatibility Risks:**
- Test across browsers from day one
- Use standard Web APIs only
- Provide graceful fallbacks for pointer lock
- Clear error messages for unsupported browsers

**Scope Risks:**
- Strict MVP definition with no feature additions
- Time-boxed development phases
- Regular playtesting to validate fun factor
- Clear "Definition of Done" for each phase

### Constraints

- Browser-only deployment (no desktop/mobile apps)
- Single-player experience only
- Public domain assets only (already provided)
- No backend services or external dependencies
- Mouse and keyboard required (no gamepad/touch)
- Target resolution: 1920x1080 (with responsive scaling)