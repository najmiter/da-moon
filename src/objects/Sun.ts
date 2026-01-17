import * as THREE from 'three';

export class Sun {
  public mesh: THREE.Mesh;
  public light: THREE.PointLight;
  public group: THREE.Group;

  private glowMesh: THREE.Mesh;

  constructor(radius: number = 15) {
    this.group = new THREE.Group();

    const sunGeometry = new THREE.IcosahedronGeometry(radius, 12);
    
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
          vec3 colorCenter = vec3(1.0, 1.0, 1.0); // Pure white center
          vec3 colorEdge = vec3(1.0, 1.0, 0.6);   // Bright yellow edge
          
          vec3 finalColor = mix(colorEdge, colorCenter, pow(intensity, 1.0));
          
          gl_FragColor = vec4(finalColor * 2.0, 1.0);
        }
      `,
    });
    this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);

    const glowGeometry = new THREE.IcosahedronGeometry(radius * 1.2, 12);
    const glowMaterial = new THREE.ShaderMaterial({
      uniforms: {
        viewVector: { value: new THREE.Vector3() },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
          gl_FragColor = vec4(1.0, 1.0, 0.8, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    this.glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    this.glowMesh.scale.setScalar(1.8);

    this.light = new THREE.PointLight(0xffffff, 1.5, 0, 0);
    this.light.position.set(0, 0, 0);
    this.light.castShadow = true;
    
    this.light.shadow.mapSize.width = 2048;
    this.light.shadow.mapSize.height = 2048;
    this.light.shadow.camera.near = 0.5;
    this.light.shadow.camera.far = 500;
    this.light.shadow.bias = -0.0001;

    const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // Soft white light
    this.group.add(ambientLight);

    this.group.add(this.mesh);
    this.group.add(this.glowMesh);
    this.group.add(this.light);
  }

  public update(camera: THREE.Camera): void {
    const glowMaterial = this.glowMesh.material as THREE.ShaderMaterial;
    glowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, this.mesh.position);
  }
}
