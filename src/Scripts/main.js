// This script was supposed to be wrapped by a game manager class, but the big functions like
// the game loop didn't play well with it, so it's all exposed in a script, but functionally the same.

// init sets up the most important global variables
function init() {
    // Setting up the basic global canvas
    window.canvas = document.getElementById('main-canvas');
    window.ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Appearence global variables
    window.palette = {};
    // useful palettes stored for convinience
    window.palette.autumn = {
        kobe: '#7D220E',
        brownSugar: '#B56235',
        darkSienna: '#250902',
        richBlack: '#050200',
        lavanderBlush: '#EADEE3'
    };
    window.palette.explosion = {
        greenYellow: '#FEF2AA',
        safetyOrange: '#FF7B12',
        kobe: '#7D220E',
        vanDykeBrown: '#6B3E26',
        smokyBlack: '#1F0B01'
    };

    // The palette used throughout the program for easy changes
    window.palette.active = {
        background: window.palette.autumn.brownSugar,
        primary: window.palette.autumn.darkSienna,
        secondary: window.palette.autumn.richBlack,
        highlight: window.palette.autumn.kobe,
        bright: window.palette.autumn.lavanderBlush
    };

    // initialising the screen. One global variable holds a function to loop the current screen.
    // The function is switched out for different screen states.
    // Each state must have it's own update, draw and swich state logic.
    window.activeGameState = new Start();

    // There are too many things going on that require a click so i'm installing some logic to check what state the game is in.
    window.addEventListener('click', () => {
        // each state object can just handle it's own click logic
        activeGameState.clickEvent();
    });

    window.addEventListener('mouseup', () => {
        // same deal as click
        activeGameState.mouseUpEvent();
    });

    window.addEventListener('mousedown', () => {
        // same deal as click
        activeGameState.mouseDownEvent();
    });

    // the score for the game. Obvs.
    window.score = 0;
    window.scoreMultiplier = 1;
    window.highscore = 0;

    // used to calculate time between kills for the score multiplier.
    window.lastKillTime = 0;
    // time until multipier resets
    window.multExpireTime = 1000;

    // the width of the game border (player cannot pass it)
    window.borderWidth = 20;

    // offset object used for creating camera tremble effect.
    window.offset = {
        x : 0,
        y : 0,
        shakePath : [],
        shake : (len) => {
            for(let i = 0; i < len - window.offset.shakePath.length; i++) {
                window.offset.shakePath.push( (Math.random() * 3) - 1);
            }
        },
        apply : () => {
            if(window.offset.shakePath.length >= 2) {
                window.offset.x = window.offset.shakePath.pop();
                window.offset.y = window.offset.shakePath.pop();
            } else {
                window.offset.x = 0;
                window.offset.y = 0;
            }
        }
    };

    // mouse object for tracking the mouse position
    window.mouse = {
        x: 0,
        y: 0
    };

    // gets precise position of mouse on screen, regardless of canvas position.
    window.addEventListener('mousemove', (e) => {
        let rect = window.canvas.getBoundingClientRect();
        window.mouse.x = e.x + rect.left;
        window.mouse.y = e.y + rect.top;
    });

}

// Will reset all global conatiners for game items. like clear the particle list and delete the player object.
// Will not reset score.
function resetGame() {
    window.entities = {};
    window.particles = {};
    window.lasers = {};
    window.player = undefined;
    if(window.offset) {
        window.offset.x = 0;
        window.offset.y = 0;
        window.offset.shakePath = [];
    }
}

// resets the entire canvas.
// I could have cleared it but I wanted bg color control inside the code for quick changes.
function clearCanvas() {
    window.ctx.fillStyle = window.palette.active.secondary;
    window.ctx.fillRect(0, 0, canvas.width, canvas.height);
    window.ctx.fillStyle = window.palette.active.background;
    window.ctx.fillRect(window.borderWidth, window.borderWidth, canvas.width - (window.borderWidth * 2), canvas.height - (window.borderWidth * 2));
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    clearCanvas();
    window.activeGameState.update();
}

window.addEventListener('load', () => {
    init();
    gameLoop();
});