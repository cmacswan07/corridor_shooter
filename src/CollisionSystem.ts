import { Enemy } from "./Enemy";
import { PROJECTILE_RADIUS } from "./Projectile";
import type { EnemyManager } from "./EnemyManager";
import type { ProjectileManager } from "./ProjectileManager";

const HIT_DISTANCE_SQ = (Enemy.HIT_RADIUS + PROJECTILE_RADIUS) ** 2;

/** Detects and resolves collisions between projectiles and enemies each frame. */
export class CollisionSystem {
  private readonly _enemyManager: EnemyManager;
  private readonly _projectileManager: ProjectileManager;

  constructor(enemyManager: EnemyManager, projectileManager: ProjectileManager) {
    this._enemyManager = enemyManager;
    this._projectileManager = projectileManager;
  }

  update(): void {
    const enemies = this._enemyManager.getEnemies();
    for (const projectile of [...this._projectileManager.getProjectiles()]) {
      for (const enemy of enemies) {
        if (enemy.isDead) continue;
        if (
          enemy.mesh.position.distanceToSquared(projectile.mesh.position) <=
          HIT_DISTANCE_SQ
        ) {
          enemy.takeDamage(1);
          this._projectileManager.remove(projectile);
          break;
        }
      }
    }
    this._enemyManager.removeDead();
  }
}
