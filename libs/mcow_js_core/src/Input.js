//----------------------------------------------------------------------------//
//                               *       +                                    //
//                         '                  |                               //
//                     ()    .-.,="``"=.    - o -                             //
//                           '=/_       \     |                               //
//                        *   |  '=._    |                                    //
//                             \     `=./`,        '                          //
//                          .   '=.__.=' `='      *                           //
//                 +                         +                                //
//                      O      *        '       .                             //
//                                                                            //
//  File      : Input.js                                                      //
//  Project   : n4                                                            //
//  Date      : 2025-03-17                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2025                                         //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
const KEY_UP    = 38;
const KEY_DOWN  = 40;
const KEY_LEFT  = 37;
const KEY_RIGHT = 39;

const KEY_SPACE = 32;

const KEY_A = 97;
const KEY_W = 119;
const KEY_S = 115;
const KEY_D = 100;
const KEY_R = 114;

//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let Mouse_X              = 0;
let Mouse_Y              = 0;
let Mouse_IsClicked      = false;
let Mouse_IsRightClicked = false;
let Mouse_IsDown         = false;
let Mouse_WheelY         = 0;

// @bug(stdmatt): Mouse_IsClicked never gets false after the mouse clicks
// first time. We need to find a way to make sure that the click remains
// only for the frame.

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Input_InstallBasicMouseHandler(htmlElement)
{
  if (Utils_IsNullOrUndefined(htmlElement)) {
    htmlElement = window;
  }

  // Move
  htmlElement.addEventListener("mousemove", function(e) {
    var r = htmlElement.getBoundingClientRect();
    if (htmlElement === document.body) {
      Mouse_X = e.clientX;
      Mouse_Y = e.clientY;
    }
    else {
      Mouse_X = (e.clientX - r.left) / (r.right - r.left) * htmlElement.width;
      Mouse_Y = (e.clientY - r.top) / (r.bottom - r.top) * htmlElement.height;
    }

    if (typeof (OnMouseMove) == "function") {
      OnMouseMove();
    }
  }, false);

  // Left Mouse Click
  htmlElement.addEventListener("click", event => {
    Mouse_IsClicked = true;
    if (typeof (OnMouseClick) == "function") {
      OnMouseClick();
    }
  });

  // Right Mouse Click
  htmlElement.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    Mouse_IsRightClicked = true;
    if (typeof (OnMouseRightClick) == "function") {
      OnMouseRightClick();
    }
  }, false);

  // Mouse Down
  htmlElement.addEventListener("mousedown", event => {
    Mouse_IsDown = true;
    if (typeof (OnMouseDown) == "function") {
      OnMouseDown();
    }
  });

  // Mouse Up
  htmlElement.addEventListener("mouseup", event => {
    Mouse_IsDown = false;
    if (typeof (OnMouseUp) == "function") {
      OnMouseUp();
    }
  });

  // Mouse Whell
  htmlElement.addEventListener("wheel", event => {
    // Mouse_WheelX += event.wheelDeltaX;
    Mouse_WheelY += event.wheelDeltaY;
    if (typeof (OnMouseWheel) == "function") {
      OnMouseWheel(event.wheelDeltaX, event.wheelDeltaY);
    }
  });
}

//------------------------------------------------------------------------------
function Input_InstallBasicKeyboardHandler(htmlElement)
{
  if (Utils_IsNullOrUndefined(htmlElement)) {
    htmlElement = window;
  }

  // Keydown.
  htmlElement.addEventListener('keydown', (event) => {
    if (typeof (OnKeyDown) == "function") {
      OnKeyDown(event);
    }
  });

  // Keyup.
  htmlElement.addEventListener('keyup', (event) => {
    if (typeof (OnKeyUp) == "function") {
      OnKeyUp(event);
    }
  });
}
