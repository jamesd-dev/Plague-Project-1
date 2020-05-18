class Game {

    constructor() {
        resetGame();
        window.player = new Player(window.canvas.width/2, window.canvas.height/2);
        this.spawner = new Spawner();
        this.state = 'game';
    }

    changeState() {
        console.log('change state');
    }

    update() {
        window.offset.apply();
        if(this.spawner.waveComplete && Object.values(window.entities).length <= 0) {
            if(this.spawner.isLastWave()) {
                // win
                setTimeout(() => {
                    window.activeGameState = new Win();
                }, 2000);
            } else {
                this.spawner.playNextWave();
            }
        }
        Object.values(window.lasers).forEach(laser => {
            laser.update();
            laser.draw();
        });
        if(window.player) {
            window.player.update();
            window.player.draw();
        }
        Object.values(window.entities).forEach(entity => {
            entity.update();
            entity.draw();
        });
        Object.values(window.particles).forEach(particle => {
            particle.update();
            particle.draw();
        });
        this.drawScore(window.palette.active.bright);
        this.drawWaveTitle();
        this.checkKillTimeExpire();
    }

    clickEvent() {
    }

    mouseUpEvent() {
        window.player.mouseUpEvent();
    }

    mouseDownEvent() {
        window.player.mouseDownEvent();
    }

    drawWaveTitle() {
        let waveText = '';
        if(this.spawner.currentWave > -1) {
            waveText = `Wave ${this.spawner.currentWave}`;
        }
        ctx.font = "900 20px Poppins";
        ctx.fillStyle = window.palette.active.primary;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(waveText, (window.canvas.width/2), (window.borderWidth + 90));
    }

    drawScore() {
        let scoreText = `${window.score}`;
        if(window.scoreMultiplier > 1) {
            scoreText = `${window.score} x${window.scoreMultiplier}`;
        }
        ctx.font = "70px Poppins";
        ctx.fillStyle = window.palette.active.primary;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(scoreText, (window.canvas.width/2), (window.borderWidth + 50));
    }

    checkKillTimeExpire() {
        if(((new Date()).getTime() - window.lastKillTime) > window.multExpireTime) {
            window.scoreMultiplier = 1;
        }
    }

}