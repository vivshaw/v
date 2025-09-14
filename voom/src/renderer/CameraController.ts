import { PerspectiveCamera } from 'three';
import type { CameraConfig } from '@/types/renderer.types';

/**
 * Controls camera setup and configuration for DOOM-style FPS view
 */
export class CameraController {
  public camera: PerspectiveCamera;
  
  // DOOM-style constants
  private static readonly DEFAULT_FOV = 90; // Classic DOOM FOV
  private static readonly DOOM_EYE_LEVEL = 41; // Units high, matching DOOM
  private static readonly NEAR_PLANE = 0.1;
  private static readonly FAR_PLANE = 1000;

  constructor(config?: CameraConfig) {
    this.camera = this.initCamera(config);
  }

  /**
   * Initialize perspective camera with DOOM-style settings
   */
  private initCamera(config?: CameraConfig): PerspectiveCamera {
    const fov = config?.fov ?? CameraController.DEFAULT_FOV;
    const aspect = window.innerWidth / window.innerHeight;
    const near = config?.near ?? CameraController.NEAR_PLANE;
    const far = config?.far ?? CameraController.FAR_PLANE;

    const camera = new PerspectiveCamera(fov, aspect, near, far);

    // Set DOOM-style eye level position
    const position = config?.position ?? {
      x: 0,
      y: CameraController.DOOM_EYE_LEVEL,
      z: 0,
    };
    
    camera.position.set(position.x, position.y, position.z);
    
    // Look forward by default
    camera.lookAt(0, position.y, -10);

    return camera;
  }

  /**
   * Update camera aspect ratio (call on window resize)
   */
  public updateAspect(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  /**
   * Set camera position
   */
  public setPosition(x: number, y: number, z: number): void {
    this.camera.position.set(x, y, z);
  }

  /**
   * Set camera look target
   */
  public lookAt(x: number, y: number, z: number): void {
    this.camera.lookAt(x, y, z);
  }
}