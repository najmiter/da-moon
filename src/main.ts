import './style.css';
import * as THREE from 'three';
import { SceneManager } from './scene/SceneManager';
import { Sun } from './objects/Sun';
import { Earth } from './objects/Earth';
import { Moon } from './objects/Moon';
import { Starfield } from './objects/Starfield';
import { OrbitSystem } from './systems/OrbitSystem';
import { SpeedController } from './ui/SpeedController';

class SolarSystemApp {
  private sceneManager: SceneManager;
  private sun: Sun;
  private earth: Earth;
  private moon: Moon;
  private starfield: Starfield;
  private orbitSystem: OrbitSystem;
  private speedController: SpeedController;
  private clock: THREE.Clock;

  constructor() {
    this.sceneManager = new SceneManager('da-moon-entry');

    this.sun = new Sun();
    this.earth = new Earth();
    this.moon = new Moon();
    this.starfield = new Starfield(2000);

    this.orbitSystem = new OrbitSystem(this.earth, this.moon, this.sun, {
      earthOrbitRadius: 80,
    });

    this.speedController = new SpeedController();

    this.speedController.onChange((_settings) => {});
    this.speedController.onCenter(() => this.focusOnEarth());

    this.sceneManager.add(this.sun.group);
    this.sceneManager.add(this.orbitSystem.earthOrbitGroup);
    this.sceneManager.add(this.orbitSystem.getOrbitVisuals());
    this.sceneManager.add(this.starfield.points);

    this.focusOnEarth();

    this.clock = new THREE.Clock();

    this.animate();
    this.playBgm();
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const deltaTime = this.clock.getDelta();
    const speeds = this.speedController.getSettings();

    this.sun.update(this.sceneManager.camera);
    this.orbitSystem.update(deltaTime, speeds);
    this.starfield.update(deltaTime);

    // if (!this.sceneManager.isUserInteracting) {
    //   const earthPos = this.orbitSystem.getEarthWorldPosition();
    //   this.sceneManager.controls.target.lerp(earthPos, 0.08);
    // }

    this.sceneManager.render();
  };

  private focusOnEarth(): void {
    const earthPos = this.orbitSystem.getEarthWorldPosition();
    this.sceneManager.controls.target.copy(earthPos);
    this.sceneManager.camera.position.set(earthPos.x + 20, earthPos.y + 10, earthPos.z + 30);
  }

  private playBgm(): void {
    const musicController = document.getElementById('music-controller');
    if (!musicController) return;

    const musicState = localStorage.getItem('music');
    musicController.textContent = musicState === 'playing' ? 'Stop music' : 'Play music';

    const listener = new THREE.AudioListener();
    this.sceneManager.camera.add(listener);

    const sound = new THREE.Audio(listener);
    const audioLoader = new THREE.AudioLoader();

    musicController.addEventListener('click', () => {
      if (!sound.isPlaying) {
        sound.play();
        localStorage.setItem('music', 'playing');
        musicController.textContent = 'Stop music';
      } else {
        sound.pause();
        localStorage.setItem('music', 'paused');
        musicController.textContent = 'Play music';
      }
    });
    
    const baseUrl = import.meta.env.BASE_URL;
    audioLoader.load(`${baseUrl}bgm/aurora.webm`, (buffer) => {
      sound.setBuffer(buffer);
      sound.setLoop(true);
      sound.setVolume(0.5);
      if (musicState === 'playing') {
        sound.play();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.getElementById('welcome-dialog') as HTMLDialogElement;
  const closeBtn = document.querySelector('#close-and-start') as HTMLButtonElement;
  const speedPanel = document.querySelector('#speed-controller') as HTMLDivElement;

  closeBtn.addEventListener('click', () => {
    dialog.requestClose()
    speedPanel.style.display = 'block';
    new SolarSystemApp();
  });
});
