//----------------------------------------------------------------------------//
// Defender Missiles Manager                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const DEFENDER_GENERATOR_MAX_MISSILES        = 10
const DEFENDER_GENERATOR_MAX_SHOOT_TIME      = 0.5;
const DEFENDER_GENERATOR_MAX_ACTIVE_MISSILES = 3;


//------------------------------------------------------------------------------
class DefenderMissileManager
{
    //--------------------------------------------------------------------------
    constructor(x, y)
    {
        this.shootingPosition = Vector_Create(x, y);

        this.missiles = [];

        this.shotMissiles    = 0;
        this.maxShotMissiles = DEFENDER_GENERATOR_MAX_MISSILES;

        this.shootTime    = 0;
        this.maxShootTime = DEFENDER_GENERATOR_MAX_SHOOT_TIME;
    } // ctor

    //--------------------------------------------------------------------------
    canShoot()
    {
        //
        // We can't shoot missiles now...
        let active_missiles = this.missiles.length + explosionMgr.playerExplosions.length;
        if(active_missiles   >= DEFENDER_GENERATOR_MAX_ACTIVE_MISSILES ||
           this.shotMissiles >= this.maxShotMissiles                   ||
           this.shootTime    <  this.maxShootTime)
         {
             return false;
         }

         return true;
    }

    //--------------------------------------------------------------------------
    shoot(targetPosition)
    {
        if(!this.canShoot()) {
            return;
        }

        ++this.shotMissiles;
        this.shootTime = 0;

        let missile = new DefenderMissile(this.shootingPosition, targetPosition);
        this.missiles.push(missile);
    } // shoot

    //--------------------------------------------------------------------------
    update(dt)
    {   //
        // Timer.
        this.shootTime += dt;

        //
        // Missiles.
        for(let i = this.missiles.length-1; i >= 0; --i) {
            // Update
            let m = this.missiles[i];
            m.update(dt);

            // Remove
            if(!m.done) {
                continue;
            }

            Array_RemoveAt(this.missiles, i);
            explosionMgr.addPlayerExplosion(
                m.endPosition.x,
                m.endPosition.y
            );
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        for(let i = 0, len = this.missiles.length; i < len; ++i) {
            this.missiles[i].draw();
        }
    } // draw
}; // class DefenderMissileManager


//----------------------------------------------------------------------------//
// Defender Missile                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const DEFENDER_MISSILE_TRAVEL_SPEED = 400;
const DEFENDER_MISSILE_MIN_RADIUS   = 5;
const DEFENDER_MISSILE_MAX_RADIUS   = 50;

const DEFENDER_MISSILE_MIN_ACTIVATE_DISTANCE = 10;
const DEFENDER_MISSILE_EXPLOSION_DURATION    = 5;

//------------------------------------------------------------------------------
class DefenderMissile
{
    //--------------------------------------------------------------------------
    constructor(startPos, targetPos)
    {
        this.startPosition = Vector_Copy(startPos);
        this.currPosition  = Vector_Copy(startPos);
        this.endPosition   = Vector_Copy(targetPos);

        let d = Vector_Sub(this.endPosition, this.startPosition);
        this.direction = Vector_Unit(d);

        this.radius = DEFENDER_MISSILE_MIN_RADIUS;
        this.color  = "white";

        this.done = false;
    } // ctor


    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.done) {
            return;
        }

        this.currPosition.x += this.direction.x * DEFENDER_MISSILE_TRAVEL_SPEED * dt;
        this.currPosition.y += this.direction.y * DEFENDER_MISSILE_TRAVEL_SPEED * dt;

        // Missile is inside the bounds to explode...
        let d = Vector_Distance(this.currPosition, this.endPosition);
        if (d <= DEFENDER_MISSILE_MIN_ACTIVATE_DISTANCE) {
            this.done = true;
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        if(this.done) {
            return;
        }

        Canvas_Push();
            Canvas_Translate(this.currPosition.x, this.currPosition.y);

            Canvas_SetFillStyle("magenta");
            Canvas_FillCircle(0, 0, 3);

            Canvas_SetFillStyle(this.color);
            Canvas_FillCircle(0, 0, this.radius);
        Canvas_Pop();
    } // draw
}; // class DefenderMissile
