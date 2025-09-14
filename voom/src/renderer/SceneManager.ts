import { Scene, WebGLRenderer, PCFSoftShadowMap, Camera } from 'three';
import type { SceneConfig } from '@/types/renderer.types';

/**
 * Manages Three.js scene initialization and configuration
 */
export class SceneManager {
  public scene: Scene;
  public renderer: WebGLRenderer;
  private canvas: HTMLCanvasElement;

  constructor(config: SceneConfig) {
    this.canvas = config.canvas;
    this.scene = new Scene();
    this.renderer = this.initRenderer(config);
  }

  /**
   * Initialize WebGL renderer with pixelated aesthetic
   */
  private initRenderer(config: SceneConfig): WebGLRenderer {
    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: config.antialias ?? false, // Disabled for pixelated look
      alpha: true,
    });

    // Configure for pixelated rendering
    renderer.setPixelRatio(config.pixelRatio ?? window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // Set clear color (dark gray)
    const clearColor = config.clearColor ?? 0x1a1a1a;
    const clearAlpha = config.clearAlpha ?? 1.0;
    renderer.setClearColor(clearColor, clearAlpha);

    // Configure shadows for better visuals
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    // Ensure textures use nearest neighbor filtering
    renderer.outputColorSpace = 'srgb';

    return renderer;
  }

  /**
   * Update renderer size (call on window resize)
   */
  public updateSize(width: number, height: number): void {
    this.renderer.setSize(width, height);
  }

  /**
   * Render a single frame
   */
  public render(camera: Camera): void {
    this.renderer.render(this.scene, camera);
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    this.renderer.dispose();
  }
}