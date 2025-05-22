import 'phaser';
import { Player } from './Player';
import { Bullet } from './Bullet';
import { Enemy } from './Enemy';
import { EnemyBullet } from './EnemyBullet'; // Import the EnemyBullet class

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player: Player;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let spaceKey: Phaser.Input.Keyboard.Key;
let enemies: Phaser.Physics.Arcade.Group;
let enemyBullets: Phaser.Physics.Arcade.Group;
let lastEnemyShotTime: number = 0;
const enemyShootInterval: number = 1500; // Enemy Shoot Interval: 2000ms -> 1500ms

let score: number = 0;
let lives: number = 3;
let scoreText: Phaser.GameObjects.Text;
let livesText: Phaser.GameObjects.Text;
let gameOverText: Phaser.GameObjects.Text;
let restartText: Phaser.GameObjects.Text;

let isGameOver: boolean = false;
let gameStarted: boolean = false;
let instructionText: Phaser.GameObjects.Text;

// Audio keys
const SFX_PLAYER_SHOOT = 'sfx_player_shoot';
const SFX_ENEMY_HIT = 'sfx_enemy_hit';
const SFX_PLAYER_HIT = 'sfx_player_hit';
const MUSIC_BACKGROUND = 'music_background';

// Wave configuration
const waveConfigs = [
    { enemies: 5, speed: 100 }, // Wave 1
    { enemies: 7, speed: 120 }, // Wave 2 (was 8 enemies)
    { enemies: 10, speed: 140 }, // Wave 3 (was 10 enemies, speed 150)
    { enemies: 12, speed: 150 }, // Wave 4 (was example, now 12 enemies)
    { enemies: 15, speed: 160 }  // Wave 5 (new)
];
let currentWaveIndex: number = -1; // Start at -1 so first wave is 0
let waveActive: boolean = false;
const waveClearDelay: number = 3000; // Milliseconds

function preload(this: Phaser.Scene) {
    this.load.svg('playerShip', 'assets/player_ship.svg', { width: 50, height: 50 });
    this.load.svg('bullet', 'assets/bullet.svg', { width: 10, height: 20 });
    this.load.svg('enemyShip', 'assets/enemy_ship.svg', { width: 50, height: 50 });
    this.load.svg('enemyBullet', 'assets/enemy_bullet.svg', { width: 10, height: 10 }); // Preload enemy bullet

    // Load audio assets
    this.load.audio(SFX_PLAYER_SHOOT, 'assets/sounds/player_shoot.wav');
    this.load.audio(SFX_ENEMY_HIT, 'assets/sounds/enemy_hit.wav');
    this.load.audio(SFX_PLAYER_HIT, 'assets/sounds/player_hit.wav');
    this.load.audio(MUSIC_BACKGROUND, 'assets/music/background.mp3');
}

function create(this: Phaser.Scene) {
    // Reset state variables for a clean restart
    isGameOver = false;
    gameStarted = false; // Reset game started state
    score = 0;
    lives = 3;
    currentWaveIndex = -1; 
    waveActive = false;
    lastEnemyShotTime = 0;

    player = new Player(this, 400, 550);
    player.setActive(false); // Player is inactive until game starts
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    player.setBulletClass(Bullet);

    enemies = this.physics.add.group({
        classType: Enemy,
        runChildUpdate: true
    });

    this.physics.add.collider(player['bullets'], enemies, handleBulletEnemyCollision as ArcadePhysicsCallback, undefined, this);

    enemyBullets = this.physics.add.group({
        classType: EnemyBullet,
        runChildUpdate: true
    });
    this.physics.add.collider(player, enemyBullets, handlePlayerHitByEnemyBullet as ArcadePhysicsCallback, undefined, this);

    scoreText = this.add.text(16, 16, 'Score: ' + score, { fontSize: '32px', color: '#FFF' });
    livesText = this.add.text(this.cameras.main.width - 16, 16, 'Lives: ' + lives, { fontSize: '32px', color: '#FFF' }).setOrigin(1, 0);

    if (gameOverText && gameOverText.scene) gameOverText.destroy();
    if (restartText && restartText.scene) restartText.destroy();
    gameOverText = null; 
    restartText = null;

    // Display initial instructions
    if (instructionText && instructionText.scene) instructionText.destroy(); // Clear previous if any
    instructionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'Arrow keys to move, Space to shoot.\nPress any key to start!', { fontSize: '24px', color: '#FFF', align: 'center' }).setOrigin(0.5);
    
    // Game doesn't start (waves, music) until a key is pressed
    this.input.keyboard.once('keydown', startGame, this);
}

function startGame(this: Phaser.Scene) {
    // Prevent starting if game is already over (e.g., player lost all lives then tries to press a key that also restarts)
    // Or if the game has already started and this somehow gets called again.
    if (isGameOver || gameStarted) return;

    gameStarted = true;
    if (instructionText) instructionText.destroy();
    instructionText = null; // Clear reference

    player.setActive(true); // Activate player for input and visibility of actions

    startNextWave.call(this); // Start the first wave

    // Start background music
    if (!this.sound.get(MUSIC_BACKGROUND) || !this.sound.get(MUSIC_BACKGROUND).isPlaying) {
        this.sound.play(MUSIC_BACKGROUND, { loop: true, volume: 0.5 });
    } else if (this.sound.get(MUSIC_BACKGROUND).isPaused) { 
        this.sound.get(MUSIC_BACKGROUND).resume();
    }
}

