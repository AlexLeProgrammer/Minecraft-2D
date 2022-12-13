














































































































































































































































































































































































































// a recopier
//zombie
var zombieX = -300;
var zombieY = 100;
var zombieYVelocity = 0;
var gravityZombie = true;
var isZombieBlockedOnSide = false;

// textures des blocs
var blockTextures = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
blockTextures[0].src = 'sprites/oak_plank.png';
blockTextures[1].src = 'sprites/obsidian.png';
blockTextures[2].src = 'sprites/grass.png';
blockTextures[3].src = 'sprites/dirt.png';
blockTextures[4].src = 'sprites/sand.png';
blockTextures[5].src = 'sprites/stones.png';
blockTextures[6].src = 'sprites/flintandsteel.png';

// hotbar
var hotbarContent = [0, 1, 2, 3, 4, 5, 6, 0, 1];

//dessine le zombie
context.fillStyle = "blue";
context.fillRect(zombieX - cameraX, zombieY - cameraY, 100, 100);   

//empeche le zombie de tomber lorsqu'il est sur un bloc
if (zombieY >= blockData[i][1] - 130 && zombieY <= blockData[i][1] - 90 && zombieX >= blockData[i][0] - 100 && zombieX <= blockData[i][0] + 100 && zombieYVelocity >= 0) {
    gravityZombie = false;
}

//detecte si il y a un bloc à coté du zombie
if (zombieX < playerX || zombieX > playerX) {
    if (zombieY >= blockData[i][1] - 100 && zombieY <= blockData[i][1] + 100 && zombieX >= blockData[i][0] - 100 && zombieX <= blockData[i][0] + 100) {
        if ((zombieX + 100 < blockData[i][0] + 25)) {
            zombieX -= 2;
            isZombieBlockedOnSide = true;
        }
        if ((zombieX > blockData[i][0] + 25)) {
            zombieX += 2; 
            isZombieBlockedOnSide = true;
        }
    }    
}

//deplace le zombie
if (zombieX > playerX) {
    zombieX -= 2;
}
if (zombieX < playerX) {
    zombieX += 2;
}
if ((zombieY > 550 || gravityZombie === false) && zombieY > playerY + 100 && ((zombieX - playerX < 300 && zombieX - playerX > -1) || (playerX - zombieX < 300 && playerX - zombieX > -1)) ||
isZombieBlockedOnSide) {
    zombieYVelocity = -15;
}
zombieY += zombieYVelocity;

//desactive la gravite si le zombie est sur le sol
if (zombieY < 550) {
    gravityZombie = true;
} else {
    gravityZombie = false;
}

//faite tomber le bloc si c'est du sable
if (blockData[i][2] === 3 && blockData[i][1] < canvas.height - canvas.height / 6 && !isABloc(blockData[i][0], blockData[i][1] + BLOCKSIZE)) {
    blockData[i][3] += GRAVITY_FORCE;
    blockData[i][1] += blockData[i][3] - blockData[i][3] % 10;
} else if (blockData[i][2] === 3) {
    blockData[i][3] = 0;
}