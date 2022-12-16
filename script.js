//Copie de Minecraft en 2D
//Auteur : Alex Etienne & Arsène Brosy
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

// constantes
const BLOCKSIZE = 50;
const GRAVITY_FORCE = 0.5;
const JUMP_FORCE = 9.5;
const ZOMBIE_JUMP_FORCE = 10;
const MOVE_SPEED = 3;
const ZOMBIE_MOVE_SPEED = 2;
const PLAYER_WIDTH = 42.5;
const PLAYER_HEIGHT = 85;
const ZOMBIE_WIDTH = 50;
const ZOMBIE_HEIGHT = 100;
const ZOMBIE_FOLLOW_DISTANCE = 600;

//variables
var playerX = 0;
var playerY = 0;

//variables des inputs
var isRightPressed = false;
var isLeftPressed = false;
var isClicked = false;
var isRightClicked = false;

//mouvement du joueur
var playerYVelocity = 0;
var renderDistance = 2;

//variables des images
var playerSprite = new Image();
playerSprite.src = 'sprites/player.png';
var hotbarCellSprite = new Image();
hotbarCellSprite.src = 'sprites/gui/hotbarFrame.png';
var hotbarSelectorSprite = new Image();
hotbarSelectorSprite.src = 'sprites/gui/hotbarSelector.png';
var zombieSprite = new Image();
zombieSprite.src = 'sprites/entities/zombie.png';

//textures des portails
var portalAnimationFrames = [];
for (var i = 0; i < 32; i++) {
    portalAnimationFrames.push(new Image());
}
portalAnimationFrames[0].src = 'sprites/blocks/portal_animation_frames/portal_ (1).png';
portalAnimationFrames[1].src = 'sprites/blocks/portal_animation_frames/portal_ (2).png';
portalAnimationFrames[2].src = 'sprites/blocks/portal_animation_frames/portal_ (3).png';
portalAnimationFrames[3].src = 'sprites/blocks/portal_animation_frames/portal_ (4).png';
portalAnimationFrames[4].src = 'sprites/blocks/portal_animation_frames/portal_ (5).png';
portalAnimationFrames[5].src = 'sprites/blocks/portal_animation_frames/portal_ (6).png';
portalAnimationFrames[6].src = 'sprites/blocks/portal_animation_frames/portal_ (7).png';
portalAnimationFrames[7].src = 'sprites/blocks/portal_animation_frames/portal_ (8).png';
portalAnimationFrames[8].src = 'sprites/blocks/portal_animation_frames/portal_ (9).png';
portalAnimationFrames[9].src = 'sprites/blocks/portal_animation_frames/portal_ (10).png';
portalAnimationFrames[10].src = 'sprites/blocks/portal_animation_frames/portal_ (11).png';
portalAnimationFrames[11].src = 'sprites/blocks/portal_animation_frames/portal_ (12).png';
portalAnimationFrames[12].src = 'sprites/blocks/portal_animation_frames/portal_ (13).png';
portalAnimationFrames[13].src = 'sprites/blocks/portal_animation_frames/portal_ (14).png';
portalAnimationFrames[14].src = 'sprites/blocks/portal_animation_frames/portal_ (15).png';
portalAnimationFrames[15].src = 'sprites/blocks/portal_animation_frames/portal_ (16).png';
portalAnimationFrames[16].src = 'sprites/blocks/portal_animation_frames/portal_ (17).png';
portalAnimationFrames[17].src = 'sprites/blocks/portal_animation_frames/portal_ (18).png';
portalAnimationFrames[18].src = 'sprites/blocks/portal_animation_frames/portal_ (19).png';
portalAnimationFrames[19].src = 'sprites/blocks/portal_animation_frames/portal_ (20).png';
portalAnimationFrames[20].src = 'sprites/blocks/portal_animation_frames/portal_ (21).png';
portalAnimationFrames[21].src = 'sprites/blocks/portal_animation_frames/portal_ (22).png';
portalAnimationFrames[22].src = 'sprites/blocks/portal_animation_frames/portal_ (23).png';
portalAnimationFrames[23].src = 'sprites/blocks/portal_animation_frames/portal_ (24).png';
portalAnimationFrames[24].src = 'sprites/blocks/portal_animation_frames/portal_ (25).png';
portalAnimationFrames[25].src = 'sprites/blocks/portal_animation_frames/portal_ (26).png';
portalAnimationFrames[26].src = 'sprites/blocks/portal_animation_frames/portal_ (27).png';
portalAnimationFrames[27].src = 'sprites/blocks/portal_animation_frames/portal_ (28).png';
portalAnimationFrames[28].src = 'sprites/blocks/portal_animation_frames/portal_ (29).png';
portalAnimationFrames[29].src = 'sprites/blocks/portal_animation_frames/portal_ (30).png';
portalAnimationFrames[30].src = 'sprites/blocks/portal_animation_frames/portal_ (31).png';
portalAnimationFrames[31].src = 'sprites/blocks/portal_animation_frames/portal_ (32).png';

