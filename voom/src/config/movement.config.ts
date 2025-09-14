/**
 * Movement configuration constants for DOOM-style FPS movement
 */
export const MOVEMENT_CONFIG = {
  // Movement speeds (units per second)
  walkSpeed: 320, // Classic DOOM walk speed
  runMultiplier: 1.4, // Sprint speed multiplier (448 units/sec when running)
  
  // Mouse sensitivity
  mouseSensitivity: 0.002,
  maxLookAngleVertical: Math.PI / 3, // 60 degrees up/down limit
  
  // Physics
  friction: 10, // How quickly player stops when no input
  acceleration: 20, // How quickly player reaches max speed
  
  // Camera
  cameraHeight: 41, // DOOM eye level in units
  
  // Diagonal movement normalization
  diagonalFactor: 0.707, // 1/sqrt(2) for proper diagonal speed
} as const;

export type MovementConfig = typeof MOVEMENT_CONFIG;