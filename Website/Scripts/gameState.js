class Game {

    constructor() {
        resetGame();
        window.player = new Player(window.canvas.width/2, window.canvas.height/2);
        this.spawner = new Spawner();
    }

    changeState() {
        console.log('change state');
    }

    update() {
        window.offset.apply();
        if(this.spawner.waveComplete && Object.values(window.entities).length <= 1) {
            if(this.spawner.isLastWave()) {
                // win
                window.activeGameState = new Win();
            } else {
                this.spawner.playNextWave();
            }
        }
        this.spawner.update();
        Object.values(window.lasers).forEach(laser => {
            laser.update();
            laser.draw();
        });
        window.player.update();
        window.player.draw();
        Object.values(window.entities).forEach(entity => {
            entity.update();
            entity.draw();
        });
        Object.values(window.particles).forEach(particle => {
            particle.update();
            particle.draw();
        });
    }

    clickEvent() {
    }

    mouseUpEvent() {
        window.player.mouseUpEvent();
    }

    mouseDownEvent() {
        window.player.mouseDownEvent();
    }

}