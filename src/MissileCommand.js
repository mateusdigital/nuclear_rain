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
// Constants                                                                  //
//----------------------------------------------------------------------------//
// Reticle
const RETICLE_MOVE_SPEED = 300;
const RETICLE_SHOOTING_POSITION_Y_GAP = 20;

// Defender Missile
const DEFENDER_MISSILE_STATE_TRAVELING = 0;
const DEFENDER_MISSILE_STATE_EXPLODING = 1;
const DEFENDER_MISSILE_STATE_DEAD      = 2;

const DEFENDER_MISSILE_TRAVEL_SPEED = 400;
const DEFENDER_MISSILE_MIN_RADIUS   = 5;
const DEFENDER_MISSILE_MAX_RADIUS   = 50;

const DEFENDER_MISSILE_MIN_ACTIVATE_DISTANCE = 10;
const DEFENDER_MISSILE_EXPLOSION_DURATION    = 5;

// Defender Generator
const DEFENDER_GENERATOR_MAX_ACTIVE_MISSILES = 3;
const DEFENDER_GENERATOR_MAX_MISSILES        = 10;
const DEFENDER_GENERATOR_MAX_SHOOT_TIME      = 0.8;

// Building
const BUILDING_WIDTH            = 15;
const BUILDING_HEIGHT           = 25;
const BUILDING_MIN_RANDOM_GAP_Y = 3;
const BUILDING_MAX_RANDOM_GAP_Y = 15;
const BUILDING_START_GAP_X      = 50;
const BUILDING_GAP_X            = 80;

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class EnemyMissile
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.startPosition = this._randomizeStartPosition();
        this.endPosition   = this._randomizeEndPosition  ();
        this.currPosition  = Vector_Copy(this.startPosition);
        this.angle         = this._randomizeAngle();
        this.isDead        = false;
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.isDead) {
           return;
        }

        this.currPosition.x += Math_Cos(this.angle) * 20 * dt;
        this.currPosition.y += Math_Sin(this.angle) * 20 * dt;
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        if(this.isDead) {
            return;
         }

        let sx = this.startPosition.x;
        let sy = this.startPosition.y;
        let cx = this.currPosition.x;
        let cy = this.currPosition.y;

        Canvas_Push()
            Canvas_SetStrokeStyle("gray");
            Canvas_SetStrokeSize(2);
            Canvas_DrawLine(sx, sy, this.endPosition.x, this.endPosition.y);

            // Trail
            Canvas_SetStrokeStyle("red");
            Canvas_SetStrokeSize(4);
            Canvas_DrawLine(sx, sy, cx, cy);

            // Head
            Canvas_SetFillStyle("white");
            Canvas_FillCircle(cx, cy, 3);
        Canvas_Pop();
    } // draw


    //--------------------------------------------------------------------------
    _randomizeStartPosition()
    {
        let x = Math_RandomInt(Canvas_Edge_Left, Canvas_Edge_Right);
        return Vector_Create(x, Canvas_Edge_Top);
    } // _randomizeStartPosition

    //--------------------------------------------------------------------------
    _randomizeEndPosition()
    {
        let x = Math_RandomInt(Canvas_Edge_Left, Canvas_Edge_Right);
        return Vector_Create(x, Canvas_Edge_Bottom);
    } // _randomizeEndPosition

    //--------------------------------------------------------------------------
    _randomizeAngle()
    {
        let d = Vector_Sub(this.endPosition, this.startPosition);
        let a = Math.atan2(d.y, d.x);

        return a;
    } // _randomizeAngle

}; // class EnemyMissile


