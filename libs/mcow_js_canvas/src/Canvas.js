//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
var Canvas      = null;
var MainContext = null;
var CurrContext = null;

var Time_Total = 0;
var Time_Delta = 0;
var _Time_Prev = 0;
var _Time_Now  = 0;

var Canvas_Edge_Left;
var Canvas_Edge_Right;
var Canvas_Edge_Top;
var Canvas_Edge_Bottom;

var Canvas_Width;
var Canvas_Height;

var Canvas_Half_Width;
var Canvas_Half_Height;

//------------------------------------------------------------------------------
function Canvas_Start() { Canvas_Draw(0); }

//------------------------------------------------------------------------------
function Canvas_Resize(width, height)
{
  width  = Math_Int(width);
  height = Math_Int(height);

  Canvas.width  = width;
  Canvas.height = height;

  MainContext.width  = width;
  MainContext.height = height;

  Canvas_Width  = width;
  Canvas_Height = height;

  Canvas_Half_Width  = Math_Int(Canvas_Width / 2);
  Canvas_Half_Height = Math_Int(Canvas_Height / 2);

  Canvas_Edge_Left   = -Canvas_Half_Width;
  Canvas_Edge_Right  = +Canvas_Half_Width;
  Canvas_Edge_Top    = -Canvas_Half_Height;
  Canvas_Edge_Bottom = +Canvas_Half_Height;

  Canvas_Translate(Canvas_Half_Width, Canvas_Half_Height);
}

//------------------------------------------------------------------------------
function Canvas_CreateCanvas(width, height, parentElement)
{
  Canvas      = document.createElement("canvas");
  MainContext = Canvas.getContext('2d');
  Canvas_SetRenderTarget(MainContext);
  Canvas_Resize(width, height);

  if (parentElement) {
    parentElement.appendChild(Canvas);
    return;
  }

  document.body.appendChild(Canvas);
}

//------------------------------------------------------------------------------
function Canvas_GetFromHtml(canvasId)
{
  Canvas      = document.getElementById(canvasId);
  MainContext = Canvas.getContext('2d');

  Canvas_SetRenderTarget(MainContext);
  Canvas_Resize(Canvas.width, Canvas.height);
}

//------------------------------------------------------------------------------
function Canvas_SetRenderTarget(renderTarget)
{
  if (renderTarget == null) {
    renderTarget = MainContext;
  }

  CurrContext = renderTarget;
}

//------------------------------------------------------------------------------
function Canvas_ClearRect(x, y, w, h, color)
{
  CurrContext.fillStyle = color == undefined ? 'black' : color;
  // CurrContext.clearRect(0, 0, Canvas.width, Canvas.height);
  CurrContext.fillRect(x, y, w, h);
}

//------------------------------------------------------------------------------
function Canvas_ClearWindow(color)
{
  Canvas_ClearRect(
    -Canvas.width, -Canvas.height, Canvas.width * 2, Canvas.height * 2, color
  );
}

//------------------------------------------------------------------------------
function Canvas_Draw(t)
{
  if (t != _Time_Now) {
    _Time_Now = t;
  }
  let dt = (_Time_Now - _Time_Prev) / 1000;
  if (dt > 1.0 / 30.0) {
    dt = 1.0 / 30.0;
  }
  _Time_Prev = _Time_Now;

  Time_Total += dt;
  Time_Delta  = dt;

  Draw(dt); // Should be defined by user.
  window.requestAnimationFrame(Canvas_Draw);
}

//------------------------------------------------------------------------------
function Canvas_Push() { CurrContext.save(); }

//------------------------------------------------------------------------------
function Canvas_Pop() { CurrContext.restore(); }

//------------------------------------------------------------------------------
function Canvas_SetOrigin(x, y) { Canvas_Translate(x, y); }

//------------------------------------------------------------------------------
function Canvas_Translate(x, y) { CurrContext.translate(x, y); }

//------------------------------------------------------------------------------
function Canvas_Rotate(a) { CurrContext.rotate(a); }

//------------------------------------------------------------------------------
function Canvas_Scale(x, y)
{
  if (y == undefined || y == null) {
    y = x;
  }
  CurrContext.scale(x, y);
}

//------------------------------------------------------------------------------
function Canvas_SetFillStyle(style) { CurrContext.fillStyle = style; }

//------------------------------------------------------------------------------
function Canvas_SetStrokeStyle(style) { CurrContext.strokeStyle = style; }

function Canvas_SetStrokeSize(size) { CurrContext.lineWidth = size; }

//------------------------------------------------------------------------------
function Canvas_DrawPoint(x, y, size)
{
  CurrContext.beginPath();
  CurrContext.arc(x, y, size, 0, 2 * Math.PI, true);
  CurrContext.closePath();
  CurrContext.stroke();
  CurrContext.fill();
}

//------------------------------------------------------------------------------
function Canvas_DrawLine(x1, y1, x2, y2)
{
  CurrContext.beginPath();
  CurrContext.moveTo(x1, y1);
  CurrContext.lineTo(x2, y2);
  CurrContext.closePath();
  CurrContext.stroke();
}

//------------------------------------------------------------------------------
function Canvas_DrawArc(x, y, r, sa, ea, close)
{
  CurrContext.beginPath();
  CurrContext.arc(x, y, r, sa, ea);
  if (close != undefined && close) {
    CurrContext.closePath();
  }
  CurrContext.stroke();
}

//------------------------------------------------------------------------------
function Canvas_FillArc(x, y, r, sa, ea, close)
{
  CurrContext.beginPath();
  CurrContext.arc(x, y, r, sa, ea);
  if (close != undefined && close) {
    CurrContext.closePath();
  }
  CurrContext.fill();
}

