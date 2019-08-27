//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Sokoban.js                                                    //
//  Project   : js_demos                                                      //
//  Date      : Aug 15, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Just a simple sokoban game...                                            //
//---------------------------------------------------------------------------~//


function ResetGame(level)
{
    levelInfo = new LevelInfo();

    camera = new Camera();
    city = new City(0, Canvas_Edge_Bottom);

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

//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let city;
let explosionMgr;
let enemyMissilesMgr;
let defenderMissilesMgr;
let defenderReticle;
let levelInfo;
let camera;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Setup()
{
    ResetGame();
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    Canvas_ClearWindow("black");

    //
    // Update
    city           .update(dt);
    defenderReticle.update(dt);

    enemyMissilesMgr.update(dt);
    if(defenderReticle.isShooting && defenderMissilesMgr.canShoot()) {
        defenderMissilesMgr.shoot(defenderReticle.position);
        defenderReticle    .shoot();
        camera.addPlayerShootShake();
    }

    defenderMissilesMgr.update(dt);
    explosionMgr   .update(dt);


    //
    // Check Collisions
    for(let i = enemyMissilesMgr.missiles.length-1; i >= 0; --i) {
        let enemy_missile = enemyMissilesMgr.missiles[i];

        // (Player Missiles vs Enemy Missiles)
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
                enemyMissilesMgr.killMissile(i);
                camera.addPlayerExplosionShake(player_explosion.radius);
            }
        }

        // (Enemy Missiles vs Player Cities)
        let min_y = (city.position.y - BUILDING_HEIGHT - 10);
        if(enemy_missile.currPosition.y < min_y) {
            continue;
        }

        // Find the closest building...
        let min_distance             = Infinity;
        let building_to_be_destroyed = null;
        for(let j = 0; j < city.buildings.length; ++j) {
            let building = city.buildings[j];
            if(building.isBeingDestroyed) {
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

        building_to_be_destroyed.destroy();
        enemyMissilesMgr.killMissile(i);
        camera.addBuildingExplosionShake();
    }



    camera.update(dt);

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

        explosionMgr.draw();
        defenderReticle.draw();
    Canvas_Pop();
}


//----------------------------------------------------------------------------//
// Input                                                                      //
//----------------------------------------------------------------------------//
function KeyDown(code)
{
}


//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Canvas_Setup({
    main_title        : "Simple Snake",
    main_date         : "Aug 10, 2019",
    main_version      : "v0.0.1",
    main_instructions : "<br><b>arrow keys</b> to move the snake<br><b>R</b> to start a new game.",
    main_link: "<a href=\"http://stdmatt.com/demos/startfield.html\">More info</a>"
});