//------------------------------------------------------------------------------
class EnemyMissileGenerator
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.missiles = [];

        this.activeMissiles    = 0;
        this.maxActiveMissiles = 3;

        this.timeToSpawnMissile    = 0;
        this.maxTimeToSpawnMissile = 2;
    } // ctor

    //--------------------------------------------------------------------------
    killMissile(index)
    {
        this.missiles[index].isDead = true;
        --this.activeMissiles;
    } // killMissile


    //--------------------------------------------------------------------------
    update(dt)
    {
        //
        // Remove killed missiles.
        for(let i = this.missiles.length-1; i >= 0; --i) {
            if(this.missiles[i].isDead) {
                Array_RemoveAt(this.missiles, i);
            }
        }

        //
        // Generate new missiles.
        if(this.activeMissiles < this.maxActiveMissiles) {
            this.timeToSpawnMissile += dt;
            if(this.timeToSpawnMissile > this.maxTimeToSpawnMissile) {
                this.timeToSpawnMissile = 0;
                this.maxTimeToSpawnMissile = Math_RandomInt(1, 3);
                this.missiles.push(new EnemyMissile());
                ++this.activeMissiles;
            }
        }

        for(let i = 0, len = this.missiles.length; i < len; ++i) {
            this.missiles[i].update(dt);
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        for(let i = 0, len = this.missiles.length; i < len; ++i) {
            this.missiles[i].draw();
        }
    } // draw
}; // EnemyMissileGenerator


//------------------------------------------------------------------------------
class DefenderReticle
{
    //--------------------------------------------------------------------------
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        //
        // Movement
        if(Keyboard[KEY_RIGHT]) {
            this.position.x += RETICLE_MOVE_SPEED * dt;
        }
        if(Keyboard[KEY_LEFT]) {
            this.position.x -= RETICLE_MOVE_SPEED * dt;
        }

        if(Keyboard[KEY_DOWN]) {
            this.position.y += RETICLE_MOVE_SPEED * dt;
        }
        if(Keyboard[KEY_UP]) {
            this.position.y -= RETICLE_MOVE_SPEED * dt;
        }

        //
        // Shooting
        this.isShooting = Keyboard[KEY_SPACE];

        //
        // Bounds Checking
        if(this.position.x <= Canvas_Edge_Left) {
            this.position.x = Canvas_Edge_Left;
        } else if(this.position.x >= Canvas_Edge_Right) {
            this.position.x = Canvas_Edge_Right;
        }
        if(this.position.y <= Canvas_Edge_Top) {
            this.position.y = Canvas_Edge_Top;
        } else if(this.position.y >= Canvas_Edge_Bottom) {
            this.position.y = Canvas_Edge_Bottom;
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_SetFillStyle("green");
        Canvas_FillCircle(this.position.x, this.position.y, 5);
    } // draw
}; // class DefenderReticle


//-----------------------------------------------------------------------------
class DefenderMissile
{
    //--------------------------------------------------------------------------
    constructor(startPos, targetPos)
    {
        this.startPosition = Vector_Copy(startPos);
        this.currPosition  = Vector_Copy(startPos);
        this.endPosition   = Vector_Copy(targetPos);

        this.state  = DEFENDER_MISSILE_STATE_TRAVELING;
        this.radius = DEFENDER_MISSILE_MIN_RADIUS;

        this.timeToExplode    = 0;
        this.maxTimeToExplode = DEFENDER_MISSILE_EXPLOSION_DURATION;

        let d = Vector_Sub(this.endPosition, this.startPosition);
        this.direction = Vector_Unit(d);
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.state == DEFENDER_MISSILE_STATE_DEAD) {
            return;
        } else if(this.state == DEFENDER_MISSILE_STATE_TRAVELING) {
            this.currPosition.x += this.direction.x * DEFENDER_MISSILE_TRAVEL_SPEED * dt;
            this.currPosition.y += this.direction.y * DEFENDER_MISSILE_TRAVEL_SPEED * dt;

            let d = Vector_Distance(this.currPosition, this.endPosition);
            if(d <= DEFENDER_MISSILE_MIN_ACTIVATE_DISTANCE) {
                this.state = DEFENDER_MISSILE_STATE_EXPLODING;
            }
        } else if(this.state == DEFENDER_MISSILE_STATE_EXPLODING) {
            this.timeToExplode += dt;
            if(this.timeToExplode >= this.maxTimeToExplode) {
                this.state = DEFENDER_MISSILE_STATE_DEAD;
            } else {
                let r = Math_Sin(MATH_PI * this.timeToExplode / this.maxTimeToExplode);
                this.radius = r * DEFENDER_MISSILE_MAX_RADIUS;
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_SetFillStyle("magenta");
        Canvas_FillCircle(this.endPosition.x, this.endPosition.y, 3);

        Canvas_SetFillStyle("blue");
        Canvas_FillCircle(this.currPosition.x, this.currPosition.y, this.radius);
    } // draw
}; // class DefenderMissile


//------------------------------------------------------------------------------
class DefenderMissileGenerator
{
    //--------------------------------------------------------------------------
    constructor(x, y)
    {
        this.shootingPosition = Vector_Create(x, y);

        this.missiles = [];

        this.activeMissiles    = 0;
        this.maxActiveMissiles = DEFENDER_GENERATOR_MAX_ACTIVE_MISSILES;

        this.shotMissiles    = 0;
        this.maxShotMissiles = DEFENDER_GENERATOR_MAX_MISSILES;

        this.shootTime    = 0;
        this.maxShootTime = DEFENDER_GENERATOR_MAX_SHOOT_TIME;
    } // ctor

