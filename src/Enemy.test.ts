import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { Enemy } from "./Enemy";

describe("Enemy", () => {
  it("starts with 5 health", () => {
    const enemy = new Enemy(new THREE.Vector3(0, 0, 0));
    expect(enemy.health).toBe(5);
  });

  it("survives damage below its health total", () => {
    const enemy = new Enemy(new THREE.Vector3(0, 0, 0));
    for (let i = 0; i < 4; i++) {
      expect(enemy.takeDamage(1)).toBe(false);
    }
    expect(enemy.health).toBe(1);
    expect(enemy.isDead).toBe(false);
  });

  it("dies when health reaches 0", () => {
    const enemy = new Enemy(new THREE.Vector3(0, 0, 0));
    for (let i = 0; i < 4; i++) enemy.takeDamage(1);
    expect(enemy.takeDamage(1)).toBe(true);
    expect(enemy.health).toBeLessThanOrEqual(0);
    expect(enemy.isDead).toBe(true);
  });
});
