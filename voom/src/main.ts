import { BoxGeometry, GridHelper, Mesh, MeshStandardMaterial, NearestFilter, PlaneGeometry, TextureLoader } from 'three';
import { SceneManager } from '@/renderer/SceneManager';
import { CameraController } from '@/renderer/CameraController';
import { LightingSetup } from '@/renderer/LightingSetup';
import { DevTools } from '@/utils/DevTools';
import { MovementSystem } from '@/player/MovementSystem';
import { ControlsOverlay } from '@/ui/ControlsOverlay';
import { DebugTester } from '@/debug/DebugTester';

/**
 * Main application class for VOOM
 */
class VoomGame {
  private sceneManager: SceneManager;
  private cameraController: CameraController;
  private lighting: LightingSetup;
  private devTools: DevTools;
  private movementSystem: MovementSystem;
  private controlsOverlay: ControlsOverlay;
  private animationId?: number;
  private lastTime: number = 0;

  constructor() {
    // Get canvas element
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas element not found');
    }

    // Initialize core systems
    this.sceneManager = new SceneManager({
      canvas,
      antialias: false, // Pixelated aesthetic
      pixelRatio: window.devicePixelRatio,
      clearColor: 0x1a1a1a,
    });

    this.cameraController = new CameraController({
      fov: 90, // DOOM-style FOV
      position: { x: 0, y: 41, z: 0 }, // Start at origin at player height
    });

    this.lighting = new LightingSetup(this.sceneManager.scene);

    // Initialize movement system
    this.movementSystem = new MovementSystem(this.cameraController.camera, canvas);

    // Initialize controls overlay
    this.controlsOverlay = new ControlsOverlay();

    // Set up pointer lock callback to hide overlay
    this.movementSystem.getPointerLockManager().setOnLockChange((locked: boolean) => {
      console.log('[Main] Pointer lock changed, locked:', locked);
      if (locked) {
        this.controlsOverlay.hide();
        console.log('[Main] Controls overlay hidden');
      } else {
        this.controlsOverlay.show();
        console.log('[Main] Controls overlay shown');
      }
    });

    // Initialize dev tools (only in dev mode)
    this.devTools = new DevTools({
      showFPS: true,
      showAxes: true,
      showTweakpane: true,
    });

    // Add dev tools to scene
    this.devTools.addAxesHelper(this.sceneManager.scene);
    this.devTools.addCameraControls(this.cameraController);
    this.devTools.addLightingControls(this.lighting);

    // Add floor for spatial reference
    this.addFloorPlane();

    // Set up event listeners
    this.setupEventListeners();

    // Configure texture loader for pixelated textures
    this.configureTextureLoader();

    // Start render loop
    this.startRenderLoop();
  }

  /**
   * Add floor plane for spatial reference
   */
  private addFloorPlane(): void {
    // Create a large floor plane
    const floorGeometry = new PlaneGeometry(500, 500, 50, 50);
    const floorMaterial = new MeshStandardMaterial({ 
      color: 0x222222,
      roughness: 0.9,
      metalness: 0.1,
      wireframe: false,
    });
    
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to horizontal
    floor.position.y = 0;
    floor.receiveShadow = true;
    
    this.sceneManager.scene.add(floor);

    // Add some reference cubes for movement testing
    const cubeColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    const positions = [
      { x: 50, z: -50 },
      { x: -50, z: -50 },
      { x: 50, z: 50 },
      { x: -50, z: 50 },
      { x: 0, z: -100 },
    ];

    positions.forEach((pos, index) => {
      const geometry = new BoxGeometry(20, 40, 20);
      const material = new MeshStandardMaterial({
        color: cubeColors[index],
        roughness: 0.7,
        metalness: 0.2,
      });
      const cube = new Mesh(geometry, material);
      cube.position.set(pos.x, 20, pos.z);
      cube.castShadow = true;
      cube.receiveShadow = true;
      this.sceneManager.scene.add(cube);
    });

    // Add grid helper for better spatial reference
    const gridSize = 500;
    const gridDivisions = 50;
    const gridHelper = new GridHelper(gridSize, gridDivisions, 0x444444, 0x222222);
    gridHelper.position.y = 0.1; // Slightly above floor to prevent z-fighting
    this.sceneManager.scene.add(gridHelper);
  }

  /**
   * Configure texture loader for pixelated rendering
   */
  private configureTextureLoader(): void {
    // This will be used when loading actual textures
    const textureLoader = new TextureLoader();
    
    // Set default texture filtering for pixelated look
    textureLoader.load = new Proxy(textureLoader.load, {
      apply: (target, thisArg, argumentsList) => {
        const result = Reflect.apply(target, thisArg, argumentsList);
        result.magFilter = NearestFilter;
        result.minFilter = NearestFilter;
        return result;
      },
    });
  }

  /**
   * Set up window resize handling
   */
  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Initial resize to ensure proper sizing
    this.handleResize();
  }

  /**
   * Handle window resize events
   */
  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update renderer size
    this.sceneManager.updateSize(width, height);

    // Update camera aspect ratio
    this.cameraController.updateAspect(width, height);
  }

  /**
   * Start the render loop
   */
  private startRenderLoop(): void {
    console.log('[Main] Starting render loop');
    let frameCount = 0;
    
    const animate = (currentTime: number) => {
      this.animationId = requestAnimationFrame(animate);

      // Calculate delta time
      if (this.lastTime === 0) {
        this.lastTime = currentTime;
      }
      
      const deltaTime = currentTime - this.lastTime;

      // Always update and render (no frame limiting for smoother input)
      // Log every 300 frames (approx every 5 seconds)
      // if (frameCount % 300 === 0) {
      //   console.log('[Main] Render loop running, frame:', frameCount, 'deltaTime:', deltaTime);
      // }
      frameCount++;
      
      // Begin frame timing
      this.devTools.beginFrame();

      // Update game state with actual delta time
      this.update(deltaTime);

      // Render frame
      this.render();

      // End frame timing
      this.devTools.endFrame();

      // Update last time
      this.lastTime = currentTime;
    };

    this.animationId = requestAnimationFrame(animate);
  }

  /**
   * Update game state
   */
  private update(deltaTime: number): void {
    // Update movement system
    this.movementSystem.update(deltaTime);
    
    // Update player state (could be used for debugging)
    if (this.devTools && this.movementSystem.getIsActive()) {
      // Player state available via: this.movementSystem.getPlayerState()
      // Could add to tweakpane for debugging in future
    }
  }

  /**
   * Render a frame
   */
  private render(): void {
    this.sceneManager.render(this.cameraController.camera);
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', this.handleResize.bind(this));
    
    this.sceneManager.dispose();
    this.devTools.dispose();
    this.movementSystem.dispose();
    this.controlsOverlay.dispose();
  }
}

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const game = new VoomGame();
    
    // Add debug tester to window for console access
    (window as any).voomDebug = new DebugTester();
    (window as any).voomGame = game;
    
    console.log('VOOM initialized! Use window.voomDebug.runAllTests() to run debug tests');
  });
} else {
  const game = new VoomGame();
  
  // Add debug tester to window for console access
  (window as any).voomDebug = new DebugTester();
  (window as any).voomGame = game;
  
  console.log('VOOM initialized! Use window.voomDebug.runAllTests() to run debug tests');
}