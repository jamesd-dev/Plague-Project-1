# Plague-Project-1

DESCRIPTION
A simple shooter game. the player is a small mobile turret that shoots lasers at little black blobs.

MVP
-Moveable player avatar
-Enemies that spawn in waves and seek the player
-Enemies able to attack and kill player
-Working laser that can kill enemies
-Boundaries to game that collide with player
-Splash screen for the start and end of the game
-Able to restart game

BACKLOG

DATA STRUCTURE
Animated class
  - Update()
  - Draw()
Particle class extends Animated
Laser class extends Animated
  - CheckCollisions()
  - Fire()
Entity class extends Animated
  - RecieveDamage()
  - Die()
  - Seek()
  - Attack()
Player class extends Entity
  - CheckCollisions()
Enemy class extends Entity
Spawner class
  - SpawnWave()
GameManager class
  - StartGame()
  - Restart()
  - GameLoop()
  - Init()
  
STATES
  - SPLASH SCREEN
    - just a simple screen with panels framing a start button that slide back when clicked
  - Game Screen
    - Fullscreen canvas with border walls and the player spawned in the centre. Otherwise plain.
  - GameOver Screen
    - gamescreen freezes when the player dies and is faded. Gameover text and a restart button is displayed on top.
  - Win Screen
    - Just a black screen with fireworks and a win text. Also includes a restart button.
    
TASKS
  - create screens
  - create game manager
  - create player
  - player movement
  - create boundaries
  - create enemies
  - create laser
  - enemy movement
  - enable player and enemies to attack and die
  - special effects
  - polish

TRELLO LINK
  https://trello.com/b/G7pWGEBk/plague-project-1

DEPLOYMENT LINK
https://polymurph13.github.io/Plague-Project-1/