    //--------------------------------------------------------------------------
    shoot(targetPosition)
    {
        // We can't shoot missiles now...
        if(this.activeMissiles >= this.maxActiveMissiles ||
           this.shotMissiles   >= this.maxShotMissiles   ||
           this.shootTime      <  this.maxShootTime)
        {
            return;
        }

        ++this.shotMissiles;
        ++this.activeMissiles;
        this.shootTime = 0;

        this.missiles.push(
            new DefenderMissile(this.shootingPosition, targetPosition)
        );
    } // shoot

    //--------------------------------------------------------------------------
    update(dt)
    {
        // Update the shoot cooldown timer.
        this.shootTime += dt;

        for(let i = this.missiles.length-1; i >= 0; --i) {
            // Update
            let m = this.missiles[i];
            m.update(dt);

            // Remove
            if(m.state == DEFENDER_MISSILE_STATE_DEAD) {
                --this.activeMissiles;
                Array_RemoveAt(this.missiles, i);
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        for(let i = 0, len = this.missiles.length; i < len; ++i) {
            this.missiles[i].draw();
        }
    } // draw
}; // class DefenderMissileGenerator


class Building
{
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);
    }

    update(dt)
    {

    }

    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);

            Canvas_SetFillStyle("black");
            Canvas_FillRect(
                -BUILDING_WIDTH  / 2,
                -BUILDING_HEIGHT / 2,
                BUILDING_WIDTH,
                BUILDING_HEIGHT
            );

            Canvas_SetStrokeStyle("magenta");
            Canvas_SetStrokeSize(2);
            Canvas_DrawRect(
                -BUILDING_WIDTH  / 2,
                -BUILDING_HEIGHT / 2,
                BUILDING_WIDTH,
                BUILDING_HEIGHT
            );
        Canvas_Pop();
    }
}

class City
{

