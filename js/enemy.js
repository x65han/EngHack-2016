function EnemyManager() {
    var list = [];

    function pushEnemy(enemy) {
        enemy.spawnEnemy();
        list.push(enemy);
    }

    function getEnemyByPhysicsInstance(enemy) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].enemy === enemy) {
                return list[i];
            }
        }
    }

    function update() {
        for (var i = 0; i < list.length; i++) {
            list[i].updatePosition();
        }
    }

    return {
        pushEnemy: pushEnemy,
        getEnemyByPhysicsInstance: getEnemyByPhysicsInstance,
        update: update
    };
}

function Enemy() {
    var health = 30,
        speed = 2,
        directionX,
        directionY;

    this.enemy = null;

    this.reduceHP = function(damage) {
        health -= damage;
        if (health <= 0) {
            this.enemy.kill();
            enemyManager.pushEnemy(new Enemy());
            audio.play('death');
        }
    };

    this.spawnEnemy = function() {
        var posX;
        directionX = genDirection();
        directionY = genDirection();
        if (directionX === -1) {
            posX = Context.width + genRandom(Context.width * 1 / 4);
        } else if (directionX === 1) {
            posX = -genRandom(Context.width * 1 / 4);
        }

        this.enemy = enemyGroup.create(posX, genRandom(Context.height), 'enemy');
        this.enemy.scale.setTo(3, 3);
        this.enemy.body.setSize(20,20,0,0);
        this.enemy.animations.add('idle');
        this.enemy.animations.play('idle', 10, true);
    };
    this.updatePosition = function() {
        this.enemy.x += speed * directionX;
        this.enemy.y += speed * directionY;
        if (this.enemy.x <= -38) {
            directionX = 1;
        } else if (this.enemy.x >= Context.width) {
            directionX = -1;
        }
        if (this.enemy.y <= -38) {
            directionY = 1;
        } else if (this.enemy.y >= Context.height) {
            directionY = -1;
        }
    };
}

function genDirection() {
    var direction = Math.round(Math.random());
    if (direction === 0) {
        return -1;
    } else {
        return 1;
    }
}

function genRandom(length) {
    return Math.floor(Math.random() * (length));
}

function hitEnemy(player, enemy) {
    function resetCollison() {
        player.hasCollided = false;
    }
    if (!player.hasCollided) {
        player.hasCollided = true;
        enemyManager.getEnemyByPhysicsInstance(enemy).reduceHP(30);
        currentPlayer.reduceHP();
        Context.game.time.events.add(Phaser.Timer.SECOND * 1, resetCollison, this);
        audio.play('boss hit');
    }
}

function killEnemyBall(fireBall, enemies) {
    enemies.kill();
    fireBall.kill();
    enemyManager.pushEnemy(new Enemy());
    audio.play('ping');
    currentPlayer.scoreboard += 100;
    currentPlayer.updateScore();
}

function killEnemyKnife(knife, enemies) {
    enemies.kill();
    enemyManager.pushEnemy(new Enemy());
    audio.play('ping');
}