//------------------------------------------------------------------------------
function Canvas_FillShape(vertices, closed)
{
  CurrContext.beginPath();
  CurrContext.moveTo(vertices[0], vertices[1]);
  for (let i = 2; i < vertices.length - 1; i += 2) {
    CurrContext.lineTo(vertices[i], vertices[i + 1]);
  }

  if (closed != undefined && closed) {
    CurrContext.lineTo(vertices[0], vertices[1]);
  }
  CurrContext.closePath();
  CurrContext.fill();
}

//------------------------------------------------------------------------------
function Canvas_DrawTriangle(x1, y1, x2, y2, x3, y3)
{
  Canvas_DrawShape([ x1, y1, x2, y2, x3, y3 ], true);
}

//------------------------------------------------------------------------------
function Canvas_DrawCircle(x, y, r) { Canvas_DrawArc(x, y, r, 0, MATH_2PI); }

//------------------------------------------------------------------------------
function Canvas_FillCircle(x, y, r) { Canvas_FillArc(x, y, r, 0, MATH_2PI); }

//------------------------------------------------------------------------------
function Canvas_DrawShape(vertices, closed)
{
  CurrContext.beginPath();
  CurrContext.moveTo(vertices[0], vertices[1]);
  for (let i = 2; i < vertices.length - 1; i += 2) {
    CurrContext.lineTo(vertices[i], vertices[i + 1]);
  }

  if (closed != undefined && closed) {
    CurrContext.lineTo(vertices[0], vertices[1]);
  }
  CurrContext.closePath();
  CurrContext.stroke();
}

function Canvas_DrawRoundedRect(x, y, w, h, r)
{
  CurrContext.beginPath();
  CurrContext.moveTo(x + r, y);
  CurrContext.lineTo(x + w - r, y);
  CurrContext.quadraticCurveTo(x + w, y, x + w, y + r);
  CurrContext.lineTo(x + w, y + h - r);
  CurrContext.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  CurrContext.lineTo(x + r, y + h);
  CurrContext.quadraticCurveTo(x, y + h, x, y + h - r);
  CurrContext.lineTo(x, y + r);
  CurrContext.quadraticCurveTo(x, y, x + r, y);
  CurrContext.closePath();
  CurrContext.stroke();
}

function Canvas_FillRoundedRect(x, y, w, h, r)
{
  CurrContext.beginPath();
  CurrContext.moveTo(x + r, y);
  CurrContext.lineTo(x + w - r, y);
  CurrContext.quadraticCurveTo(x + w, y, x + w, y + r);
  CurrContext.lineTo(x + w, y + h - r);
  CurrContext.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  CurrContext.lineTo(x + r, y + h);
  CurrContext.quadraticCurveTo(x, y + h, x, y + h - r);
  CurrContext.lineTo(x, y + r);
  CurrContext.quadraticCurveTo(x, y, x + r, y);
  CurrContext.closePath();
  CurrContext.fill();
}

//------------------------------------------------------------------------------
function Canvas_DrawRect(x, y, w, h)
{
  CurrContext.beginPath();
  CurrContext.rect(x, y, w, h);
  CurrContext.closePath();
  CurrContext.stroke();
}

//------------------------------------------------------------------------------
function Canvas_FillRect(x, y, w, h)
{
  if (w <= 0 || h <= 0) {
    return;
  }

  CurrContext.beginPath();
  CurrContext.rect(x, y, w, h);
  CurrContext.closePath();
  CurrContext.fill();
}

//------------------------------------------------------------------------------
var      _Canvas_ImageData = null;
function Canvas_LockPixels()
{
  if (_Canvas_ImageData != null) {
    return;
  }

  _Canvas_ImageData =
    CurrContext.getImageData(0, 0, Canvas_Width, Canvas_Height);
}

//------------------------------------------------------------------------------
function Canvas_UnlockPixels()
{
  if (_Canvas_ImageData == null) {
    return;
  }

  CurrContext.putImageData(_Canvas_ImageData, 0, 0);
  _Canvas_ImageData = null;
}

//------------------------------------------------------------------------------
function Canvas_SetColor(x, y, color)
{
  // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
  function get_pixel_index(x, y, width)
  {
    var red = y * (width * 4) + x * 4;
    return [ red, red + 1, red + 2, red + 3 ];
  }

  var indices = get_pixel_index(x, y, Canvas_Width);

  _Canvas_ImageData.data[indices[0]] = color[0];
  _Canvas_ImageData.data[indices[1]] = color[1];
  _Canvas_ImageData.data[indices[2]] = color[2];
  _Canvas_ImageData.data[indices[3]] = color[3];
}

//------------------------------------------------------------------------------
function Canvas_RenderTextAt(x, y, str, fontSize, fontName, centered = false)
{
  // debugger;
  if (!Utils_IsNullOrUndefined(fontSize) && !Utils_IsNullOrUndefined(fontName)) {
    let name         = String_Cat(fontSize, "px ", fontName)
    CurrContext.font = name;
  }

  let width  = CurrContext.measureText(str).width;
  let height = parseInt(CurrContext.font);

  if (!centered) {
    // Canvas_SetFillStyle("red");
    // Canvas_FillRect(x, y, width, height);
    // Canvas_SetFillStyle("white");

    CurrContext.fillText(str, x, y + height);
  }
  else {
    // Canvas_SetFillStyle("red");
    // Canvas_FillRect(
    //     x + width - width / 4,
    //     y + height / 4,
    //     width, height
    // );
    // Canvas_SetFillStyle("white");

    CurrContext.fillText(str, x + width - width / 4, y + height + height / 4);
  }
  // x + width,
  // y + height);//x + (width / 2), y + (height / 2));
}
