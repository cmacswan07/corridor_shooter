import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { CollisionSystem } from "./CollisionSystem";
import { EnemyManager } from "./EnemyManager";
import { ProjectileManager } from "./ProjectileManager";

describe("CollisionSystem", () => {
  it("damages an enemy and destroys the projectile on hit", () => {
    const scene = new THREE.Scene();
    const enemyManager = new EnemyManager(scene);
    const projectileManager = new ProjectileManager(scene);
    const collisionSystem = new CollisionSystem(enemyManager, projectileManager);
    const target = enemyManager.getEnemies()[0];
    projectileManager.spawn(target.mesh.position.clone(), new THREE.Vector3(0, 0, -1));

    collisionSystem.update();

    expect(target.health).toBe(4);
    expect(projectileManager.getProjectiles()).toHaveLength(0);
  });

  it("leaves enemies and projectiles untouched when far apart", () => {
    const scene = new THREE.Scene();
    const enemyManager = new EnemyManager(scene);
    const projectileManager = new ProjectileManager(scene);
    const collisionSystem = new CollisionSystem(enemyManager, projectileManager);
    projectileManager.spawn(new THREE.Vector3(1000, 1000, 1000), new THREE.Vector3(0, 0, -1));

    collisionSystem.update();

    for (const enemy of enemyManager.getEnemies()) {
      expect(enemy.health).toBe(5);
    }
    expect(projectileManager.getProjectiles()).toHaveLength(1);
  });

  it("destroys an enemy whose health reaches 0 on hit", () => {
    const scene = new THREE.Scene();
    const enemyManager = new EnemyManager(scene);
    const projectileManager = new ProjectileManager(scene);
    const collisionSystem = new CollisionSystem(enemyManager, projectileManager);
    const target = enemyManager.getEnemies()[0];
    target.health = 1;
    projectileManager.spawn(target.mesh.position.clone(), new THREE.Vector3(0, 0, -1));

    collisionSystem.update();

    expect(target.isDead).toBe(true);
    expect(enemyManager.getEnemies()).not.toContain(target);
    expect(scene.children).not.toContain(target.mesh);
  });
});
