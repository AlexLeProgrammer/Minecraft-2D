//jeu de plateforme javascript
//Auteur : Alex Etienne
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// constantes
const BLOCKSIZE = 50;

//variables
var playerX = -300;
var playerY = 100;

//variables des inputs
var isRightPressed = false;
var isLeftPressed = false;
var isUpPressed = false;
var isDownPressed = false;
var isShiftPressed = false;
var isSpacePressed = false;
var isClicked = false;
var isRightClicked = false;

var moveSpeed = 5;

//variables des images
var playerSprite = new Image();
playerSprite.src = 'sprites/player.png';

var hotbarCellSprite = new Image();
hotbarCellSprite.src = 'sprites/hotbarFrame.png';
var hotbarSelectorSprite = new Image();
hotbarSelectorSprite.src = 'sprites/hotbarSelector.png';

// textures des blocs
var blockTextures = [new Image(), new Image()];
blockTextures[0].src = 'sprites/woodPlank.png';
blockTextures[1].src = 'sprites/obsidianBlock.jpg';

// hotbar
var hotbarContent = [0, 1, 1, 1, 0, 0, 0, 1, 0];

const GRAVITY_FORCE = 0.5; //le joueur saute de 4 block de haut avec un force de -15 et une gravite de 0.5
var playerYVelocity = 0;

//variables des blocs
var blockData = [];
var blockX = 0;
var blockY = 0;
var usedHotbarID = 0;

var gravity = true;

var cameraX = 0;
var cameraY = 0;

var mouseScreenPosX = 0;
var mouseScreenPosY = 0;
var mouseWorldPosX = 0;
var mouseWorldPosY = 0;


//permet de generer un nombre aleatoire
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
    console.log(mouseWorldPosX.toString() + " : " + mouseWorldPosY.toString());

    // calcul la position in-game du curseur
    mouseWorldPosX = mouseScreenPosX - (mouseWorldPosX < 0 ? BLOCKSIZE: 0) + cameraX;
    mouseWorldPosY = mouseScreenPosY + cameraY;

    //arrondi l'emplacement de la souris sur la grille
    var blockX = parseInt(mouseWorldPosX / BLOCKSIZE) * BLOCKSIZE;
    var blockY = parseInt(mouseWorldPosY / BLOCKSIZE) * BLOCKSIZE;
    
    // clear le canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    //dessine le sol
    context.fillStyle = "#1CDF1F";
    context.fillRect(0, canvas.height - cameraY - 40, canvas.width, canvas.height);

    //setup la camera
    cameraX += (playerX - canvas.width / 2 - cameraX + 30) / 30;
    cameraY += (playerY - canvas.height / 2 - cameraY) / 30;
    
    //desactive la gravite si le joueur est sur le sol
    if (playerY < 550) {
        gravity = true;
    } else {
        gravity = false;
    }

    //gere les blocs
    for (var i = 0; i < blockData.length; i++) {
        //dessine les blocs
        context.drawImage(blockTextures[blockData[i][2]], blockData[i][0] - cameraX, blockData[i][1] - cameraY, 50, 50);

        //empeche le joueur de tomber lorsqu'il est sur un bloc
        if (playerY >= blockData[i][1] - 130 && playerY <= blockData[i][1] - 90 && playerX >= blockData[i][0] - 60 && playerX <= blockData[i][0] + 50 && playerYVelocity >= 0) {
            gravity = false;
        }

        //empeche le joueur de traverser un bloc par le bas
        if (playerY >= blockData[i][1] - 130 && playerY <= blockData[i][1] + 50 && playerX >= blockData[i][0] - 60 && playerX <= blockData[i][0] + 50 && playerYVelocity < 0) {
            playerYVelocity = 0;
        }
        
        //detecte si il y a un bloc à coté du joueur
        if (isRightPressed || isLeftPressed) {
            if (playerY >= blockData[i][1] - 110 && playerY <= blockData[i][1] + 50 && playerX >= blockData[i][0] - 60 && playerX <= blockData[i][0] + 50) {
                if ((playerX + 60 < blockData[i][0] + 25)) {
                    playerX -= moveSpeed;
                }
                if ((playerX > blockData[i][0] + 25)) {
                     playerX += moveSpeed; 
                }
            }    
        }
    }

    //applique la gravite sur la velocite du joueur
    if (gravity === true) {
        playerYVelocity += GRAVITY_FORCE;
    } else {
        playerYVelocity = 0;
    }
    
    //creer le joueur
    context.drawImage(playerSprite, playerX - cameraX, playerY - cameraY);
        
    //affiche l'emplacement ou le joueur va placer un bloc
    context.strokeSytle = "black";
    context.lineWidth = 3;
    context.strokeRect(blockX - cameraX, blockY - cameraY, 50, 50);

    // dessine la hotbar
    var hotbarCellSize = 50;
    var hotbarHeight = 20;
    var itemsMargin = 10;
    var hotbarStartX = canvas.width / 2 - hotbarCellSize * 9 / 2;
    for (var cellIndex = 0; cellIndex < 9; cellIndex ++) {
        context.drawImage(hotbarCellSprite, hotbarStartX + cellIndex * hotbarCellSize,
        canvas.height - hotbarCellSize - hotbarHeight, hotbarCellSize, hotbarCellSize);

        context.drawImage(blockTextures[hotbarContent[cellIndex]], hotbarStartX + cellIndex * hotbarCellSize + itemsMargin,
        canvas.height - hotbarCellSize - hotbarHeight + itemsMargin, hotbarCellSize - 2 * itemsMargin, hotbarCellSize - 2 * itemsMargin);
    }
    context.drawImage(hotbarSelectorSprite, hotbarStartX + usedHotbarID * hotbarCellSize,
    canvas.height - hotbarCellSize - hotbarHeight, hotbarCellSize, hotbarCellSize);

    //si on clicke pose un bloc avec le bon type de bloc
    if (isClicked) {
        var newBlock = [blockX, blockY, hotbarContent[usedHotbarID]];
        blockData.push(newBlock);
    }

    //detecte si la souris est au dessus d'un bloc et le suprimme si on appuie sur shift
    for (var i = 0; i < blockData.length; i++) {
        if (blockX == blockData[i][0] && blockY == blockData[i][1] && isShiftPressed) {
            blockData.splice(i, 1);
        }
    }
    
    //detecte dans quelle direction le joueur veut se deplacer
    if (isRightPressed) {
        playerX += moveSpeed;
    }
    if  (isLeftPressed) {
        playerX -= moveSpeed;
    }
    if ((playerY > 550 || gravity === false) && isSpacePressed) {
        playerYVelocity = -15;
    }

    //fait tomber ou sauter le joueur
    playerY += playerYVelocity;

    isClicked = false;
    isRightClicked = false;
    isShiftPressed = false;
    isOnBlock = false;
    requestAnimationFrame(loop);
}

