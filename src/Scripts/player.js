class Player extends Entity {
    
    constructor(x, y) {
        super(x, y, 0.2, 10, window.palette.active.primary, window.palette.active.secondary, 500);
        this.turretLength = 20;
        // ensures that there can only be one player in game.
        // had trouble with too many references to the player floating around. This makes all
        // references easy to kill.
        window.player = this;
    }

    update() {

        super.seek(window.mouse.x, window.mouse.y, this.isColliding, this);

    }

    draw() {
        let offsetX = window.offset.x;
        let offsetY = window.offset.y;

        // draw outer circle
        window.ctx.fillStyle = this.secColour;
        window.ctx.beginPath();
        window.ctx.arc(this.x + window.offset.x, this.y + window.offset.y, this.size + (this.size / 2), 0, Math.PI * 2);
        window.ctx.fill();
        window.ctx.closePath();

        // draw inner circle
        window.ctx.fillStyle = this.primColour;
        window.ctx.beginPath();
        window.ctx.arc(this.x + window.offset.x, this.y + window.offset.y, this.size, 0, Math.PI * 2);
        window.ctx.fill();
        window.ctx.closePath();

        // draw turret
        // turret is just a line between player and mouse that gets shortened
        let dx = window.mouse.x - this.x;
        let dy = window.mouse.y - this.y;
        let mag = Math.sqrt((dx * dx) + (dy * dy));

        //normalise vector
        dx /= mag;
        dy /= mag;

        //scale
        dx *= this.turretLength;
        dy *= this.turretLength;

        window.ctx.beginPath();
        window.ctx.lineWidth = 10;
        window.ctx.strokeStyle = this.primColour;
        window.ctx.moveTo(this.x + window.offset.x, this.y + window.offset.y);
        window.ctx.lineTo(this.x + dx + window.offset.x, this.y + dy + window.offset.y);
        window.ctx.stroke();
        window.ctx.lineWidth = 0;
        window.ctx.closePath();

        // lil floating health bar above player
        this.drawHealthBar();
    }

    drawHealthBar() {

        // not going to explain how it works, but the barlength shinks as the player health does
        // always stays centered over player.
        let maxBarWidth = this.size * 2;
        let backColour = this.secColour;

        let healthPercent = this.health / this.maxHealth;
        let barWidth = maxBarWidth * healthPercent;
        let barHeight = maxBarWidth / 4;

        let barX = this.x - (barWidth/2);
        let barY = this.y - (this.size * 2.5);

        window.ctx.fillStyle = backColour;
        window.ctx.fillRect(barX + window.offset.x, barY + window.offset.y, barWidth, barHeight);

    }

    // tests projected x and y for collisions
    // the player only collides with the outer border, so the logic is fairly simple.
    isColliding(x, y, entity) {

        // radius of player outer circle
        let radius = entity.size + (entity.size / 2);

        let hitLeftBorder = (x <= window.borderWidth + radius);
        let hitRightBorder = (x >= (window.canvas.width - window.borderWidth - radius));
        let hitTopBorder = (y <= window.borderWidth + radius);
        let hitBottomBorder = (y >= (window.canvas.height - window.borderWidth - radius));

        return hitLeftBorder || hitRightBorder || hitTopBorder || hitBottomBorder;

    }

    clickEvent() {
        
    }

    mouseUpEvent() {
        clearInterval(this.laserBuilder);
    }

    // lasers start firing when the mouse is held. enables fans of lasers,
    // though it means that if you hold a laser on one enemy it deals tremendous damage because all the laser damage stacks.
    mouseDownEvent() {
        // makes sure theres no existing interval.
        // debugging for when right clicking with mouse down produced infinite lasers
        clearInterval(this.laserBuilder);

        // temporary loop to produce a new laser object every millisecond
        this.laserBuilder = setInterval(() => {
            if(window.activeGameState.state != 'game') {
                clearInterval(this.laserBuilder);
            }
            let mouseDirection = this.getMouseDirection();
            new Laser(this, mouseDirection.x, mouseDirection.y);
        }, 1);
    }

    getMouseDirection() {
         // get vector to mouse
         let dx = window.mouse.x - this.x;
         let dy = window.mouse.y - this.y;
         // get magnitide
         let mag = Math.sqrt((dx * dx) + (dy * dy));
 
         //normalise vector
         dx /= mag;
         dy /= mag;

         // vector direction
         return {x: dx, y: dy};
    }

    takeDamage(damage) {
        this.health -= damage;
        if(this.health <= 0) {
            this.die();
        }
    }

    die() {
        // calls particle explosion effect from Entity
        this.explode();
        // lose game
        // pauses so the player can see explosions and makes the end less
        // jarring
        setTimeout(() => {
            window.activeGameState = new Lose();
        }, 3000);
        // deletes the only direct player reference so that there are no ghosts.
        delete window.player;
    }

}