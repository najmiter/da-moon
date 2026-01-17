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
