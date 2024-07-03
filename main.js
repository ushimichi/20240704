const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);

let score = 0;
let scoreText;
let gameOverText;
let touchX = null;
let isGameOver = false;

function preload() {
    this.load.image('background', 'imgs/background.png');
    this.load.image('player', 'imgs/player.png');
    this.load.image('bullet', 'imgs/bullet.png');
    this.load.image('enemy', 'imgs/enemy.png');
}

function create() {
    // 背景の追加
    this.add.image(400, 300, 'background');

    // プレイヤーの作成
    this.player = this.physics.add.sprite(400, 500, 'player');
    this.player.setCollideWorldBounds(true);

    // キー入力の設定
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // 弾のグループを作成
    this.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 10
    });

    // 敵のグループを作成
    this.enemies = this.physics.add.group();

    // 敵の生成
    this.time.addEvent({
        delay: 1000,
        callback: addEnemy,
        callbackScope: this,
        loop: true
    });

    // 衝突判定
    this.physics.add.overlap(this.bullets, this.enemies, destroyEnemy, null, this);
    this.physics.add.overlap(this.player, this.enemies, gameOver, null, this);

    // スコア表示
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    // ゲームオーバー表示
    gameOverText = this.add.text(400, 300, '', { fontSize: '64px', fill: '#fff' });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    // タッチイベントの設定
    this.input.on('pointermove', function (pointer) {
        touchX = pointer.x;
    });

    this.input.on('pointerdown', function (pointer) {
        if (isGameOver) {
            restartGame.call(this);
        } else {
            fireBullet.call(this);
        }
    }, this);
}

function update() {
    if (isGameOver) return;

    // プレイヤーの移動
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
    } else if (touchX !== null) {
        const diff = touchX - this.player.x;
        if (Math.abs(diff) > 10) {
            this.player.setVelocityX(diff);
        } else {
            this.player.setVelocityX(0);
        }
    } else {
        this.player.setVelocityX(0);
    }

    // 弾の発射
    if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
        fireBullet.call(this);
    }
}

function fireBullet() {
    const bullet = this.bullets.get(this.player.x, this.player.y - 20);

    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.body.velocity.y = -300;
    }
}

function addEnemy() {
    if (isGameOver) return;

    const x = Phaser.Math.Between(50, 750);
    const enemy = this.enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(100);
}

function destroyEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}

function gameOver(player, enemy) {
    this.physics.pause();
    player.setTint(0xff0000);
    enemy.destroy();
    isGameOver = true;
    gameOverText.setText('Game Over! Tap to Restart');
    gameOverText.setVisible(true);
}

function restartGame() {
    isGameOver = false;
    this.physics.resume();
    this.player.clearTint();
    this.enemies.clear(true, true);
    score = 0;
    scoreText.setText('Score: ' + score);
    gameOverText.setVisible(false);
}
