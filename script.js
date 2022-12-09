//jeu de plateforme javascript
//Auteur : Alex Etienne
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

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
var isOnePressed = false;
var isTwoPressed = false;

var moveSpeed = 5;

//variables des images
var playerSprite = new Image();
playerSprite.src = 'sprites/player.png';

var PNJSprite = new Image();
PNJSprite.src = 'sprites/PNJ.png';

var propsSprite = new Image();
propsSprite.src = 'sprites/props.png';

var cloudSprite = new Image();
cloudSprite.src = 'sprites/cloud.png';

var woodenBlock = new Image();
woodenBlock.src = 'sprites/woodPlank.png';

var obsidianBlock = new Image();
obsidianBlock.src = 'sprites/obsidianBlock.jpg';

const GRAVITY_FORCE = 0.5; //le joueur saute de 4 block de haut avec un force de -15 et une gravite de 0.5
var playerYVelocity = 0;

//variable des plateformes
var plateform = [[0, 500], [300, 300], [-100, 100], [300, -100], [-200, -300], [300, -500], [-200, -700], [400, -900], [-200, -1100],
[200, -1300], [500, -1500], [0, -1700]];

//variables des blocs
var blockData = [];
var blockX = 0;
var blockY = 0;
var blockId = 0;

var gravity = true;


//sens de deplacement de la 8e plateforme
var plateformWay = true;

var cameraX = 0;
var cameraY = 0;

var mouseCanvasPoseX = 0;
var mouseCanvasPoseY = 0;


