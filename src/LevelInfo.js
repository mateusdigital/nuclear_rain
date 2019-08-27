class LevelInfo
{
    constructor(level)
    {
        this.level = level;

        this.enemyMissileManager_maxActiveMissiles     = 3 + level;
        this.enemyMissileManager_maxTimeToSpawnMissile = 3 - level / 10;
        this.enemyMissileManager_maxShotMissiles       = level;

        this.enemyMissile_speed      = 50 + level;

        this.enemyMissile_headColor  = chroma.random();
        this.enemyMissile_trailColor = chroma.random();

        this.terrainColor  = chroma.random();
        this.buildingColor = chroma.random();
    }
}
