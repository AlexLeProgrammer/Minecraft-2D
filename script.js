//Copie de Minecraft en 2D
//Auteur : Alex Etienne & Arsène Brosy
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

//constantes
const BLOCKSIZE = 50;
const GRAVITY_FORCE = 0.1;
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
var renderDistance = 2;

//variables des inputs
var isRightPressed = false;
var isLeftPressed = false;
var isClicked = false;
var isRightClicked = false;

//#region TEXTURES
//variables des images
var playerSprite = new Image();
playerSprite.src = 'sprites/player.png';
var hotbarCellSprite = new Image();
hotbarCellSprite.src = 'sprites/gui/hotbarFrame.png';
var hotbarSelectorSprite = new Image();
hotbarSelectorSprite.src = 'sprites/gui/hotbarSelector.png';
var zombieSprite = new Image();
zombieSprite.src = 'sprites/entities/zombie.png';
var forcefield = new Image();
forcefield.src = 'sprites/mist/forcefield.png';

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

//textures du feux
var fireAnimationFrames = [];
for (var i = 0; i < 32; i++) {
    fireAnimationFrames.push(new Image());
}
fireAnimationFrames[0].src = 'sprites/blocks/fire_animation_frames/fire_ (1).png';
fireAnimationFrames[1].src = 'sprites/blocks/fire_animation_frames/fire_ (2).png';
fireAnimationFrames[2].src = 'sprites/blocks/fire_animation_frames/fire_ (3).png';
fireAnimationFrames[3].src = 'sprites/blocks/fire_animation_frames/fire_ (4).png';
fireAnimationFrames[4].src = 'sprites/blocks/fire_animation_frames/fire_ (5).png';
fireAnimationFrames[5].src = 'sprites/blocks/fire_animation_frames/fire_ (6).png';
fireAnimationFrames[6].src = 'sprites/blocks/fire_animation_frames/fire_ (7).png';
fireAnimationFrames[7].src = 'sprites/blocks/fire_animation_frames/fire_ (8).png';
fireAnimationFrames[8].src = 'sprites/blocks/fire_animation_frames/fire_ (9).png';
fireAnimationFrames[9].src = 'sprites/blocks/fire_animation_frames/fire_ (10).png';
fireAnimationFrames[10].src = 'sprites/blocks/fire_animation_frames/fire_ (11).png';
fireAnimationFrames[11].src = 'sprites/blocks/fire_animation_frames/fire_ (12).png';
fireAnimationFrames[12].src = 'sprites/blocks/fire_animation_frames/fire_ (13).png';
fireAnimationFrames[13].src = 'sprites/blocks/fire_animation_frames/fire_ (14).png';
fireAnimationFrames[14].src = 'sprites/blocks/fire_animation_frames/fire_ (15).png';
fireAnimationFrames[15].src = 'sprites/blocks/fire_animation_frames/fire_ (16).png';
fireAnimationFrames[16].src = 'sprites/blocks/fire_animation_frames/fire_ (17).png';
fireAnimationFrames[17].src = 'sprites/blocks/fire_animation_frames/fire_ (18).png';
fireAnimationFrames[18].src = 'sprites/blocks/fire_animation_frames/fire_ (19).png';
fireAnimationFrames[19].src = 'sprites/blocks/fire_animation_frames/fire_ (20).png';
fireAnimationFrames[20].src = 'sprites/blocks/fire_animation_frames/fire_ (21).png';
fireAnimationFrames[21].src = 'sprites/blocks/fire_animation_frames/fire_ (22).png';
fireAnimationFrames[22].src = 'sprites/blocks/fire_animation_frames/fire_ (23).png';
fireAnimationFrames[23].src = 'sprites/blocks/fire_animation_frames/fire_ (24).png';
fireAnimationFrames[24].src = 'sprites/blocks/fire_animation_frames/fire_ (25).png';
fireAnimationFrames[25].src = 'sprites/blocks/fire_animation_frames/fire_ (26).png';
fireAnimationFrames[26].src = 'sprites/blocks/fire_animation_frames/fire_ (27).png';
fireAnimationFrames[27].src = 'sprites/blocks/fire_animation_frames/fire_ (28).png';
fireAnimationFrames[28].src = 'sprites/blocks/fire_animation_frames/fire_ (29).png';
fireAnimationFrames[29].src = 'sprites/blocks/fire_animation_frames/fire_ (30).png';
fireAnimationFrames[30].src = 'sprites/blocks/fire_animation_frames/fire_ (31).png';
fireAnimationFrames[31].src = 'sprites/blocks/fire_animation_frames/fire_ (32).png';

