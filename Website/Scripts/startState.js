class Start extends State {

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
            super.drawCenteredText('Click To Play', window.palette.active.bright);
        }
    }

    clickEvent() {
        super.clickEvent();
    }

}