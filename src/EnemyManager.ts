import * as THREE from "three";
import { Enemy } from "./Enemy";

const ROWS = 2;
const COLS = 5;
const ROW_SPACING = 2.5;
const COL_SPACING = 2.5;
const ENEMY_Y = 2;
const FIRST_ROW_Z = -15;

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

  private _spawnWave() {
    const totalWidth = (COLS - 1) * COL_SPACING;

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = -totalWidth / 2 + col * COL_SPACING;
        const z = FIRST_ROW_Z - row * ROW_SPACING;
        const enemy = new Enemy(new THREE.Vector3(x, ENEMY_Y, z));
        this._enemies.push(enemy);
        this._scene.add(enemy.mesh);
      }
    }
  }
}