//recupere la position de la souris
canvas.addEventListener("mousemove", (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mouseScreenPosX = e.clientX;
    mouseScreenPosY = e.clientY;
});
//molette
canvas.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        usedHotbarID --;
    }
    if (e.deltaY > 0) {
        usedHotbarID ++;
    }
    if (usedHotbarID < 0) { usedHotbarID = 8; }
    if (usedHotbarID > 8) { usedHotbarID = 0; }
});

//1 = 49, 9 = 57
document.addEventListener('mousedown', function(e) {
    //detecte si on clique
    if (e.which === 1) {
        isClicked = true;
    }
    //detecte si on clique droit
    if (e.which === 3) {
        isRightClicked = true;
    }
});
document.addEventListener('keydown', function(e) {
    if (e.which === 39) {
        isRightPressed = true;
    }
    //detecte si on appuie sur la touche "D"
    if (e.which === 68) {
        isRightPressed = true;
    }
    //detecte si on appuie sur la touche "gauche"
    if (e.which === 37) {
        isLeftPressed = true;
    }
    //detecte si on appuie sur la touche "A"
    if (e.which === 65) {
        isLeftPressed = true;
    }
    //detecte si on appuie sur la touche "shift"
    if (e.which === 16) {
        isShiftPressed = true;
    }
    //detecte si on appuie sur la touche "espace"
    if (e.which === 32) {
        isSpacePressed = true;
    }
});
document.addEventListener('keyup', function(e) {
    //detecte si on relache la touche "droite"
    if (e.which === 39) {
        isRightPressed = false;
    }
    //detecte si on relache la touche "D"
    if (e.which === 68) {
        isRightPressed = false;
    }
    //detecte si on relache la touche "gauche"
    if (e.which === 37) {
        isLeftPressed = false;
    }
    //detecte si on relache la touche "A"
    if (e.which === 65) {
        isLeftPressed = false;
    }
    //detecte si on relache la touche "espace"
    if (e.which === 32) {
        isSpacePressed = false;
    }
});

requestAnimationFrame(loop);