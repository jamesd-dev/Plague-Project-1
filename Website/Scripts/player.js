class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        //physics
        this.speed = 2;

        // appearence
        this.size = 10;
        this.turretLength = 20;
        this.primColour = window.palette.autumn.kobe;
        this.secColour = window.palette.autumn.richBlack;
    }

    update() {

        // get vector to mouse
        let dx = window.mouse.x - this.x;
        let dy = window.mouse.y - this.y;
        let mag = Math.sqrt((dx * dx) + (dy * dy));

        
        //normalise vector
        dx /= mag;
        dy /= mag;

        // using a fraction power makes it so the player goes faster the further the mouse is from it.
        // makes it feel more responsive.
        // low exponent to make the effect more subtle.
        dx = Math.pow(mag, 0.2) * dx;
        dy = Math.pow(mag, 0.2) * dy;

        // apply change
        this.x += dx;
        this.y += dy;

    }

    draw() {
        let offsetX = window.offset.x;
        let offsetY = window.offset.y;

        // draw outer circle
        window.ctx.fillStyle = window.palette.active.secondary;
        window.ctx.beginPath();
        window.ctx.arc(this.x + window.offset.x, this.y + window.offset.y, this.size + (this.size / 2), 0, Math.PI * 2);
        window.ctx.fill();
        window.ctx.closePath();

        // draw inner circle
        window.ctx.fillStyle = window.palette.active.highlight;
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
        window.ctx.strokeStyle = window.palette.active.highlight;
        window.ctx.moveTo(this.x + window.offset.x, this.y + window.offset.y);
        window.ctx.lineTo(this.x + dx + window.offset.x, this.y + dy + window.offset.y);
        window.ctx.stroke();
        window.ctx.lineWidth = 0;
        window.ctx.closePath();
    }
}