//textures de la lave
var lavaAnimationFrames = [];
for (var i = 0; i < 20; i++) {
    lavaAnimationFrames.push(new Image());
}
lavaAnimationFrames[0].src = 'sprites/blocks/lava_animation_frames/lava_ (1).png';
lavaAnimationFrames[1].src = 'sprites/blocks/lava_animation_frames/lava_ (2).png';
lavaAnimationFrames[2].src = 'sprites/blocks/lava_animation_frames/lava_ (3).png';
lavaAnimationFrames[3].src = 'sprites/blocks/lava_animation_frames/lava_ (4).png';
lavaAnimationFrames[4].src = 'sprites/blocks/lava_animation_frames/lava_ (5).png';
lavaAnimationFrames[5].src = 'sprites/blocks/lava_animation_frames/lava_ (6).png';
lavaAnimationFrames[6].src = 'sprites/blocks/lava_animation_frames/lava_ (7).png';
lavaAnimationFrames[7].src = 'sprites/blocks/lava_animation_frames/lava_ (8).png';
lavaAnimationFrames[8].src = 'sprites/blocks/lava_animation_frames/lava_ (9).png';
lavaAnimationFrames[9].src = 'sprites/blocks/lava_animation_frames/lava_ (10).png';
lavaAnimationFrames[10].src = 'sprites/blocks/lava_animation_frames/lava_ (11).png';
lavaAnimationFrames[11].src = 'sprites/blocks/lava_animation_frames/lava_ (12).png';
lavaAnimationFrames[12].src = 'sprites/blocks/lava_animation_frames/lava_ (13).png';
lavaAnimationFrames[13].src = 'sprites/blocks/lava_animation_frames/lava_ (14).png';
lavaAnimationFrames[14].src = 'sprites/blocks/lava_animation_frames/lava_ (15).png';
lavaAnimationFrames[15].src = 'sprites/blocks/lava_animation_frames/lava_ (16).png';
lavaAnimationFrames[16].src = 'sprites/blocks/lava_animation_frames/lava_ (17).png';
lavaAnimationFrames[17].src = 'sprites/blocks/lava_animation_frames/lava_ (18).png';
lavaAnimationFrames[18].src = 'sprites/blocks/lava_animation_frames/lava_ (19).png';
lavaAnimationFrames[19].src = 'sprites/blocks/lava_animation_frames/lava_ (20).png';

//textures des blocs
var blockTextures = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
blockTextures[0].src = 'sprites/blocks/oak_plank.png';
blockTextures[1].src = 'sprites/blocks/grass.png';
blockTextures[2].src = 'sprites/blocks/dirt.png';
blockTextures[3].src = 'sprites/blocks/obsidian.png';
blockTextures[4].src = 'sprites/blocks/sand.png';
blockTextures[5].src = 'sprites/blocks/stone.png';
blockTextures[6].src = 'sprites/Items/flint_and_steel.png';
blockTextures[7].src = 'sprites/blocks/oak_log.png';
blockTextures[8].src = 'sprites/blocks/oak_leaves.png';
blockTextures[9].src = 'sprites/blocks/netherrack.png';
blockTextures[10].src = 'sprites/Items/lava_bucket.png';
blockTextures[11].src = 'sprites/blocks/portal_animation_frames/portal_ (1).png';

//#endregion

//variables des blocs
var blockX = 0;
var blockY = 0;
var usedHotbarID = 0;
var canPlaceAir = false;
var gravity = true;
var cameraX = 0;
var cameraY = 0;
var mouseScreenPosX = 0;
var mouseScreenPosY = 0;
var mouseWorldPosX = 0;
var mouseWorldPosY = 0;

//generation procedurale
var proceduralDetail = 3;
var proceduralSize = 500;
var proceduralHeight = 300;

//zombie
var zombieX = 500;
var zombieY = -200;
var zombieYVelocity = 0;
var gravityZombie = true;
var isZombieBlockedOnSide = false;

//portail du nether
var isANewPortal = false;

//animation
var animationFrameCounter = 0;
var borderFrameCounter = 0;
var lavaFrameCounter = 0;
var lavaFrameWay = 1;

// gui
const GUI_SIZE = 50;
var inventorySprite = new Image();
inventorySprite.src = 'sprites/gui/inventory.png';
var fullHeartSprite = new Image();
fullHeartSprite.src = 'sprites/gui/full_heart.png';
var emptyHeartSprite = new Image();
emptyHeartSprite.src = 'sprites/gui/empty_heart.png';
var halfHeartSprite = new Image();
halfHeartSprite.src = 'sprites/gui/half_heart.png';

// données du monde
var worldDatas = {
    // variables du joueur
    playerX: 525,
    playerY: 0,
    playerLife: 10,
    fireTime: 0,
    // mouvement du joueur
    playerYVelocity: 0,
    // terrain
    modifiedChunks: [],
    //recuperation de la seed
    proceduraleSeed: 0,
    //nether
    netherModifiedChunks: [],
    proceduraleNetherSeed: 0,
    isInNether: false,
    // inventaire
    inventory: {
        opened: false,
        content: [
            0, 0, 0, 0, 0, 0, 0, 0, 0,
            4, 4, 5, 5, 7, 7, 8, 8, 0,
            9, 0, 0, 1, 1, 2, 2, 3, 3,
            10, 4, 4, 5, 5, 6, 6, 7, 7,
        ],
        inMouse: null,
    }
}

//#region CHARGEMENT DES DONNEES
if (localStorage.getItem("datas") != null) {
    worldDatas = JSON.parse(localStorage.getItem("datas"));
} else {
    // si il n'y a pas de donnees enregistre generer
    for (var i = 0; i < worldDatas.inventory.content.length; i++) {
        worldDatas.inventory.content[i] = parseInt(Math.random() * (blockTextures.length - 1) + 1) - 1;
        if(Math.random() >= 0.85) {
            worldDatas.inventory.content[i] = null;
        }
    }
    // genere la graine
    worldDatas.proceduraleSeed = Math.random();
    worldDatas.proceduraleNetherSeed = Math.random();

    //genere la position y du joueur
    worldDatas.playerY = parseInt(getYProcedural(525) / BLOCKSIZE) * BLOCKSIZE - PLAYER_HEIGHT / 2;
}

// utilise la graine avec la fonction de bruit perlin
noise.seed(worldDatas.proceduraleSeed);

//#endregion

//detecte si il y a un bloc a des coordonnees precises
function isABlock(x, y) {
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
//detecte si il y a un bloc specifique a des coordonnees precises
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
    return result * proceduralHeight;
}

