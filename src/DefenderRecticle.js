//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const RETICLE_MOVE_SPEED              = 300;
const RETICLE_SHOOTING_POSITION_Y_GAP = 20;
const RETICLE_RADIUS                  = 5;

//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
class DefenderReticle
{
    //--------------------------------------------------------------------------
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);
        this.rotation = 0;

        this.timeToRotate    = 0.3;
        this.maxTimeToRotate = 0.3;
    } // ctor


    //--------------------------------------------------------------------------
    shoot()
    {
        this.timeToRotate = 0;
    } // shoot

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


        this.timeToRotate += dt;
        if(this.timeToRotate >= this.maxTimeToRotate) {
            this.timeToRotate = this.maxTimeToRotate;
            this.rotation     = 0;
            this.color        = "white";
        } else {
            let ratio = this.timeToRotate / this.maxTimeToRotate;
            this.rotation = Math_Lerp(MATH_2PI, 0, ratio);
            this.color    = chroma.hsl(ratio * 360, 1.0, 0.5);
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            Canvas_Rotate(this.rotation);
            Canvas_Scale(1 + (1 - (this.timeToRotate / this.maxTimeToRotate)));


            Canvas_SetStrokeSize(2);
            Canvas_SetStrokeStyle(this.color);


            Canvas_DrawCircle(0, 0, RETICLE_RADIUS);

            Canvas_DrawLine(0, -RETICLE_RADIUS * 2, 0, -RETICLE_RADIUS);
            Canvas_DrawLine(0, +RETICLE_RADIUS * 2, 0, +RETICLE_RADIUS);

            Canvas_DrawLine(-RETICLE_RADIUS * 2, 0, -RETICLE_RADIUS, 0);
            Canvas_DrawLine(+RETICLE_RADIUS * 2, 0, +RETICLE_RADIUS, 0);
        Canvas_Pop();
    } // draw
}; // class DefenderReticle
