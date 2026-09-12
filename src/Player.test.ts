import * as THREE from "three";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Enemy } from "./Enemy";
import { ENEMY_Z } from "./EnemyManager";
import { Player } from "./Player";
import type { ProjectileManager } from "./ProjectileManager";

beforeAll(() => {
  vi.stubGlobal("window", {
    innerWidth: 1200,
    innerHeight: 800,
    addEventListener: vi.fn(),
  });
  vi.stubGlobal("document", {
    body: { style: {}, appendChild: vi.fn() },
    createElement: () => ({ style: {} }),
  });
});

function createCamera() {
  const camera = new THREE.PerspectiveCamera(60, 1200 / 800, 0.1, 1000);
  camera.position.set(0, 3, 12);
  camera.lookAt(0, 0, -20);
  return camera;
}

function fireAt(camera: THREE.Camera, enemyPos: THREE.Vector3) {
  const spawn = vi.fn();
  const projectileManager = { spawn } as unknown as ProjectileManager;
  const player = new Player(camera, projectileManager);

  const ndc = enemyPos.clone().project(camera);
  const input = (player as unknown as { _input: { mouseNdc: THREE.Vector2; inputs: { mouseButtons: { left: boolean } } } })._input;
  input.mouseNdc.set(ndc.x, ndc.y);
  input.inputs.mouseButtons.left = true;

  player.update(1 / 60);

  const [spawnPos, direction] = spawn.mock.calls[0] as [THREE.Vector3, THREE.Vector3];
  const ray = new THREE.Ray(spawnPos, direction.clone().normalize());
  return ray.distanceToPoint(enemyPos);
}

describe("Player aiming", () => {
  it("hits an enemy directly ahead when the crosshair is on it", () => {
    const camera = createCamera();
    const enemyPos = new THREE.Vector3(0, 1, ENEMY_Z);

    expect(fireAt(camera, enemyPos)).toBeLessThanOrEqual(Enemy.HIT_RADIUS);
  });

  it("hits an off-center enemy when the crosshair is on it", () => {
    const camera = createCamera();
    const enemyPos = new THREE.Vector3(3, 2.5, ENEMY_Z);

    expect(fireAt(camera, enemyPos)).toBeLessThanOrEqual(Enemy.HIT_RADIUS);
  });

  it("hits even accounting for the muzzle offset from the player's mesh origin", () => {
    const camera = createCamera();
    const enemyPos = new THREE.Vector3(-2, 1.5, ENEMY_Z);

    const distance = fireAt(camera, enemyPos);
    expect(distance).toBeLessThanOrEqual(Enemy.HIT_RADIUS);
    expect(distance).toBeGreaterThanOrEqual(0);
  });
});
