//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Sokoban.js                                                    //
//  Project   : js_demos                                                      //
//  Date      : Aug 15, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2019                                                //
//                                                                            //
//  Description :                                                             //
//   Just a simple sokoban game...                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Helper Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function
LoadFont(fontFace, path)
{
    let font_face = new FontFace(
        fontFace,
        "url(" + path + ")"
    );
    Log("before await");
    await font_face.load();
    document.fonts.add(font_face);
    Log("after await");
}

//------------------------------------------------------------------------------
function ChangeStateToSplash()
{
    drawFunc    = StateSplash_Draw;
    keyDownFunc = StateSplash_KeyDown;
    StateSplash_Setup();
}

//------------------------------------------------------------------------------
function ChangeStateToGame()
{
    drawFunc    = StateGame_Draw;
    keyDownFunc = null;
    StateGame_Setup();
}

//------------------------------------------------------------------------------
function ChangeStateToGameOver()
{
    drawFunc    = StateGameOver_Draw;
    keyDownFunc = StateGameOver_KeyDown;
    StateGameOver_Setup();
}

//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let resourcesLoaded = false;
let drawFunc        = null;
let keyDownFunc     = null;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function Setup()
{
    await LoadFont("vector_battleregular", "./css/vectorb-webfont.woff");
    resourcesLoaded = true;

    ChangeStateToSplash();
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    if(resourcesLoaded && drawFunc != null) {
        drawFunc(dt);
    }
}


//----------------------------------------------------------------------------//
// Input                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function KeyDown(code)
{
    if(keyDownFunc != null) {
        keyDownFunc(code);
    }
}


//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Canvas_Setup({
    main_title        : "Simple Snake",
    main_date         : "Aug 10, 2019",
    main_version      : "v0.0.1",
    main_instructions : "<br><b>arrow keys</b> to move the snake<br><b>R</b> to start a new game.",
    main_link: "<a href=\"http://stdmatt.com/demos/startfield.html\">More info</a>"
});
