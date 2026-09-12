import * as THREE from "three";

export class Enemy {
  static readonly HIT_RADIUS = 0.7;

  mesh: THREE.Mesh;
  isDead: boolean = false;
  health: number = 5;
  private _elapsed = 0;
  private readonly _basePos: THREE.Vector3;
  private readonly _rotationSpeed: { x: number; y: number };

  constructor(spawnPos: THREE.Vector3) {
    this._basePos = spawnPos.clone();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff3355,
      emissive: 0x330000,
      roughness: 0.4,
      metalness: 0.4,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(this._basePos);

    this._rotationSpeed = {
      x: 0.2 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.6,
    };
  }

  update(delta: number) {
    if (this.isDead) return;

    this._elapsed += delta;
    this.mesh.rotation.x += this._rotationSpeed.x * delta;
    this.mesh.rotation.y += this._rotationSpeed.y * delta;
  }

  /** Applies damage; sets isDead when health drops to 0 or below. Returns true if this call killed the enemy. */
  takeDamage(amount: number): boolean {
    if (this.isDead) return false;
    this.health -= amount;
    if (this.health <= 0) {
      this.isDead = true;
      return true;
    }
    return false;
  }
}