// textures des blocs
var blockTextures = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
blockTextures[0].src = 'sprites/blocks/oak_plank.png';
blockTextures[1].src = 'sprites/blocks/grass.png';
blockTextures[2].src = 'sprites/blocks/dirt.png';
blockTextures[3].src = 'sprites/blocks/obsidian.png';
blockTextures[4].src = 'sprites/blocks/sand.png';
blockTextures[5].src = 'sprites/blocks/stone.png';
blockTextures[6].src = 'sprites/items/flint_and_steel.png';

// hotbar
var hotbarContent = [0, 1, 2, 3, 4, 5, 1, 0, 6];

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

// generation procedurale
var proceduralDetail = 3;
var proceduralSize = 500;
var proceduralHeight = 300;
var superflat = false;

//zombie
var zombieX = 500;
var zombieY = -200;
var zombieYVelocity = 0;
var gravityZombie = true;
var isZombieBlockedOnSide = false;

//portail du nether
var portalPose = [];
var isAPortal = false;
var portalFrameCounter = 0;
var portalFrameCounterSlower = 0;

noise.seed(Math.random());
//permet de generer un nombre aleatoire
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//detecte si il y a un bloc a des coordonnees precises
function isABloc(x, y) {
    var chunk = parseInt(parseInt(x / BLOCKSIZE) / 16) - (x < 0 ? 1 : 0);
    var chunkBlocks = getChunkBlocks(chunk);
    var result = false;
    for (var i = 0; i < chunkBlocks.length; i++) {
        if (chunkBlocks[i][0] <= x && chunkBlocks[i][0] + BLOCKSIZE >= x && chunkBlocks[i][1] <= y && chunkBlocks[i][1] + BLOCKSIZE >= y) {
            result = true;
        }
    }
    return result;
}
//detecte si il y a un bloc- d'obsidienne a des coordonnees precises
function isASpecificBlock(x, y, id) {
    var chunk = parseInt(parseInt(x / BLOCKSIZE) / 16) - (x < 0 ? 1 : 0);
    var chunkBlocks = getChunkBlocks(chunk);
    var result = false;
    for (var i = 0; i < chunkBlocks.length; i++) {
        if (chunkBlocks[i][0] <= x && chunkBlocks[i][0] + BLOCKSIZE >= x && chunkBlocks[i][1] <= y && chunkBlocks[i][1] + BLOCKSIZE >= y &&
            chunkBlocks[i][2] === id) {
            result = true;
        }
    }
    return result;
}

function getYProcedural(x) {
    var result = 0;
    for (var i = 0; i < proceduralDetail; i++) {
        result += noise.perlin2(x / (proceduralSize / (i + 1)), i * 100) / (i + 1);
    }
    return superflat ? 0 : (result * proceduralHeight);
}

