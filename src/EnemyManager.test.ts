import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { EnemyManager } from "./EnemyManager";

describe("EnemyManager", () => {
  it("spawns a wave of 10 enemies", () => {
    const scene = new THREE.Scene();
    const manager = new EnemyManager(scene);

    expect(manager.getEnemies()).toHaveLength(10);
  });

  it("removes dead enemies while keeping survivors", () => {
    const scene = new THREE.Scene();
    const manager = new EnemyManager(scene);
    const [first, second] = manager.getEnemies();
    first.isDead = true;
    second.isDead = true;

    manager.removeDead();

    expect(manager.getEnemies()).toHaveLength(8);
    expect(manager.getEnemies()).not.toContain(first);
    expect(scene.children).not.toContain(first.mesh);
    expect(scene.children).not.toContain(second.mesh);
  });

  it("spawns a new wave once every enemy is dead", () => {
    const scene = new THREE.Scene();
    const manager = new EnemyManager(scene);
    const originalEnemies = manager.getEnemies();
    for (const enemy of originalEnemies) enemy.isDead = true;

    manager.removeDead();

    expect(manager.getEnemies()).toHaveLength(10);
    for (const enemy of originalEnemies) {
      expect(scene.children).not.toContain(enemy.mesh);
    }
  });
});
