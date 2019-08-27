//----------------------------------------------------------------------------//
// Building Particle                                                          //
//----------------------------------------------------------------------------//
BUILDING_PARTICLE_MIN_SPEED = 100;
BUILDING_PARTICLE_MAX_SPEED = 200;

BUILDING_PARTICLE_MIN_SIZE = 4;
BUILDING_PARTICLE_MAX_SIZE = 20;

BUILDING_PARTICLE_MIN_TIME_TO_DIE = 1;
BUILDING_PARTICLE_MAX_TIME_TO_DIE = 3;

//------------------------------------------------------------------------------
class BuildingParticle
{
    //--------------------------------------------------------------------------
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);
        this.angle    = Math_Random(0, MATH_2PI);
        this.speed    = Math_Random(BUILDING_PARTICLE_MIN_SPEED, BUILDING_PARTICLE_MAX_SPEED);
        this.size     = Math_RandomInt(BUILDING_PARTICLE_MIN_SIZE, BUILDING_PARTICLE_MAX_SIZE);

        this.timeToDie    = 0;
        this.maxTimeToDie = Math_RandomInt(BUILDING_PARTICLE_MIN_TIME_TO_DIE, BUILDING_PARTICLE_MAX_TIME_TO_DIE)
        this.ratio        = 0;

        this.done = false;
    } // ctor

    //--------------------------------------------------------------------------
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
    } // update

    //--------------------------------------------------------------------------
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
    } // draw
}; // class BuildingParticle



//----------------------------------------------------------------------------//
// Building                                                                   //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const BUILDING_WIDTH            = 15;
const BUILDING_HEIGHT           = 25;
const BUILDING_MIN_RANDOM_GAP_Y = 3;
const BUILDING_MAX_RANDOM_GAP_Y = 15;
const BUILDING_START_GAP_X      = 50;
const BUILDING_GAP_X            = 80;
const BUILDING_MIN_PARTICLES    = 10;
const BUILDING_MAX_PARTICLES    = 20;

//------------------------------------------------------------------------------
class Building
{
    //--------------------------------------------------------------------------
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);

        this.color     = "magenta";
        this.particles = [];

        this.isBeingDestroyed = false;
        this.done             = false;
    } // ctor

    //--------------------------------------------------------------------------
    destroy()
    {
        if(this.isBeingDestroyed || this.done) {
            return;
        }

        this.color            = "red";
        this.isBeingDestroyed = true;

        let len = Math_RandomInt(BUILDING_MIN_PARTICLES, BUILDING_MAX_PARTICLES);
        for(let i = 0; i < len; ++i) {
            let p = new BuildingParticle(this.position.x, this.position.y)
            this.particles.push(p);
        }
    } // destroy

    //--------------------------------------------------------------------------
    update(dt)
    {
        if(!this.isBeingDestroyed || this.done) {
            return;
        }

        for(let i = this.particles.length-1; i >= 0; --i) {
            let p = this.particles[i];
            p.update(dt);

            if(p.done) {
                Array_RemoveAt(this.particles, i);
                this.done = this.particles.length == 0;
            }
        }
    } // update

    //--------------------------------------------------------------------------
    draw()
    {
        if(this.done) {
            return;
        }

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
    } // draw
}; // class Building


//----------------------------------------------------------------------------//
// City                                                                       //
//----------------------------------------------------------------------------//
class City
{
    //--------------------------------------------------------------------------
    constructor(x, y)
    {
        this.position = Vector_Create(x, y);

        this.buildings = [];
        this.terrain   = [];
        this.done      = false;

        this._createBuildings(y - BUILDING_HEIGHT - 10);
        this._createTerrain();
    } // ctor

    //--------------------------------------------------------------------------
    update(dt)
    {
        for(let i = this.buildings.length-1; i >= 0; --i) {
            let b = this.buildings[i];
            b.update(dt);
            if(b.done) {
                Array_RemoveAt(this.buildings,i);
                this.done = this.buildings.length == 0;
            }
        }
    } // update

    //--------------------------------------------------------------------------
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
    }// draw

    //--------------------------------------------------------------------------
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
    } // _createBuildings

    //--------------------------------------------------------------------------
    _createTerrain()
    {
        Noise_Seed(Math.random());

        let building_left   = -1;
        let building_right  = -1;
        let building_bottom = -1;

        const terrain_left_most_point   = Canvas_Edge_Left   - 20;
        const terrain_right_most_point  = Canvas_Edge_Right  + 20;
        const terrain_bottom_most_point = Canvas_Edge_Bottom + 20;
        const number_of_steps           = 6;

        this.terrain.push(terrain_left_most_point);
        this.terrain.push(terrain_bottom_most_point);

        for(let i = 0; i < this.buildings.length; ++i) {
            let building = this.buildings[i];

            // building pos.
            building_left   = building.position.x - (BUILDING_WIDTH  / 2);
            building_right  = building.position.x + (BUILDING_WIDTH  / 2);
            building_bottom = building.position.y + (BUILDING_HEIGHT / 2);
            building_bottom += Math_RandomInt(-10, 0);

            // terrain pos.
            let last_terrain_x = Array_Get(this.terrain, -2);

            this._addPoints(
                this.terrain,
                last_terrain_x,
                building_left,
                number_of_steps,
                building_bottom
            );

            this.terrain.push(building_left)
            this.terrain.push(building_bottom);

            this.terrain.push(building_right)
            this.terrain.push(building_bottom);
        }

        this._addPoints(
            this.terrain,
            building_right,
            terrain_right_most_point,
            number_of_steps,
            building_bottom
        );

        this.terrain.push(terrain_right_most_point);
        this.terrain.push(terrain_bottom_most_point);
    } // _createTerrain

    //--------------------------------------------------------------------------
    _addPoints(arr, left, right, steps, baseY)
    {
        let distance = (right - left);
        let incr     = distance / steps;

        // Generate some extra points between those two points...
        for(let x = left + incr; x < right; x += incr) {
            let y = Noise_Perlin2(x, baseY) * 10 + baseY;
            arr.push(x);
            arr.push(y);
        }
    } // _addPoints
}; // class City
