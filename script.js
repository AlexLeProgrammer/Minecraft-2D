//Copie de Minecraft en 2D
//Auteur : Alex Etienne & Arsène Brosy
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// constantes
const BLOCKSIZE = 50;
const GRAVITY_FORCE = 0.5; //le joueur saute de 4 block de haut avec un force de -15 et une gravite de 0.5

//variables
var playerX = 0;
var playerY = 550;

//variables des inputs
var isRightPressed = false;
var isLeftPressed = false;
var isClicked = false;
var isRightClicked = false;

//mouvement du joueur
var playerWidth = 42.5;
var playerHeight = 85;
var moveSpeed = 5;
var playerYVelocity = 0;
var renderDistance = 2;

//variables des images
var playerSprite = new Image();
playerSprite.src = 'sprites/player.png';

var hotbarCellSprite = new Image();
hotbarCellSprite.src = 'sprites/hotbarFrame.png';
var hotbarSelectorSprite = new Image();
hotbarSelectorSprite.src = 'sprites/hotbarSelector.png';

// textures des blocs
var blockTextures = [new Image(), new Image(), new Image()];
blockTextures[0].src = 'sprites/woodPlank.png';
blockTextures[1].src = 'sprites/obsidianBlock.jpg';
blockTextures[2].src = 'sprites/flintandsteel.png';

// hotbar
var hotbarContent = [0, 1, 1, 1, 0, 2, 0, 1, 0];

//variables des blocs
var modifiedChunks = [];
var blockX = 0;
var blockY = 0;
var usedHotbarID = 0;

var canPlaceAir = true;

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

