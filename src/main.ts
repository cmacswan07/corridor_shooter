import "./style.css";
import * as THREE from "three";
import { Player } from "./Player";
import { ProjectileManager } from "./ProjectileManager";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.add(new THREE.GridHelper(40, 20));

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 3, 12);
camera.lookAt(0, 0, -20);

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const projectileManager = new ProjectileManager(scene);
const player = new Player(camera, projectileManager);
scene.add(player.mesh);

const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  player.update(delta);
  projectileManager.update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
