//------------------------------------------------------------------------------
const VECTOR_ZERO = Vector_Create(0, 0);

//------------------------------------------------------------------------------
function Vector_Mul(v, s) {
    return Vector_Create(v.x * s, v.y *s);
}

//------------------------------------------------------------------------------
function Vector_Copy(a)
{
    return Vector_Create(a.x, a.y);
}

//------------------------------------------------------------------------------
function Vector_Equals(a, b)
{
    return a.x == b.x && a.y == b.y;
}

//------------------------------------------------------------------------------
function Vector_Distance(a, b)
{
    return Math_Distance(a.x, a.y, b.x, b.y);
}

//------------------------------------------------------------------------------
function Vector_FromPolar(angle, mag)
{
    return Vector_Create(mag * Math_Cos(angle), mag * Math_Sin(angle));
}

function Vector_Dot(a, b) {
    return (a.x * b.x) + (a.y * b.y);
}


//------------------------------------------------------------------------------
function Vector_Length(v)
{
    return Math.sqrt(v.x * v.x + v.y * v.y);
}

//------------------------------------------------------------------------------
function Vector_Unit(v)
{
    let l = Vector_Length(v);
    return Vector_Create(v.x / l, v.y / l);
}



//------------------------------------------------------------------------------
function Vector_Add(a, b)
{
    return Vector_Create(a.x + b.x, a.y + b.y);
}

//------------------------------------------------------------------------------
function Vector_Sub(a, b)
{
    return Vector_Create(a.x - b.x, a.y - b.y);
}

//------------------------------------------------------------------------------
function Vector_Create(x, y)
{
    let v = {x:0, y:0}
    if(x != undefined) {
        v.x = x;
    }
    if(y != undefined) {
        v.y = y;
    }
    return v;
}