function spawnEnemiesForWave(scene: Phaser.Scene, waveConfig: { enemies: number, speed?: number, formation?: string }) {

function spawnEnemiesForWave(scene: Phaser.Scene, waveConfig: { enemies: number, speed?: number, formation?: string }) {
    console.log(`Spawning wave with ${waveConfig.enemies} enemies.`);
    for (let i = 0; i < waveConfig.enemies; i++) {
        const x = Phaser.Math.Between(100, 700); // Random X for now
        const y = Phaser.Math.Between(50, 150);  // Random Y near top
        const enemy = enemies.get(x, y) as Enemy;
        if (enemy) {
            enemy.setActive(true).setVisible(true);
            // Optionally set speed if defined in waveConfig and Enemy class supports it
            if (waveConfig.speed && typeof (enemy as any).setSpeed === 'function') {
                 (enemy as any).setSpeed(waveConfig.speed);
            } else if (waveConfig.speed) {
                // Default way to set speed if no specific method
                enemy.setVelocityY(waveConfig.speed);
            }
        }
    }
    waveActive = true;
}

function startNextWave(this: Phaser.Scene) {
    currentWaveIndex++;
    if (currentWaveIndex >= waveConfigs.length) {
        console.log("All waves cleared! Looping back...");
        currentWaveIndex = 0; // Loop back for continuous play
        // Or, implement a victory condition
    }

    const waveConfig = waveConfigs[currentWaveIndex];
    console.log(`Starting wave ${currentWaveIndex + 1}`);
    spawnEnemiesForWave(this, waveConfig);
}


function handleBulletEnemyCollision(bullet: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject): void {
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
    this.sound.play(SFX_ENEMY_HIT);
}

function handlePlayerHitByEnemyBullet(playerObj: Phaser.GameObjects.GameObject, enemyBullet: Phaser.GameObjects.GameObject): void {
    if (isGameOver) return; // Don't process if already game over

    enemyBullet.destroy();
    lives--;
    livesText.setText('Lives: ' + lives);
    this.sound.play(SFX_PLAYER_HIT);
    console.log('Player hit! Lives left: ' + lives);

    if (lives <= 0) {
        isGameOver = true;
        console.log('Game Over');
        (playerObj as Player).setActive(false).setVisible(false);
        this.sound.stopByKey(MUSIC_BACKGROUND); // Stop music on game over

        // Display Game Over messages
        gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Game Over', { fontSize: '64px', color: '#FF0000' }).setOrigin(0.5);
        restartText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Press R to Restart', { fontSize: '32px', color: '#FFF' }).setOrigin(0.5);

        // Stop enemies and their bullets
        enemies.getChildren().forEach(enemy => {
            (enemy as Phaser.Physics.Arcade.Sprite).setVelocity(0, 0);
            // Optionally make them inactive/invisible
            // (enemy as Phaser.Physics.Arcade.Sprite).setActive(false).setVisible(false);
        });
        enemyBullets.getChildren().forEach(bullet => {
            (bullet as Phaser.Physics.Arcade.Sprite).setVelocity(0,0);
             // (bullet as Phaser.Physics.Arcade.Sprite).setActive(false).setVisible(false);
        });

    }
}

function update(this: Phaser.Scene, time: number, delta: number) {
    if (isGameOver) {
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R))) {
            // gameStarted will be reset in create()
            this.scene.restart();
        }
        return; 
    }

    if (!gameStarted) {
        // Game hasn't started yet (waiting for initial key press).
        // The 'keydown' listener in create() calls startGame().
        return;
    }

    // Game has started and is not over
    if (player.active) { // Player specific actions
        if (cursors.left.isDown) {
            player.moveLeft();
        } else if (cursors.right.isDown) {
            player.moveRight();
        } else {
            player.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            player.shoot();
        }
    }

    // Enemy shooting logic - only if game is not over and game has started
    if (time > lastEnemyShotTime + enemyShootInterval) { // isGameOver and gameStarted checks are implicitly handled by overall update structure
        const livingEnemies = enemies.getChildren().filter(enemy => enemy.active);
        if (livingEnemies.length > 0) {
            const randomEnemy = Phaser.Utils.Array.GetRandom(livingEnemies) as Enemy;
            if (randomEnemy) {
                randomEnemy.shoot(enemyBullets);
            }
            lastEnemyShotTime = time;
        }
    }

    // Wave management - only if game is not over and game has started
    if (waveActive && enemies.countActive(true) === 0) { // isGameOver and gameStarted checks are implicitly handled
        waveActive = false;
        console.log(`Wave ${currentWaveIndex + 1} cleared!`);
        this.time.delayedCall(waveClearDelay, () => {
            if (!isGameOver && gameStarted) { // Still need to check here in case game over happened during delay
                startNextWave.call(this);
            }
        });
    }
}

const game = new Phaser.Game(config);
