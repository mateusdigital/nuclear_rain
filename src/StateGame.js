//----------------------------------------------------------------------------//
//                               *       +                                    //
//                         '                  |                               //
//                     ()    .-.,="``"=.    - o -                             //
//                           '=/_       \     |                               //
//                        *   |  '=._    |                                    //
//                             \     `=./`,        '                          //
//                          .   '=.__.=' `='      *                           //
//                 +                         +                                //
//                      O      *        '       .                             //
//                                                                            //
//  File      : StateGame.js                                                  //
//  Project   : nuclear_rain                                                  //
//  Date      : 2019-08-27                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2019 - 2025                                  //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//----------------------------------------------------------------------------//

//------------------------------------------------------------------------------
function CheckCollisions_PlayerMissiles_Vs_EnemyMissile(index)
{
  let enemy_missile = enemyMissilesMgr.missiles[index];

  for (let j = 0; j < explosionMgr.playerExplosions.length; ++j) {
    let player_explosion = explosionMgr.playerExplosions[j];
    let collided         = Math_CircleContainsPoint(
      player_explosion.position.x,
      player_explosion.position.y,
      player_explosion.radius,
      enemy_missile.currPosition.x,
      enemy_missile.currPosition.y
    );

    if (collided) {
      const missile = enemyMissilesMgr.killMissile(index);
      const score   = missile.score;

      AddScore(score);

      camera.addPlayerExplosionShake(player_explosion.radius);

      return true;
    }
  }

  return false;
}

//------------------------------------------------------------------------------
function CheckCollisions_PlayerCity_Vs_EnemyMissile(index)
{
  let enemy_missile = enemyMissilesMgr.missiles[index];

  let min_y = (city.position.y - BUILDING_HEIGHT - 10);
  if (enemy_missile.currPosition.y < min_y || city.done) {
    return false;
  }

  // Find the closest building...
  let min_distance             = Infinity;
  let building_to_be_destroyed = null;

  for (let j = 0; j < city.buildings.length; ++j) {
    let building = city.buildings[j];
    if (building.isBeingDestroyed || building.done) {
      continue;
    }

    let d = Math_DistanceSqr(
      enemy_missile.currPosition.x,
      enemy_missile.currPosition.y,
      building.position.x,
      building.position.y
    );

    if (d < min_distance) {
      building_to_be_destroyed = building;
      min_distance             = d;
    }
  }

  if (building_to_be_destroyed) {
    building_to_be_destroyed.destroy();
  }
  enemyMissilesMgr.killMissile(index);
  camera.addBuildingExplosionShake();

  return true;
}

//------------------------------------------------------------------------------
function CheckCollisions()
{
  for (let i = enemyMissilesMgr.missiles.length - 1; i >= 0; --i) {
    let collided = CheckCollisions_PlayerMissiles_Vs_EnemyMissile(i);
    if (collided) {
      continue;
    }

    collided = CheckCollisions_PlayerCity_Vs_EnemyMissile(i);
    if (collided) {
      continue;
    }
  }
}

//------------------------------------------------------------------------------
function CheckShooting()
{
  if (defenderReticle.isShooting && defenderMissilesMgr.canShoot()) {
    defenderMissilesMgr.shoot(defenderReticle.position);
    defenderReticle.shoot();

    camera.addPlayerShootShake();
  }
}

//------------------------------------------------------------------------------
function ResetGame(level)
{
  keyboard  = [];
  levelInfo = new LevelInfo(1);

  camera = new Camera();
  city   = new City(0, Canvas_Edge_Bottom);

  defenderMissilesMgr =
    new DefenderMissileManager(city.position.x, city.position.y);

  defenderReticle = new DefenderReticle(
    defenderMissilesMgr.shootingPosition.x,
    defenderMissilesMgr.shootingPosition.y - RETICLE_SHOOTING_POSITION_Y_GAP
  );

  enemyMissilesMgr = new EnemyMissileManager();
  explosionMgr     = new ExplosionManager();
}

