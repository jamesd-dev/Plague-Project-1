class Enemy extends Entity {

    constructor(x, y, size, player) {
        super(x, y, 0.3, size, window.palette.active.primary, window.palette.active.secondary, 10);
        this.health = Math.pow(this.size, 2);
        // used to target player
        this.player = player;
    }

    update() {
        this.seek(this.player.x, this.player.y, () => {return false;});
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

}