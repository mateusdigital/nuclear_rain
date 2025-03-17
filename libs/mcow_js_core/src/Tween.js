//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Tween.js                                                      //
//  Project   : mcow_js_core                                                  //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//


//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
const Default_Tween_Group = Tween_CreateGroup();

let _Tween_Total_Time = 0;
let _Tween_Delta_Time = 0;

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Tween_Update(dt)
{
    _Tween_Delta_Time  = dt;
    _Tween_Total_Time += dt;

    if(Default_Tween_Group._started) {
        Default_Tween_Group.update();
    }
}

//------------------------------------------------------------------------------
function Tween_CreateBasic(time, group)
{
    const curr = {value: 0};
    const end  = {value: 1};

    if(!group) {
        group = Default_Tween_Group;
    }

    const tween = new TWEEN.Tween(curr, group).to(end, time);
    return tween;
}

//------------------------------------------------------------------------------
function Tween_Create(group)
{
    if(!group) {
        group = Default_Tween_Group;
    }
    return new TWEEN.Tween(null, group);
}

//------------------------------------------------------------------------------
function Tween_CreateGroup()
{
    return new TWEEN.Group();
}
