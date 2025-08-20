import 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private bullets: Phaser.GameObjects.Group;
    private lastFired: number = 0;
    private fireRate: number = 200; // Player Fire Rate: 250ms -> 200ms (5 shots/sec)
    private moveSpeed: number = 250; // Player Speed: 200 -> 250 (Corrected: single definition)


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'playerShip');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        // Create a group for bullets
        // The actual classType for bullets will be set in game.ts after Bullet class is imported
        this.bullets = this.scene.add.group({
            runChildUpdate: true // Ensure bullets' update methods are called
        });
    }

    public moveLeft(): void {
        this.setVelocityX(-this.moveSpeed);
    }

    public moveRight(): void {
        this.setVelocityX(this.moveSpeed);
    }

    public stop(): this {
        this.setVelocityX(0);
        return this;
    }

    public shoot(): void {
        if (!this.bullets.classType) {
            console.error("Bullet classType not set on player's bullet group!");
            return;
        }
        if (this.scene.time.now > this.lastFired + this.fireRate) {
            const bullet = this.bullets.get(this.x, this.y - 30); // Get a bullet from the group

            if (bullet) {
                bullet.setActive(true);
                bullet.setVisible(true);
                // The bullet's constructor and physics should handle its movement.
                this.lastFired = this.scene.time.now;
                if (this.scene.sound.exists('sfx_player_shoot')) {
                    this.scene.sound.play('sfx_player_shoot'); // Play shoot sound
                }
            }
        }
    }

    // Method to set the bullet class on the group, to be called from game.ts
    public setBulletClass(bulletClass: any): void {
        this.bullets.classType = bulletClass;
    }
}
