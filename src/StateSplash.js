
//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let textMissile;
let textCommand;
let textPressAnyKey;


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

    textPressAnyKey = new Text("Press [SPACE] Key", 15, "vector_battleregular");
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
        textPressAnyKey.drawAt(0, Canvas_Edge_Bottom - 40);
    }
}

//------------------------------------------------------------------------------
function StateSplash_KeyDown(code)
{
    if(textMissile.done && textCommand.done && code == KEY_SPACE) {
        ChangeStateToGame();
    }
}
