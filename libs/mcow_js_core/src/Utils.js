//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Utils.js                                                      //
//  Project   : mcow_js_core                                                  //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//------------------------------------------------------------------------------
function Utils_AddRuntimeProperty(obj, propName, value)
{
    const full_prop_name = String_Cat("rtvar_", propName);
    obj[full_prop_name] = value;
}


//------------------------------------------------------------------------------
function Utils_UniqueId()
{
    if(this.s_unique_id == undefined) {
        this.s_unique_id = 0;
    }
    return this.s_unique_id++;
}

//------------------------------------------------------------------------------
function Utils_IsNullOrUndefined(v)
{
    return v == null || v == undefined;
}

//----------------------------------------------------------------------------//
// Coords Functions                                                           //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Coords_GetSurrounding(v)
{
    let coords = [];
    for(let i = -1; i <= +1; ++i) {
        let yy = v.y + i;
        for(let j = -1; j <= +1; ++j) {
            let xx = v.x + j;

            if(yy == v.y && xx == v.x) { // Don't want the same coord.
                continue;
            }

            coords.push(Vector_Create(xx, yy));
        }
    }

    return coords;
}

//------------------------------------------------------------------------------
function Coords_GetAdjacent(v)
{
    let coords = [];
    coords.push(Vector_Create(v.x +0, v.y +1)); // Bottom
    coords.push(Vector_Create(v.x +1, v.y +0)); // Right
    coords.push(Vector_Create(v.x -1, v.y +0)); // Top
    coords.push(Vector_Create(v.x +0, v.y -1)); // Left
    return coords;
}
