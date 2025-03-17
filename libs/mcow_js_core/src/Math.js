//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Math.js                                                       //
//  Project   : mcow_js_core                                                  //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

const MATH_PI  = Math.PI;
const MATH_2PI = MATH_PI * 2;


//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const Math_Cos = Math.cos;
const Math_Sin = Math.sin;
const Math_Int = Math.trunc;
const Math_Min = Math.min;
const Math_Max = Math.max;
const Math_Abs = Math.abs;


//------------------------------------------------------------------------------
function Math_IntDiv(a, b)
{
    return Math_Int(a / b);
}

//------------------------------------------------------------------------------
function Math_IntMod(a, b)
{
    return Math_Int(a % b);
}



//------------------------------------------------------------------------------
function Math_Clamp(m, M, v) {
    if(v < m) return m;
    if(v > M) return M;
    return v;
}
//------------------------------------------------------------------------------
function Math_Wrap(m, M, v) {
    if(v < m) return M;
    if(v > M) return m;
    return v;
}

//------------------------------------------------------------------------------
// Precise method, which guarantees v = v1 when t = 1.
function Math_Lerp(v0, v1, t)
{
    return (1 - t) * v0 + t * v1;
}



//------------------------------------------------------------------------------
function Math_Normalize(value, m, M)
{
    let normalized = (value - m) / (M - m);
    return normalized;
}

//------------------------------------------------------------------------------
function Math_Denormalize(normalized, m, M)
{
    let denormalized = (normalized * (M - m) + m);
    return denormalized;
}

//------------------------------------------------------------------------------
function Math_Map(value, s1, e1, s2, e2)
{
    if(s1 == e1 || s2 == e2) {
        return e2;
    }

    let normalized   = Math_Normalize  (value,      s1, e1);
    let denormalized = Math_Denormalize(normalized, s2, e2);

    return Math_Clamp(
        Math_Min(s2, e2),
        Math_Max(s2, e2),
        denormalized
    );
}


//------------------------------------------------------------------------------
function Math_Distance(x1, y1, x2, y2)
{
    let x = (x2 - x1);
    let y = (y2 - y1);
    return Math.sqrt(x*x + y*y);
}

//------------------------------------------------------------------------------
function Math_DistanceSqr(x1, y1, x2, y2)
{
    const x = (x2 - x1);
    const y = (y2 - y1);
    return x*x + y*y;
}


//------------------------------------------------------------------------------
function Math_Radians(d)
{
    return d * (MATH_PI / 180);
}

function Math_Degrees(r)
{
    return r * (180 / MATH_PI);
}


//------------------------------------------------------------------------------
function Math_RectContainsPoint(rx, ry, rw, rh, px, py)
{
    if(px < rx     ) return false; // To the left
    if(px > rx + rw) return false; // To the right
    if(py < ry     ) return false; // To the top
    if(py > ry + rh) return false; // To the bottom

    return true;
}

//------------------------------------------------------------------------------
function Math_CircleContainsPoint(cx, cy, cr, px, py)
{
    return Math_Distance(cx, cy, px, py) < cr;
}
