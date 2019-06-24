const level = document.getElementById('level');
const lives = document.getElementById('lives');
const highestScore = document.getElementById('highestScore');

function getRandom(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

class Enemy {
  // static variable for generating random speed between low and high.
  static low = 30;
  static high = 40;

  constructor(y) {
    this.x = getRandom(-250, -50);
    this.y = y;
    this.speed = getRandom(30, 40);
    this.sprite = 'images/enemy-bug.png';
  };

  update(dt) {
    // check collision
    if (player.y === this.y && player.x >= (this.x - 78) && player.x <= (this.x + 78) && player.livesFlag) {
      player.livesFlag = false;
      window.setTimeout(player.updateLives.bind(player), 200);
    }
    // reset enemy back to start postion when get out of box
    allEnemies.forEach(function (enemy) {
      if (enemy.x > 505) {
        enemy.x = getRandom(-250, -50);
      }
      enemy.x += enemy.speed * dt;
    });
  };

  // levelup() function for upgrade bugs speed.
  static levelup() {
    Enemy.high += 5;
    Enemy.low += 5;
    allEnemies.forEach(function (enemy) {
      enemy.speed = getRandom(Enemy.high, Enemy.low);
    })
  };

  // resetEnemy() function reset enemy back to start position and it also reset its speed to default. 
  static resetEnemy(low = 30, high = 40) {
    allEnemies.forEach(function (enemy) {
      enemy.speed = getRandom(low, high);
      enemy.x = getRandom(-250, -50);
    });
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.level = 1;
    this.lives = 3;
    this.sprite = 'images/char-boy.png';
    this.levelflag = true; //levelflag is used to update game level only once
    this.livesFlag = true; //livesflag is used to update plyer lives only once
    this.highest = 1;
  }
  // updateLevelBoard() increase level of player on scoreboard and reset players position back to default. 
  updateLevelBoard() {
    this.x = 200;
    this.y = 400;
    if (!this.levelflag) {
      this.level += 1;
      Enemy.levelup();
      if (this.level >= this.highest) {
        this.highest = this.level - 1;
        highestScore.innerText = this.highest;
      }
      level.innerText = this.level;
    }
    this.levelflag = true;
  }
  // updateLives() decrease lives of player on scoreboard and reset players position back to default.
  updateLives() {
    this.x = 200;
    this.y = 400;
    if (!this.livesFlag) {
      Enemy.resetEnemy(Enemy.high,Enemy.low);
      player.lives -= 1;
      lives.innerText = player.lives;
    }
    if (this.lives === 0) {
      this.level = 1;
      this.lives = 3;
      Enemy.low = 30;
      Enemy.high = 40;
      level.innerText = this.level;
      lives.innerText = this.lives;
      Enemy.resetEnemy();
    }
    this.livesFlag = true;
  }

  update() {
    // this will check for the winning condition.
    if (player.y === -25 && this.levelflag) {
      this.levelflag = false;
      window.setTimeout(this.updateLevelBoard.bind(this), 400);
      Enemy.levelup();
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(key) {
    if (key == 'up' && this.y > -25) {
      this.y -= 85;
    } else if (key == 'down' && this.y < 400) {
      this.y += 85;
    } else if (key == 'left' && this.x > 0) {
      this.x -= 100;
    } else if (key == 'right' && this.x < 400) {
      this.x += 100;
    }
  }
}

let allEnemies = [];
let e1 = new Enemy(230);
let e2 = new Enemy(145);
let e3 = new Enemy(60);
allEnemies.push(e1, e2, e3);

let player = new Player(200, 400);

document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});