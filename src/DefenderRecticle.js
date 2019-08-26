//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const RETICLE_MOVE_SPEED = 300;
const RETICLE_SHOOTING_POSITION_Y_GAP = 20;


//----------------------------------------------------------------------------//
// Types                                                                      //
//----------------------------------------------------------------------------//
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