playerY = parseInt(getYProcedural(0) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE;
function getChunkBlocks(x) {
    var result = [];
    // ce chunk a-t-il des modifications
    var isModified = false;
    for (var i = 0; i < modifiedChunks.length; i++) {
        if (parseInt(parseInt(modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (modifiedChunks[i][0][0] < 0 ? 1 : 0) == x) {
            isModified = true;
            for (var j = 0; j < modifiedChunks[i].length; j++) {
                result.push(modifiedChunks[i][j]);
            }
        }
    }

    // ajout de terrain si pas de modifs
    if (!isModified) {
        for (var xPos = 0; xPos < 16; xPos++) {
            // herbe
            result.push([
                x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE,
                1
            ]);
            // terre
            for (var yPos = parseInt(getYProcedural(x * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE; yPos <= 1000; yPos += BLOCKSIZE) {
                result.push([
                    x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                    yPos,
                    2
                ]);
            }
        }
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
    // sol
    if (isABloc(playerX, playerY + PLAYER_HEIGHT / 2 + playerYVelocity) && playerYVelocity >= 0) {
        playerYVelocity = 0;
    }else {
        playerYVelocity += GRAVITY_FORCE;
    }
    
    // toit
    if (isABloc(playerX, playerY + PLAYER_HEIGHT / 2 - BLOCKSIZE* 2) && playerYVelocity <= 0) {
        playerYVelocity = 0;
    }
    playerY += playerYVelocity;
    
    // horizontal
    if (isRightPressed && !isABloc(playerX + PLAYER_WIDTH / 2, playerY)) {
        playerX += MOVE_SPEED;
    }
    if  (isLeftPressed && !isABloc(playerX - PLAYER_WIDTH / 2, playerY)) {
        playerX -= MOVE_SPEED;
    }

    // sol zombie
    if (isABloc(zombieX, zombieY + ZOMBIE_HEIGHT + zombieYVelocity) && zombieYVelocity >= 0) {
        zombieYVelocity = 0;
        gravityZombie = false;
    }else {
        zombieYVelocity += GRAVITY_FORCE;
        gravityZombie = true;
    }
       
    
    // horizontal zombie
    if (zombieX < playerX && (isABloc(zombieX + ZOMBIE_WIDTH, zombieY + ZOMBIE_HEIGHT / 2) || isABloc(zombieX + ZOMBIE_WIDTH, zombieY))) {
        isZombieBlockedOnSide = true;
        zombieX -= ZOMBIE_MOVE_SPEED;
    }
    if (zombieX > playerX && (isABloc(zombieX, zombieY + ZOMBIE_HEIGHT / 2) || isABloc(zombieX, zombieY))) {
        isZombieBlockedOnSide = true;
        zombieX += ZOMBIE_MOVE_SPEED;
    }

    //deplace le zombie
    if (zombieX > playerX && isZombieBlockedOnSide === false && zombieX - playerX > -1 && zombieX - playerX < ZOMBIE_FOLLOW_DISTANCE) {
        zombieX -= ZOMBIE_MOVE_SPEED;
    }
    if (zombieX < playerX && isZombieBlockedOnSide === false  && playerX - zombieX > -1 && playerX - zombieX < ZOMBIE_FOLLOW_DISTANCE) {
        zombieX += ZOMBIE_MOVE_SPEED;
    }
    if (gravityZombie === false && isZombieBlockedOnSide) {
        zombieYVelocity = -ZOMBIE_JUMP_FORCE;
    }
    zombieY += zombieYVelocity;
    
    //portail
    if(isClicked && hotbarContent[usedHotbarID] === 6) {
        if (isASpecificBlock(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 - BLOCKSIZE, blockY + BLOCKSIZE / 2 - BLOCKSIZE, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2 - BLOCKSIZE, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 2, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 - BLOCKSIZE, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 3, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 4, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 4, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE * 2, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 3, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE * 2, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 2, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE * 2, blockY + BLOCKSIZE / 2 - BLOCKSIZE, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE, blockY + BLOCKSIZE / 2, 3)) {
            portalPose[0] = blockX;
            portalPose[1] = blockY;
            isAPortal = true;
        }
    }
    
    //sable 4
    
    //#endregion
    //#region AFFICHAGE
    // clear le canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    var playerChunk = parseInt(parseInt(playerX / BLOCKSIZE) / 16) - (playerX < 0 ? 1 : 0);
    for (var i = playerChunk - renderDistance; i <= playerChunk + renderDistance ; i++) {
        var blocks = getChunkBlocks(i);
        for (var j = 0; j < blocks.length; j++) {
            //gere le sable
            if (blocks[j][2] === 4) {
                if (isABloc(blocks[j][0] + 1, blocks[j][1] + BLOCKSIZE + 1 + blocks[j][3])) {
                    blocks[j][3] = 0;
                    blocks[j][0] = parseInt(blocks[j][0] / BLOCKSIZE) * BLOCKSIZE;
                    blocks[j][1] = parseInt(blocks[j][1] / BLOCKSIZE) * BLOCKSIZE;
                }else {
                    blocks[j][3] += GRAVITY_FORCE;
                }
                blocks[j][1] += blocks[j][3];
            }
            // dessine les blocs
            context.drawImage(blockTextures[blocks[j][2]], blocks[j][0] - cameraX, blocks[j][1] - cameraY, BLOCKSIZE, BLOCKSIZE);
        }
        
    }

    //dessine les blocs de portail
    if (isAPortal) {
        context.drawImage(portalAnimationFrames[portalFrameCounter], portalPose[0] - cameraX, portalPose[1] - BLOCKSIZE - cameraY, BLOCKSIZE, BLOCKSIZE);
        context.drawImage(portalAnimationFrames[portalFrameCounter], portalPose[0] - cameraX, portalPose[1] - BLOCKSIZE * 2 - cameraY, BLOCKSIZE, BLOCKSIZE);
        context.drawImage(portalAnimationFrames[portalFrameCounter], portalPose[0] - cameraX, portalPose[1] - BLOCKSIZE * 3 - cameraY, BLOCKSIZE, BLOCKSIZE);
        context.drawImage(portalAnimationFrames[portalFrameCounter], portalPose[0] + BLOCKSIZE - cameraX, portalPose[1] - BLOCKSIZE - cameraY, BLOCKSIZE, BLOCKSIZE);
        context.drawImage(portalAnimationFrames[portalFrameCounter], portalPose[0] + BLOCKSIZE - cameraX, portalPose[1] - BLOCKSIZE * 2 - cameraY, BLOCKSIZE, BLOCKSIZE);
        context.drawImage(portalAnimationFrames[portalFrameCounter], portalPose[0] + BLOCKSIZE - cameraX, portalPose[1] - BLOCKSIZE * 3 - cameraY, BLOCKSIZE, BLOCKSIZE);
    }

    //dessine le zombie
    context.drawImage(zombieSprite, zombieX - cameraX, zombieY - cameraY, ZOMBIE_WIDTH, ZOMBIE_HEIGHT);
    
    // dessine le joueur
    context.drawImage(playerSprite, playerX - cameraX - PLAYER_WIDTH / 2, playerY - cameraY - PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);

    // dessine le carré noir
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
    if (isClicked && !isABloc(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2) && usedHotbarID != 8) {
        // si le chunk n'etait pas modifié creer le terrain
        if (modifiedChunks[chunkIndex] == null) {
            var terrain = [];
            for (var i = 0; i < getChunkBlocks(chunkIndex).length; i++) {
                terrain.push(getChunkBlocks(chunkIndex)[i]);
            }
            modifiedChunks.push([]);
            for (var i = 0; i < terrain.length; i++) {
                modifiedChunks[modifiedChunks.length - 1].push(terrain[i]);
            }
        }
        // poser
        if (isABloc(blockX, blockY + BLOCKSIZE * 1.5) || isABloc(blockX, blockY - BLOCKSIZE * 1.5) || isABloc(blockX + BLOCKSIZE * 1.5, blockY) || isABloc(blockX - BLOCKSIZE * 1.5, blockY) ||
        mouseScreenPosY >= canvas.height - cameraY * 1.5 || canPlaceAir) {
            if (chunkIndex == modifiedChunks.length) {
                modifiedChunks.push([]);
            }
            var newBlock = [blockX, blockY, hotbarContent[usedHotbarID], 0];
            modifiedChunks[chunkIndex].push(newBlock);
        }
    }
    
    //casser bloc
    if (isRightClicked) {
        // si le chunk n'etait pas modifié creer le terrain
        if (modifiedChunks[chunkIndex] == null) {
            var terrain = [];
            for (var i = 0; i < getChunkBlocks(chunkIndex).length; i++) {
                terrain.push(getChunkBlocks(chunkIndex)[i]);
            }
            modifiedChunks.push([]);
            for (var i = 0; i < terrain.length; i++) {
                modifiedChunks[modifiedChunks.length - 1].push(terrain[i]);
            }
        }
        for (var i = 0; i < modifiedChunks[chunkIndex].length; i++) {
            if (blockX == modifiedChunks[chunkIndex][i][0] && blockY == modifiedChunks[chunkIndex][i][1]) {
                modifiedChunks[chunkIndex].splice(i, 1);
            }
        }
    }

    //compte les image de l'animation du portail
    if (portalFrameCounterSlower === 2) {
        portalFrameCounterSlower = 0;

        if(portalFrameCounter === 31) {
            portalFrameCounter = 0;
        } else {
            portalFrameCounter++;
        }
    } else {
        portalFrameCounterSlower++;
    }
    //#endregion
    isClicked = false;
    isRightClicked = false;
    isZombieBlockedOnSide = false;
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
    if (e.which === 32 && isABloc(playerX, playerY + PLAYER_HEIGHT / 2 + 5)) {
        playerYVelocity = -JUMP_FORCE;
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