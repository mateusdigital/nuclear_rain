//~---------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//  File      : LevelInfo.js                                                  //
//  Project   : nuclear_rain                                                  //
//  Date      : Aug 26, 2019                                                  //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt 2019, 2020                                            //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

function RandomColor()
{
  let h = Random_Int(0, 360);
  return chroma.hsl(h, 1.0, 0.5);
}

class LevelInfo
{
  constructor(level)
  {
    this.level = level;

    this.enemyMissileManager_maxActiveMissiles     = 60 + level;
    this.enemyMissileManager_maxTimeToSpawnMissile = 4 - level / 10;
    this.enemyMissileManager_maxShotMissiles       = level * 1.5;

    this.enemyMissile_speed = 80 + (level * (level / 5));

    this.enemyMissile_headColor  = RandomColor();
    this.enemyMissile_trailColor = RandomColor();

    this.terrainColor  = RandomColor();
    this.buildingColor = RandomColor();
  }
}
