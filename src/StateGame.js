//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : StateGame.js                                                  //
//  Project   : nuclear_rain                                                  //
//  Date      : Aug 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
function CheckCollisions_PlayerMissiles_Vs_EnemyMissile(index)
{
    let enemy_missile = enemyMissilesMgr.missiles[index];

    for(let j = 0; j < explosionMgr.playerExplosions.length; ++j) {
        let player_explosion = explosionMgr.playerExplosions[j];
        let collided = Math_CircleContainsPoint(
            player_explosion.position.x,
            player_explosion.position.y,
            player_explosion.radius,
            enemy_missile.currPosition.x,
            enemy_missile.currPosition.y
        );

        if(collided) {
            enemyMissilesMgr.killMissile(index);
            camera.addPlayerExplosionShake(player_explosion.radius);

            return true;
        }
    }

    return false;
}

//------------------------------------------------------------------------------
function CheckCollisions_PlayerCity_Vs_EnemyMissile(index)
{
    let enemy_missile = enemyMissilesMgr.missiles[index];

    let min_y = (city.position.y - BUILDING_HEIGHT - 10);
    if(enemy_missile.currPosition.y < min_y || city.done) {
        return false;
    }

    // Find the closest building...
    let min_distance             = Infinity;
    let building_to_be_destroyed = null;

    for(let j = 0; j < city.buildings.length; ++j) {
        let building = city.buildings[j];
        if(building.isBeingDestroyed || building.done) {
            continue;
        }

        let d = Math_DistanceSqr(
            enemy_missile.currPosition.x,
            enemy_missile.currPosition.y,
            building.position.x,
            building.position.y
        );

        if(d < min_distance) {
            building_to_be_destroyed = building;
            min_distance             = d;
        }
    }


    if(building_to_be_destroyed) {
        building_to_be_destroyed.destroy();
    }
    enemyMissilesMgr.killMissile(index);
    camera.addBuildingExplosionShake();

    return true;
}

//------------------------------------------------------------------------------
function CheckCollisions()
{
    for(let i = enemyMissilesMgr.missiles.length-1; i >= 0; --i) {
        let collided = CheckCollisions_PlayerMissiles_Vs_EnemyMissile(i);
        if(collided) {
            continue;
        }

        collided = CheckCollisions_PlayerCity_Vs_EnemyMissile(i);
        if(collided) {
            continue;
        }
    }
}


//------------------------------------------------------------------------------
function CheckShooting()
{
    if(defenderReticle.isShooting && defenderMissilesMgr.canShoot()) {
        defenderMissilesMgr.shoot(defenderReticle.position);
        defenderReticle    .shoot();

        camera.addPlayerShootShake();
    }
}


//------------------------------------------------------------------------------
function ResetGame(level)
{
    keyboard = [];
    levelInfo = new LevelInfo(1);

    camera = new Camera();
    city   = new City(0, Canvas_Edge_Bottom);

    defenderMissilesMgr = new DefenderMissileManager(
        city.position.x,
        city.position.y
    );

    defenderReticle = new DefenderReticle(
        defenderMissilesMgr.shootingPosition.x,
        defenderMissilesMgr.shootingPosition.y - RETICLE_SHOOTING_POSITION_Y_GAP
    );

    enemyMissilesMgr = new EnemyMissileManager();
    explosionMgr     = new ExplosionManager   ();
}

//------------------------------------------------------------------------------
function CheckGameOver()
{
    if(city.done) {
        ChangeStateToGameOver();
    }
}

function CheckNextLevel()
{
    if(!enemyMissilesMgr.done) {
        return;
    }

    levelInfo        = new LevelInfo(levelInfo.level + 1);
    enemyMissilesMgr = new EnemyMissileManager();
}

//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let levelInfo;
let city;
let explosionMgr;
let enemyMissilesMgr;
let defenderMissilesMgr;
let defenderReticle;
let camera;
let keyboard = [];


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function StateGame_Setup()
{
    ResetGame();
}

//------------------------------------------------------------------------------
function StateGame_Draw(dt)
{
    Canvas_ClearWindow(camera.color);

    //
    // Update
    city               .update(dt);
    defenderReticle    .update(dt);
    enemyMissilesMgr   .update(dt);
    defenderMissilesMgr.update(dt);
    explosionMgr       .update(dt);
    camera             .update(dt);

    CheckShooting  ();
    CheckCollisions();
    CheckGameOver  ();
    CheckNextLevel ();

    //
    // Draw
    Canvas_Push();
        Canvas_Translate(camera.currPosition.x, camera.currPosition.y);
        city.draw();
    Canvas_Pop();

    Canvas_Push();
        Canvas_Translate(camera.currPosition.x, 0);

        enemyMissilesMgr   .draw();
        defenderMissilesMgr.draw();
        explosionMgr       .draw();
        defenderReticle    .draw();
    Canvas_Pop();
}

//------------------------------------------------------------------------------
function StateGame_KeyDown(code)
{
    keyboard[code] = true;
    console.log("code down", code)
}

//------------------------------------------------------------------------------
function StateGame_KeyUp(code)
{
    keyboard[code] = false;
    console.log("code up", code)
}

