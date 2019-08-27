


//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let textMissile;
let textCommand;

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function StateSplash_Setup()
{
    // Missile Text
    {
        let text = new Text("MISSILE", 50, "vector_battleregular");
        textMissile = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Top -text.height),
            Vector_Create(0, -text.height / 2),
            1
        );
    }

    // Missile Command
    {
        let text = new Text("COMMAND", 50, "vector_battleregular");
        let y = textMissile.endPosition.y + textMissile.text.height;
        textCommand = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Bottom + text.height),
            Vector_Create(0, y),
            1
        );
    }
}

//------------------------------------------------------------------------------
function StateSplash_Draw(dt)
{
    Canvas_ClearWindow("black");

    textMissile.update(dt);
    textCommand.update(dt);

    textMissile.draw();
    textCommand.draw();
}
