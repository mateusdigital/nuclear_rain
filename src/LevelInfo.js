class LevelInfo
{
    constructor()
    {
        this.enemyMissileManager_maxActiveMissiles = 3;
        this.enemyMissileManager_maxTimeToSpawnMissile = 2;

        this.enemyMissile_speed = 50;
        this.enemyMissile_headColor = "white";
        this.enemyMissile_trailColor = chroma.random();
    }
}