function isABloc(x, y) {
    var chunk = parseInt(parseInt(x / BLOCKSIZE) / 16) - (x < 0 ? 1 : 0);
    var chunkBlocks = [];
    if (modifiedChunks.length > 0) {
        for (var i = 0; i < modifiedChunks.length; i++) {
            if (parseInt(parseInt(modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (modifiedChunks[i][0][0] < 0 ? 1 : 0) == chunk) {
                chunkBlocks = modifiedChunks[i];
            }
        }
    }
    var result = false;
    for (var i = 0; i < chunkBlocks.length; i++) {
        if (chunkBlocks[i][0] <= x && chunkBlocks[i][0] + BLOCKSIZE >= x && chunkBlocks[i][1] <= y && chunkBlocks[i][1] + BLOCKSIZE >= y) {
            result = true;
        }
    }
    return result;
}

function groundDistance(x, y, width) {
    // trouve le bon chunk
    var chunk = parseInt(parseInt(x / BLOCKSIZE) / 16) - (x < 0 ? 1 : 0);
    var chunkBlocks = [];
    if (modifiedChunks.length > 0) {
        for (var i = 0; i < modifiedChunks.length; i++) {
            if (parseInt(parseInt(modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (modifiedChunks[i][0][0] < 0 ? 1 : 0) == chunk) {
                chunkBlocks = modifiedChunks[i];
            }
        }
    }
    // setup variables
    var result = 550 - y;
    var alreadyUsed = [];
    for(var i = 0; i < chunkBlocks.length; i++) {
        alreadyUsed.push(false);
    }
    //verifie chaque block du plus bas au plus haut
    for(var i = 0; i < chunkBlocks.length; i++) {
        var lowestBlocId = 0;
        var lowestBlocY = 0;
        for(var bloc = 0; bloc < chunkBlocks.length; bloc++) {
            // a-t-il deja été pris en compte
            var isAlreadyUsed = alreadyUsed[bloc];
            if(chunkBlocks[bloc][1] > lowestBlocY && !isAlreadyUsed) {
                lowestBlocY = chunkBlocks[bloc][1];
                lowestBlocId = bloc;
            }
        }
        // verifie si le joueur est dessus
        if(x + width / 2 >= chunkBlocks[lowestBlocId][0] && x - width / 2 <= chunkBlocks[lowestBlocId][0] + BLOCKSIZE && y - 20 <= chunkBlocks[lowestBlocId][1]) {
            result = chunkBlocks[lowestBlocId][1] - y;
        }
        alreadyUsed[lowestBlocId] = true;
    }
    return result;
}

function ceilDistance(x, y, width) {
    // trouve le bon chunk
    var chunk = parseInt(parseInt(x / BLOCKSIZE) / 16) - (x < 0 ? 1 : 0);
    var chunkBlocks = [];
    if (modifiedChunks.length > 0) {
        for (var i = 0; i < modifiedChunks.length; i++) {
            if (parseInt(parseInt(modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (modifiedChunks[i][0][0] < 0 ? 1 : 0) == chunk) {
                chunkBlocks = modifiedChunks[i];
            }
        }
    }
    // setup variables
    var result = 1000;
    var alreadyUsed = [];
    for(var i = 0; i < chunkBlocks.length; i++) {
        alreadyUsed.push(false);
    }
    //verifie chaque block du plus haut au plus bas
    for(var i = 0; i < chunkBlocks.length; i++) {
        var highestBlocId = 0;
        var heighestBlocY = 0;
        for(var bloc = 0; bloc < chunkBlocks.length; bloc++) {
            // a-t-il deja été pris en compte
            var isAlreadyUsed = alreadyUsed[bloc];
            if(chunkBlocks[bloc][1] + BLOCKSIZE < heighestBlocY && !isAlreadyUsed) {
                heighestBlocY = chunkBlocks[bloc][1] + BLOCKSIZE;
                highestBlocId = bloc;
            }
        }
        // verifie si le joueur est dessous
        if(x + width / 2 >= chunkBlocks[highestBlocId][0] && x - width / 2 <= chunkBlocks[highestBlocId][0] + BLOCKSIZE && y + 20 >= chunkBlocks[highestBlocId][1] + BLOCKSIZE) {
            result = y - chunkBlocks[highestBlocId][1] - BLOCKSIZE;
        }
        alreadyUsed[highestBlocId] = true;
    }
    return result;
}

function loop() {
    canvas.width = window.innerWidth - 1;
    canvas.height = window.innerHeight - 1;
    
    // calcul la position in-game du curseur
    mouseWorldPosX = mouseScreenPosX - (mouseWorldPosX < 0 ? BLOCKSIZE: 0) + cameraX;
    mouseWorldPosY = mouseScreenPosY - (mouseWorldPosY < 0 ? BLOCKSIZE: 0) + cameraY;
    
    // arrondi l'emplacement de la souris sur la grille
    var blockX = parseInt(mouseWorldPosX / BLOCKSIZE) * BLOCKSIZE;
    var blockY = parseInt(mouseWorldPosY / BLOCKSIZE) * BLOCKSIZE;
    
    //deplace la camera
    cameraX += (playerX - canvas.width / 2 - cameraX) / 30;
    cameraY += (playerY - canvas.height / 2 - cameraY) / 30;
    
    //#region PHISIQUES
    // vertical
    if (groundDistance(playerX, playerY + playerHeight / 2, playerWidth * 0.9) < playerYVelocity && playerYVelocity > 0) {
        playerYVelocity = 0;
        playerY += groundDistance(playerX, playerY + playerHeight / 2, playerWidth * 0.9);
    } else if (isABloc(playerX, playerY + playerHeight / 2 - BLOCKSIZE* 2) && playerYVelocity < 0) {
        playerYVelocity = 0;
    } else {
        playerYVelocity += GRAVITY_FORCE;
    }
    playerY += playerYVelocity;

    // horizontal
    if (isRightPressed && !isABloc(playerX + playerWidth / 2, playerY)) {
        playerX += moveSpeed;
    }
    if  (isLeftPressed && !isABloc(playerX - playerWidth / 2, playerY)) {
        playerX -= moveSpeed;
    }
    //#endregion

    //#region AFFICHAGE
    // clear le canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    //dessine le sol
    context.fillStyle = "#1CDF1F";
    context.fillRect(0, 550 - cameraY, canvas.width, canvas.height);

    // dessine les blocs
    for (var i = 0; i < modifiedChunks.length; i++) {
        // dessine les blocs
        if (Math.abs((parseInt(parseInt(modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (modifiedChunks[i][0][0] < 0 ? 1 : 0)) - 
        (parseInt(parseInt(playerX / BLOCKSIZE) / 16) - (playerX < 0 ? 1 : 0))) <= renderDistance) {
            for (var j = 0; j < modifiedChunks[i].length; j++) {
                context.drawImage(blockTextures[modifiedChunks[i][j][2]], modifiedChunks[i][j][0] - cameraX, modifiedChunks[i][j][1] - cameraY, BLOCKSIZE, BLOCKSIZE);
            }
        }
    }

    // dessine les chunks
    context.fillStyle = "yellow";
    for (var i = 0; i < canvas.width; i++) {
        context.fillRect(16 * i * BLOCKSIZE - cameraX, 0, 1, canvas.height);
    }
    
    // dessine le joueur
    context.drawImage(playerSprite, playerX - cameraX - playerWidth / 2, playerY - cameraY - playerHeight / 2, playerWidth, playerHeight);
        
    // dessines le carré noir
    context.strokeSytle = "black";
    context.lineWidth = 3;
    context.strokeRect(blockX - cameraX, blockY - cameraY, 50, 50);

    // dessine la hotbar
    var hotbarCellSize = 50;
    var hotbarHeight = 20;
    var itemsMargin = 10;
    var hotbarStartX = canvas.width / 2 - hotbarCellSize * 9 / 2;
    for (var cellIndex = 0; cellIndex < 9; cellIndex ++) {
        // case
        context.drawImage(hotbarCellSprite, hotbarStartX + cellIndex * hotbarCellSize,
        canvas.height - hotbarCellSize - hotbarHeight, hotbarCellSize, hotbarCellSize);

        // item
        context.drawImage(blockTextures[hotbarContent[cellIndex]], hotbarStartX + cellIndex * hotbarCellSize + itemsMargin,
        canvas.height - hotbarCellSize - hotbarHeight + itemsMargin, hotbarCellSize - 2 * itemsMargin, hotbarCellSize - 2 * itemsMargin);
    }
    // selecteur
    context.drawImage(hotbarSelectorSprite, hotbarStartX + usedHotbarID * hotbarCellSize,
    canvas.height - hotbarCellSize - hotbarHeight, hotbarCellSize, hotbarCellSize);
    //#endregion

    //#region POSER/CASSER
    // trouve le bon chunk
    var chunk = parseInt(parseInt(blockX / BLOCKSIZE) / 16) - (blockX < 0 ? 1 : 0);
    var chunkIndex = modifiedChunks.length;
    for (var i = 0; i < modifiedChunks.length; i++) {
        if (parseInt(parseInt(modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (modifiedChunks[i][0][0] < 0 ? 1 : 0) == chunk) {
            chunkIndex = i;
        }
    }
    //poser bloc
    if (isClicked && !isABloc(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2)) {
        // poser
        if (isABloc(blockX, blockY + BLOCKSIZE * 1.5) || isABloc(blockX, blockY - BLOCKSIZE * 1.5) || isABloc(blockX + BLOCKSIZE * 1.5, blockY) || isABloc(blockX - BLOCKSIZE * 1.5, blockY) ||
        mouseScreenPosY >= canvas.height - cameraY * 1.5 || canPlaceAir) {
            if (chunkIndex == modifiedChunks.length) {
                modifiedChunks.push([]);
            }
            var newBlock = [blockX, blockY, hotbarContent[usedHotbarID]];
            modifiedChunks[chunkIndex].push(newBlock);
        }
    }

    //casser bloc
    var unModified = false;
    if (isRightClicked && modifiedChunks[chunkIndex] != null) {
        for (var i = 0; i < modifiedChunks[chunkIndex].length; i++) {
            if (blockX == modifiedChunks[chunkIndex][i][0] && blockY == modifiedChunks[chunkIndex][i][1]) {
                if (modifiedChunks[chunkIndex].length > 1) {
                    modifiedChunks[chunkIndex].splice(i, 1);
                } else {
                    unModified = true;
                }
            }
        }
    }
    if (unModified) {modifiedChunks.splice(chunkIndex, 1);}
    //#endregion

    isClicked = false;
    isRightClicked = false;
    requestAnimationFrame(loop);
}

//#region INPUTS
//position de la souris
canvas.addEventListener("mousemove", (e) => {
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
    // droite
    if (e.which === 39 || e.which == 68) {
        isRightPressed = true;
    }
    // gauche
    if (e.which === 37 || e.which == 65) {
        isLeftPressed = true;
    }
    // saut
    if (e.which === 32 && groundDistance(playerX, playerY + playerHeight / 2, playerWidth) <= 5) {
        playerYVelocity = -15;
    }
});
document.addEventListener('keyup', function(e) {
    // droite
    if (e.which === 39 || e.which == 68) {
        isRightPressed = false;
    }
    // gauche
    if (e.which === 37 || e.which == 65) {
        isLeftPressed = false;
    }
});
//#endregion

// demarre le jeu
requestAnimationFrame(loop);