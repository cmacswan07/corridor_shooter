import * as THREE from "three";

const PROJECTILE_SPEED = 50;
const PROJECTILE_LIFETIME = 1.5;
const PROJECTILE_RADIUS = 0.12;

export class Projectile {
  readonly mesh: THREE.Mesh;
  private _velocity: THREE.Vector3;
  private _age = 0;

  constructor(position: THREE.Vector3, direction: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(PROJECTILE_RADIUS, 8, 6);
    const material = new THREE.MeshStandardMaterial({
      color: 0xffdd44,
      emissive: 0xff8800,
      emissiveIntensity: 1.5,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(position);
    this._velocity = direction.clone().multiplyScalar(PROJECTILE_SPEED);
  }

  update(delta: number) {
    this.mesh.position.addScaledVector(this._velocity, delta);
    this._age += delta;
    return this._age < PROJECTILE_LIFETIME;
  }
}
