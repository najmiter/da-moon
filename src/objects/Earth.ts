import * as THREE from 'three';
import { getFresnelMat } from '../shaders/FresnelMaterial';
import type { SpeedSettings } from '../ui/SpeedController';

export class Earth {
  public mesh: THREE.Mesh;
  public lightsMesh: THREE.Mesh;
  public cloudMesh: THREE.Mesh;
  public glowMesh: THREE.Mesh;
  public group: THREE.Group;

  private textureLoader: THREE.TextureLoader;

  constructor(radius: number = 5) {
    this.group = new THREE.Group();
    this.textureLoader = new THREE.TextureLoader();

    const earthMap = this.textureLoader.load('/textures/00_earthmap1k.jpg');
    const earthBump = this.textureLoader.load('/textures/01_earthbump1k.jpg');
    const earthSpec = this.textureLoader.load('/textures/02_earthspec1k.jpg');
    const earthLights = this.textureLoader.load('/textures/03_earthlights1k.jpg');
    const cloudMap = this.textureLoader.load('/textures/04_earthcloudmap.jpg');
    const cloudMapTrans = this.textureLoader.load('/textures/05_earthcloudmaptrans.jpg');

    const detail = 12;
    const geometry = new THREE.IcosahedronGeometry(radius, detail);

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      bumpMap: earthBump,
      bumpScale: 0.04,
      specularMap: earthSpec,
      specular: new THREE.Color(0x333333),
    });

    this.mesh = new THREE.Mesh(geometry, earthMaterial);

    const lightsMaterial = new THREE.MeshBasicMaterial({
      map: earthLights,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });
    this.lightsMesh = new THREE.Mesh(geometry, lightsMaterial);

    const cloudMaterial = new THREE.MeshStandardMaterial({
      map: cloudMap,
      alphaMap: cloudMapTrans,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.cloudMesh = new THREE.Mesh(geometry, cloudMaterial);
    this.cloudMesh.scale.setScalar(1.003);

    const fresnelMat = getFresnelMat();
    this.glowMesh = new THREE.Mesh(geometry, fresnelMat);
    this.glowMesh.scale.setScalar(1.01);

    this.group.add(this.mesh);
    this.group.add(this.lightsMesh);
    this.group.add(this.cloudMesh);
    this.group.add(this.glowMesh);

    this.group.rotation.z = (-23.4 * Math.PI) / 180;
  }

  public update(deltaTime: number, speeds: SpeedSettings): void {
    const rotationSpeed = deltaTime * speeds.earthRotationSpeed * speeds.timeScale;
    this.mesh.rotation.y += rotationSpeed;
    this.lightsMesh.rotation.y += rotationSpeed;
    this.cloudMesh.rotation.y += rotationSpeed * 1.1;
    this.glowMesh.rotation.y += rotationSpeed;
  }
}
