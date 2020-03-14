//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Explosion.js                                                  //
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
// Explosion Manager                                                          //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class ExplosionManager
{
    //--------------------------------------------------------------------------
    constructor()
    {
        this.playerExplosions = [];
        this.otherExplosions  = [];
    } // ctor

    //-------------------------------------------------------------------------
    addPlayerExplosion(x, y)
    {
        let e = new Explosion(
            x, y,
            DEFENDER_MISSILE_MIN_RADIUS, DEFENDER_MISSILE_MAX_RADIUS,
            DEFENDER_MISSILE_EXPLOSION_DURATION
        );
        this.playerExplosions.push(e);
    } // addPlayerExplosion

    //--------------------------------------------------------------------------
    addOtherExplosion(x, y)
    {
        let e = new Explosion(
            x, y,
            DEFENDER_MISSILE_MIN_RADIUS, DEFENDER_MISSILE_MAX_RADIUS / 2,
            DEFENDER_MISSILE_EXPLOSION_DURATION / 2
        );
        this.otherExplosions.push(e);
    } // addOtherExplosion

    //--------------------------------------------------------------------------
    update(dt)
    {
        // Player
        for(let i = this.playerExplosions.length -1; i >= 0; --i) {
            let e = this.playerExplosions[i];
            e.update(dt);

            if(e.done) {
                Array_RemoveAt(this.playerExplosions, i);
            }
        }

        // Other
        for(let i = this.otherExplosions.length -1; i >= 0; --i) {
            let e = this.otherExplosions[i];
            e.update(dt);

            if(e.done) {
                Array_RemoveAt(this.otherExplosions, i);
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        // Player
        for(let i = this.playerExplosions.length -1; i >= 0; --i) {
            let e = this.playerExplosions[i];
            e.draw();
        }

        // Other
        for(let i = this.otherExplosions.length -1; i >= 0; --i) {
            let e = this.otherExplosions[i];
            e.draw();
        }
    } // draw
}; // class ExplosionManager


//----------------------------------------------------------------------------//
// Explosion                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class Explosion
{
    //--------------------------------------------------------------------------
    constructor(x, y, minRadius, maxRadius, duration)
    {
        this.position = Vector_Create(x, y);

        this.minRadius = minRadius;
        this.maxRadius = maxRadius;
        this.radius    = minRadius;

        this.timeToExplode    = 0;
        this.maxTimeToExplode = duration;

        this.done = false;
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.done) {
            return;
        }

        this.timeToExplode += dt;
        if (this.timeToExplode >= this.maxTimeToExplode) {
            this.timeToExplode = this.maxTimeToExplode;
            this.done          = true;
            return;
        }

        //
        // Radius
        let radius_ratio = this.timeToExplode / this.maxTimeToExplode;
        let r = Math_Sin(MATH_PI * radius_ratio);
        this.radius = r * this.maxRadius;

        //
        // Color
        let color_ratio = this.timeToExplode / (this.maxTimeToExplode / 20);
        color_ratio *= 360
        if(color_ratio > 360){
            color_ratio %= 360;
        }

        this.color = chroma.hsl(color_ratio , 1, 0.5);
    } // update


    //--------------------------------------------------------------------------
    draw()
    {
        if(this.done) {
            return;
        }

        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            Canvas_SetFillStyle(this.color);
            Canvas_FillCircle(0, 0, this.radius);
        Canvas_Pop();
    } // draw
}; // class Explosion
