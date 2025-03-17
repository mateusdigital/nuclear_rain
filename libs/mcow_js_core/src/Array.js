//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : Array.js                                                      //
//  Project   : mcow_js_core                                                  //
//  Date      : Feb 28, 2020                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2020                                                  //
//                                                                            //
//  Description :                                                             //
// asdfasdfsda //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Functions                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function Array_Create(size, defaultValue = null)
{
  let arr = new Array(size);
  arr.fill(defaultValue);
  return arr;
}

//------------------------------------------------------------------------------
function Array_Create2D(h, w, defaultValue = null)
{
  let arr = [];
  for (let i = 0; i < h; ++i) {
    arr.push([]);
    for (let j = 0; j < w; ++j) {
      arr[i].push(defaultValue);
    }
  }
  return arr;
}

//------------------------------------------------------------------------------
function Array_IsEmpty(arr) { return arr.length == 0; }

//------------------------------------------------------------------------------
function Array_IndexOf(arr, func)
{
  // @TODO(stdmatt): use js stuff...
  for (let i = 0; i < arr.length; ++i) {
    if (func(arr[i])) {
      return i;
    }
  }
  return -1;
}

//------------------------------------------------------------------------------
function Array_FindIf(arr, func)
{
  let r = arr.find(func);
  return r;
}

//------------------------------------------------------------------------------
function Array_Contains(arr, func)
{
  let r = arr.find(func);
  if (r == undefined) {
    return false;
  }
  return true;
}

//------------------------------------------------------------------------------
function Array_RemoveFront(arr) { arr = arr.splice(0, 1); }

//------------------------------------------------------------------------------
function Array_RemoveLast(arr) { arr = arr.splice(arr.length - 1, 1); }

//------------------------------------------------------------------------------
function Array_RemoveAt(arr, i) { arr = arr.splice(i, 1); }

//------------------------------------------------------------------------------
function Array_RemoveIf(arr, pred)
{
  for (let i = 0; i < arr.length; ++i) {
    if (pred(arr[i])) {
      Array_RemoveAt(arr, i);
      return;
    }
  }
}

//------------------------------------------------------------------------------
function Array_PushFront(arr, e) { arr.unshift(e); }

//------------------------------------------------------------------------------
function Array_PushBack(arr, e) { arr.push(e); }

//------------------------------------------------------------------------------
function Array_PopBack(arr)
{
  let e = Array_GetBack(arr);
  arr   = arr.splice(arr.length - 1, 1);
  return e;
}

//------------------------------------------------------------------------------
function Array_PopFront(arr)
{
  let e = Array_GetFront(arr);
  arr   = arr.splice(0, 1);
  return e;
}
//------------------------------------------------------------------------------
function Array_Get(arr, i)
{
  if (i >= arr.length) {
    debugger;
  }

  if (i < 0) {
    i = (arr.length + i);
  }

  return arr[i];
}

//------------------------------------------------------------------------------
function Array_GetLast(arr)
{
  if (Array_IsEmpty(arr)) {
    return null;
  }
  return arr[arr.length - 1];
}

//------------------------------------------------------------------------------
function Array_GetFront(arr)
{
  if (Array_IsEmpty(arr)) {
    return null;
  }
  return arr[0];
}
