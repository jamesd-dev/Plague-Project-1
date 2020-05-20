class Enemy extends Entity {

    constructor(x, y, health, speed) {
        super(x, y, 0.3, 1, window.palette.active.primary, window.palette.active.secondary, health);
        this.maxHealth = health;
        this.health = health;
        this.size = Math.sqrt(this.health);

        // so speed can be updated later
        this.baseSpeed = speed;
        // make speed dependant on size
        // much more fun weaving around big lumbering enemies while the lil' uns chase you.
        this.speed = (1 / this.size) * this.baseSpeed;

        // radius at which the explosion on death will damage player
        this.explosionRadius = 80;
        this.explosionDamage = (this.maxHealth * 100 > 5) ? this.maxHealth * 100 : 5;

        // used to produce the shaking before the enemy splits
        this.shakeOffset = {
            x: 0,
            y: 0,
            shakePath: []
        };

        // adds entity to entities list, used to loop through and draw/update all entities
        window.entities[this.id] = this;
    }

    update() {
        if(window.player != undefined) {
            // the more enemies they are the less likely it is that they will split.
            // should help the performance
            if(Math.random() < (1 / (Math.pow(Object.values(window.entities).length, 2))) && this.health > 20 && Object.values(window.entities).length < 100) {
                this.split();
            }
            this.applyShake();
            this.speed = (1 / this.size) * this.baseSpeed;
            this.size = Math.sqrt(this.health) + 1;
            this.seek(window.player.x, window.player.y, () => {return false;});
            this.trySuicideAttack();
        }
    }

    draw() {

        // draw circle
        window.ctx.fillStyle = this.secColour;
        window.ctx.beginPath();
        window.ctx.arc(this.x + window.offset.x + this.shakeOffset.x, this.y + window.offset.y + this.shakeOffset.y, this.size, 0, Math.PI * 2);
        window.ctx.fill();
        window.ctx.closePath();

    }

    clickEvent() {

    }

    takeDamage(damage) {
        this.health -= damage;
        if(this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.explode();
        window.score += 100 * window.scoreMultiplier;
        // like a real explosion, the closer you are the more it hurts
        if (this.getDistanceToPlayer() < this.explosionRadius) {
            window.player.takeDamage(this.explosionDamage/this.getDistanceToPlayer());
        }
        let currentTime = (new Date()).getTime();
        if(currentTime - window.lastKillTime < (window.multExpireTime / 2)) {
            window.scoreMultiplier++;
        }
        window.lastKillTime = currentTime;
        delete window.entities[this.id];
    }

    seek(targetX, targetY, isColliding) {

        // removes some of the jitter when the target is reached.
        targetX -= 2;
        targetY -= 2;

         // get vector to target
         let dx = targetX - this.x;
         let dy = targetY - this.y;
         let mag = Math.sqrt((dx * dx) + (dy * dy));
 
         
         //normalise vector
         dx /= mag;
         dy /= mag;
 
         dx = this.speed * dx;
         dy = this.speed * dy;
     
        // check if entity is colliding with anything.
         // anything but the player will just have a false returning function.
         if(!isColliding(this.x + dx, this.y + dy)) {
            // apply change
            this.x += dx;
            this.y += dy;
        }

         
    }

    getDistanceToPlayer() {
        let dx = window.player.x - this.x;
        let dy = window.player.y - this.y;
        let dist = Math.sqrt((dx * dx) + (dy * dy));
        return dist;
    }

    trySuicideAttack() {
        // tries to get close so explosion hurts more
        if(this.getDistanceToPlayer() < this.explosionRadius * 0.2) {
            this.die();
        }
    }

    // mostly stolen from the camera shake functions
    // shakes the enemy then splits into small enemies.
    split() {
        for(let i = 0; i < 500 - this.shakeOffset.shakePath.length; i++) {
            this.shakeOffset.shakePath.push( (Math.random() * 3) - 1);
        }
    }

    applyShake() {
        if(this.shakeOffset.shakePath.length >= 2) {
            this.shakeOffset.x = this.shakeOffset.shakePath.pop();
            this.shakeOffset.y = this.shakeOffset.shakePath.pop();
            if(this.shakeOffset.shakePath.length <= 2) {
                if (Object.values(window.entities).length < 100) {
                    this.splitEnemy();
                }
            }
        } else {
            this.shakeOffset.x = 0;
            this.shakeOffset.y = 0;
        }
    }

    // splits enemy into a bunch of smaller enemies, which all add up to the same size
    splitEnemy() {
       while(this.health * 0.1> 0.5) {
            let healthFrag = this.health * 0.1;
            this.health -= healthFrag;
            new Enemy(this.x + (Math.random() * 20) - 20, this.y + (Math.random() * 20) - 20, healthFrag, this.baseSpeed);
        }
        this.die();
    }

}
