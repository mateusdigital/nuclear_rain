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

    city = new City(0, Canvas_Edge_Bottom);

    defenderMissilesMgr = new DefenderMissileManager(
        city.shootingPosition.x,
        city.shootingPosition.y
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
    }

    defenderMissilesMgr.update(dt);
    explosionMgr   .update(dt);

    //
    // Check Collisions
    for(let i = 0; i < enemyMissilesMgr.missiles.length; ++i) {
        let enemy_missile = enemyMissilesMgr.missiles[i];
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
            }
        }
    }


    //
    // Draw
    city.draw();

    enemyMissilesMgr   .draw();
    defenderMissilesMgr.draw();

    explosionMgr.draw();
    defenderReticle.draw();
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