function getXwithSeed(x) {
    var result = 0;
    if (x > 10) {
        x /= 10;
    } else if (x > 100) {
        x /= 100;
    }
    result = parseInt((worldDatas.proceduraleSeed * 100 / (x + 1)) % 12);

    return result;
}

function getChunkBlocks(x) {
    var result = [];
    // ce chunk a-t-il des modifications
    var isModified = false;
    if (worldDatas.isInNether === false) {
        for (var i = 0; i < worldDatas.modifiedChunks.length; i++) {
            if (parseInt(parseInt(worldDatas.modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (worldDatas.modifiedChunks[i][0][0] < 0 ? 1 : 0) == x) {
                isModified = true;
                for (var j = 0; j < worldDatas.modifiedChunks[i].length; j++) {
                    result.push(worldDatas.modifiedChunks[i][j]);
                }
            }
        }
    } else {
        for (var i = 0; i < worldDatas.netherModifiedChunks.length; i++) {
            if (parseInt(parseInt(worldDatas.netherModifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (worldDatas.netherModifiedChunks[i][0][0] < 0 ? 1 : 0) == x) {
                isModified = true;
                for (var j = 0; j < worldDatas.netherModifiedChunks[i].length; j++) {
                    result.push(worldDatas.netherModifiedChunks[i][j]);
                }
            }
        }
    }

    // ajout de terrain si pas de modifs
    if (!isModified) {
        for (var xPos = 0; xPos < 16; xPos++) {
            if (worldDatas.isInNether === false) {
                // herbe
                result.push([
                    x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                    parseInt(getYProcedural(x * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE,
                    1
                ]);
                // terre
                for (var yPos = parseInt(getYProcedural(x * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE; yPos <= 10 * BLOCKSIZE; yPos += BLOCKSIZE) {
                    result.push([
                        x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                        yPos,
                        2
                    ]);
                }
                // pierre
                for (var yPos = parseInt(getYProcedural((x + 64) * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE * 5; yPos <= 80 * BLOCKSIZE; yPos += BLOCKSIZE) {
                    result.push([
                        x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                        yPos,
                        5
                    ]);
                }  
            } else {
                // netherrack
                for (var yPos = parseInt(getYProcedural(x * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE; yPos <=  80 * BLOCKSIZE; yPos += BLOCKSIZE) {
                    result.push([
                        x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                        yPos,
                        9
                    ]);
                } 
                // lave
                if (parseInt(getYProcedural(x * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE >= 100) {
                    for (var yPos = 100; yPos <=  parseInt(getYProcedural(x * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE; yPos += BLOCKSIZE) {
                        result.push([
                            x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                            yPos,
                            10
                        ]);
                    } 
                }
            }
        }
        if (worldDatas.isInNether === false) {
            // arbre
            //tronc
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE,
                7
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 2,
                7
            ]); 
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 3,
                7
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 4,
                7
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 5,
                8
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 6,
                8
            ]);
            //tronc + 1 a gauche
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE - BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 3,
                8
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE - BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 4,
                8
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE - BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 5,
                8
            ]);
            //tronc + 2 a gauche
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE - BLOCKSIZE * 2,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 3,
                8
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE - BLOCKSIZE * 2,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 4,
                8
            ]);
            //tronc + 1 a droite
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE + BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 3,
                8
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE + BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 4,
                8
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE + BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 5,
                8
            ]);
            //tronc + 2 a droite
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE + BLOCKSIZE * 2,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 3,
                8
            ]);
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE + BLOCKSIZE * 2,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE - BLOCKSIZE * 4,
                8
            ]);
        } else {
            // feu
            result.push([
                x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE,
                parseInt(getYProcedural(x * 16 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE + 2 * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE,
                6
            ]);
        }
        // cave
        if (worldDatas.isInNether === false) {
            // air cave
            var caveXstart = 16;
            // determine si il peut y avoir une grotte
            if ((getXwithSeed(x) + getXwithSeed(x + 1) + getXwithSeed(x + 2)) / 3 > 3.5) {
                caveXstart = 0;
            }

            for (var airIndex = 0; airIndex < result.length; airIndex++) {
                if (result[airIndex][1] === 10 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE && result[airIndex][0] >= caveXstart * BLOCKSIZE + x * 16 * BLOCKSIZE) {
                    result.splice(airIndex, 10);
                }
            }
            for (var xPos = 0; xPos < 16; xPos++) {
                // toit grotte
                var roofTop = 6 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE;
                var roofBottom = parseInt(getYProcedural((x + 96) * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE * 10 + getXwithSeed(x) * BLOCKSIZE;
                for (var yPos = roofTop; yPos <= roofBottom; yPos += BLOCKSIZE) {
                    result.push([
                        x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                        yPos,
                        5
                    ]);
                }
                // sol grotte
                var groundTop = parseInt(getYProcedural((x + 128) * 16 * BLOCKSIZE + xPos * BLOCKSIZE) / BLOCKSIZE) * BLOCKSIZE + BLOCKSIZE * 19 + getXwithSeed(x) * BLOCKSIZE;
                var groundBottom = 23 * BLOCKSIZE + getXwithSeed(x) * BLOCKSIZE;
                for (var yPos = groundTop; yPos <= groundBottom; yPos += BLOCKSIZE) {
                    result.push([
                        x * 16 * BLOCKSIZE + xPos * BLOCKSIZE,
                        yPos,
                        5
                    ]);
                }
            }
        }
    }
    return result;
}

var reseted = false;
function resetWorld() {
    reseted = true;
    localStorage.clear();
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
    cameraX += (worldDatas.playerX - canvas.width / 2 - cameraX) / 30;
    cameraY += (worldDatas.playerY - canvas.height / 2 - cameraY) / 30;
    
    //calcule dans quel chunk est le joueur
    var playerChunk = parseInt(parseInt(worldDatas.playerX / BLOCKSIZE) / 16) - (worldDatas.playerX < 0 ? 1 : 0);
    
    //nether
    if (isASpecificBlock(worldDatas.playerX, worldDatas.playerY, 11) && worldDatas.isInNether === false) {
        worldDatas.isInNether = true;
        noise.seed(worldDatas.proceduraleNetherSeed);
        worldDatas.playerX += 3 * BLOCKSIZE;
        worldDatas.playerY = getYProcedural(worldDatas.playerX);
    } else if (isASpecificBlock(worldDatas.playerX, worldDatas.playerY, 11)) {
        worldDatas.isInNether = false;
        noise.seed(worldDatas
            .proceduraleSeed);
        worldDatas.playerX += 3 * BLOCKSIZE;
        worldDatas.playerY = getYProcedural(worldDatas.playerX);
    }
    
    if (!worldDatas.inventory.opened) {
        //#region PHISIQUES
        // vertical
        // sol
        if (isABlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2 + worldDatas.playerYVelocity) &&
        !isASpecificBlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2 + worldDatas.playerYVelocity, 10) && worldDatas.playerYVelocity >= 0 && !isASpecificBlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2 + worldDatas.playerYVelocity, 6)) {
            if (worldDatas.playerYVelocity > 13) {
                worldDatas.playerLife -= (worldDatas.playerYVelocity - 13) / 2;
                worldDatas.playerLife -= worldDatas.playerLife % 0.5;
            } 
            worldDatas.playerYVelocity = 0;
        }else {
            worldDatas.playerYVelocity += GRAVITY_FORCE;
        }
        
        // toit
    if (isABlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2 - BLOCKSIZE* 2) &&
    !isASpecificBlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2 - BLOCKSIZE* 2, 6) &&
    !isASpecificBlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2 - BLOCKSIZE* 2, 10) && worldDatas.playerYVelocity <= 0) {
        worldDatas.playerYVelocity = 0;
    }
    worldDatas.playerY += worldDatas.playerYVelocity;
    
    // horizontal
    if (isRightPressed && (!isABlock(worldDatas.playerX + PLAYER_WIDTH / 2, worldDatas.playerY) || isASpecificBlock(worldDatas.playerX + PLAYER_WIDTH / 2, worldDatas.playerY, 6) || isASpecificBlock(worldDatas.playerX + PLAYER_WIDTH / 2, worldDatas.playerY, 10) ||
    (isASpecificBlock(worldDatas.playerX + PLAYER_WIDTH / 2, worldDatas.playerY, 3) && isASpecificBlock(worldDatas.playerX + PLAYER_WIDTH / 2 + BLOCKSIZE, worldDatas.playerY, 11)) ||
    isASpecificBlock(worldDatas.playerX + PLAYER_WIDTH / 2, worldDatas.playerY, 11))) {
        worldDatas.playerX += MOVE_SPEED;
    }
    if  (isLeftPressed && (!isABlock(worldDatas.playerX - PLAYER_WIDTH / 2, worldDatas.playerY) || isASpecificBlock(worldDatas.playerX - PLAYER_WIDTH / 2, worldDatas.playerY, 6) || isASpecificBlock(worldDatas.playerX - PLAYER_WIDTH / 2, worldDatas.playerY, 10) ||
    (isASpecificBlock(worldDatas.playerX - PLAYER_WIDTH / 2, worldDatas.playerY, 3) && isASpecificBlock(worldDatas.playerX - PLAYER_WIDTH / 2 - BLOCKSIZE, worldDatas.playerY, 11)) ||
    isASpecificBlock(worldDatas.playerX - PLAYER_WIDTH / 2, worldDatas.playerY, 11)) && worldDatas.playerX - PLAYER_WIDTH / 2 >= 5) {
        worldDatas.playerX -= MOVE_SPEED;
    }
    
    // sol zombie
    if (isABlock(zombieX, zombieY + ZOMBIE_HEIGHT + zombieYVelocity) && zombieYVelocity >= 0) {
        zombieYVelocity = 0;
        gravityZombie = false;
    }else {
        zombieYVelocity += GRAVITY_FORCE;
        gravityZombie = true;
    }
    
    
    // horizontal zombie
    if (zombieX < worldDatas.playerX && (isABlock(zombieX + ZOMBIE_WIDTH, zombieY + ZOMBIE_HEIGHT / 2) || isABlock(zombieX + ZOMBIE_WIDTH, zombieY))) {
        isZombieBlockedOnSide = true;
        zombieX -= ZOMBIE_MOVE_SPEED;
    }
    if (zombieX > worldDatas.playerX && (isABlock(zombieX, zombieY + ZOMBIE_HEIGHT / 2) || isABlock(zombieX, zombieY))) {
        isZombieBlockedOnSide = true;
        zombieX += ZOMBIE_MOVE_SPEED;
    }

    //deplace le zombie
    if (zombieX > worldDatas.playerX && isZombieBlockedOnSide === false && zombieX - worldDatas.playerX > -1 && zombieX - worldDatas.playerX < ZOMBIE_FOLLOW_DISTANCE) {
        zombieX -= ZOMBIE_MOVE_SPEED;
    }
    if (zombieX < worldDatas.playerX && isZombieBlockedOnSide === false  && worldDatas.playerX - zombieX > -1 && worldDatas.playerX - zombieX < ZOMBIE_FOLLOW_DISTANCE) {
        zombieX += ZOMBIE_MOVE_SPEED;
    }
    if (gravityZombie === false && isZombieBlockedOnSide) {
        zombieYVelocity = -ZOMBIE_JUMP_FORCE;
    }
    zombieY += zombieYVelocity;
    
    //portail
    if(isClicked && worldDatas.inventory.content[usedHotbarID] === 6) {
        if (isASpecificBlock(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2 + BLOCKSIZE, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 - BLOCKSIZE, blockY + BLOCKSIZE / 2, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2 - BLOCKSIZE, blockY + BLOCKSIZE / 2 - BLOCKSIZE, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 - BLOCKSIZE, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 2, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 3, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 3, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE * 2, blockY + BLOCKSIZE / 2 - BLOCKSIZE * 2, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE * 2, blockY + BLOCKSIZE / 2 - BLOCKSIZE, 3) &&
        isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE * 2, blockY + BLOCKSIZE / 2, 3) && isASpecificBlock(blockX + BLOCKSIZE / 2 + BLOCKSIZE, blockY + BLOCKSIZE / 2 + BLOCKSIZE, 3)) {
            isANewPortal = true;
        }
    }

    //#endregion
    
    //#region DEGATS
    //degats du feux
    if (isASpecificBlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2, 6) && worldDatas.fireTime === 0) {
        worldDatas.fireTime = 299;
    }
    if (worldDatas.fireTime > 0) {
        if (worldDatas.fireTime % 100 === 0) {
            worldDatas.playerLife -= 1.5;
        }
        worldDatas.fireTime--;
    }
    //#endregion

    //#region POSER/CASSER
    // trouve le bon chunk
    var chunk = parseInt(parseInt(blockX / BLOCKSIZE) / 16) - (blockX < 0 ? 1 : 0);
    var chunkIndex = worldDatas.modifiedChunks.length;
    var netherChunkIndex = worldDatas.netherModifiedChunks.length;
    if (worldDatas.isInNether === false) {
        for (var i = 0; i < worldDatas.modifiedChunks.length; i++) {
            if (parseInt(parseInt(worldDatas.modifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (worldDatas.modifiedChunks[i][0][0] < 0 ? 1 : 0) === chunk) {
                chunkIndex = i;
            }
        }
    } else {
        for (var i = 0; i < worldDatas.netherModifiedChunks.length; i++) {
            if (parseInt(parseInt(worldDatas.netherModifiedChunks[i][0][0] / BLOCKSIZE) / 16) - (worldDatas.netherModifiedChunks[i][0][0] < 0 ? 1 : 0) === chunk) {
                netherChunkIndex = i;
            }
        }
    }

    //poser bloc
    if (worldDatas.isInNether === false) {
        if (isClicked && !isABlock(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2) && worldDatas.inventory.content[usedHotbarID] != null) {
            // si le chunk n'etait pas modifié creer le terrain
            if (worldDatas.modifiedChunks[chunkIndex] == null) {
                var terrain = [];
                for (var i = 0; i < getChunkBlocks(chunkIndex).length; i++) {
                    terrain.push(getChunkBlocks(chunkIndex)[i]);
                }
                worldDatas.modifiedChunks.push([]);
                for (var i = 0; i < terrain.length; i++) {
                    worldDatas.modifiedChunks[worldDatas.modifiedChunks.length - 1].push(terrain[i]);
                }
            }
            // poser
            if ((isABlock(blockX + BLOCKSIZE * 0.5, blockY + BLOCKSIZE * 1.5) && !isASpecificBlock(blockX + BLOCKSIZE * 0.5, blockY + BLOCKSIZE * 1.5, 6)) ||
            (isABlock(blockX + BLOCKSIZE * 0.5, blockY - BLOCKSIZE * 0.5) && !isASpecificBlock(blockX + BLOCKSIZE * 0.5, blockY - BLOCKSIZE * 0.5, 6)) ||
            (isABlock(blockX + BLOCKSIZE * 1.5, blockY + BLOCKSIZE * 0.5) && !isASpecificBlock(blockX + BLOCKSIZE * 1.5, blockY + BLOCKSIZE * 0.5, 6)) ||
            (isABlock(blockX - BLOCKSIZE * 0.5, blockY + BLOCKSIZE * 0.5) && !isASpecificBlock(blockX - BLOCKSIZE * 0.5, blockY + BLOCKSIZE * 0.5, 6)) || canPlaceAir) {
                if (chunkIndex == worldDatas.modifiedChunks.length) {
                    worldDatas.modifiedChunks.push([]);
                }
                var newBlock = [blockX, blockY, worldDatas.inventory.content[usedHotbarID], 0];
                worldDatas.modifiedChunks[chunkIndex].push(newBlock);
            }
        }
    } else {
        if (isClicked && !isABlock(blockX + BLOCKSIZE / 2, blockY + BLOCKSIZE / 2) && worldDatas.inventory.content[usedHotbarID] != null) {
            // si le chunk n'etait pas modifié creer le terrain
            if (worldDatas.netherModifiedChunks[netherChunkIndex] == null) {
                var terrain = [];
                for (var i = 0; i < getChunkBlocks(netherChunkIndex).length; i++) {
                    terrain.push(getChunkBlocks(netherChunkIndex)[i]);
                }
                worldDatas.netherModifiedChunks.push([]);
                for (var i = 0; i < terrain.length; i++) {
                    worldDatas.netherModifiedChunks[worldDatas.netherModifiedChunks.length - 1].push(terrain[i]);
                }
            }
            // poser
            if ((isABlock(blockX, blockY + BLOCKSIZE * 1.5) && !isASpecificBlock(blockX, blockY + BLOCKSIZE * 1.5, 6)) ||
            (isABlock(blockX, blockY - BLOCKSIZE * 1.5) && !isASpecificBlock(blockX, blockY - BLOCKSIZE * 1.5, 6)) ||
            (isABlock(blockX + BLOCKSIZE * 1.5, blockY) && !isASpecificBlock(blockX + BLOCKSIZE * 1.5, blockY, 6)) ||
            (isABlock(blockX - BLOCKSIZE * 1.5, blockY) && !isASpecificBlock(blockX - BLOCKSIZE * 1.5, blockY, 6)) || canPlaceAir) {
                if (netherChunkIndex == worldDatas.netherModifiedChunks.length) {
                    worldDatas.netherModifiedChunks.push([]);
                }
                var newBlock = [blockX, blockY, worldDatas.inventory.content[usedHotbarID], 0];
                worldDatas.netherModifiedChunks[netherChunkIndex].push(newBlock);
            }
        }
    }
    
    if (worldDatas.isInNether === false) {
        //place les blocs de portail
        if (isANewPortal) {
            var newBlock = [blockX, blockY, 11];
            worldDatas.modifiedChunks[chunkIndex].push(newBlock);
            var newBlock = [blockX, blockY - BLOCKSIZE, 11];
            worldDatas.modifiedChunks[chunkIndex].push(newBlock);
            var newBlock = [blockX, blockY - BLOCKSIZE * 2, 11];
            worldDatas.modifiedChunks[chunkIndex].push(newBlock);
            var newBlock = [blockX + BLOCKSIZE, blockY, 11];
            worldDatas.modifiedChunks[chunkIndex].push(newBlock);
            var newBlock = [blockX + BLOCKSIZE, blockY - BLOCKSIZE, 11];
            worldDatas.modifiedChunks[chunkIndex].push(newBlock);
            var newBlock = [blockX + BLOCKSIZE, blockY - BLOCKSIZE * 2, 11];
            worldDatas.modifiedChunks[chunkIndex].push(newBlock);
        }
    } else {
        if (worldDatas.netherModifiedChunks.length === 0) {
            //place le portail par defaut dans le nether
            var terrain = [];
            for (var i = 0; i < getChunkBlocks(playerChunk).length; i++) {
                terrain.push(getChunkBlocks(playerChunk)[i]);
            }
            worldDatas.netherModifiedChunks.push([]);
            for (var i = 0; i < terrain.length; i++) {
                worldDatas.netherModifiedChunks[worldDatas.netherModifiedChunks.length - 1].push(terrain[i]);
            }
            // creation des blocs de portail dans le nether
            //blocs de gauches
            var portalX = parseInt((worldDatas.playerX - 4 * BLOCKSIZE )/ BLOCKSIZE) * BLOCKSIZE;
            var portalY = parseInt(getYProcedural(portalX) / BLOCKSIZE) * BLOCKSIZE
            var newBlock = [portalX, portalY, 11, 0];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX, portalY - BLOCKSIZE, 11, 0];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX, portalY - BLOCKSIZE * 2, 11, 0];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            //blocs de droites
            newBlock = [portalX + BLOCKSIZE, portalY, 11, 0];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE, portalY - BLOCKSIZE, 11, 0];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE, portalY - BLOCKSIZE * 2, 11, 0];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            // creation des blocs d'obsidienne du portail dans le nether
            newBlock = [portalX, portalY + BLOCKSIZE, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX - BLOCKSIZE, portalY + BLOCKSIZE, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX - BLOCKSIZE, portalY, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX - BLOCKSIZE, portalY - BLOCKSIZE, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX - BLOCKSIZE, portalY - BLOCKSIZE * 2, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX - BLOCKSIZE, portalY - BLOCKSIZE * 3, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX, portalY - BLOCKSIZE * 3, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE, portalY - BLOCKSIZE * 3, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE * 2, portalY - BLOCKSIZE * 3, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE * 2, portalY - BLOCKSIZE * 2, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE * 2, portalY - BLOCKSIZE, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE * 2, portalY, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE * 2, portalY + BLOCKSIZE, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
            newBlock = [portalX + BLOCKSIZE, portalY + BLOCKSIZE, 3];
            worldDatas.netherModifiedChunks[playerChunk].push(newBlock);
        }

        //place les blocs de portail
        if (isANewPortal) {
            var newBlock = [blockX, blockY, 11];
            worldDatas.netherModifiedChunks[netherChunkIndex].push(newBlock);
            var newBlock = [blockX, blockY - BLOCKSIZE, 11];
            worldDatas.netherModifiedChunks[netherChunkIndex].push(newBlock);
            var newBlock = [blockX, blockY - BLOCKSIZE * 2, 11];
            worldDatas.netherModifiedChunks[netherChunkIndex].push(newBlock);
            var newBlock = [blockX + BLOCKSIZE, blockY, 11];
            worldDatas.netherModifiedChunks[netherChunkIndex].push(newBlock);
            var newBlock = [blockX + BLOCKSIZE, blockY - BLOCKSIZE, 11];
            worldDatas.netherModifiedChunks[netherChunkIndex].push(newBlock);
            var newBlock = [blockX + BLOCKSIZE, blockY - BLOCKSIZE * 2, 11];
            worldDatas.netherModifiedChunks[netherChunkIndex].push(newBlock);
        }
    }

    if (worldDatas.isInNether === false) {
        //casser bloc
        if (isRightClicked) {
            // si le chunk n'etait pas modifié creer le terrain
            if (worldDatas.modifiedChunks[chunkIndex] == null) {
                var terrain = [];
                for (var i = 0; i < getChunkBlocks(chunkIndex).length; i++) {
                    terrain.push(getChunkBlocks(chunkIndex)[i]);
                }
                worldDatas.modifiedChunks.push([]);
                for (var i = 0; i < terrain.length; i++) {
                    worldDatas.modifiedChunks[worldDatas.modifiedChunks.length - 1].push(terrain[i]);
                }
            }
            for (var i = 0; i < worldDatas.modifiedChunks[chunkIndex].length; i++) {
                if (blockX == worldDatas.modifiedChunks[chunkIndex][i][0] && blockY == worldDatas.modifiedChunks[chunkIndex][i][1]) {
                    worldDatas.modifiedChunks[chunkIndex].splice(i, 1);
                }
            }
        }
    } else {
        //casser bloc
        if (isRightClicked) {
            // si le chunk n'etait pas modifié creer le terrain
            if (worldDatas.netherModifiedChunks[netherChunkIndex] == null) {
                var terrain = [];
                for (var i = 0; i < getChunkBlocks(netherChunkIndex).length; i++) {
                    terrain.push(getChunkBlocks(netherChunkIndex)[i]);
                }
                worldDatas.netherModifiedChunks.push([]);
                for (var i = 0; i < terrain.length; i++) {
                    worldDatas.netherModifiedChunks[worldDatas.netherModifiedChunks.length - 1].push(terrain[i]);
                }
            }
            for (var i = 0; i < worldDatas.netherModifiedChunks[netherChunkIndex].length; i++) {
                if (blockX == worldDatas.netherModifiedChunks[netherChunkIndex][i][0] && blockY == worldDatas.netherModifiedChunks[netherChunkIndex][i][1]) {
                    worldDatas.netherModifiedChunks[netherChunkIndex].splice(i, 1);
                }
            }
        }
    }

    //#endregion
}

