//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Camera.js                                                     //
//  Project   : nuclear_rain                                                  //
//  Date      : Aug 26, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

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

        this.playerExplosionShakes      = [];
        this.playerShootShakes          = [];
        this.addBuildingExplosionShakes = [];

        this.color = chroma.hsl(0, 1, 1);
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
    addBuildingExplosionShake()
    {
        let s = new Shake(5.0, AMPLITUDE * 5);
        this.addBuildingExplosionShakes.push(s);
    } // addBuildingExplosionShake

    //--------------------------------------------------------------------------
    update(dt)
    {
        let x = 0;
        let y = 0;
        let v = 0;

        x = this._updateShakes(this.playerExplosionShakes,      dt);
        y = this._updateShakes(this.playerShootShakes,          dt);
        v = this._updateShakes(this.addBuildingExplosionShakes, dt);

        this.currPosition.x = (x + v) * 5;
        this.currPosition.y = (y + v) * 5;

        this.color = this.color.set('hsl.l', v / 4);
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
