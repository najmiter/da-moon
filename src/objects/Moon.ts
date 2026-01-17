import * as THREE from 'three';
import type { SpeedSettings } from '../ui/SpeedController';

export class Moon {
  public mesh: THREE.Mesh;
  public group: THREE.Group;

  private textureLoader: THREE.TextureLoader;

  constructor() {
    this.group = new THREE.Group();
    this.textureLoader = new THREE.TextureLoader();

    const moonMap = this.textureLoader.load('/textures/moonmap1k.jpg');
    const moonBump = this.textureLoader.load('/textures/moonbump1k.jpg');

    const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);

    const moonMaterial = new THREE.MeshPhongMaterial({
      map: moonMap,
      bumpMap: moonBump,
      bumpScale: 0.02,
    });

    this.mesh = new THREE.Mesh(moonGeometry, moonMaterial);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh.position.x = 15;

    this.group.add(this.mesh);
  }

  public update(deltaTime: number, speeds: SpeedSettings): void {
    this.mesh.rotation.y += deltaTime * speeds.moonRotationSpeed * speeds.timeScale;
  }
}
