//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const DEFENDER_GENERATOR_MAX_ACTIVE_MISSILES = 3;
const DEFENDER_GENERATOR_MAX_MISSILES        = 10;
const DEFENDER_GENERATOR_MAX_SHOOT_TIME      = 0.8;


//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
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
    canShoot()
    {
        // We can't shoot missiles now...
        if(this.activeMissiles >= this.maxActiveMissiles ||
            this.shotMissiles   >= this.maxShotMissiles   ||
            this.shootTime      <  this.maxShootTime)
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
