//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : MissileCommand.js                                             //
//  Project   : nuclear_rain                                                  //
//  Date      : Aug 25, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const INPUT_METHOD_INVALID  = -1;
const INPUT_METHOD_KEYBOARD =  0;
const INPUT_METHOD_MOUSE    =  1;

//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let resourcesLoaded = false;
let drawFunc        = null;
let keyDownFunc     = null;
let keyUpFunc       = null;
let mouseClickFunc  = null;
let inputMethod     = INPUT_METHOD_INVALID;
let is_first_click  = true;


let BIG_TEXT_FONT_NAME   = null;
let SMALL_TEXT_FONT_NAME = null;

let BIG_TEXT_FONT_SIZE   = null;
let SMALL_TEXT_FONT_SIZE = null;


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
    console.log("before await");
    await font_face.load();
    document.fonts.add(font_face);
    console.log("after await");
}

//------------------------------------------------------------------------------
function ChangeStateToSplash()
{
    inputMethod = INPUT_METHOD_INVALID;

    drawFunc       = StateSplash_Draw;
    keyDownFunc    = StateSplash_KeyDown;
    keyUpFunc      = null;
    mouseClickFunc = StateSplash_MouseClick;

    StateSplash_Setup();
}

//------------------------------------------------------------------------------
function ChangeStateToGame()
{
    drawFunc       = StateGame_Draw;
    keyDownFunc    = StateGame_KeyDown;
    keyUpFunc      = StateGame_KeyUp;
    mouseClickFunc = null;

    StateGame_Setup();
}

//------------------------------------------------------------------------------
function ChangeStateToGameOver()
{
    drawFunc       = StateGameOver_Draw;
    keyDownFunc    = StateGameOver_KeyDown;
    keyUpFunc      = null;
    mouseClickFunc = StateGameOver_MouseClick;

    StateGameOver_Setup();
}

//------------------------------------------------------------------------------
function InitializeCanvas()
{
    //
    // Configure the Canvas.
    const parent        = document.getElementById("canvas_div");
    const parent_width  = parent.clientWidth;
    const parent_height = parent.clientHeight;

    const max_side = Math_Max(parent_width, parent_height);
    const min_side = Math_Min(parent_width, parent_height);

    const ratio = min_side / max_side;
    const DESIGN_WIDTH  = 1000;
    const DESIGN_HEIGHT = 1000;
    // Landscape
    if(parent_width > parent_height) {
        Canvas_CreateCanvas(DESIGN_WIDTH, DESIGN_WIDTH* ratio, parent);
    }
    // Portrait
    else {
        Canvas_CreateCanvas(DESIGN_WIDTH * ratio, DESIGN_HEIGHT, parent);
    }

    Canvas.style.width  = "100%";
    Canvas.style.height = "100%";
}




//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
async function Setup()
{
    Random_Seed(null);
    InitializeCanvas();

    Input_InstallBasicMouseHandler(Canvas);
    Input_InstallBasicKeyboardHandler();

    await LoadFont('edit_undo_line_brkregular',  './res/edunline-webfont.woff2' )
    await LoadFont('digitalixregular',           './res/digitalix-webfont.woff2')

    BIG_TEXT_FONT_NAME   = "edit_undo_line_brkregular";
    SMALL_TEXT_FONT_NAME = "digitalixregular";

    BIG_TEXT_FONT_SIZE   = 80;
    SMALL_TEXT_FONT_SIZE = 12;

    resourcesLoaded = true;

    ChangeStateToSplash();
    Canvas_Start();
}

//------------------------------------------------------------------------------
function Draw(dt)
{
    if(resourcesLoaded && drawFunc != null) {
        drawFunc(dt);
    }
    Mouse_IsClicked = false;
}


//----------------------------------------------------------------------------//
// Input                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function OnKeyDown(event)
{
    const code = event.keyCode;
    if(keyDownFunc != null) {
        keyDownFunc(code);
    }
}

function OnKeyUp(event)
{
    const code = event.keyCode;
    if(keyUpFunc != null) {
        keyUpFunc(code);
    }
}


//------------------------------------------------------------------------------
function OnMouseClick()
{
    if(is_first_click) {
        is_first_click = false;
        return;
    }
    if(mouseClickFunc != null) {
        mouseClickFunc();
    }
}


//----------------------------------------------------------------------------//
// Entry Point                                                                //
//----------------------------------------------------------------------------//
Setup();