//------------------------------------------------------------------------------
function CheckGameOver()
{
  if (city.done) {
    ChangeStateToGameOver();
  }
}

// -----------------------------------------------------------------------------
function CheckNextLevel()
{
  if (!enemyMissilesMgr.done) {
    return;
  }

  levelInfo        = new LevelInfo(levelInfo.level + 1);
  enemyMissilesMgr = new EnemyMissileManager();
}

//----------------------------------------------------------------------------//
// Globals                                                                    //
//----------------------------------------------------------------------------//
let levelInfo;
let city;
let explosionMgr;
let enemyMissilesMgr;
let defenderMissilesMgr;
let defenderReticle;
let camera;
let keyboard = [];
let scoreHud = null;
// -----------------------------------------------------------------------------
const SCORE_COLOR  = chroma.rgb(255, 255, 255, 0.2);
const SCORE_FORMAT = "score: ";

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function StateGame_Setup()
{
  ResetGame();

  scoreHud =
    new Text(MakeScoreString(0), SMALL_TEXT_FONT_SIZE, SMALL_TEXT_FONT_NAME);
}

//------------------------------------------------------------------------------
function StateGame_Draw(dt)
{
  Canvas_ClearWindow(camera.color);

  //
  // Update
  city.update(dt);
  defenderReticle.update(dt);
  enemyMissilesMgr.update(dt);
  defenderMissilesMgr.update(dt);
  explosionMgr.update(dt);
  camera.update(dt);

  _scoreAddTimer += dt;
  let color       = SCORE_COLOR;
  if (_scoreAddTimer <= SCORE_ADD_DURATION) {
    const curr_score = Math_Lerp(
      _currScoreValue, _playerScore, _scoreAddTimer / SCORE_ADD_DURATION
    );

    scoreHud.str = MakeScoreString(Math_Int(curr_score));
    const hue    = (Time_Total * 200) % 360;
    const max_opacity =
      Math_Max(0.8, 0.2 + (_scoreAddTimer / SCORE_ADD_DURATION));

    color = chroma.hsv(hue, 1, 1, max_opacity);
  }
  else {
    _currScoreValue = _playerScore;
  }

  Canvas_SetFillStyle(color);
  scoreHud.drawAt(0, Canvas_Edge_Top + scoreHud.height);

  CheckShooting();
  CheckCollisions();
  CheckGameOver();
  CheckNextLevel();

  //
  // Draw
  Canvas_Push();
  {
    Canvas_Translate(camera.currPosition.x, camera.currPosition.y);
    city.draw();
  }
  Canvas_Pop();

  Canvas_Push();
  {
    Canvas_Translate(camera.currPosition.x, 0);

    enemyMissilesMgr.draw();
    defenderMissilesMgr.draw();
    explosionMgr.draw();
    defenderReticle.draw();
  }
  Canvas_Pop();
}

//------------------------------------------------------------------------------
function StateGame_KeyDown(code)
{
  keyboard[code] = true;
  console.log("code down", code)
}

//------------------------------------------------------------------------------
function StateGame_KeyUp(code)
{
  keyboard[code] = false;
  console.log("code up", code)
}

//
// Score
//

// -----------------------------------------------------------------------------
const SCORE_ADD_DURATION = 2;
const SCORE_ZEROES       = 8;
let   _scoreAddTimer     = 0;
let   _playerScore       = 0;
let   _currScoreValue    = 0;

// -----------------------------------------------------------------------------
function AddScore(score)
{
  _playerScore   += score;
  _scoreAddTimer  = 0;
}

// -----------------------------------------------------------------------------
function MakeScoreString(score)
{
  let score_str = Math_Int(score).toString();
  if (score_str.length < SCORE_ZEROES) {
    let zeros = SCORE_ZEROES - score_str.length;
    score_str = "0".repeat(zeros) + score_str;
  }
  return String_Cat(SCORE_FORMAT, score_str);
}
