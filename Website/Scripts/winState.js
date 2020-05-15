class Win extends State {

    constructor() {
        super();
    }

    changeState() {
        console.log('change state');
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
        }
    }

    clickEvent() {
        super.clickEvent();
    }

}