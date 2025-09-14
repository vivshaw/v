// Debug test script to run in browser console
// Copy and paste this into the browser console to test the movement system

console.log('=== VOOM Debug Test ===');

// Check if canvas exists
const canvas = document.getElementById('game-canvas');
console.log('Canvas found:', !!canvas);

// Check if overlay exists
const overlay = document.getElementById('controls-overlay');
console.log('Overlay found:', !!overlay);
if (overlay) {
  console.log('Overlay visible:', overlay.style.opacity !== '0');
  console.log('Overlay pointer-events:', overlay.style.pointerEvents);
}

// Try to trigger pointer lock
if (canvas) {
  console.log('Attempting to request pointer lock...');
  canvas.requestPointerLock();
  
  setTimeout(() => {
    console.log('Pointer lock element:', document.pointerLockElement);
    console.log('Is locked to canvas:', document.pointerLockElement === canvas);
  }, 100);
}

// Check for event listeners
console.log('Testing event listeners...');

// Test click
const clickEvent = new MouseEvent('click', {
  view: window,
  bubbles: true,
  cancelable: true
});

if (canvas) {
  console.log('Dispatching click event to canvas...');
  canvas.dispatchEvent(clickEvent);
}

// Monitor keyboard events
console.log('Press W, A, S, D to test keyboard input');
console.log('Press ESC to unlock pointer');
console.log('Move mouse to test mouse look');