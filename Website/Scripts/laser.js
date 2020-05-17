// static list of laser objects to iterate through for the gameloop
window.lasers = {};
class Laser {

    constructor(startEntity, directionX, directionY) {
        // the object that created the laser
        this.entity = startEntity;

        // x and y for the point where the laser starts
        this.startX = startEntity.x;
        this.startY = startEntity.y;

        // the vector of the laser direction
        this.directionX = directionX;
        this.directionY = directionY;

        // width of the drawn laser
        this.laserWidth = 5;

        // get line equation (direction acts as second point when added to start)
        // y = mx + b
        // get m
        // get changes in x and y
        let dx = this.directionX; //((startX + directionX) - startX) === directionX
        let dy = this.directionY;
        this.m = dy / dx;

        // get b
        // y = mx + b
        // b = y - mx
        this.b = this.startY - (this.m * this.startX);

        // get end point
        let collision = this.calculateCollisions();
        // ensures that the collision just provides the distance. the direction must always be the same.
        // makes circle collisions far far easier to calculate.
        let targetMag = this.getDistance(this.startX, this.startY, collision.x, collision.y);
        this.endX = this.startX + (directionX * targetMag);
        this.endY = this.startY + (directionY * targetMag);

        this.damage = (1 / targetMag * 2000);

        // opacity and lifetime are the same. therefore it has a max value of 1..ish.
        this.lifetime = (1 / targetMag * 100);
        this.decayRate = 0.7;
        // makes sure that the laser gets one frame of being full opacity.
        this.lifetime /= this.decayRate;

        // damage entity hit
        if(collision.e) {
            collision.e.takeDamage(this.damage);
        }

        // because id is based on start and end points, any old lasers in the same position will be overwritten.
        // way more efficient
        this.id = `${Math.round(this.startX)}${Math.round(this.startY)}${Math.round(this.endX)}${Math.round(this.endY)}`;
        window.lasers[this.id] = this;

    }

    update() {

        this.lifetime *= this.decayRate;
        if(this.lifetime <= 0.01) {
            delete window.lasers[this.id];
        }
        
    }

    draw() {  
        window.ctx.beginPath();
        window.ctx.strokeStyle = `rgba(234, 222, 227, ${this.lifetime})`;
        window.ctx.lineWidth = this.laserWidth;
        window.ctx.moveTo(this.entity.x + window.offset.x, this.entity.y + window.offset.y);
        window.ctx.lineTo(this.endX  + window.offset.x, this.endY  + window.offset.y);
        window.ctx.stroke();
    }

    // finds everything that lies on the same line as the laser. Will always hit at least the border.
    calculateCollisions() {
        // list of x and y objects
        let collisions = [];
        
        collisions = this.calculateBorderCollisions();
        collisions = collisions.concat(this.calculateEntityCollisions());

        if(collisions.length > 0) {
            // sort by distance from start
            collisions.sort((a, b) => {
                return (this.getDistance(this.startX, this.startY, a.x, a.y) - this.getDistance(this.startX, this.startY, b.x, b.y));
            });

            // return closest collision
            return collisions[0];
        } else {
            // laser should always collide with something, so this is an error
            console.error('Laser collided with nothing');
            return null;
        }

    }

    calculateEntityCollisions() {

        let collisions = [];

        Object.values(window.entities).forEach(entity => {

            // define two points on the line. The emmiting entity and a point past the edge of the canvas.
            let p1 = {x:this.startX, y:this.startY};
            // I don't know why 100 at this point, it just seems to be large enough
            let p2 = {x:p1.x + (this.directionX * 100), y:p1.y + (this.directionY * 100)};

            let localP1 = {x: p1.x - entity.x, y: p1.y - entity.y};
            let localP2 = {x: p2.x - entity.x, y: p2.y - entity.y};

            let p2minusp1 = {x: localP2.x - localP1.x, y: localP2.y - localP1.y};

            let a = ((p2minusp1.x) * (p2minusp1.x)) + ((p2minusp1.y) * (p2minusp1.y));
            let b = 2 * ((p2minusp1.x * localP1.x) + (p2minusp1.y * localP1.y));
            let c = (localP1.x * localP1.x) + (localP1.y * localP1.y) - (entity.size * entity.size);

            // b^2 + 4ac to find intersection points of a circle
            let delta = (b * b) - (4 * a * c);

            if(
                entity != this.entity && // makes sure the laser doesn't collide with the entity emmiting it
                this.isSameDirection(this.startX, this.startY, entity.x, entity.y) &&
                // offset < entity.size &&
                // offset > -entity.size
                delta >= 0

            ) {
                collisions.push({x:entity.x, y:entity.y, e:entity});
            }

        });

        return collisions;

    }

    // returns true if the collision is in the same direction as the laser
    isSameDirection(startX, startY, targetX, targetY) {
        let colDirX = targetX - startX;
        let colDirY = targetY - startY;
        let colDirMag = Math.sqrt((colDirX * colDirX) + (colDirY * colDirY));
        colDirX /= colDirMag;
        colDirY /= colDirMag;
        let fuzzyX = colDirX - this.directionX;
        let fuzzyY= colDirY - this.directionY;
        if (
            Math.abs(fuzzyX) < 0.1 &&
            Math.abs(fuzzyY) < 0.1
        ) {return true;}
        return false;
    }

    calculateBorderCollisions() {
        let collisions = [];

        let hitX, hitY;
        let borderX, borderY;

        // right border
        borderX = window.canvas.width - window.borderWidth;
        hitY = this.calcY(borderX);
        // The last third of the comparison checks that the obstacle is in the same direction that the laser is moving.
        if(hitY < window.canvas.height && hitY > 0 && this.directionX >= 0) {collisions.push({x:borderX, y:hitY});}

        // left border
        borderX = window.borderWidth;
        hitY = this.calcY(borderX);
        if(hitY < window.canvas.height && hitY > 0 && this.directionX <= 0) {collisions.push({x:borderX, y:hitY});}

        // bottom border
        borderY = window.canvas.height - window.borderWidth;
        hitX = this.calcX(borderY);
        if(hitX < window.canvas.width && hitX > 0 && this.directionY >= 0) {collisions.push({x:hitX, y:borderY});}

        // top border
        borderY = window.borderWidth;
        hitX = this.calcX(borderY);
        if(hitX < window.canvas.width && hitX > 0 && this.directionY <= 0) {collisions.push({x:hitX, y:borderY});}

        return collisions;
    }

    getDistance(startX, startY, endX, endY) {
        let dx = endX - startX;
        let dy = endY - startY;
        let dist = Math.sqrt((dx * dx) + (dy * dy));
        return dist;
    }

    calcX(y) {
        return (y - this.b) / this.m;
    }

    calcY(x) {
        return (this.m * x) + this.b;
    }

}