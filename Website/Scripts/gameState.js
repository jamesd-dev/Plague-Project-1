class Game {

    constructor() {
        new Player(window.canvas.width/2, window.canvas.height/2);
        new Enemy(100, 100);
        for(let i = 0; i < 100; i++) {
            new Enemy(Math.random() * window.canvas.width, Math.random() * window.canvas.height, Math.random() * 10);
        }
    }

    changeState() {
        console.log('change state');
    }

    update() {
        Object.values(window.lasers).forEach(laser => {
            laser.update();
            laser.draw();
        });
        Object.values(window.entities).forEach(entity => {
            entity.update();
            entity.draw();
        });
    }

    clickEvent() {
    }

    mouseUpEvent() {
        Object.values(window.entities).forEach(entity => {
            entity.mouseUpEvent();
        });
    }

    mouseDownEvent() {
        Object.values(window.entities).forEach(entity => {
            entity.mouseDownEvent();
        });
    }

}