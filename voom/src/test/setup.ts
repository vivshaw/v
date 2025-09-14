// Test setup file for Vitest
// Add any global test configuration here

// Mock WebGL context for Three.js tests
HTMLCanvasElement.prototype.getContext = function(contextType: string) {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      getExtension: () => null,
      getParameter: () => 0,
      createTexture: () => ({}),
      bindTexture: () => {},
      texParameteri: () => {},
      texImage2D: () => {},
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      useProgram: () => {},
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
      uniformMatrix4fv: () => {},
      enableVertexAttribArray: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      vertexAttribPointer: () => {},
      drawArrays: () => {},
      viewport: () => {},
      clearColor: () => {},
      clear: () => {},
      enable: () => {},
      depthFunc: () => {},
      getShaderParameter: () => true,
      getProgramParameter: () => true,
      getShaderInfoLog: () => '',
      getProgramInfoLog: () => '',
      deleteShader: () => {},
      deleteProgram: () => {},
      deleteTexture: () => {},
      deleteBuffer: () => {},
    } as any;
  }
  return null;
};