function RandomColor()
{
    let h = Math_RandomInt(0, 360);
    return chroma.hsl(h, 1.0, 0.5);
}

class LevelInfo
{
    constructor(level)
    {
        this.level = level;

        this.enemyMissileManager_maxActiveMissiles     = 3 + level;
        this.enemyMissileManager_maxTimeToSpawnMissile = 3 - level / 10;
        this.enemyMissileManager_maxShotMissiles       = level;

        this.enemyMissile_speed      = 50 + (level * (level / 3));
        Log(this.enemyMissile_speed);

        this.enemyMissile_headColor  = RandomColor();
        this.enemyMissile_trailColor = RandomColor();

        this.terrainColor  = RandomColor();
        this.buildingColor = RandomColor();
    }
}
