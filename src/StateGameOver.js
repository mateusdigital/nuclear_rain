
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
        let text = new Text("We Lost", 50, "vector_battleregular");
        textWeLost = new TextEffect(
            text,
            Vector_Create(0, Canvas_Edge_Top -text.height),
            Vector_Create(0, -text.height / 2),
            1
        );
    }

    textMsg = new Text(
        "In a nuclear war there are no winners",
        15,
        "vector_battleregular"
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
    if(textWeLost.done && code == KEY_SPACE) {
        ChangeStateToSplash();
    }
}