//#region INVENTAIRE
if (worldDatas.inventory.opened) {
    var cellX = parseInt((mouseScreenPosX - canvas.width / 2 + GUI_SIZE * 4.6) / GUI_SIZE) - ((mouseScreenPosX - canvas.width / 2 + GUI_SIZE * 4.6) < 0 ? 1 : 0);
    var cellY = parseInt((mouseScreenPosY - canvas.height / 2) / GUI_SIZE) - ((mouseScreenPosY - canvas.height / 2) < 0 ? 1 : 0);
    var cellI = cellX + (3 - cellY) * 9;
    if (isClicked && cellX >= 0 && cellX <= 8 && cellY >= 0 && cellY <= 3) {
        var wasInMouse = worldDatas.inventory.inMouse;
        worldDatas.inventory.inMouse = worldDatas.inventory.content[cellI];
        worldDatas.inventory.content[cellI] = wasInMouse;
    }
}
//#endregion

//#region AFFICHAGE
// clear le canvas
context.clearRect(0, 0, canvas.width, canvas.height);

//compte les image des animations
animationFrameCounter++;
borderFrameCounter++;
if (borderFrameCounter >= 1000000) {
    borderFrameCounter = 0;
}
if ((parseInt(lavaFrameCounter / 8) === 0 && lavaFrameWay === -1) || (parseInt(lavaFrameCounter / 8) === lavaAnimationFrames.length - 1 && lavaFrameWay === 1)) {
    lavaFrameWay *= -1;
}
lavaFrameCounter += lavaFrameWay;
for (var i = playerChunk - renderDistance; i <= playerChunk + renderDistance ; i++) {
    var blocks = getChunkBlocks(i);
    for (var j = 0; j < blocks.length; j++) {
        //gere le sable
        if (blocks[j][2] === 4) {
                if (isABlock(blocks[j][0] + 1, blocks[j][1] + BLOCKSIZE + 1 + blocks[j][3])) {
                    blocks[j][3] = 0;
                    blocks[j][0] = parseInt(blocks[j][0] / BLOCKSIZE) * BLOCKSIZE;
                    blocks[j][1] = parseInt(blocks[j][1] / BLOCKSIZE) * BLOCKSIZE;
                }else {
                    blocks[j][3] += GRAVITY_FORCE;
                }
                blocks[j][1] += blocks[j][3];
            }
            // dessine les blocs
            if (blocks[j][2] === 6) {
                context.drawImage(fireAnimationFrames[parseInt(animationFrameCounter / 3) % 31], blocks[j][0] - cameraX, blocks[j][1] - cameraY, BLOCKSIZE, BLOCKSIZE);  
            } else if (blocks[j][2] === 10) {
                context.drawImage(lavaAnimationFrames[parseInt(lavaFrameCounter / 8)], blocks[j][0] - cameraX, blocks[j][1] - cameraY, BLOCKSIZE, BLOCKSIZE);  
            } else if (blocks[j][2] === 11) {
                context.drawImage(portalAnimationFrames[parseInt(animationFrameCounter / 3) % 31], blocks[j][0] - cameraX, blocks[j][1] - cameraY, BLOCKSIZE, BLOCKSIZE);  
            } else {
                context.drawImage(blockTextures[blocks[j][2]], blocks[j][0] - cameraX, blocks[j][1] - cameraY, BLOCKSIZE, BLOCKSIZE);
            }
        }
        
    }

    //dessine la limite du monde
    if (playerChunk <= renderDistance) {
        for (var i = -borderFrameCounter - canvas.height * 5; i < canvas.height + worldDatas.playerY; i += BLOCKSIZE) {
            context.drawImage(forcefield, -BLOCKSIZE - cameraX, i - cameraY, BLOCKSIZE, BLOCKSIZE);
        }
    }

    //dessine le zombie
    context.drawImage(zombieSprite, zombieX - cameraX, zombieY - cameraY, ZOMBIE_WIDTH, ZOMBIE_HEIGHT);
    
    // dessine le joueur
    context.drawImage(playerSprite, worldDatas.playerX - cameraX - PLAYER_WIDTH / 2, worldDatas.playerY - cameraY - PLAYER_HEIGHT / 2, PLAYER_WIDTH, PLAYER_HEIGHT);

    // dessine le carré noir
    context.strokeSytle = "black";
    context.lineWidth = 3;
    context.strokeRect(blockX - cameraX, blockY - cameraY, 50, 50);
    
    // dessine la hotbar
    var hotbarCellSize = GUI_SIZE;
    var hotbarHeight = 20;
    var itemsMargin = 10;
    var hotbarStartX = canvas.width / 2 - hotbarCellSize * 9 / 2;
    for (var cellIndex = 0; cellIndex < 9; cellIndex ++) {
        // case
        context.drawImage(hotbarCellSprite, hotbarStartX + cellIndex * hotbarCellSize,
        canvas.height - hotbarCellSize - hotbarHeight, hotbarCellSize, hotbarCellSize);
        // item
        if(worldDatas.inventory.content[cellIndex] != null) {
            context.drawImage(blockTextures[worldDatas.inventory.content[cellIndex]], hotbarStartX + cellIndex * hotbarCellSize + itemsMargin,
            canvas.height - hotbarCellSize - hotbarHeight + itemsMargin, hotbarCellSize - 2 * itemsMargin, hotbarCellSize - 2 * itemsMargin);
        }
    }
    // selecteur
    context.drawImage(hotbarSelectorSprite, hotbarStartX + usedHotbarID * hotbarCellSize,
    canvas.height - hotbarCellSize - hotbarHeight, hotbarCellSize, hotbarCellSize);
        
    // dessine les coeurs
    var heartSize = GUI_SIZE / 2;
    var heartHeight = 80;
    for (var heartIndex = 0; heartIndex < worldDatas.playerLife; heartIndex ++) {
        context.drawImage(fullHeartSprite, hotbarStartX + heartIndex * heartSize,
        canvas.height - heartSize - heartHeight, heartSize, heartSize);
        if (worldDatas.playerLife / 0.5 % 2 != 0 && (heartIndex === worldDatas.playerLife - 1 || heartIndex === worldDatas.playerLife - 0.5)) {
            context.drawImage(halfHeartSprite, hotbarStartX + heartIndex * heartSize,
            canvas.height - heartSize - heartHeight, heartSize, heartSize);
        }
        if (worldDatas.playerLife < 10 && (heartIndex === worldDatas.playerLife - 1 || heartIndex === worldDatas.playerLife - 0.5)) {
            for (var heartIndex = worldDatas.playerLife; heartIndex < 10; heartIndex ++) {
                if (worldDatas.playerLife / 0.5 % 2 != 0 && heartIndex === worldDatas.playerLife) {
                    heartIndex += 0.5;
                }
                if (heartIndex != 10) {
                    context.drawImage(emptyHeartSprite, hotbarStartX + heartIndex * heartSize,
                    canvas.height - heartSize - heartHeight, heartSize, heartSize);
                }
            }
        }
    }

    // dessine l'inventaire
    var inventorySizeX = GUI_SIZE * 10
    var inventorySizeY = 166 * inventorySizeX / 176;
    if (worldDatas.inventory.opened) {
        context.drawImage(
        inventorySprite,
        canvas.width / 2 - inventorySizeX / 2,
        canvas.height / 2 - inventorySizeY / 2,
        inventorySizeX,
        inventorySizeY
        );
        // content
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 9; x++) {
                if(worldDatas.inventory.content[x + (y + 1) * 9] != null) {
                    context.drawImage(
                        blockTextures[worldDatas.inventory.content[x + (y + 1) * 9]],
                        canvas.width / 2 - inventorySizeX / 2 + GUI_SIZE * 0.55 + GUI_SIZE * x * 1.02,
                        canvas.height / 2 + inventorySizeY / 2 - GUI_SIZE * 2.55 - GUI_SIZE * y,
                        GUI_SIZE * 0.75,
                        GUI_SIZE * 0.75
                        );
                }
            }
        }
        // hotbar
        for (var i = 0; i < 9; i++) {
            if(worldDatas.inventory.content[i] != null) {
                context.drawImage(
                    blockTextures[worldDatas.inventory.content[i]],
                    canvas.width / 2 - inventorySizeX / 2 + GUI_SIZE * 0.55 + GUI_SIZE * i * 1.02,
                    canvas.height / 2 + inventorySizeY / 2 - GUI_SIZE * 1.3,
                    GUI_SIZE * 0.75,
                    GUI_SIZE * 0.75
                    );
            }
        }
        // in mouse
        if (worldDatas.inventory.inMouse != null) {
            context.drawImage(
                blockTextures[worldDatas.inventory.inMouse],
                mouseScreenPosX - GUI_SIZE * 0.75 / 2,
                mouseScreenPosY - GUI_SIZE * 0.75 / 2,
                GUI_SIZE * 0.75,
                GUI_SIZE * 0.75
                );
        }
    }
    //#endregion

    //#region SAUVEGARDE
    if (!reseted) {localStorage.setItem("datas", JSON.stringify(worldDatas));}
    //#endregion

    isClicked = false;
    isRightClicked = false;
    isZombieBlockedOnSide = false;
    isANewPortal = false;
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
    if (e.which === 32 && isABlock(worldDatas.playerX, worldDatas.playerY + PLAYER_HEIGHT / 2 + 5)) {
        worldDatas.playerYVelocity = -JUMP_FORCE;
    }
    // enventaire (e)
    if (e.which === 69) {
        worldDatas.inventory.opened = !worldDatas.inventory.opened;
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
