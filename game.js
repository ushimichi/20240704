var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
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

var game = new Phaser.Game(config);

function preload() {
    this.load.image('ship', 'imgs/player.png');
    this.load.image('bullet', 'imgs/bullet.png');
    this.load.image('enemy', 'imgs/enemy.png');
}

function create() {
    var player = this.physics.add.sprite(100, config.height / 2, 'ship');

    var bullets = this.physics.add.group();

    this.input.on('pointerdown', function (pointer) {
        var bullet = bullets.create(player.x, player.y, 'bullet');
        bullet.setVelocity(500, 0);
    }, this);
}

function update() {
    // ゲームの更新処理
}
