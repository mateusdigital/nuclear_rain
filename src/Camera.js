//----------------------------------------------------------------------------//
// Camera                                                                     //
//----------------------------------------------------------------------------//
const AMPLITUDE = 50;

//------------------------------------------------------------------------------
class Camera
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.startPosition = Vector_Create(0, 0);
        this.currPosition  = Vector_Copy(this.startPosition);

        this.playerExplosionShakes = [];
        this.playerShootShakes     = [];
    } // ctor

    //--------------------------------------------------------------------------
    addPlayerShootShake()
    {
        let s = new Shake(0.5, AMPLITUDE);
        this.playerShootShakes.push(s);
    } // addPlayerShootShake

    //--------------------------------------------------------------------------
    addPlayerExplosionShake(radius)
    {
        let s = new Shake(1.0, radius);
        this.playerExplosionShakes.push(s);
    } // addPlayerExplosionShake

    //--------------------------------------------------------------------------
    update(dt)
    {
        let x = this._updateShakes(this.playerExplosionShakes, dt);
        this.currPosition.x = x * 5;

        let y = this._updateShakes(this.playerShootShakes, dt);
        this.currPosition.y = y * 5;
    } // update

    //--------------------------------------------------------------------------
     _updateShakes(arr, dt)
     {
         let v = 0;
         for(let i = arr.length - 1; i >= 0; --i) {
             let s = arr[i];
             s.update(dt);

             if(s.done) {
                 Array_RemoveAt(arr, i);
                 continue;
             }

             v += s.value();
         }

         return v;
     } // _updateShakes
}; // class Camera
