// RR030307466BR

//----------------------------------------------------------------------------//
// Enemy Missile Manager                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class EnemyMissileManager
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.missiles = [];

        this.shotMissiles    = 0;
        this.maxShotMissiles = levelInfo.enemyMissileManager_maxShotMissiles;

        this.activeMissiles    = 0;
        this.maxActiveMissiles = levelInfo.enemyMissileManager_maxActiveMissiles;

        this.timeToSpawnMissile    = 0;
        this.maxTimeToSpawnMissile = levelInfo.enemyMissileManager_maxTimeToSpawnMissile;

        this.done = false;
    } // ctor

    //--------------------------------------------------------------------------
    killMissile(index)
    {
        let m = this.missiles[index];
        Array_RemoveAt(this.missiles, index);

        explosionMgr.addOtherExplosion(m.currPosition.x, m.currPosition.y);
        --this.activeMissiles;
    } // killMissile

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.done) {
            return;
        }
        if(this.activeMissiles == 0 && this.shotMissiles >= this.maxShotMissiles) {
            this.done = true;
        }

        //
        // Generate new missiles.
        if(this.activeMissiles < this.maxActiveMissiles && this.shotMissiles < this.maxShotMissiles) {
            this.timeToSpawnMissile -= dt;
            if(this.timeToSpawnMissile <= 0) {
                // Reset the spawn timer.
                this.timeToSpawnMissile = Random_Number(0, this.maxTimeToSpawnMissile);

                // Create a new missile.
                this.missiles.push(new EnemyMissile());
                ++this.activeMissiles;
                ++this.shotMissiles;
            }
        }

        //
        // Update the current missiles.
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
}; // EnemyMissileManager


//----------------------------------------------------------------------------//
// Enemy Missile                                                              //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const ENEMY_MISSILE_TRAIL_STROKE_SIZE = 3;
const ENEMY_MISSILE_TRAIL_HEAD_RADIUS = 3;

//------------------------------------------------------------------------------
class EnemyMissile
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.startPosition = this._randomizeStartPosition();
        this.endPosition   = this._randomizeEndPosition  ();
        this.currPosition  = Vector_Copy(this.startPosition);

        this.angle = this._randomizeAngle();
        this.speed = levelInfo.enemyMissile_speed;

        this.headColor  = levelInfo.enemyMissile_headColor;
        this.trailColor = levelInfo.enemyMissile_trailColor;

        this.done = false;
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.done) {
           return;
        }

        //
        // Update Position.
        this.currPosition.x += Math_Cos(this.angle) * this.speed * dt;
        this.currPosition.y += Math_Sin(this.angle) * this.speed * dt;
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        if(this.done) {
            return;
         }

        let sx = this.startPosition.x;
        let sy = this.startPosition.y;
        let cx = this.currPosition.x;
        let cy = this.currPosition.y;

        Canvas_Push()
            // @TODO(stdmatt): Debug draw...
            // Canvas_SetStrokeStyle("gray");
            // Canvas_SetStrokeSize(2);
            // Canvas_DrawLine(sx, sy, this.endPosition.x, this.endPosition.y);

            //
            // Trail
            Canvas_SetStrokeStyle(this.trailColor);
            Canvas_SetStrokeSize(ENEMY_MISSILE_TRAIL_STROKE_SIZE);
            Canvas_DrawLine(sx, sy, cx, cy);

            //
            // Head
            Canvas_SetFillStyle(this.headColor);
            Canvas_FillCircle(cx, cy, ENEMY_MISSILE_TRAIL_HEAD_RADIUS);
        Canvas_Pop();
    } // draw


    //--------------------------------------------------------------------------
    _randomizeStartPosition()
    {
        let x = Random_Int(Canvas_Edge_Left, Canvas_Edge_Right);
        return Vector_Create(x, Canvas_Edge_Top);
    } // _randomizeStartPosition

    //--------------------------------------------------------------------------
    _randomizeEndPosition()
    {
        let x = Random_Int(Canvas_Edge_Left, Canvas_Edge_Right);
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
