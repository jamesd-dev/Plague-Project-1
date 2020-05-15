class Win extends State {

    constructor() {
        super();
    }

    changeState() {
        console.log('change state');
        window.activeGameState = new Game();
    }

    update() {
        super.update();
        if(this.panels.length <= 0) {

            this.changeState();
            
        }
    }

    draw() {
        super.draw();
        if(this.visibleText) {
            super.drawCenteredText('Click To Restart', window.palette.active.bright);
            this.drawScore(window.palette.active.bright);
            this.drawWin(window.palette.active.bright);
        }
    }

    drawScore(color) {
        ctx.font = "10rem Poppins";
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Score: ${window.score}`, (window.canvas.width/2), (window.canvas.height/1.3));
    }

    drawWin(color) {
        ctx.font = "10rem Poppins";
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`WINNER!!!!!`, (window.canvas.width/2), (window.canvas.height/4));
    }

    clickEvent() {
        super.clickEvent();
    }

}