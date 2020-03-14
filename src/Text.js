//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Text.js                                                       //
//  Project   : nuclear_rain                                                  //
//  Date      : Aug 27, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Text                                                                       //
//----------------------------------------------------------------------------//
class Text
{
    //--------------------------------------------------------------------------
    constructor(str, fontSize, font)
    {
        this.str      = str;
        this.fontSize = fontSize;
        this.font     = font;
        this.fontStr  = String_Cat(fontSize, "pt ", font);

        Canvas_Push();
            CurrContext.font = this.fontStr;
            this.width  = CurrContext.measureText(str).width;
            this.height = parseInt(CurrContext.font);
        Canvas_Pop();
    } // ctor

    //--------------------------------------------------------------------------
    drawAt(x, y)
    {
        Canvas_Push();
            Canvas_Translate(x, y);
            CurrContext.font = this.fontStr;
            CurrContext.fillText(this.str, -this.width / 2, this.height / 2);
        Canvas_Pop();
    } // draw
};

//----------------------------------------------------------------------------//
// Text Effect                                                                //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
class TextEffect
{
    //--------------------------------------------------------------------------
    constructor(text, startPos, endPos, duration)
    {
        this.text = text;

        this.startPosition = Vector_Copy(startPos);
        this.currPosition  = Vector_Copy(startPos);
        this.endPosition   = Vector_Copy(endPos);

        this.currTime = 0;
        this.maxTime  = duration;

        this.timeToChangeColor    = 0;
        this.maxTimeToChangeColor = 0.08;

        this.color = "red";
        this.done  = false;
    } // ctor


    //--------------------------------------------------------------------------
    update(dt)
    {
        if(this.done) {
            this.timeToChangeColor += dt;
            if(this.timeToChangeColor >= this.maxTimeToChangeColor) {
                this.timeToChangeColor = 0;
                this.color = chroma.random();
            }
            return;
        }

        this.currTime += dt;
        if(this.currTime >= this.maxTime) {
            this.currTime = this.maxTime;
            this.done = true;
        }

        let ratio = this.currTime / this.maxTime;
        this.currPosition.x = Math_Lerp(this.startPosition.x, this.endPosition.x, ratio);
        this.currPosition.y = Math_Lerp(this.startPosition.y, this.endPosition.y, ratio);
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        Canvas_Push();
            Canvas_SetFillStyle(this.color);
            Canvas_Translate(this.currPosition.x, this.currPosition.y);
            this.text.drawAt(0, 0);
            if(this.done) {
                this.text.drawAt(this.timeToChangeColor * 2, 2);
            }
        Canvas_Pop();
    } // draw
}; // class TextEffect
