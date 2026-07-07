import * as THREE from "three";
import { InputManager } from "./InputManager";

interface Bounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

const SPEED = 8;
const TURN_SPEED = 8;
const MAX_ROLL = 0.5;
const CROSSHAIR_DEPTH = -40;
const TIP_AXIS = new THREE.Vector3(0, 1, 0);
const PLANE_Z = 0;
const EDGE_MARGIN = 0.75;

export class Player {
  private _mesh: THREE.Mesh;
  private _input: InputManager;
  private _camera: THREE.Camera;
  private _raycaster = new THREE.Raycaster();
  private _aimPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, CROSSHAIR_DEPTH),
  );
  private _movementPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, PLANE_Z),
  );
  private _currentRoll = 0;
  private _bounds: Bounds = {
    minX: -1,
    maxX: 1,
    minY: -1,
    maxY: 1,
  };

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
    this._updateBounds();
    this._updateMovement(delta);
    this._updateAim(delta);
  }

  private _updateMovement(delta: number) {
    const v = new THREE.Vector2(0, 0);
    if (this._input.inputs.left) v.x -= 1;
    if (this._input.inputs.right) v.x += 1;
    if (this._input.inputs.up) v.y += 1;
    if (this._input.inputs.down) v.y -= 1;
    if (v.lengthSq() > 0) v.normalize();

    this._mesh.position.x += v.x * SPEED * delta;
    this._mesh.position.y += v.y * SPEED * delta;

    this._mesh.position.x = THREE.MathUtils.clamp(
      this._mesh.position.x,
      this._bounds.minX,
      this._bounds.maxX,
    );
    this._mesh.position.y = THREE.MathUtils.clamp(
      this._mesh.position.y,
      this._bounds.minY,
      this._bounds.maxY,
    );

    const targetRoll = v.x * MAX_ROLL;
    this._currentRoll += (targetRoll - this._currentRoll) * 10 * delta;
  }

  private _updateAim(delta: number) {
    const targetPoint = this._raycastToPlane(
      this._input.mouseNdc.x,
      this._input.mouseNdc.y,
      this._aimPlane,
    );
    if (!targetPoint) return;

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

  private _raycastToPlane(ndcX: number, ndcY: number, plane: THREE.Plane) {
    this._raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), this._camera);
    const point = new THREE.Vector3();
    const hit = this._raycaster.ray.intersectPlane(plane, point);
    return hit ? point : null;
  }

  private _updateBounds() {
    const topLeft = this._raycastToPlane(-1, 1, this._movementPlane);
    const bottomRight = this._raycastToPlane(1, -1, this._movementPlane);
    if (!topLeft || !bottomRight) return;

    this._bounds = {
      minX: topLeft.x + EDGE_MARGIN,
      maxX: bottomRight.x - EDGE_MARGIN,
      minY: bottomRight.y + EDGE_MARGIN,
      maxY: topLeft.y - EDGE_MARGIN,
    };
  }
}
