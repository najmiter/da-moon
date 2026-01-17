import * as THREE from 'three';
import { Earth } from '../objects/Earth';
import { Moon } from '../objects/Moon';
import { Sun } from '../objects/Sun';
import type { SpeedSettings } from '../ui/SpeedController';

export interface OrbitConfig {
  earthOrbitRadius: number;
}

export class OrbitSystem {
  private earth: Earth;
  private moon: Moon;
  private config: OrbitConfig;

  public earthOrbitGroup: THREE.Group;
  public moonOrbitGroup: THREE.Group;

  private earthOrbitAngle: number = 0;
  private moonOrbitAngle: number = 0;

  constructor(earth: Earth, moon: Moon, _sun: Sun, config?: Partial<OrbitConfig>) {
    this.earth = earth;
    this.moon = moon;

    this.config = {
      earthOrbitRadius: 80,
      ...config,
    };

    this.earthOrbitGroup = new THREE.Group();
    this.moonOrbitGroup = new THREE.Group();

    this.setupOrbits();
  }

  private setupOrbits(): void {
    this.earth.group.position.x = this.config.earthOrbitRadius;

    this.earth.group.add(this.moonOrbitGroup);

    this.moonOrbitGroup.add(this.moon.group);

    this.earthOrbitGroup.add(this.earth.group);

    this.createOrbitVisuals();
  }

  private createOrbitVisuals(): void {
    // Earth orbit visual
    const earthOrbitGeometry = new THREE.RingGeometry(this.config.earthOrbitRadius - 0.1, this.config.earthOrbitRadius + 0.1, 128);
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });
    const earthOrbitMesh = new THREE.Mesh(earthOrbitGeometry, orbitMaterial);
    earthOrbitMesh.rotation.x = Math.PI / 2;
    // Add to scene root or a static group, but since we don't have access to scene here easily without passing it,
    // we can add it to a parent group if available.
    // Actually, Earth orbits the Sun (0,0,0). So we can just return these meshes or add them to a group we export.
  }

  public getOrbitVisuals(): THREE.Group {
    const group = new THREE.Group();

    // Earth orbit (around Sun)
    const earthOrbitGeo = new THREE.RingGeometry(this.config.earthOrbitRadius - 0.05, this.config.earthOrbitRadius + 0.05, 128);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
    const earthOrbit = new THREE.Mesh(earthOrbitGeo, material);
    earthOrbit.rotation.x = Math.PI / 2;
    group.add(earthOrbit);

    // Moon orbit (around Earth) - this is trickier because it moves with Earth.
    // We can add it to the Earth group!
    const moonOrbitGeo = new THREE.RingGeometry(15 - 0.05, 15 + 0.05, 64);
    const moonOrbit = new THREE.Mesh(moonOrbitGeo, material);
    moonOrbit.rotation.x = Math.PI / 2;
    this.earth.group.add(moonOrbit);

    return group;
  }

  public update(deltaTime: number, speeds: SpeedSettings): void {
    const timeScale = speeds.timeScale;

    this.earthOrbitAngle += deltaTime * speeds.earthOrbitSpeed * timeScale;
    this.earthOrbitGroup.rotation.y = this.earthOrbitAngle;

    this.moonOrbitAngle += deltaTime * speeds.moonOrbitSpeed * timeScale;
    this.moonOrbitGroup.rotation.y = this.moonOrbitAngle;

    this.earth.update(deltaTime, speeds);
    this.moon.update(deltaTime, speeds);
  }

  public getEarthWorldPosition(): THREE.Vector3 {
    const position = new THREE.Vector3();
    this.earth.mesh.getWorldPosition(position);
    return position;
  }

  public getMoonWorldPosition(): THREE.Vector3 {
    const position = new THREE.Vector3();
    this.moon.mesh.getWorldPosition(position);
    return position;
  }
}
