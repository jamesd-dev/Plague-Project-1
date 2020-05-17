class Spawner {
    constructor() {
        this.waves = [
            new Wave(50, 10, 100, 100)
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
        setTimeout(() => {
            if(!this.isLastWave()) {
                this.currentWave++;
                this.waveComplete = false;
                this.spawnInterval = setInterval(() => {
                    if(this.waves[this.currentWave].enemies.length <= 1) {
                        this.waveComplete = true;
                        clearInterval(this.spawnInterval);
                    }
                    let pos = this.getRandomBorderPosition();
                    new Enemy(pos.x, pos.y, this.waves[this.currentWave].enemies.pop());
                }, 200);
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

    constructor(maxHealth, minHealth, number, maxEnemies) {
        this.maxHealth = maxHealth;
        this.minHealth = minHealth;
        this.maxEnemies = maxEnemies;

        // not really enemies, just their health. but that's the only variable stat, so the spawner can do the rest.
        this.enemies = [];

        for(let i = 0; i < number; i++) {
            this.enemies.push(this.getRandomHealth());
        }

    }

    getRandomHealth() {
        // should make low numbers more likely
        // random between 0 and 1;
        let r1 = Math.random();
        // random between 0 and r1
        let r2 = Math.random() * r1;

        let health = (r2 * (this.maxHealth - this.minHealth)) + this.minHealth;

        return health;

    }

}