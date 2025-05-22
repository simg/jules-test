import 'phaser';

import { EnemyBullet } from './EnemyBullet'; // Import EnemyBullet
// Removed duplicate import of EnemyBullet

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    private moveSpeed: number = 100;
    // public bullets: Phaser.GameObjects.Group; // This was not used / initialized properly

    constructor(scene: Phaser.Scene, x: number, y: number, speed?: number) {
        super(scene, x, y, 'enemyShip');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        if (speed !== undefined) {
            this.moveSpeed = speed;
        }
        this.setVelocityY(this.moveSpeed);
        this.setCollideWorldBounds(false); // Allow enemies to move off-screen
    }

    public setSpeed(speed: number): void {
        this.moveSpeed = speed;
        this.setVelocityY(this.moveSpeed);
    }

    // Method for enemy to shoot
    public shoot(enemyBulletsGroup: Phaser.Physics.Arcade.Group): void {
        if (this.active) { // Only shoot if active
            const bullet = enemyBulletsGroup.get(this.x, this.y + 30) as EnemyBullet;
            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                // EnemyBullet constructor should set its velocity.
            }
        }
    }

    update() {
        // Example: Destroy enemy if it moves off the bottom of the screen
        if (this.y > this.scene.cameras.main.height) {
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
        // Add logic for enemies to shoot periodically later - This comment is misleading as shooting is time-based in game.ts
    }
}
