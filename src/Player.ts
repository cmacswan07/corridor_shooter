import * as THREE from "three";
import { InputManager } from "./InputManager";

const BOUNDS = {
  minX: -6,
  maxX: 6,
  minY: -3.5,
  maxY: 3.5,
};

const SPEED = 8;

export class Player {
  private _mesh: THREE.Mesh;
  private _input: InputManager;

  constructor() {
    const geometry = new THREE.ConeGeometry(0.6, 1.6, 4);
    const material = new THREE.MeshStandardMaterial({ color: 0x44ccff });
    this._mesh = new THREE.Mesh(geometry, material);

    this._mesh.rotation.x = -Math.PI / 2;

    this._input = new InputManager();
  }

  get mesh() {
    return this._mesh;
  }

  update(delta: number) {
    const v = new THREE.Vector2(0, 0);
    if (this._input.keys.left) v.x -= 1;
    if (this._input.keys.right) v.x += 1;
    if (this._input.keys.up) v.y += 1;
    if (this._input.keys.down) v.y -= 1;

    this._mesh.position.x += v.x * SPEED * delta;
    this._mesh.position.y += v.y * SPEED * delta;

    this._mesh.position.x = THREE.MathUtils.clamp(
      this._mesh.position.x,
      BOUNDS.minX,
      BOUNDS.maxX,
    );
    this._mesh.position.y = THREE.MathUtils.clamp(
      this._mesh.position.y,
      BOUNDS.minY,
      BOUNDS.maxY,
    );

    const targetRoll = -v.x * 0.5;
    this._mesh.rotation.z += (targetRoll - this._mesh.rotation.z) * 10 * delta;
  }
}
