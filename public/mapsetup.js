// TODO: this information should probably come from the map file itself

var level;

var player = {
	x: -1, y: 0, z: 0.5, // location
	dx: Math.cos(0), dy: Math.sin(0), // view direction (2D unit vector)
	dh: 0, // vertical view offset
	vz: 0, // upwards velocity
	sector_id: 0, s: undefined, // sector (id used only for initialisation)
	radius: 0.2, // collision radius
	height: 0.5, // height of collision cylinder
	eyeline: 0.4, // height of camera above feet
	maxstep: 0.15 // max step height to walk up without jumping
};

var map_scale = 22;
var map_shift_x = 0;
var map_shift_y = 0;
