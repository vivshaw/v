import Stats from 'stats.js';
import { Pane } from 'tweakpane';
import { AxesHelper, Scene } from 'three';
import type { CameraController } from '@/renderer/CameraController';
import type { LightingSetup } from '@/renderer/LightingSetup';
import type { DevToolsConfig } from '@/types/renderer.types';

/**
 * Development tools for debugging and performance monitoring
 * Only active in development mode
 */
export class DevTools {
  private stats?: Stats;
  private tweakpane?: Pane;
  private axesHelper?: AxesHelper;
  private enabled: boolean;

  constructor(config?: DevToolsConfig) {
    // Only enable in development mode
    this.enabled = import.meta.env.DEV;
    
    if (!this.enabled) {
      return;
    }

    // Initialize based on config
    if (config?.showFPS !== false) {
      this.initStats();
    }

    if (config?.showTweakpane !== false) {
      this.initTweakpane();
    }
  }

  /**
   * Initialize FPS counter
   */
  private initStats(): void {
    if (!this.enabled) return;

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    
    // Position in top-left corner
    this.stats.dom.style.position = 'absolute';
    this.stats.dom.style.left = '10px';
    this.stats.dom.style.top = '10px';
    this.stats.dom.style.zIndex = '9999';
    
    document.body.appendChild(this.stats.dom);
  }

  /**
   * Initialize Tweakpane for runtime adjustments
   */
  private initTweakpane(): void {
    if (!this.enabled) return;

    this.tweakpane = new Pane({
      title: 'VOOM Dev Tools',
      expanded: false,
    });

    // Position in top-right corner
    const container = this.tweakpane.element.parentElement;
    if (container) {
      container.style.position = 'fixed';
      container.style.right = '10px';
      container.style.top = '10px';
      container.style.zIndex = '9999';
    }
  }

  /**
   * Add camera controls to Tweakpane
   */
  public addCameraControls(camera: CameraController): void {
    if (!this.enabled || !this.tweakpane) return;

    const folder = (this.tweakpane as any).addFolder({
      title: 'Camera',
      expanded: false,
    });

    const params = {
      fov: camera.camera.fov,
      x: camera.camera.position.x,
      y: camera.camera.position.y,
      z: camera.camera.position.z,
    };

    folder.addBinding(params, 'fov', {
      min: 45,
      max: 120,
      step: 1,
    }).on('change', (ev: any) => {
      camera.camera.fov = ev.value;
      camera.camera.updateProjectionMatrix();
    });

    folder.addBinding(params, 'x', {
      min: -100,
      max: 100,
      step: 1,
    }).on('change', (ev: any) => {
      camera.setPosition(ev.value, params.y, params.z);
    });

    folder.addBinding(params, 'y', {
      min: 0,
      max: 100,
      step: 1,
    }).on('change', (ev: any) => {
      camera.setPosition(params.x, ev.value, params.z);
    });

    folder.addBinding(params, 'z', {
      min: -100,
      max: 100,
      step: 1,
    }).on('change', (ev: any) => {
      camera.setPosition(params.x, params.y, ev.value);
    });
  }

  /**
   * Add lighting controls to Tweakpane
   */
  public addLightingControls(lighting: LightingSetup): void {
    if (!this.enabled || !this.tweakpane) return;

    const folder = (this.tweakpane as any).addFolder({
      title: 'Lighting',
      expanded: false,
    });

    const params = {
      ambientIntensity: 0.3,
      directionalIntensity: 0.7,
    };

    folder.addBinding(params, 'ambientIntensity', {
      min: 0,
      max: 1,
      step: 0.01,
    }).on('change', (ev: any) => {
      lighting.setAmbientIntensity(ev.value);
    });

    folder.addBinding(params, 'directionalIntensity', {
      min: 0,
      max: 2,
      step: 0.01,
    }).on('change', (ev: any) => {
      lighting.setDirectionalIntensity(ev.value);
    });
  }

  /**
   * Add axes helper to scene
   */
  public addAxesHelper(scene: Scene, size: number = 50): void {
    if (!this.enabled) return;

    this.axesHelper = new AxesHelper(size);
    scene.add(this.axesHelper);
  }

  /**
   * Update stats before render
   */
  public beginFrame(): void {
    if (this.enabled && this.stats) {
      this.stats.begin();
    }
  }

  /**
   * Update stats after render
   */
  public endFrame(): void {
    if (this.enabled && this.stats) {
      this.stats.end();
    }
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.stats?.dom.parentElement) {
      this.stats.dom.parentElement.removeChild(this.stats.dom);
    }

    if (this.tweakpane) {
      this.tweakpane.dispose();
    }

    if (this.axesHelper) {
      this.axesHelper.dispose();
    }
  }
}