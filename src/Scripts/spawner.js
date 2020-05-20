// A strutures used to easily make waves of enemies.
// The wave object generates a random range of enemies given parameters such as
// health and the number of enemies.
// The spawner takes that list of generated enemies and creates them over a period of time.
// The spawner also manages waves, calling the next one and signalling when there are no more.
class Spawner {
    constructor() {
        this.waves = [
            new Wave(1000, 100, 20, 9),
            new Wave(2000, 100, 30, 10),
            // new Wave(10, 1, 200),
            // new Wave(200, 100, 50),
        ];

        this.currentWave = -1;
        this.waveComplete = false;
        this.spawnInterval = undefined;
        this.playNextWave();
    }

    isLastWave() {
        if(this.currentWave < this.waves.length - 1) {
            return false;
        } else {
            return true;
        }
    }

    playNextWave() {
        // ensures that the program know that a new wave is on the way and not simply over.
        this.waveComplete = false;
        // resets list of enemies, to make sure no ghosts remain in the system
        window.entities = {};
        // pause between waves to allow the player a breather
        setTimeout(() => {
            // checks that there is a wave to go to
            if(!this.isLastWave()) {
                this.currentWave++;
                // creates an enemy from the list every x milliseconds
                // stops the player being flooded and really helps performace
                this.spawnInterval = setInterval(() => {
                    // checks if there are any more enemies in the wave to create
                    if(this.waves[this.currentWave].enemies.length <= 1) {
                        // if not, kills loops and signals that the wave is complete
                        this.waveComplete = true;
                        clearInterval(this.spawnInterval);
                    }
                    let pos = this.getRandomBorderPosition();
                    let enemy = this.waves[this.currentWave].enemies.pop();
                    new Enemy(pos.x, pos.y, enemy.health, enemy.speed);

                }, 1/ (this.waves[this.currentWave].enemies.length / 10000)); // loop time is faster the more enemies there are
            }
        }, 3000);
    }

    getRandomBorderPosition() {

        let side = Math.ceil(Math.random() * 4);

        switch (side) {
            case 1 :
                return {x:Math.random() * window.canvas.width, y: - window.borderWidth};
            case 2 :
                return {x:window.canvas.width + window.borderWidth, y: Math.random() * window.canvas.height};
            case 3 :
                return {x:Math.random() * window.canvas.width, y: window.canvas.height - window.borderWidth};
            case 4 :
                return {x: - window.borderWidth, y: Math.random() * window.canvas.height};
        }

    }

}

class Wave {

    // include a speed variable for the wave enemies. The game is a lot more panic inducing with fast enemies
    // and weaving between them is super fun.
    constructor(maxHealth, minHealth, number, speed) {
        this.maxHealth = maxHealth;
        this.minHealth = minHealth;

        // not really enemies, just their health. but that's the only variable stat, so the spawner can do the rest.
        this.enemies = [];

        for(let i = 0; i < number; i++) {
            this.enemies.push({health: this.getRandomHealth(), speed: speed});
        }

    }

    // uses a trick to make the probability graph tilt towards the lower numbers.
    // you only want a few harder enemies in a wave.
    getRandomHealth() {
        // should make low numbers more likely
        // random between 0 and 1;
        let r1 = Math.random();
        // random between 0 and r1
        
        for(let i = 0; i < 3; i++) {
            r1 = Math.random() * r1;
        } 

        let health = (r1 * (this.maxHealth - this.minHealth)) + this.minHealth;

        return health;

    }

}