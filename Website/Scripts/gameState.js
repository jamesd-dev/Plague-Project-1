class Game {

    constructor() {
        this.player = new Player(window.canvas.width/2, window.canvas.height/2);
    }

    changeState() {
        console.log('change state');
    }

    update() {
        this.player.update();

        this.draw();
    }

    draw() {
        this.player.draw();
    }

    clickEvent() {
        
    }

}