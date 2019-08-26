
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
