// only really need one of each of these and they all do state stuff, so they're all
// on this page.

class Panel {
    constructor(x, y, width, height, movesUp, speed, delay, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.delay = delay;
        this.color = color;

        // if the panel animates moving up or down
        this.movesUp = movesUp;
        // trigger for the panel to start moving
        this.move = false;
    }

    update() {
        if(this.move) {
            if(this.delay > 0) {
                this.delay -= 0.1;
            } else {
                if(this.movesUp) {
                    this.height = (this.height < this.speed) ? 0 : this.height -= this.speed;
                } else {
                    this.height = (this.height < this.speed) ? 0 : this.height -= this.speed;
                    this.y = (this.y > window.canvas.height - this.speed) ? window.canvas.height : this.y += this.speed;
                }
            }
        }
    }

    draw() {
        if(this.height > 0) {
            window.ctx.fillStyle = this.color;
            window.ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

}

class State {

    constructor() {
        resetGame();
        this.centreGap = 100;
        this.panelGap = 30;
        this.panels = [
            new Panel(0, (window.canvas.height / 2) + (this.centreGap / 2), window.canvas.width, (window.canvas.height / 2) - (this.centreGap / 2), false, 4, 1, window.palette.active.secondary),
            new Panel(0, 0, window.canvas.width, (window.canvas.height / 2) - (this.centreGap / 2), true, 4, 1, window.palette.active.secondary),
            // outer panels
            new Panel(0, (window.canvas.height / 2) + (this.centreGap / 2) + this.panelGap, window.canvas.width, (window.canvas.height / 2) - (this.centreGap / 2) - this.panelGap, false, 5, 0, window.palette.active.primary),
            new Panel(0, 0, window.canvas.width, (window.canvas.height / 2) - (this.centreGap / 2) - this.panelGap, true, 5, 0, window.palette.active.primary),
        ];
        this.visibleText = true;
        // For things to check what game state is active
        this.state = 'start';
        window.highscore = this.getHighscore();
        if(window.highscore < window.score) {
            this.saveHighscore();
        }
    }

    drawCenteredText(text, color) {
        ctx.font = "4rem Poppins";
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, (window.canvas.width/2), (window.canvas.height/2));
    }

    changeState() {
        // logic implemented in children
    }

    update() {
        this.panels.forEach(panel => { panel.update(); });
        this.panels = this.panels.filter((panel) => {return panel.height > 0;});
        // easier to include draw here as it always runs with update.
        this.draw();
    }

    draw() {
        this.panels.forEach(panel => { panel.draw(); });
        //if(this.visibleText) {
            // Have to redo for each child
            //this.drawText('Click To Play', window.palette.active.bright);
        //}
    }

    clickEvent() {
        this.visibleText = false;
        this.panels.map((panel) => {panel.move = true;});
    }

    mouseDownEvent() {}

    mouseUpEvent() {}

    saveHighscore() {
        window.localStorage.setItem('highscore', window.score);
    }

    getHighscore() {
        let hs = parseInt(window.localStorage.getItem('highscore'));
        if (hs) {
            return hs;
        } else {
            return 0;
        }
    }

}