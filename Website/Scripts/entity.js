// used to hold and interate through all the entities in game.
// kept as an object as it's faster to find a specific item in a long list.
// Has to be established here because of the script order.
window.entities = {};

class Entity {

    constructor(x, y, speed, size, primColour, secColour, health) {
        this.x = x;
        this.y = y;

        //physics
        this.speed = speed;

        // appearence
        this.size = size;
        this.primColour = primColour;
        this.secColour = secColour;

        // stats
        // used to locate the object in the entities list.
        // Unique unless something else spawns in exactly the same place.
        // But then I can lose that one anyway.
        this.id = (`${Math.round(this.x)}${Math.round(this.y)}`);
        this.maxHealth = health;
        this.health = this.maxHealth;
    }

    // moves entity towards a target
    // also checks for collisions
    seek(targetX, targetY, isColliding, entity) {

        // removes some of the jitter when the target is reached.
        targetX -= 2;
        targetY -= 2;

         // get vector to target
         let dx = targetX - this.x;
         let dy = targetY - this.y;
         let mag = Math.sqrt((dx * dx) + (dy * dy));
 
         
         //normalise vector
         dx /= mag;
         dy /= mag;
 
         // using a fraction power makes it so the entity goes faster the further the target is from it.
         // makes it feel more responsive.
         // low exponent to make the effect more subtle.
         dx = Math.pow(mag, this.speed) * dx;
         dy = Math.pow(mag, this.speed) * dy;
 
 
         // check if entity is colliding with anything.
         // anything but the player will just have a false returning function.
         if(!isColliding(this.x + dx, this.y + dy, entity)) {
             // apply change
             this.x += dx;
             this.y += dy;
         }

    }

    takeDamage() {
        
    }

    clickEvent() {

    }

    mouseUpEvent() {
        
    }

    mouseDownEvent() {
        
    }

    explode() {
        for (let i = 0; i < 50; i++) {
            new ExplosionParticle(this.x, this.y);
        }
        window.offset.shake(50);
    }

}