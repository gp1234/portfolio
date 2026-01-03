import * as THREE from "three";
import { gsap } from "gsap";

interface SphereManager {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  points: THREE.Points | null;
  container: HTMLElement;
}

class ThreeSphere {
  private manager: SphereManager | null = null;
  private readonly pointCount = 10000; // Reduced for better performance
  private readonly sphereRadius = 100;
  private readonly continentColor = new THREE.Color(0xffd700); // Gold
  private readonly oceanColor = new THREE.Color(0x007fff); // Azure Blue

  init(): void {
    console.log("ThreeSphere: Initializing...");
    const container = document.getElementById("sphere-container");

    if (!container) {
      console.error("Sphere container not found!");
      return;
    }

    console.log(
      "ThreeSphere: Container found, dimensions:",
      container.clientWidth,
      "x",
      container.clientHeight
    );

    // Add a temporary test div to see if container is working
    const testDiv = document.createElement("div");
    testDiv.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: red;
      color: white;
      padding: 20px;
      border-radius: 10px;
      z-index: 1000;
    `;
    testDiv.textContent = "SPHERE CONTAINER FOUND!";
    container.appendChild(testDiv);

    // Remove test div after 3 seconds
    setTimeout(() => {
      if (testDiv.parentNode) {
        testDiv.parentNode.removeChild(testDiv);
      }
    }, 3000);

    // Check if container has dimensions
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      console.warn("ThreeSphere: Container has no dimensions, retrying...");
      setTimeout(() => this.init(), 100);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d1117, 0.0015);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    this.manager = {
      scene,
      camera,
      renderer,
      points: null,
      container,
    };

    console.log("ThreeSphere: Scene set up, creating sphere...");
    this.createSphere();
    this.setupEventListeners();
    this.animate();
  }

  private createSphere(): void {
    if (!this.manager) return;

    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    for (let i = 0; i < this.pointCount; i++) {
      // Generate points on sphere surface
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;

      const x = this.sphereRadius * Math.sin(phi) * Math.cos(theta);
      const y = this.sphereRadius * Math.sin(phi) * Math.sin(theta);
      const z = this.sphereRadius * Math.cos(phi);
      positions.push(x, y, z);

      // Random color between continent and ocean
      const isLand = Math.random() > 0.7;
      let color = isLand
        ? this.continentColor.clone()
        : this.oceanColor.clone();

      // Add some variation
      color.r += (Math.random() - 0.5) * 0.1;
      color.g += (Math.random() - 0.5) * 0.1;
      color.b += (Math.random() - 0.5) * 0.1;

      colors.push(color.r, color.g, color.b);
      sizes.push(Math.random() * 2 + 1);
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

    this.createPointsObject(geometry);
  }

  private createPointsObject(geometry: THREE.BufferGeometry): void {
    if (!this.manager) return;

    // Simple point material without texture for reliability
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          gl_PointSize = size * ( 300.0 / -mvPosition.z );
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float r = 0.0, delta = 0.0, alpha = 1.0;
          vec2 cxy = 2.0 * gl_PointCoord - 1.0;
          r = dot(cxy, cxy);
          if (r > 1.0) {
            discard;
          }
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    this.manager.points = new THREE.Points(geometry, material);
    this.manager.scene.add(this.manager.points);

    console.log("ThreeSphere: Sphere created with", this.pointCount, "points");

    // Start size animation
    this.animatePointSizes();
  }

  private animatePointSizes(): void {
    if (!this.manager?.points) return;

    const sizeAttribute = this.manager.points.geometry.attributes
      .size as THREE.BufferAttribute;
    const originalSizes = Array.from(sizeAttribute.array);

    for (let i = 0; i < this.pointCount; i++) {
      gsap.to(sizeAttribute.array, {
        [i]: originalSizes[i] * (Math.random() * 1.5 + 0.5),
        duration: Math.random() * 3 + 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    }
  }

  private onWindowResize = (): void => {
    if (!this.manager) return;

    const { container, camera, renderer } = this.manager;

    if (container && container.clientWidth > 0 && container.clientHeight > 0) {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    }
  };

  private setupEventListeners(): void {
    window.addEventListener("resize", this.onWindowResize, false);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    if (!this.manager) return;

    const { points, renderer, scene, camera } = this.manager;

    // Simple auto-rotation
    if (points) {
      points.rotation.y += 0.002;
      points.rotation.x += 0.001;

      // Update size attribute for animations
      const sizeAttribute = points.geometry.attributes
        .size as THREE.BufferAttribute;
      if (sizeAttribute) sizeAttribute.needsUpdate = true;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };

  destroy(): void {
    if (!this.manager) return;

    window.removeEventListener("resize", this.onWindowResize);

    if (this.manager.points) {
      this.manager.scene.remove(this.manager.points);
      this.manager.points.geometry.dispose();
      (this.manager.points.material as THREE.Material).dispose();
    }

    this.manager.renderer.dispose();
    this.manager.container.removeChild(this.manager.renderer.domElement);
    this.manager = null;
  }
}

// Export and initialize
export const threeSphere = new ThreeSphere();

// Initialize after body becomes visible
function initializeWhenReady() {
  const body = document.querySelector("body");
  if (body && body.style.display !== "none") {
    console.log("ThreeSphere: Body is visible, initializing...");
    // Small delay to ensure styles are applied
    setTimeout(() => {
      threeSphere.init();
    }, 100);
  } else {
    console.log("ThreeSphere: Body not visible yet, waiting...");
    // Check again in a bit
    setTimeout(initializeWhenReady, 50);
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWhenReady);
} else {
  initializeWhenReady();
}
