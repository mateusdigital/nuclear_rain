// RR030307466BR

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
