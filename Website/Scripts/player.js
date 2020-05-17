class Player extends Entity {
    
    constructor(x, y) {
        super(x, y, 0.2, 10, window.palette.active.primary, window.palette.active.secondary, 100);
        this.turretLength = 20;
        // ensures that there can only be one player in game.
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

        this.drawHealthBar();
    }

    drawHealthBar() {

        let maxBarWidth = this.size * 2;
        let backColour = this.secColour;
        let barColour = window.palette.active.bright;

        let healthPercent = this.health / this.maxHealth;
        let barWidth = maxBarWidth * healthPercent;
        let barHeight = maxBarWidth / 4;

        let barX = this.x - (barWidth/2);
        let barY = this.y - (this.size * 2.5);

        window.ctx.fillStyle = backColour;
        window.ctx.fillRect(barX + window.offset.x, barY + window.offset.y, barWidth, barHeight);

    }

    // tests projected x and y for collisions
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
        //let mouseDirection = this.getMouseDirection();
        //new Laser(this.x, this.y, mouseDirection.x, mouseDirection.y);
    }

    mouseUpEvent() {
        clearInterval(this.laserBuilder);
    }

    mouseDownEvent() {
        this.laserBuilder = setInterval(() => {
            let mouseDirection = this.getMouseDirection();
            new Laser(this, mouseDirection.x, mouseDirection.y);
        }, 1);
    }

    getMouseDirection() {
         // get vector to mouse
         let dx = window.mouse.x - this.x;
         let dy = window.mouse.y - this.y;
         let mag = Math.sqrt((dx * dx) + (dy * dy));
 
         
         //normalise vector
         dx /= mag;
         dy /= mag;

         return {x: dx, y: dy};
    }

    takeDamage(damage) {
        this.health -= damage;
        if(this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.explode();
        // lose game
        window.activeGameState = new Lose();
        delete window.player;
    }

}