//permet de generer un nombre aleatoire
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
    //arrondi l'emplacement de la souris
    if ((mouseCanvasPoseY + cameraY) % 50 >= 25) {
        blockY = mouseCanvasPoseY + cameraY + 50;
    } else {
        blockY = mouseCanvasPoseY + cameraY;
    }
    if ((mouseCanvasPoseX + cameraX) % 50 >= 25) {
        blockX = mouseCanvasPoseX + cameraX + 50;
    } else {
        blockX = mouseCanvasPoseX + cameraX;
    }

    //change de blockId si le joueur veut changer de bloc
    if (isOnePressed) {
        blockId = 0;
    } else if (isTwoPressed) {
        blockId = 1;
    }
    
    // clear le canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    //dessine les decors
    context.drawImage(propsSprite, -500 - cameraX,  37 - cameraY);

    //dessine le sol
    context.fillStyle = "#656D4A";
    context.fillRect(0, canvas.height - cameraY, canvas.width, canvas.height);
    
    //dessine les nuages
    context.drawImage(cloudSprite, -100 - cameraX,  -2000 - cameraY);

    //setup la camera
    cameraX += (playerX - canvas.width / 2 - cameraX + 30) / 30;
    cameraY += (playerY - canvas.height / 2 - cameraY) / 30;
    
    //desactive la gravite si le joueur est sur le sol
    if (playerY < 550) {
        gravity = true;
    } else {
        gravity = false;
    }

    //gere les plateformes
    context.fillStyle = "#A68A64";
    for (var i = 0; i < 12; i++) {
        //dessine les plateformes
        context.fillRect(plateform[i][0] - cameraX, plateform[i][1] - cameraY, 200, 100);
        
        //empeche le joueur de tomber lorsqu'il est sur une plateforme
        if (playerY >= plateform[i][1] - 130 && playerY <= plateform[i][1] - 90 && playerX >= plateform[i][0] - 60 && playerX <= plateform[i][0] + 200 && playerYVelocity >= 0) {
            gravity = false;
            if (i === 7) {
                if (plateformWay === true) {
                    playerX += 3;
                } else {
                    playerX -= 3;
                }
            }
        }

        //empeche le joueur de traverser une plateforme par le bas
        if (playerY >= plateform[i][1] - 130 && playerY <= plateform[i][1] + 100 && playerX >= plateform[i][0] - 60 && playerX <= plateform[i][0] + 200 && playerYVelocity < 0) {
            playerYVelocity = 0;
        }
        
        //detecte si il y a une plateforme à coté du joueur
        if (isRightPressed || isLeftPressed) {
            if (playerY >= plateform[i][1] - 120 && playerY <= plateform[i][1] + 100 && playerX >= plateform[i][0] - 60 && playerX <= plateform[i][0] + 200) {
                if (playerX + 60 < plateform[i][0] + 100) {
                    playerX -= moveSpeed; 
                }
                if (playerX > plateform[i][0] + 100) {
                     playerX += moveSpeed; 
                }
            }    
        }
    }

    //gere les blocs
    for (var i = 0; i < blockData.length; i++) {
        //dessine les blocs avec le bon type de bloc
        if (blockData[i][2] === 0) {
            context.drawImage(woodenBlock, blockData[i][0] - cameraX, blockData[i][1] - cameraY, 50, 50);
        } else {
            context.drawImage(obsidianBlock, blockData[i][0] - cameraX, blockData[i][1] - cameraY, 50, 50);
        }

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

    //deplace la 8e plateforme
    if (plateformWay && plateform[7][0] >= 500)  {
        plateformWay = false;
    } else if (plateformWay == false && plateform[7][0] <= 150)  {
        plateformWay = true;
    } 
    if (plateform[7][0] < 500 && plateformWay) {
        plateform[7][0] += 3;
    } else if (plateform[7][0] > 150 && plateformWay == false) {
        plateform[7][0] -= 3;
    }

    //applique la gravite sur la velocite du joueur
    if (gravity === true) {
        playerYVelocity += GRAVITY_FORCE;
    } else {
        playerYVelocity = 0;
    }

    //creer le PNJ
    context.drawImage(PNJSprite, -1000 - cameraX, 530 - cameraY);
    
    //creer le joueur
    context.drawImage(playerSprite, playerX - cameraX, playerY - cameraY);
        
    //affiche l'emplacement ou le joueur va placer un bloc avec le bon type de bloc
    if (blockId === 0) {
        context.drawImage(woodenBlock, mouseCanvasPoseX, mouseCanvasPoseY, 50, 50);
    } else {
        context.drawImage(obsidianBlock, mouseCanvasPoseX, mouseCanvasPoseY, 50, 50);
    }

    //si on clicke pose un bloc avec le bon type de bloc
    if (isClicked) {
        var newBlock = [parseInt(blockX  / 50) * 50 + cameraX / 100,
        parseInt(blockY  / 50) * 50 + cameraY / 100, blockId];
        blockData.push(newBlock);
    }

    //detecte si la souris est au dessus d'un bloc et le suprimme si on appuie sur shift
    for (var i = 0; i < blockData.length; i++) {
        if (parseInt(blockX  / 50) * 50 + cameraX / 100 >= blockData[i][0] - 50 &&
        parseInt(blockX  / 50) * 50 + cameraX / 100 <= blockData[i][0] + 50 &&
        parseInt(blockY  / 50) * 50 + cameraY / 100 >= blockData[i][1] - 50 &&
        parseInt(blockY  / 50) * 50 + cameraY / 100 <= blockData[i][1] + 50 && isShiftPressed) {
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
    mouseCanvasPoseX = e.clientX;
    mouseCanvasPoseY = e.clientY;
    if (mouseCanvasPoseY + cameraY + 30 >= canvas.height - 25) {
        mouseCanvasPoseY = canvas.height - cameraY - 55;
    }
    console.log(window.innerWidth.toString() + " : " + window.innerHeight.toString());
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
    console.log(e.which);
    //detecte si on appuie sur la touche "droite"
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
    //detecte si on appuie sur la touche "1"
    if (e.which === 49) {
        isOnePressed = true;
    }
    //detecte si on appuie sur la touche "2"
    if (e.which === 50) {
        isTwoPressed = true;
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
    //detecte si on relache la touche "1"
    if (e.which === 49) {
        isOnePressed = false;
    }
    //detecte si on relache la touche "2"
    if (e.which === 50) {
        isTwoPressed = false;
    }
    //detecte si on relache la touche "espace"
    if (e.which === 32) {
        isSpacePressed = false;
    }
});

requestAnimationFrame(loop);