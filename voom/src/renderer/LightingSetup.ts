import { 
  AmbientLight, 
  DirectionalLight, 
  Scene,
  Vector3,
} from 'three';

/**
 * Manages scene lighting for DOOM-style visuals
 */
export class LightingSetup {
  private ambientLight: AmbientLight;
  private directionalLight: DirectionalLight;

  constructor(scene: Scene) {
    this.ambientLight = this.createAmbientLight();
    this.directionalLight = this.createDirectionalLight();
    
    // Add lights to scene
    scene.add(this.ambientLight);
    scene.add(this.directionalLight);
  }

  /**
   * Create ambient light for base illumination
   */
  private createAmbientLight(): AmbientLight {
    // Low intensity for moody DOOM atmosphere
    const light = new AmbientLight(0xffffff, 0.3);
    return light;
  }

  /**
   * Create directional light for main illumination and shadows
   */
  private createDirectionalLight(): DirectionalLight {
    const light = new DirectionalLight(0xffffff, 0.7);
    
    // Position light to cast interesting shadows
    light.position.set(50, 100, 50);
    light.lookAt(new Vector3(0, 0, 0));
    
    // Configure shadows
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    
    // Shadow camera frustum
    const shadowCameraSize = 100;
    light.shadow.camera.left = -shadowCameraSize;
    light.shadow.camera.right = shadowCameraSize;
    light.shadow.camera.top = shadowCameraSize;
    light.shadow.camera.bottom = -shadowCameraSize;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    
    return light;
  }

  /**
   * Update ambient light intensity
   */
  public setAmbientIntensity(intensity: number): void {
    this.ambientLight.intensity = intensity;
  }

  /**
   * Update directional light intensity
   */
  public setDirectionalIntensity(intensity: number): void {
    this.directionalLight.intensity = intensity;
  }

  /**
   * Update directional light position
   */
  public setDirectionalPosition(x: number, y: number, z: number): void {
    this.directionalLight.position.set(x, y, z);
  }
}