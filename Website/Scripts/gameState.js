class Game {

    constructor() {
        new Player(window.canvas.width/2, window.canvas.height/2);
        new Enemy(100, 100);
    }

    changeState() {
        console.log('change state');
    }

    update() {
        Object.values(window.entities).forEach(entity => {
            entity.update();
            entity.draw();
        });
    }

    clickEvent() {
        
    }

}