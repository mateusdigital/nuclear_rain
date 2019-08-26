
// Building
const BUILDING_WIDTH            = 15;
const BUILDING_HEIGHT           = 25;
const BUILDING_MIN_RANDOM_GAP_Y = 3;
const BUILDING_MAX_RANDOM_GAP_Y = 15;
const BUILDING_START_GAP_X      = 50;
const BUILDING_GAP_X            = 80;


class Building
{
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);
    }

    update(dt)
    {

    }

    draw()
    {
        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);

            Canvas_SetFillStyle("black");
            Canvas_FillRect(
                -BUILDING_WIDTH  / 2,
                -BUILDING_HEIGHT / 2,
                BUILDING_WIDTH,
                BUILDING_HEIGHT
            );

            Canvas_SetStrokeStyle("magenta");
            Canvas_SetStrokeSize(2);
            Canvas_DrawRect(
                -BUILDING_WIDTH  / 2,
                -BUILDING_HEIGHT / 2,
                BUILDING_WIDTH,
                BUILDING_HEIGHT
            );
        Canvas_Pop();
    }
}
