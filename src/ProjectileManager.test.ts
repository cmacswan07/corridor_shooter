import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { ProjectileManager } from "./ProjectileManager";

describe("ProjectileManager", () => {
  it("tracks spawned projectiles", () => {
    const scene = new THREE.Scene();
    const manager = new ProjectileManager(scene);
    manager.spawn(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));

    expect(manager.getProjectiles()).toHaveLength(1);
  });

  it("removes a projectile from the list and the scene", () => {
    const scene = new THREE.Scene();
    const manager = new ProjectileManager(scene);
    manager.spawn(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
    const [projectile] = manager.getProjectiles();

    manager.remove(projectile);

    expect(manager.getProjectiles()).toHaveLength(0);
    expect(scene.children).not.toContain(projectile.mesh);
  });

  it("does nothing when removing a projectile that isn't tracked", () => {
    const scene = new THREE.Scene();
    const manager = new ProjectileManager(scene);
    manager.spawn(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
    const untracked = manager.getProjectiles()[0];
    manager.remove(untracked);

    manager.remove(untracked);

    expect(manager.getProjectiles()).toHaveLength(0);
  });
});
