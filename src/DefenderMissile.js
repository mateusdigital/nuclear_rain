//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const DEFENDER_MISSILE_TRAVEL_SPEED = 400;
const DEFENDER_MISSILE_MIN_RADIUS   = 5;
const DEFENDER_MISSILE_MAX_RADIUS   = 50;

const DEFENDER_MISSILE_MIN_ACTIVATE_DISTANCE = 10;
const DEFENDER_MISSILE_EXPLOSION_DURATION    = 5;


//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
//-----------------------------------------------------------------------------
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
        this.done   = false;
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
        Canvas_Push();
            Canvas_Translate(this.currPosition.x, this.currPosition.y);

            Canvas_SetFillStyle("magenta");
            Canvas_FillCircle(0, 0, 3);

            Canvas_SetFillStyle(this.color);
            Canvas_FillCircle(0, 0, this.radius);
        Canvas_Pop();
    } // draw
}
; // class DefenderMissile