    _createBuildings(building_y)
    {
        const BUILDINGS_COUNT = 6;
        let half_buildings_count = BUILDINGS_COUNT / 2;

        //
        // Left Buildings.
        for(let i = 0; i < half_buildings_count; ++i) {
            let building_x = -(BUILDING_START_GAP_X) - (i * BUILDING_GAP_X + BUILDING_WIDTH / 2);
            let gap_y      = Math_Random(BUILDING_MIN_RANDOM_GAP_Y, BUILDING_MAX_RANDOM_GAP_Y);
            let b          = new Building(building_x, building_y - gap_y);

            this.buildings.push(b);
        }

        //
        // Right Buildings.
        for(let i = 0; i < half_buildings_count; ++i) {
            let building_x =  (BUILDING_START_GAP_X) + (i * BUILDING_GAP_X - BUILDING_WIDTH/2);
            let gap_y      = Math_Random(BUILDING_MIN_RANDOM_GAP_Y, BUILDING_MAX_RANDOM_GAP_Y);
            let b          = new Building(building_x, building_y - gap_y);

            this.buildings.push(b);
        }

        this.buildings = this.buildings.sort(function(a, b) {
            if(a.position.x < b.position.x) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    _createTerrain()
    {
        Noise_Seed(Math.random());

        this.terrain.push(Canvas_Edge_Left);
        this.terrain.push(Canvas_Edge_Bottom);

        for(let i = 0; i < this.buildings.length; ++i) {
            let building = this.buildings[i];

            let building_left  = building.position.x - (BUILDING_WIDTH / 2);
            let building_right = building.position.x + (BUILDING_WIDTH / 2);

            let building_bottom = building.position.y + (BUILDING_HEIGHT / 2);
            building_bottom += Math_RandomInt(-10, 0);


            let last_terrain_x = Array_Get(this.terrain, -2);
            let last_terrain_y = Array_Get(this.terrain, -1);
            let distance = (building_left - last_terrain_x);
            let steps    = 6;
            let incr     = distance / steps;

            for(let x = last_terrain_x + incr; x < building_left; x += incr) {
                this.terrain.push(x);

                let y = Noise_Perlin2(x, building_bottom) * 10 + building_bottom;
                this.terrain.push(y);
            }


            this.terrain.push(building_left)
            this.terrain.push(building_bottom);

            this.terrain.push(building_right)
            this.terrain.push(building_bottom);
        }

        this.terrain.push(Canvas_Edge_Right);
        this.terrain.push(Canvas_Edge_Bottom);
    }

    constructor(x, y)
    {
        this.shootingPosition = Vector_Create(x, y);

        this.buildings = [];
        this.terrain   = [];

        this._createBuildings(y - BUILDING_HEIGHT - 10);
        this._createTerrain();
    }

    update(dt)
    {
        for(let i = 0, len = this.buildings.length; i < len; ++i) {
            this.buildings[i].update(dt);
        }
    }

    draw()
    {

        Canvas_Push();
        Canvas_SetStrokeStyle("cyan");
        Canvas_SetStrokeSize(2);
        Canvas_DrawShape(this.terrain, false);


        Canvas_Pop();

        for(let i = 0, len = this.buildings.length; i < len; ++i) {
            this.buildings[i].draw();
        }
    }

}; // class City


//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let enemyMissilesGen;
let defenderReticle;
let defenderMissilesGen;
let city;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Setup()
{
    // debugger;
    Noise_Seed(10);
    let v = Noise_Perlin2(100, 200)
    Log(v)
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

    if(defenderReticle.isShooting) {
        defenderMissilesGen.shoot(defenderReticle.position);
    }
    defenderMissilesGen.update(dt);

    //
    // Check Collisions
    for(let i = 0; i < enemyMissilesGen.missiles.length; ++i) {
        let enemy_missile = enemyMissilesGen.missiles[i];
        for(let j = 0; j < defenderMissilesGen.missiles.length; ++j) {
            let defender_missile = defenderMissilesGen.missiles[j];
            let collided = Math_CircleContainsPoint(
                defender_missile.currPosition.x,
                defender_missile.currPosition.y,
                defender_missile.radius,
                enemy_missile.currPosition.x,
                enemy_missile.currPosition.y
            );

            if(collided) {
                enemyMissilesGen.killMissile(i);
            }
        }
    }


    //
    // Draw
    city               .draw();
    enemyMissilesGen   .draw();
    defenderMissilesGen.draw();
    defenderReticle    .draw();
}


//----------------------------------------------------------------------------//
// Input                                                                      //
//----------------------------------------------------------------------------//
function KeyDown(code)
{

}


Canvas_Setup({
    main_title        : "Simple Snake",
    main_date         : "Aug 10, 2019",
    main_version      : "v0.0.1",
    main_instructions : "<br><b>arrow keys</b> to move the snake<br><b>R</b> to start a new game.",
    main_link: "<a href=\"http://stdmatt.com/demos/startfield.html\">More info</a>"
});

//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
