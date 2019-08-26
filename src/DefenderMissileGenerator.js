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

        this.shotMissiles    = 0;
        this.maxShotMissiles = DEFENDER_GENERATOR_MAX_MISSILES;

        this.shootTime    = 0;
        this.maxShootTime = DEFENDER_GENERATOR_MAX_SHOOT_TIME;
    } // ctor

    //--------------------------------------------------------------------------
    canShoot()
    {
        // We can't shoot missiles now...
        let active_missiles = this.missiles.length + explosionManager.playerExplosions.length;
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
    {
        // Update the shoot cooldown timer.
        this.shootTime += dt;

        for(let i = this.missiles.length-1; i >= 0; --i) {
            // Update
            let m = this.missiles[i];
            m.update(dt);

            // Remove
            if(m.done) {
                Array_RemoveAt(this.missiles, i);
                explosionManager.addPlayerExplosion(
                    m.endPosition.x,
                    m.endPosition.y
                );
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
