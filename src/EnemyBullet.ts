import 'phaser';

export class EnemyBullet extends Phaser.Physics.Arcade.Sprite {
    private bulletSpeed: number = 250; // Enemy Bullet Speed: 300 -> 250

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'enemyBullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(this.bulletSpeed);
        this.setCollideWorldBounds(false); // Bullets should go off-screen
    }

    update() {
        // Automatically destroy bullets when they go off-screen (bottom)
        if (this.y > this.scene.cameras.main.height) {
            this.destroy();
        }
    }
}
