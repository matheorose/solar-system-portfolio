import * as THREE from 'three';

class Starfield extends THREE.Points {
  constructor({ count = 800, radius = 120 } = {}) {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.pow(Math.random(), 0.4);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.6,
      sizeAttenuation: true,
      transparent: true,
      depthWrite: false
    });

    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader.replace(
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
        `float dist = length(gl_PointCoord - 0.5);
        float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
        if (alpha <= 0.0) discard;
        gl_FragColor = vec4(outgoingLight, diffuseColor.a * alpha);`
      );
    };

    super(geometry, material);
  }
}

export { Starfield };
