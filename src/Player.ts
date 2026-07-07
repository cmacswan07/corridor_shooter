import * as THREE from "three";
import { InputManager } from "./InputManager";

const BOUNDS = {
  minX: -6,
  maxX: 6,
  minY: -3.5,
  maxY: 3.5,
};
const SPEED = 8;
const TURN_SPEED = 8;
const MAX_ROLL = 0.5;
const CROSSHAIR_DEPTH = -40;
const TIP_AXIS = new THREE.Vector3(0, 1, 0);

export class Player {
  private _mesh: THREE.Mesh;
  private _input: InputManager;
  private _camera: THREE.Camera;
  private _raycaster = new THREE.Raycaster();
  private _aimPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, CROSSHAIR_DEPTH),
  );
  private _currentRoll = 0;

  constructor(camera: THREE.Camera) {
    this._camera = camera;
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
    this._updateMovement(delta);
    this._updateAim(delta);
  }

  private _updateMovement(delta: number) {
    const v = new THREE.Vector2(0, 0);
    if (this._input.keys.left) v.x -= 1;
    if (this._input.keys.right) v.x += 1;
    if (this._input.keys.up) v.y += 1;
    if (this._input.keys.down) v.y -= 1;
    if (v.lengthSq() > 0) v.normalize();

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

    const targetRoll = v.x * MAX_ROLL;
    this._currentRoll += (targetRoll - this._currentRoll) * 10 * delta;
  }

  private _updateAim(delta: number) {
    this._raycaster.setFromCamera(this._input.mouseNdc, this._camera);
    const targetPoint = new THREE.Vector3();
    const hit = this._raycaster.ray.intersectPlane(this._aimPlane, targetPoint);
    if (!hit) return;
    const direction = targetPoint.sub(this._mesh.position).normalize();
    const aimQuat = new THREE.Quaternion().setFromUnitVectors(
      TIP_AXIS,
      direction,
    );
    const rollQuat = new THREE.Quaternion().setFromAxisAngle(
      TIP_AXIS,
      this._currentRoll,
    );
    aimQuat.multiply(rollQuat);
    this._mesh.quaternion.slerp(aimQuat, 1 - Math.exp(-TURN_SPEED * delta));
  }
}
