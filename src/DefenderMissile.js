//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const DEFENDER_MISSILE_STATE_TRAVELING = 0;
const DEFENDER_MISSILE_STATE_EXPLODING = 1;
const DEFENDER_MISSILE_STATE_DEAD      = 2;

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
    constructor(startPos, targetPos) {
        this.startPosition = Vector_Copy(startPos);
        this.currPosition = Vector_Copy(startPos);
        this.endPosition = Vector_Copy(targetPos);
        this.state = DEFENDER_MISSILE_STATE_TRAVELING;
        this.radius = DEFENDER_MISSILE_MIN_RADIUS;
        this.timeToExplode = 0;
        this.maxTimeToExplode = DEFENDER_MISSILE_EXPLOSION_DURATION;
        let d = Vector_Sub(this.endPosition, this.startPosition);
        this.direction = Vector_Unit(d);
    } // ctor
    //--------------------------------------------------------------------------
    update(dt) {
        if (this.state == DEFENDER_MISSILE_STATE_DEAD) {
            return;
        }
        else if (this.state == DEFENDER_MISSILE_STATE_TRAVELING) {
            this.currPosition.x += this.direction.x * DEFENDER_MISSILE_TRAVEL_SPEED * dt;
            this.currPosition.y += this.direction.y * DEFENDER_MISSILE_TRAVEL_SPEED * dt;
            let d = Vector_Distance(this.currPosition, this.endPosition);
            if (d <= DEFENDER_MISSILE_MIN_ACTIVATE_DISTANCE) {
                this.state = DEFENDER_MISSILE_STATE_EXPLODING;
            }
        }
        else if (this.state == DEFENDER_MISSILE_STATE_EXPLODING) {
            this.timeToExplode += dt;
            if (this.timeToExplode >= this.maxTimeToExplode) {
                this.state = DEFENDER_MISSILE_STATE_DEAD;
            }
            else {
                let r = Math_Sin(MATH_PI * this.timeToExplode / this.maxTimeToExplode);
                this.radius = r * DEFENDER_MISSILE_MAX_RADIUS;
            }
        }
    } // update
    //--------------------------------------------------------------------------
    draw() {
        Canvas_SetFillStyle("magenta");
        Canvas_FillCircle(this.endPosition.x, this.endPosition.y, 3);
        Canvas_SetFillStyle("blue");
        Canvas_FillCircle(this.currPosition.x, this.currPosition.y, this.radius);
    } // draw
}
; // class DefenderMissile
