import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

export interface SceneConfig {
  canvas: HTMLCanvasElement;
  antialias?: boolean;
  pixelRatio?: number;
  clearColor?: number;
  clearAlpha?: number;
}

export interface CameraConfig {
  fov?: number;
  near?: number;
  far?: number;
  position?: { x: number; y: number; z: number };
}

export interface RenderContext {
  renderer: WebGLRenderer;
  scene: Scene;
  camera: PerspectiveCamera;
}

export interface DevToolsConfig {
  showFPS?: boolean;
  showAxes?: boolean;
  showTweakpane?: boolean;
}