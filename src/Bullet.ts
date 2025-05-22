import 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
    private bulletSpeed: number = -600; // Negative for upward movement

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'bullet');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setVelocityY(this.bulletSpeed);
        this.setCollideWorldBounds(false); // Bullets should go off-screen
    }

    update() {
        // Automatically destroy bullets when they go off-screen to save resources
        if (this.y < 0) {
            this.destroy();
        }
    }
}
