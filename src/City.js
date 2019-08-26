
// Building
const BUILDING_WIDTH            = 15;
const BUILDING_HEIGHT           = 25;
const BUILDING_MIN_RANDOM_GAP_Y = 3;
const BUILDING_MAX_RANDOM_GAP_Y = 15;
const BUILDING_START_GAP_X      = 50;
const BUILDING_GAP_X            = 80;

class BuildingParticle
{
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);
        this.angle    = Math_Random(0, MATH_2PI);
        this.speed    = Math_Random(100, 200);
        this.size     = Math_RandomInt(4, 10);

        this.timeToDie    = 0;
        this.maxTimeToDie = Math_RandomInt(1, 2)
        this.ratio        = 0;

        this.done = false;
    }

    update(dt)
    {
        if(this.done) {
            return;
        }

        this.timeToDie += dt;
        if(this.timeToDie >= this.maxTimeToDie) {
            this.done = true;
            return;
        }

        this.position.x += Math_Cos(this.angle) * this.speed * dt;
        this.position.y += Math_Sin(this.angle) * this.speed * dt;

        this.ratio = this.timeToDie / this.maxTimeToDie;
        this.color = chroma.hsl(this.ratio * 360, 1, 0.5);
    }

    draw()
    {
        if(this.done) {
            return;
        }

        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);
            Canvas_SetFillStyle(this.color);
            let size = this.size * (1 - this.ratio);
            Canvas_FillRect(0, 0, size, size);
        Canvas_Pop();
    }
}


class Building
{
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);
        this.color = "magenta";
        this.isBeingDestroyed = false;
        this.particles = [];
    }

    destroy()
    {
        if(this.isBeingDestroyed) {
            return;
        }

        this.color = "red";
        this.isBeingDestroyed = true;

        let particles_len = Math_Random(10, 20);
        for(let i = 0; i < particles_len; ++i) {
            let p = new BuildingParticle(this.position.x, this.position.y)
            this.particles.push(p);
        }
    }

    update(dt)
    {
        if(!this.isBeingDestroyed) {
            return;
        }

        for(let i = this.particles.length-1; i >= 0; --i) {
            let p = this.particles[i];
            p.update(dt);
            if(p.done) {
                Array_RemoveAt(this.particles, i);
            }
        }
    }

    draw()
    {
        if(this.isBeingDestroyed) {
            for(let i = 0; i < this.particles.length; ++i) {
                this.particles[i].draw();
            }
            return;
        }

        Canvas_Push();
            Canvas_Translate(this.position.x, this.position.y);

            Canvas_SetFillStyle("black");
            Canvas_FillRect(
                -BUILDING_WIDTH  / 2,
                -BUILDING_HEIGHT / 2,
                BUILDING_WIDTH,
                BUILDING_HEIGHT
            );

            Canvas_SetStrokeStyle(this.color);
            Canvas_SetStrokeSize(2);
            Canvas_DrawRect(
                -BUILDING_WIDTH  / 2,
                -BUILDING_HEIGHT / 2,
                BUILDING_WIDTH,
                BUILDING_HEIGHT
            );
        Canvas_Pop();
    }
}


class City
{
    _createBuildings(building_y)
    {
        const BUILDINGS_COUNT = 6;
        let half_buildings_count = BUILDINGS_COUNT / 2;

        //
        // Left Buildings.
        for(let i = 0; i < half_buildings_count; ++i) {
            let building_x = -(BUILDING_START_GAP_X) - (i * BUILDING_GAP_X + BUILDING_WIDTH / 2);
            let gap_y      = Math_Random(BUILDING_MIN_RANDOM_GAP_Y, BUILDING_MAX_RANDOM_GAP_Y);
            let b          = new Building(building_x, building_y - gap_y);

            this.buildings.push(b);
        }

        //
        // Right Buildings.
        for(let i = 0; i < half_buildings_count; ++i) {
            let building_x =  (BUILDING_START_GAP_X) + (i * BUILDING_GAP_X - BUILDING_WIDTH/2);
            let gap_y      = Math_Random(BUILDING_MIN_RANDOM_GAP_Y, BUILDING_MAX_RANDOM_GAP_Y);
            let b          = new Building(building_x, building_y - gap_y);

            this.buildings.push(b);
        }

        this.buildings = this.buildings.sort(function(a, b) {
            if(a.position.x < b.position.x) {
                return -1;
            } else {
                return 1;
            }
        });
    }

    _createTerrain()
    {
        Noise_Seed(Math.random());

        this.terrain.push(Canvas_Edge_Left);
        this.terrain.push(Canvas_Edge_Bottom);

        for(let i = 0; i < this.buildings.length; ++i) {
            let building = this.buildings[i];

            let building_left  = building.position.x - (BUILDING_WIDTH / 2);
            let building_right = building.position.x + (BUILDING_WIDTH / 2);

            let building_bottom = building.position.y + (BUILDING_HEIGHT / 2);
            building_bottom += Math_RandomInt(-10, 0);


            let last_terrain_x = Array_Get(this.terrain, -2);
            let last_terrain_y = Array_Get(this.terrain, -1);
            let distance = (building_left - last_terrain_x);
            let steps    = 6;
            let incr     = distance / steps;

            for(let x = last_terrain_x + incr; x < building_left; x += incr) {
                this.terrain.push(x);

                let y = Noise_Perlin2(x, building_bottom) * 10 + building_bottom;
                this.terrain.push(y);
            }


            this.terrain.push(building_left)
            this.terrain.push(building_bottom);

            this.terrain.push(building_right)
            this.terrain.push(building_bottom);
        }

        this.terrain.push(Canvas_Edge_Right);
        this.terrain.push(Canvas_Edge_Bottom);
    }

    constructor(x, y)
    {
        this.position = Vector_Create(x, y);

        this.buildings = [];
        this.terrain   = [];

        this._createBuildings(y - BUILDING_HEIGHT - 10);
        this._createTerrain();
    }

    update(dt)
    {
        for(let i = 0, len = this.buildings.length; i < len; ++i) {
            this.buildings[i].update(dt);
        }
    }

    draw()
    {

        Canvas_Push();
        Canvas_SetStrokeStyle("cyan");
        Canvas_SetStrokeSize(2);
        Canvas_DrawShape(this.terrain, false);


        Canvas_Pop();

        for(let i = 0, len = this.buildings.length; i < len; ++i) {
            this.buildings[i].draw();
        }
    }

}; // class City
