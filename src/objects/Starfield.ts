import * as THREE from 'three';

export class Starfield {
  public points: THREE.Points;

  constructor(starCount: number = 2000) {
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load('/textures/stars/circle.png');

    const positions: number[] = [];
    const colors: number[] = [];

    for (let i = 0; i < starCount; i++) {
      const radius = 800 + Math.random() * 400;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);

      const col = new THREE.Color().setHSL(0.6, 0.2, Math.random());
      colors.push(col.r, col.g, col.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.5,
      sizeAttenuation: true,
      map: starTexture,
      transparent: true,
      vertexColors: true,
    });

    this.points = new THREE.Points(geometry, material);
  }

  public update(deltaTime: number): void {
    this.points.rotation.y += deltaTime * 0.002;
  }
}
