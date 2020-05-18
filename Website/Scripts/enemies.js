class Enemy extends Entity {

    constructor(x, y, health) {
        super(x, y, 0.3, 1, window.palette.active.primary, window.palette.active.secondary, health);
        this.size = Math.sqrt(this.health);
        // radius at which the explosion on death will damage player
        this.explosionRadius = 20;
        this.explosionDamage = Math.pow(this.health, 1.5);
        // adds entity to entities list, used to loop through and draw/update all entities
        window.entities[this.id] = this;
    }

    update() {
        if(window.player != undefined) {
            this.size = Math.sqrt(this.health) + 3;
            this.explosionDamage = Math.pow(this.health, 1.5);
            this.seek(window.player.x, window.player.y, () => {return false;});
            this.trySuicideAttack();
        }
    }

    draw() {

        // draw circle
        window.ctx.fillStyle = this.secColour;
        window.ctx.beginPath();
        window.ctx.arc(this.x + window.offset.x, this.y + window.offset.y, this.size, 0, Math.PI * 2);
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
        if (this.getDistanceToPlayer() < this.explosionRadius) {
            window.player.takeDamage(this.explosionDamage * (1/this.getDistanceToPlayer()) * 10);
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
        if(this.getDistanceToPlayer() < this.explosionRadius * 0.9) {
            this.die();
        }
    }

}