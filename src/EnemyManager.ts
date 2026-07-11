import * as THREE from "three";
import { Enemy } from "./Enemy";

const ROWS = 2;
const COLS = 5;
const ROW_SPACING = 2.5;
const COL_SPACING = 2.5;
const FIRST_ROW_Z = -15;

export class EnemyManager {
  private readonly _scene: THREE.Scene;
  private _enemies: Enemy[] = [];

  constructor(scene: THREE.Scene) {
    this._scene = scene;
  }
}
