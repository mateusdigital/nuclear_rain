//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : StateGameOver.js                                              //
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
// Globals                                                                    //
//----------------------------------------------------------------------------//
let textWeLost;
let textMsg;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function StateGameOver_Setup()
{
    // WeLost Text
    {
        let text = new Text("We Lost", BIG_TEXT_FONT_SIZE, BIG_TEXT_FONT_NAME);
        textWeLost = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Top -text.height),
            Vector_Create(0, -text.height / 2),
            1
        );
    }

    textMsg = new Text(
        "In a nuclear war there are no winners",
        SMALL_TEXT_FONT_SIZE,
        SMALL_TEXT_FONT_NAME
    );
}

//------------------------------------------------------------------------------
function StateGameOver_Draw(dt)
{
    Canvas_ClearWindow("black");

    textWeLost.update(dt);
    textWeLost.draw();

    if(textWeLost.done) {
        Canvas_SetFillStyle("white");
        textMsg.drawAt(0, textWeLost.endPosition.y + textWeLost.text.height);
    }
}

//------------------------------------------------------------------------------
function StateGameOver_KeyDown(code)
{
    if(inputMethod != INPUT_METHOD_KEYBOARD) {
        return;
    }

    if(textWeLost.done && code == KEY_SPACE) {
        ChangeStateToSplash();
    }
}

//------------------------------------------------------------------------------
function StateGameOver_MouseClick(code)
{
    if(inputMethod != INPUT_METHOD_MOUSE) {
        return;
    }

    if(textWeLost.done) {
        ChangeStateToSplash();
    }
}
