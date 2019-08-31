
//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let textMissile;
let textCommand;
let keyboardText;
let mouseText;


//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function StateSplash_Setup()
{
    // Missile Text
    {
        let text = new Text("NUCLEAR", 50, "vector_battleregular");
        textMissile = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Top -text.height),
            Vector_Create(0, -text.height / 2),
            1
        );
    }

    // Missile Command
    {
        let text = new Text("RAIN", 50, "vector_battleregular");
        textCommand = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Bottom + text.height),
            Vector_Create(0, 50),
            1
        );
    }

    keyboardText = new Text("[Keyboard] Press space", 15, "vector_battleregular");
    mouseText    = new Text("[Mouse] Click any button", 15, "vector_battleregular");
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
        let y = Canvas_Edge_Bottom - 50;
        keyboardText.drawAt(0, y);

        y +=  keyboardText.height + 10;
        mouseText.drawAt(0, y);
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
