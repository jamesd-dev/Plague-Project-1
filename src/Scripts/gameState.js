// game screen
class Game {

    constructor() {
        resetGame();
        window.player = new Player(window.canvas.width/2, window.canvas.height/2);
        this.spawner = new Spawner();

        // useful for other things to determine what the game state is
        this.state = 'game';
    }

    update() {
        // apply the camera shake effect. If any.
        window.offset.apply();

        // check if current wave is over (no more enemies being released and no enemy left alive)
        if(this.spawner.waveComplete && Object.values(window.entities).length <= 0) {
            // check if there are no more waves left
            if(this.spawner.isLastWave()) {
                // win
                // pause before winning to let the player enjoy the moment
                setTimeout(() => {
                    window.activeGameState = new Win();
                }, 2000);
            } else {
                // if it's not the last wave the next wave is called here
                this.spawner.playNextWave();
            }
        }

        // updates and draws all lasers.
        Object.values(window.lasers).forEach(laser => {
            laser.update();
            laser.draw();
        });

        // updates and draws player.
        if(window.player) {
            window.player.update();
            window.player.draw();
        }

        // updates and draws all enemies.
        Object.values(window.entities).forEach(entity => {
            entity.update();
            entity.draw();
        });

        // updates and draws all particles in particle effects (explosions).
        Object.values(window.particles).forEach(particle => {
            particle.update();
            particle.draw();
        });

        // draws the current score
        this.drawScore(window.palette.active.bright);

        // draws the current wave index
        this.drawWaveTitle();

        // checks to see if enough time has elapsed between kills to reset
        // the score multiplier
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