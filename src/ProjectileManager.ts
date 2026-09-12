import * as THREE from "three";
import { Projectile } from "./Projectile";

export class ProjectileManager {
  private _scene: THREE.Scene;
  private _projectiles: Projectile[] = [];

  constructor(scene: THREE.Scene) {
    this._scene = scene;
  }

  spawn(position: THREE.Vector3, direction: THREE.Vector3) {
    const projectile = new Projectile(position, direction);
    this._scene.add(projectile.mesh);
    this._projectiles.push(projectile);
  }

  update(delta: number) {
    this._projectiles = this._projectiles.filter((p) => {
      const alive = p.update(delta);
      if (!alive) this._scene.remove(p.mesh);
      return alive;
    });
  }

  /** Returns the currently active projectiles (for collision checks). */
  getProjectiles(): readonly Projectile[] {
    return this._projectiles;
  }

  /** Removes a specific projectile immediately (e.g. on collision), independent of its lifetime. */
  remove(projectile: Projectile): void {
    const idx = this._projectiles.indexOf(projectile);
    if (idx === -1) return;
    this._projectiles.splice(idx, 1);
    this._scene.remove(projectile.mesh);
  }
}
