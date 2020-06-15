//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : StateSplash.js                                                //
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
let textMissile;
let textCommand;
let keyboardText;
let mouseText;
let versionText;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function StateSplash_Setup()
{
    // Missile Text
    {
        let text = new Text("NUCLEAR", BIG_TEXT_FONT_SIZE, BIG_TEXT_FONT_NAME);
        textMissile = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Top -text.height),
            Vector_Create(0, -text.height / 2),
            1
        );
    }

    // Missile Command
    {
        let text = new Text("RAIN", BIG_TEXT_FONT_SIZE, BIG_TEXT_FONT_NAME);
        textCommand = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Bottom + text.height),
            Vector_Create(0, 50),
            1
        );
    }

    keyboardText = new Text("[Keyboard] Press space",   SMALL_TEXT_FONT_SIZE, SMALL_TEXT_FONT_NAME);
    mouseText    = new Text("[Mouse] Click any button", SMALL_TEXT_FONT_SIZE, SMALL_TEXT_FONT_NAME);

    const version = String_Cat("v", NUCLEAR_RAIN_VERSION, " - stdmatt MMXX - GPLv3");
    versionText = new Text(version, 10, "Arial");
}

//------------------------------------------------------------------------------
function StateSplash_Draw(dt)
{
    Canvas_ClearWindow("black");

    textMissile.update(dt);
    textCommand.update(dt);

    textMissile.draw();
    textCommand.draw();

    if(textMissile.done && textCommand.done) {
        Canvas_SetFillStyle("white");
        let y = Canvas_Edge_Bottom - 80;
        keyboardText.drawAt(0, y);

        y += keyboardText.height + 10;
        mouseText.drawAt(0, y);

        y += mouseText.height + 15;
        versionText.drawAt(0, y);
    }
}

//------------------------------------------------------------------------------
function StateSplash_KeyDown(code)
{
    if(textMissile.done && textCommand.done && code == KEY_SPACE) {
        inputMethod = INPUT_METHOD_KEYBOARD;
        ChangeStateToGame();
    }
}

//------------------------------------------------------------------------------
function StateSplash_MouseClick(code)
{
    if(textMissile.done) {
        inputMethod = INPUT_METHOD_MOUSE;
        ChangeStateToGame();
    }
}
