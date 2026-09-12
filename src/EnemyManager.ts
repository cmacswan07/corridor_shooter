import * as THREE from "three";
import { Enemy } from "./Enemy";

const ROWS = 2;
const COLS = 5;
const ROW_SPACING = 2.5;
const COL_SPACING = 2.5;
const ENEMY_Z = -15;
const FIRST_ROW_Y = 2;

export class EnemyManager {
  private readonly _scene: THREE.Scene;
  private _enemies: Enemy[] = [];

  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._spawnWave();
  }

  update(delta: number) {
    for (const enemy of this._enemies) {
      enemy.update(delta);
    }
  }

  /** Returns the currently active enemies (for collision checks). */
  getEnemies(): readonly Enemy[] {
    return this._enemies;
  }

  /** Removes dead enemies from the scene and list; spawns a new wave if none remain. */
  removeDead(): void {
    this._enemies = this._enemies.filter((enemy) => {
      if (enemy.isDead) {
        this._scene.remove(enemy.mesh);
        return false;
      }
      return true;
    });
    if (this._enemies.length === 0) {
      this._spawnWave();
    }
  }

  private _spawnWave() {
    const totalWidth = (COLS - 1) * COL_SPACING;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = -totalWidth / 2 + col * COL_SPACING;
        const y = FIRST_ROW_Y + row * ROW_SPACING;
        const enemy = new Enemy(new THREE.Vector3(x, y, ENEMY_Z));
        this._enemies.push(enemy);
        this._scene.add(enemy.mesh);
      }
    }
  }
}
