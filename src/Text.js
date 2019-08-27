
class Text
{
    constructor(str, fontSize, font)
    {
        this.str      = str;
        this.fontSize = fontSize;
        this.font     = font;
        this.fontStr  = String_Cat(fontSize, "pt ", font);

        Canvas_Push();
            CurrContext.font = this.fontStr;
            this.width  = CurrContext.measureText(str).width;
            this.height = parseInt(CurrContext.font);
        Canvas_Pop();
    }

    drawAt(x, y) {
        Canvas_Push();
            CurrContext.font = this.fontStr;
            CurrContext.fillText(this.str, -this.width / 2, this.height / 2);

            Canvas_SetStrokeStyle("white");
            Canvas_DrawRect(-this.width / 2, -this.height/2, this.width, this.height);
            Canvas_DrawPoint(0, 0, 5);
        Canvas_Pop();
    }
};
