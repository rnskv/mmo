import CollisionGameObject from "../core/CollisionGameObject";
import settings from "../configs/settings";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

class Player extends CollisionGameObject {
  constructor({ isBot, uid, _id, name, ...params }) {
    super({ ...params });
    this.type = 'PLAYER';
    this.uid = uid;
    this._id = _id;

    this.name = name;

    this.speed = 1;

    this.dx = 0;
    this.dy = 10;

    this.radius = 15;

    this.pivot = { x: this.width / 2, y: this.height / 2 };
    this.gravity = 9.8;
    this.moveUpRotation = 35;

    this.isBot = isBot;

    this.maxDX = 1.5;
    this.isDie = false;

    this.localScores = 0;
    this.lastCheckPointId = null;
    this.maxScores = 0;
    this.currentCheckPoint = null;
  }

  get clientData() {
    return {
      id: this.id,
      _id: this._id,
      x: this.x,
      y: this.y,
      radius: this.radius,
      pivot: this.pivot,
      rotation: (Math.PI * this.rotation) / 180,
      shape: this.shape.size,
      uid: this.uid,
      name: this.name,
      localScores: this.localScores
    };
  }

  increaseLocalScores(id) {
    if (this.lastCheckPointId !== id) {
      this.lastCheckPointId = id;
      this.localScores += 1;
    }
  }

  onClick() {
    if (this.isDie) return;
    this.dy = -7;
    this.rotation = -40;
    this.y -= 1;
  }

  onCollide(object) {
    console.log(object.type)
    switch (object.type) {
      case 'PIPE': {
        this.kill();
        break;
      }
      case 'CHECKPOINT': {
        this.increaseLocalScores(object.id)
      }
    }
    // this.x = object.x - this.width;

  }

  kill() {
    if (this.isDie) return;
    this.dx = 0;
    this.rotation = 90;
    this.isDie = true;
    this.dy = -10;
    this.localScores = 0;
  }

  spawn() {
    this.dy = 0;
    this.y = 0;
    this.x = 0;
    this.rotation = 0;
    this.isDie = false;
  }

  update(dt) {
    this.methods.spawnPipe(this.x, 0);
    if (this.dy < 6 || (this.isDie && this.dy < 10)) {
      this.dy += 0.5 * dt;
    }

    if (this.dx < this.maxDX && !this.isDie) {
      this.dx += 0.5 * dt;
    }

    if (this.rotation < this.moveUpRotation) {
      this.rotation += (Math.abs(this.dy) / 2) * dt;
    }

    if (this.y < settings.map.border.top) {
      this.kill();
    }

    if (this.y + this.dy * this.speed * dt < settings.map.border.bottom) {
      this.x += this.dx * this.speed * dt;
      this.y += this.dy * this.speed * dt;
    } else {
      if (this.x > 500) {
        this.spawn();
      } else {
        if (this.isDie) {
          this.spawn();
        }
        this.rotation = 0;
        this.isDie = false;
      }
    }
  }
}

export default Player;
