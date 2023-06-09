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
function HideMousePointer()
{

    document.getElementById("canvas_div").style.cursor = "none";
}

//------------------------------------------------------------------------------
function ShowMousePointer ()
{
    document.getElementById("canvas_div").style.cursor = "auto";
}

//------------------------------------------------------------------------------
function ChangeStateToSplash()
{
    inputMethod = INPUT_METHOD_INVALID;

    drawFunc       = StateSplash_Draw;
    keyDownFunc    = StateSplash_KeyDown;
    keyUpFunc      = null;
    mouseClickFunc = StateSplash_MouseClick;

    ShowMousePointer ()
    StateSplash_Setup();
}

//------------------------------------------------------------------------------
function ChangeStateToGame()
{
    drawFunc       = StateGame_Draw;
    keyDownFunc    = StateGame_KeyDown;
    keyUpFunc      = StateGame_KeyUp;
    mouseClickFunc = null;

    HideMousePointer()
    StateGame_Setup ();
}

//------------------------------------------------------------------------------
function ChangeStateToGameOver()
{
    drawFunc       = StateGameOver_Draw;
    keyDownFunc    = StateGameOver_KeyDown;
    keyUpFunc      = null;
    mouseClickFunc = StateGameOver_MouseClick;

    ShowMousePointer   ()
    StateGameOver_Setup();
}



//------------------------------------------------------------------------------
let originalWidth  = 800;
let originalHeight = 600;

//------------------------------------------------------------------------------
function InitializeCanvas(){
    const canvas = document.getElementById("canvas_div");

    // Less area - let just be the size.
    const area = originalWidth * originalHeight;
    const window_area = innerWidth * innerHeight;

    console.log("area : ", area);
    console.log("warea: ", window_area);

    if(window_area < area) {
        originalWidth  = Math.max(innerWidth, originalWidth);
        originalHeight = Math.max(innerHeight, originalHeight);
        console.log("Less area");
    } else {
        const ratio_w = innerWidth / originalWidth;
        const ratio_h = innerHeight / originalHeight;

        const new_w = originalWidth * ratio_w;
        const new_h = originalHeight * ratio_h;

        originalWidth = Math.min(new_h, originalWidth);
        originalHeight = Math.min(new_h, originalHeight);

        console.log("Scaled");
    }

    Canvas_CreateCanvas(originalWidth, originalHeight, canvas);
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
}

function resizeCanvas(){
    const canvas = document.querySelector("canvas");

    const parentWidth  = canvas.parentElement.clientWidth;
    const parentHeight = Math.min(canvas.parentElement.clientHeight, window.innerHeight);

    const fitSize = scale_to_fit(
        originalWidth,
        originalHeight,
        parentWidth   - 40,
        parentHeight  - 40
        );

    // css
    canvas.style.width  = fitSize.width  + "px";
    canvas.style.height = fitSize.height + "px";

    console.log(fitSize, window.innerWidth, window.innerHeight);
}

function scale_to_fit(originalWidth, originalHeight, parentWidth, parentHeight) {
    const aspectRatio          = originalWidth / originalHeight;
    const containerAspectRatio = parentWidth / parentHeight;

    let width, height;

    if (containerAspectRatio > aspectRatio) {
        width = parentHeight * aspectRatio;
        height = parentHeight;
    } else {
        width = parentWidth;
        height = parentWidth / aspectRatio;
    }

    return { width, height };
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

    await LoadFont('edit_undo_line_brkregular',  './fonts/edunline-webfont.woff2' )
    await LoadFont('digitalixregular',           './fonts/digitalix-webfont.woff2')

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
