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
    window.activeGameState = new Win();

    // There are too many things going on that require a click so i'm installing some logic to check what state the game is in.
    window.addEventListener('click', () => {
        // each state object can just handle it's own click logic
        activeGameState.clickEvent();
    });

}

// Will reset all global conatiners for game items. like clear the particle list and delete the player object.
// Will not reset score.
function resetGame() {

}

// resets the entire canvas.
// I could have cleared it but I wanted bg color control inside the code for quick changes.
function clearCanvas() {
    window.ctx.fillStyle = window.palette.active.background;
    window.ctx.fillRect(0, 0, canvas.width, canvas.height);
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