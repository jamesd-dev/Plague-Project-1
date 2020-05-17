class Enemy extends Entity {

    constructor(x, y, size, player) {
        super(x, y, 0.1, size, window.palette.active.primary, window.palette.active.secondary, 10);
        this.health = Math.pow(this.size, 2);
        // used to target player
        this.player = player;
    }

    update() {

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

}