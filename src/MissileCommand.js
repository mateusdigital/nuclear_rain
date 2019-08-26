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




//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let enemyMissilesGen;
let defenderReticle;
let defenderMissilesGen;
let city;
let explosionManager;

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Setup()
{

    city = new City(0, Canvas_Edge_Bottom);

    defenderMissilesGen = new DefenderMissileGenerator(
        city.shootingPosition.x,
        city.shootingPosition.y
    );

    defenderReticle = new DefenderReticle(
        defenderMissilesGen.shootingPosition.x,
        defenderMissilesGen.shootingPosition.y - RETICLE_SHOOTING_POSITION_Y_GAP
    );

    enemyMissilesGen = new EnemyMissileGenerator();

    explosionManager = new ExplosionManager();
}



//------------------------------------------------------------------------------
function Draw(dt)
{
    Canvas_ClearWindow("black");

    //
    // Update
    city            .update(dt);
    enemyMissilesGen.update(dt);
    defenderReticle .update(dt);
    explosionManager.update(dt);

    if(defenderReticle.isShooting && defenderMissilesGen.canShoot()) {
        defenderMissilesGen.shoot(defenderReticle.position);
        defenderReticle    .shoot();
    }
    defenderMissilesGen.update(dt);

    //
    // Check Collisions
    for(let i = 0; i < enemyMissilesGen.missiles.length; ++i) {
        let enemy_missile = enemyMissilesGen.missiles[i];
        for(let j = 0; j < explosionManager.playerExplosions.length; ++j) {
            let player_explosion = explosionManager.playerExplosions[j];
            let collided = Math_CircleContainsPoint(
                player_explosion.position.x,
                player_explosion.position.y,
                player_explosion.radius,
                enemy_missile.currPosition.x,
                enemy_missile.currPosition.y
            );

            if(collided) {

                enemyMissilesGen.killMissile(i);
                explosionManager.addOtherExplosion(
                    enemy_missile.currPosition.x,
                    enemy_missile.currPosition.y
                );
            }
        }
    }


    //
    // Draw
    city.draw();

    enemyMissilesGen   .draw();
    defenderMissilesGen.draw();

    explosionManager.draw();

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
