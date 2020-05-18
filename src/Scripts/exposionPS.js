window.particles = {};

class ExplosionParticle {
    constructor(x, y) {

        this.palIndex = 0;

        // position
        this.x = x;
        this.y = y;

        // physics
        this.speed = (Math.random() * 3) + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.vx = this.speed * Math.cos(this.angle);
        this.vy = this.speed * Math.sin(this.angle);
        this.accel = 0.9;

        // particle colours
        this.palette = [
            window.palette.explosion.greenYellow,
            window.palette.explosion.safetyOrange,
            window.palette.explosion.kobe,
            window.palette.explosion.vanDykeBrown,
            window.palette.explosion.smokyBlack
        ];

        // everything else
        this.lifespan = Math.random() * 50;
        this.decayRate = 0.01;
        this.size = Math.random() * 50;
        this.sizeDecayRate = 0.9;
        this.id = (new Date()).getTime().toString() + Math.random();

        // add to central list of all particles
        window.particles[this.id] = this;
    }

    die() {
        delete window.particles[this.id];
    }

    update() {
        // physics
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= this.accel;
        this.vy *= this.accel;

        // appearence
        this.size *= this.sizeDecayRate;
        if(this.palIndex < this.palette.length + 1) {
            if(Math.random() * (this.lifespan) < 1) {
                this.palIndex++;
            }
        }

        // lifespan
        this.lifespan -= this.decayRate;
        if (this.lifespan < 0 || this.size < 0.1) {
            this.die();
        }

    }

    draw() {
        window.ctx.fillStyle = this.palette[this.palIndex];
        window.ctx.beginPath();
        window.ctx.arc(this.x + window.offset.x, this.y + window.offset.y, this.size, 0, Math.PI * 2);
        window.ctx.fill();
    }

}