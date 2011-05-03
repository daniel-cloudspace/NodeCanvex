/*
 * Copyright 2006 Philip Taylor
 * <philip at zaynar.demon.co.uk> / <excors at gmail.com>
 * Distributed under the terms of the GPL (http://www.gnu.org/licenses/gpl.txt)
 */

(function() { // [private]

const max_vertical_look = 0.8;

var editor_enabled = this.editor_enabled;
var ui_enabled = this.ui_enabled;

var fpsgraph_enabled = false;

var camera = {
	x: 0, y: 0, z: 0, // position of eye
	dx: 0, dy: 0, // viewing direction (unit vector)
	dh: 0, // vertical view offset
	s: null, // current sector
	t: 0 // current time (seconds since start of game)
};

// 'wall': { name: [ { 'img': Image object, 'w': tile width, 'h': tile height }, ...(for increasing mipmaps) ] }
// 'sprite': { name: { 'sprite':spritedef, images: [ Image object, ...(for frames of animation, then for directions) ] } }
var textures = { wall:{}, sprite:{} };
var loading_textures = [];

var default_texture = { img:new Image(), w:32, h:32 };
var error_texture = { img:new Image(), w:32, h:32 };
default_texture.img.src = 'data:image/png;base64,' + texture_data.loading;
error_texture.img.src = 'data:image/png;base64,' + texture_data.error;

// Globals declared in renderer.js:
//   var sectors;
//   var sprites;
// (TODO: do they need to be separate globals, and not part of the standard level object?)

// Data about the current level (after passing through preprocess_map)
// Properties:
//  proximity_triggers: [ { x:..., y:..., fn: function(dt, dist) {...} }, ... ]
var level_data = {};

function load_texture(type, name)
{
	if (! name)
	{
		return undefined;
	}
	
	if (! textures.wall[name])
	{
		var texture_dir = 'textures/tiled/' + ((options_flags.draw_pattern_walls || type == 'floor') ? 'mip2/' : 'mip/');

		textures.wall[name] = [];
		if (mipmap_enabled)
		{
			for (var i = mipmap_min; i <= mipmap_max; ++i)
			{
				var image = new Image();
				image.src = texture_dir+name+'.'+i+'.png';
				textures.wall[name][i] = { img:default_texture.img, w:default_texture.w, h:default_texture.h };
				loading_textures.push( { type:type, obj:textures.wall[name][i], img:image } );
			}
		}
		else
		{
			var image = new Image();
			image.src = texture_dir+name+'.'+mipmap_max+'.png';
			textures.wall[name][mipmap_min] = { img:default_texture.img, w:default_texture.w, h:default_texture.h };
			loading_textures.push( { type:type, obj:textures.wall[name][mipmap_min], img:image } );
		}
	}
	
	return textures.wall[name];
}

function load_sprite(name)
{
	if (! textures.sprite[name])
	{
		if (! spritedefs[name])
		{
			// error - sprite doesn't exist
			return null;
		}
		
		textures.sprite[name] = { sprite:spritedefs[name], images:[] };
		var i = 0;
		for (var a = 0; a < spritedefs[name].angles; ++a)
		{
			for (var f = 0; f < spritedefs[name].frames; ++f)
			{
				textures.sprite[name].images.push({ img:default_texture.img, w:default_texture.w, h:default_texture.h });

				var image = new Image();
				image.src = 'textures/sprites/'+spritedefs[name].img+'.'+a+'.'+f+'.png';
				loading_textures.push( { type:'sprite', obj:textures.sprite[name].images[i], img:image } );
				++i;
			}
		}
	}

	return textures.sprite[name];
}

function flush_textures()
{
	textures = { wall:{}, sprite:{} };
	loading_textures = [];
}

function process_pending_textures(ctx)
{
	for (var t in loading_textures)
	{
		var tex = loading_textures[t];
		if (tex.img.complete)
		{
			if (tex.img.width)
			{
				if (options_flags.draw_pattern_walls && tex.type == 'wall')
				{
					tex.obj.img = ctx.createPattern(tex.img, 'repeat');

					tex.obj.w = tex.img.width; // texture_u_repeat;
					tex.obj.h = tex.img.height; // texture_v_repeat;
				}
				else
				{
					if (tex.type == 'floor')
					{
						tex.obj.img = ctx.createPattern(tex.img, 'repeat');
					}
					else if (options_flags.draw_from_canvas)
					{
						var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
						canvas.width = tex.img.width;
						canvas.height = tex.img.height;
						canvas.getContext('2d').drawImage(tex.img, 0, 0);
						tex.obj.img = canvas;
					}
					else
					{
						tex.obj.img = tex.img;
					}
				
					if (tex.type == 'wall')
					{
						tex.obj.w = tex.img.width / texture_u_repeat;
						tex.obj.h = tex.img.height / texture_v_repeat;
					}
					else // tex.type == 'sprite' || 'floor'
					{
						tex.obj.w = tex.img.width;
						tex.obj.h = tex.img.height;
					}
				}
			}
			else
			{
				tex.obj.img = error_texture.img;
				tex.obj.w = error_texture.w;
				tex.obj.h = error_texture.h;
			}
			delete loading_textures[t];
		}
	}
}


function array_to_rgba(c)
{
	return 'rgba('+c[0]+','+c[1]+','+c[2]+',1)';
}

function colour_interpolate(c0, c1, n)
{
	var m = 1-n;
	return [ Math.floor(c0[0]*m+c1[0]*n),
	         Math.floor(c0[1]*m+c1[1]*n),
	         Math.floor(c0[2]*m+c1[2]*n) ];
}

function scripted_vertical_door(sector)
{
	var attached_edges = [];
	// Check all sectors attached to this one, and make a list of their
	// edges which this sector is attached to
	for (var e = 0; e < sector.edges.length; ++e)
	{
		if (sector.edges[e].dest)
		{
			var edges2 = sector.edges[e].dest.edges;
			for (var e2 = 0; e2 < edges2.length; ++e2)
			{
				if (edges2[e2].dest === sector)
				{
					attached_edges.push(edges2[e2]);
				}
			}
		}
	}

	return function (dt, dist)
	{
		var speed = 0.3;
		var h;
		if (dist < 2)
		{
			h = Math.min(1, sector.ceiling_height + speed*dt);
		}
		else
		{
			h = Math.max(0, sector.ceiling_height - speed*dt);
		}
		if (h != sector.ceiling_height)
		{
			for (var e = 0; e < attached_edges.length; ++e)
			{
				// TODO: maybe we want texture offsets?
				attached_edges[e].upper.v = h * attached_edges[e].upper.vscale;
			}
			sector.ceiling_height = h;
		}
	};
}

function preprocess_map(ctx, h)
{
	if (player.s)
	{
		player.sector_id = player.s.id;
	}
	
	sectors = [];
	level_data.proximity_triggers = [];
	
	for (var s = 0; s < level.sectors.length; ++s)
	{
		var sector = level.sectors[s];

		var new_sector = {
			id: s,
			floor_height: sector.floor_height,
			ceiling_height: sector.ceiling_height,
			light: sector.light,
			sector_id: s,
			sprites: {}
		};
		
		if (options_flags.gradient_surfaces)
		{
			var gradient;
			
			var dh = h * max_vertical_look;
			var stop0 = dh / (h+2*dh);
			var stop1 = (dh+h) / (h+2*dh);

			// Create the floor pattern
			if (! options_flags.textured_floors)
			{
				gradient = ctx.createLinearGradient(0, -dh, 0, h+dh);
				var c = colour_interpolate([ 0, 0, 0 ], sector.floor, sector.light);
				var c0 = array_to_rgba( colour_interpolate(c, [ 255, 255, 255 ], 0.3 ) );
				var c1 = array_to_rgba( c );
				gradient.addColorStop(1, c0);
				gradient.addColorStop(stop1, c0);
				gradient.addColorStop(0.5, c1);
				gradient.addColorStop(stop0, c1);
				gradient.addColorStop(0, c1);
				new_sector.floor = gradient;
			}
			else
			{
				new_sector.floor = load_texture('floor', 'testfloor');
			}

			// Create the ceiling pattern (no textured version yet)
			gradient = ctx.createLinearGradient(0, -dh, 0, h+dh);
			c = colour_interpolate([ 0, 0, 0 ], sector.ceiling, sector.light);
			c0 = array_to_rgba( colour_interpolate(c, [ 0, 0, 0 ], 0.3 ) );
			c1 = array_to_rgba( c );
			gradient.addColorStop(0, c0);
			gradient.addColorStop(stop0, c0);
			gradient.addColorStop(0.5, c1);
			gradient.addColorStop(stop1, c1);
			gradient.addColorStop(1, c1);
			new_sector.ceiling = gradient;
		}
		else
		{
			// No gradients - use flat colours
			c = colour_interpolate([ 0, 0, 0 ], sector.floor, sector.light);
			new_sector.floor = array_to_rgba( colour_interpolate(c, [ 255, 255, 255 ], 0.3/2 ) );
			c = colour_interpolate([ 0, 0, 0 ], sector.ceiling, sector.light);
			new_sector.ceiling = array_to_rgba( colour_interpolate(c, [ 0, 0, 0 ], 0.3/2 ) );
		}

		new_sector.edges = [];
		for (var e = 0; e < sector.edges.length; ++e)
		{
			var edge = sector.edges[e];
			var new_edge = {
				x0: edge.x0, y0: edge.y0,
				x1: edge.x1, y1: edge.y1,
				dest: edge.dest,
				dbg: edge.dbg
			};

			new_edge.len = point_distance(new_edge.x0, new_edge.y0, new_edge.x1, new_edge.y1);

			// Solid walls use lower.
			// Portal walls use lower, upper, middle(optional).
			new_edge.lower = {
				u: edge.tex.l.u,
				v: edge.tex.l.v,
				uscale: 1/edge.tex.l.us,
				vscale: 1/edge.tex.l.vs,
				tex: load_texture('wall', edge.tex.l.n)
			};
			new_edge.middle = {
				u: edge.tex.m.u,
				v: edge.tex.m.v,
				uscale: 1/edge.tex.m.us,
				vscale: 1/edge.tex.m.vs,
				tex: load_texture('wall', edge.tex.m.n)
			};
			new_edge.upper = {
				u: edge.tex.u.u,
				v: edge.tex.u.v,
				uscale: 1/edge.tex.u.us,
				vscale: 1/edge.tex.u.vs,
				tex: load_texture('wall', edge.tex.u.n || edge.tex.l.n)
			};
			
			new_sector.edges.push(new_edge);
		}

		// Link up the edge 'next' properties, for faster iteration around them
		for (e = 0; e < new_sector.edges.length; ++e)
		{
			new_sector.edges[e].next = new_sector.edges[ (new_sector.edges.length+e-1) % new_sector.edges.length ];
		}

		sectors.push(new_sector);
	}

	// Link up sectors through portal walls
	for (var s = 0; s < sectors.length; ++s)
	{
		for (var e = 0; e < sectors[s].edges.length; ++e)
		{
			var edge = sectors[s].edges[e];
			edge.dest = (edge.dest === 0 ? null : sectors[ edge.dest-1 ]);
		}
	}

	player.s = sectors[player.sector_id];
	
	// Handle scripted sectors
	for (var s = 0; s < level.sectors.length; ++s)
	{
		if (level.sectors[s].tags)
		{
			for (var t = 0; t < level.sectors[s].tags.length; ++t)
			{
				var tag = level.sectors[s].tags[t];
				if (tag.type == 'vertical door')
				{
					var c = polygon_centre(sectors[s]);
					level_data.proximity_triggers.push({
						x: c.x, y: c.y,
						fn: scripted_vertical_door(sectors[s])
					});
				}
				else
				{
					alert('invalid sector tag "' + tag.type + '"');
				}
			}
		}
	}

	// Handle sprites:

	sprites = [];

	for (var s = 0; s < level.sprites.length; ++s)
	{
		var new_sprite = {
			x: level.sprites[s].x,
			y: level.sprites[s].y,
			a: level.sprites[s].a
			// TODO: scaling
		};
		new_sprite.spritedef = load_sprite(level.sprites[s].sprite);
		new_sprite.sector = sectors[level.sprites[s].sector];
		
		new_sprite.z = level.sprites[s].z + new_sprite.sector.floor_height;


		// Add this sprite to all sectors which contain its bounding circle.
		// TODO: change this so sprites can move
		var r = new_sprite.spritedef.sprite.radius;
		var nearby_sectors = find_nearby_sectors(new_sprite.x, new_sprite.y, new_sprite.sector, r);
		for (var i = 0; i < nearby_sectors.length; ++i)
		{
			nearby_sectors[i].sprites[s] = 1;
		}
		
		sprites.push(new_sprite);
	}
}


function find_nearby_sectors_(x, y, sector, d, found)
{
	if (found[sector.id])
	{
		return;
	}
	found[sector.id] = true;
	
	for (var e = 0; e < sector.edges.length; ++e)
	{
		var edge = sector.edges[e];
		if (edge.dest)
		{
			var dist = point_line_distance_circle(x, y, edge.x0, edge.y0, edge.x1, edge.y1);
			if (dist <= d)
			{
				find_nearby_sectors_(x, y, edge.dest, d, found);
			}
		}
	}
}

function find_nearby_sectors(x, y, sector, d)
{
	var found = {};
	find_nearby_sectors_(x, y, sector, d, found);
	var found_sectors = [];
	for (var s in found)
	{
		found_sectors.push(sectors[s]);
	}
	return found_sectors;
}

// (dx,dy) is total displacement, t is time in seconds [which is relevant when we add gravity...]
function move_camera_by(dx, dy, t)
{
	/*
	Theoretical algorithm:
	- Find all sectors which are 'close' (reachable from edges within r+d of camera).
	- Construct list of edges and vertices, to collide the camera-circle against.
	  (This may get things wrong when 'close' sectors are overlapping. So limit the
	  distance 'd' to some small maximum, and tell people to not overlap nearby
	  sectors.)
	- Push edges inwards by r and expand vertices into circles of size r,
	  then collide a camera-point against them.
	- (Assert that d < r/2). Then move the camera to the end point, find any walls it's
	  now intersecting, and push the camera out.
	*/

	var radius = player.radius;

	var d = Math.sqrt(dx*dx + dy*dy);
	var nearby_sectors = find_nearby_sectors(player.x, player.y, player.s, d+radius);

	for (var s = 0; s < nearby_sectors.length; ++s)
	{
		for (var e = 0; e < nearby_sectors[s].edges.length; ++e)
		{
			var edge = nearby_sectors[s].edges[e];

			// Try colliding against solid/portal wall:
			
			// If this is a portal wall, check whether we can fit between
			// new sector's floor and ceiling
			if (edge.dest &&
				(player.z+player.maxstep >= edge.dest.floor_height && player.z+player.height <= edge.dest.ceiling_height))
			{
				// okay - can pass
			}
			else
			{
				// Check whether we're on the inside of this edge
				var dir = dx*(edge.y1-edge.y0) - dy*(edge.x1-edge.x0);
				if (dir > 0)
				{
					// Check whether we're too close to the edge
					var dist = point_line_distance_circle(player.x+dx, player.y+dy, edge.x0, edge.y0, edge.x1, edge.y1);
					if (dist < radius)
					{
						// Push outwards along the edge's normal
						var d = radius-dist;
						var nx = edge.y0 - edge.y1;
						var ny = edge.x1 - edge.x0;
						var n = d / Math.sqrt(nx*nx + ny*ny);
						dx += nx*n;
						dy += ny*n;
					}
				}


				// TODO: this is quite broken - it's possible to fly up the corners
				// of objects by running into them. The stuff below doesn't
				// actually help (now that the above look is using _circle instead of _perp),
				// so don't bother with it.

				/*
				// Check whether we're inside circles around the edge's vertices
				// (TODO: this does far too much redundant work)

				var dist = point_distance(player.x+dx, player.y+dy, edge.x0, edge.y0);
				if (dist < radius)
				{
					// Push outwards along the edge's normal
					var d = radius-dist;
					var nx = edge.y0 - edge.y1;
					var ny = edge.x1 - edge.x0;
					var n = d / Math.sqrt(nx*nx + ny*ny);
					dx += nx*n;
					dy += ny*n;
				}

				var dist = point_distance(player.x+dx, player.y+dy, edge.x1, edge.y1);
				if (dist < radius)
				{
					// Push outwards along the edge's normal
					var d = radius-dist;
					var nx = edge.y0 - edge.y1;
					var ny = edge.x1 - edge.x0;
					var n = d / Math.sqrt(nx*nx + ny*ny);
					dx += nx*n;
					dy += ny*n;
				}
				*/
			}
		}
	}
	
	// Now player.(x,y) + (dx,dy) is a valid place to be.
	
	player.x += dx;
	player.y += dy;

	// Work out which sector it is in. (This is probably more robust than
	// trying to work out which boundaries have been crossed, because the
	// path dx,dy might be jumping outside the level geometry.)
	
	var new_sectors;
	
	for (var s = 0; s < nearby_sectors.length; ++s)
	{
		if (point_is_in_polygon(player.x, player.y, nearby_sectors[s]))
		{
			player.s = nearby_sectors[s];
			break;
		}
	}
}

function rotate_camera(da)
{
	var a = Math.atan2(player.dx, player.dy);
	a -= da;
	player.dx = Math.sin(a);
	player.dy = Math.cos(a);
}

function move_camera(dx, dy)
{
	var d = Math.sqrt(dx*dx + dy*dy);
	dx /= d;
	dy /= d;
	var step_size = player.radius / 2;
	while (d >= step_size)
	{
		move_camera_by(dx*step_size, dy*step_size, 1);
		d -= step_size;
	}
	if (d > 0)
	{
		move_camera_by(dx*d, dy*d, 1);
	}
}

function walk_camera(forwards, sideways)
{
	var dx = player.dx*forwards-player.dy*sideways;
	var dy = player.dy*forwards+player.dx*sideways;
	move_camera(dx, dy);
}

function jump()
{
	if (player.on_floor)
	{
		player.vz = 2;
	}
}

function process_input(keys, dt)
{
	var walk_speed = 1.5;
	var strafe_speed = walk_speed / 2;
	var turn_speed = 1;
	var look_speed = 1;

	if (keys[DOM_VK.LEFT])  { rotate_camera(-turn_speed*dt); } 
	if (keys[DOM_VK.RIGHT]) { rotate_camera( turn_speed*dt); } 

	var dx = 0, dy = 0;
	if (keys[DOM_VK.UP])   { dx += walk_speed; }
	if (keys[DOM_VK.DOWN]) { dx -= walk_speed; }

	// Opera sends keyCode 44 (Mozilla's DOM_VK_DELETE) for
	// both '.' and 'del'. We can't tell them apart, so just accept
	// 'del' as an alternative strafe key.
	// It also sends 44 (DOM_VK_PRINTSCREEN) for ',', though it doesn't
	// receive the printscreen key at all.
	// And some keyboards (e.g. French AZERTY) seem to require shift+semicolon
	// to get '.', so also allow X/C for strafing.

	if (keys[DOM_VK.COMMA] || keys[DOM_VK.PRINTSCREEN] || keys[DOM_VK.X])
		{ dy -= strafe_speed; }
	if (keys[DOM_VK.PERIOD] || keys[DOM_VK.DELETE] || keys[DOM_VK.C])
		{ dy += strafe_speed; }

	if (dx || dy)
	{
		// Ensure constant velocity; strafing just changes the direction
		var d = Math.sqrt(dx*dx + dy*dy);
		dx /= d;
		dy /= d;
		walk_camera(dx*walk_speed*dt, dy*walk_speed*dt);
	}

	if (keys[DOM_VK.PAGE_UP])   { player.dh = Math.min(+max_vertical_look, player.dh+look_speed*dt); }
	if (keys[DOM_VK.PAGE_DOWN]) { player.dh = Math.max(-max_vertical_look, player.dh-look_speed*dt); }
	
	if (keys[DOM_VK.SPACE]) { jump(); }
}

function do_gravity(dt)
{
	var gravity_accel = 5;

	var max_floor = -Infinity, min_ceiling = Infinity;

	var r = player.radius - 0.01; // slight fudginess to prevent floating up walls
	
	var nearby_sectors = find_nearby_sectors(player.x, player.y, player.s, r);

	for (var s = 0; s < nearby_sectors.length; ++s)
	{
		max_floor = Math.max(nearby_sectors[s].floor_height, max_floor);
		min_ceiling = Math.min(nearby_sectors[s].ceiling_height, min_ceiling);
	}
	
	if (player.z == max_floor && player.vz <= 0)
	{
		// Nothing much to do if they're already standing on the floor
		player.vz = 0;
		player.on_floor = true;
	}
	else
	{
		// Accelerate downwards
		// (Not particularly accurate because we're moving in discrete steps)
		player.vz -= gravity_accel*dt;

		player.on_floor = false;

		if (player.vz > 0)
		{
			// Moving upwards:
			
			if (player.z + player.vz*dt + player.height <= min_ceiling)
			{
				// Okay to jump up this far
				player.z += player.vz*dt;
			}
			else
			{
				// Stick them to the ceiling
				player.z = min_ceiling-player.height;
				player.vz = 0;
			}
		}
		else if (player.vz < 0)
		{
			// Moving downwards:
			
			if (player.z + player.vz*dt >= max_floor)
			{
				// Okay to fall down this far
				player.z += player.vz*dt;
			}
			else
			{
				// Stick them to the floor
				player.z = max_floor;
				player.vz = 0;
				player.on_floor = true;
			}
		}
	}
}

function process_scripts(dt)
{
	for (var i = 0; i < level_data.proximity_triggers.length; ++i)
	{
		var trigger = level_data.proximity_triggers[i];
		var dist = point_distance(trigger.x, trigger.y, player.x, player.y);
		trigger.fn(dt, dist);
	}
}

function draw_map(ctx)
{
	ctx.fillStyle = '#fffff0';
	var w = ctx.canvas.width;
	var h = ctx.canvas.height;
	ctx.fillRect((-map_shift_x-w/2)/map_scale, (-map_shift_y-h/2)/map_scale, w/map_scale, h/map_scale);
	
	var d = '';

	for (var s = 0; s < sectors.length; ++s)
	{
		var sector = sectors[s];
		for (var e = 0; e < sector.edges.length; ++e)
		{
			var edge = sector.edges[e];

			if (sector == camera.s)
			{
				ctx.strokeStyle = '#0000ff';
			}
			else if (edge.dest === null)
			{
				ctx.strokeStyle = '#00ff00';
			}
			else
			{
				ctx.strokeStyle = '#ff0000';
			}
			ctx.beginPath();
			ctx.moveTo(edge.x0, edge.y0);
			ctx.lineTo(edge.x1, edge.y1);
			ctx.stroke();
		}
	}

	ctx.strokeStyle = '#ff00ff';
	ctx.beginPath();
	ctx.moveTo(camera.x, camera.y);
	ctx.lineTo(camera.x+camera.dx*0.2, camera.y+camera.dy*0.2);
	ctx.stroke();
	ctx.closePath();
}


function fpsgraph_enable(state)
{
	if (! fpsgraph_enabled)
	{
		var obj = document.createElementNS('http://www.w3.org/1999/xhtml', 'object');
		obj.width = 640;
		obj.height = 320;
		obj.data = 'fpsgraph/fpsgraph.xhtml';
		obj.id = 'fpsgraph';
		$('fpsgraph_container').appendChild(obj);
		$('fpsgraph_container').style.display = 'block';
		fpsgraph_enabled = true;
	}
}

const STATE_LOADING = 0;
const STATE_PLAYING = 1;
var game_state = STATE_LOADING;
function game_tick(ctx, dctx, gctx, w, h, keys, dt)
{
	switch (game_state)
	{
	case STATE_LOADING:
		// ...
		break;

	case STATE_PLAYING:
		process_input(keys, dt);
		do_gravity(dt);
		process_scripts(dt);
		
		camera.x = player.x;
		camera.y = player.y;
		camera.z = player.z + player.eyeline;
		camera.dx = player.dx;
		camera.dy = player.dy;
		camera.dh = player.dh;
		camera.s = player.s;
		camera.t += dt;

		if (dctx)
		{
			profile_begin('map');
			draw_map(dctx);
			profile_end('map');
		}
		
		process_pending_textures(ctx);
		
		render_frame(ctx, dctx, gctx, w, h, camera);

		break;
	}
}

function on_map_loaded(ctx, h)
{
//	upgrade_level(); // XXX
	preprocess_map(ctx, h);

	if (editor_enabled)
	{
		var reload_map = function ()
		{
			preprocess_map(ctx, h);
		};

		editor_init(reload_map);
	}

	game_state = STATE_PLAYING;
}









window.addEventListener('load', function()
{
	profiler_enabled = ($('profile') !== null);

	// Set up the graphics system

	var screen_ctx = $('c').getContext('2d');

	var w = $('c').width;
	var h = $('c').height;

	var render_ctx, render_canvas;
	if (options_flags.double_buffer)
	{
		// Create temporary canvas for double-buffering
		render_canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
		render_canvas.width = w;
		render_canvas.height = h;
		render_ctx = render_canvas.getContext('2d');
	}
	else
	{
		// Draw directly onto the screen
		render_ctx = screen_ctx;
	}
	
	if (options_flags.opera_context)
	{
		try
		{
			var gctx = $('c').getContext('opera-2dgame');
			if (gctx)
			{
				gctx.lockCanvasUpdates(true);
			}
		}
		catch (e)
		{
			// context not available
		}
	}

	var dctx;
	if (options_flags.map && $('dc'))
	{
		dctx = $('dc').getContext('2d');
		dctx.lineWidth = 1/map_scale;
		dctx.translate(map_shift_x+dctx.canvas.width/2, map_shift_y+dctx.canvas.height/2);
		dctx.scale(map_scale, map_scale);
	}

	// Allow resolution changes

	window.change_res = function (new_w, new_h, ui_class)
	{
		w = new_w;
		h = new_h;
		if (render_ctx != screen_ctx)
		{
			render_canvas.width = w;
			render_canvas.height = h;
		}
		$('c').width = w;
		$('c').height = h;
		$('ui').setAttribute('class', ui_class);
		preprocess_map(render_ctx, h);
	};

	//////
/*
	if ($('options'))
	{
		var options = [
			[ 'gradient_surfaces', 'Gradient floor/ceiling', [0, 1], function(){ preprocess_map(ctx, h); } ],
			[ 'lighting_workaround', 'Alternate lighting (workaround for Opera)', [0, 1] ],
			[ 'horizontal_scale', 'Horizontal raycasting scale', [1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32] ],
			[ 'low_textures', 'Low detail textures', [1, 0], function(){ flush_textures(); preprocess_map(ctx, h); } ]
		];
		var options_html = '';
		for (var o in options)
		{
			options_html += '<select id="options__'+options[o][0]+'">';
			var choices = options[o][2];
			for (var c in choices)
			{
				options_html += '<option value="'+choices[c]+'">'+choices[c]+'</option>';
			}
			options_html += '</select> - <b>'+options[o][1]+'</b><br/>';
		}
		$('options').innerHTML = options_html;
		for (var o in options)
		{
			var obj = $('options__'+options[o][0]);
			for (var i in obj.options)
			{
				if (obj.options[i].value == options_flags[options[o][0]])
				{
					obj.selectedIndex = i;
					break;
				}
			}
			(function(){
				var option = options[o];
				obj.onchange = function (e)
				{
					options_flags[option[0]] = Math.floor(this.options[this.selectedIndex].value);
					if (option[3]) { option[3](); }
				};
			})();
		}
	}
*/

	//////

	// Per-frame operation and pausing

	var last_frame_time = null; // should only be non-null while the game is running (not paused)
	function tick()
	{
		try
		{
			var now = new Date();
			var dt = Math.max(0, now - (last_frame_time || now)) / 1000;
			last_frame_time = now;
			// TODO: smoother updates, particularly on Windows where the timer
			// is limited to ~16msec resolution

			game_tick(render_ctx, dctx, gctx, w, h, keys, dt);
			if (render_ctx !== screen_ctx)
			{
				screen_ctx.drawImage(render_canvas, 0, 0);
			}
		
			profile_report();
			framerate_update();
		}
		catch (e)
		{
			debug(e);
		}
	}

	var paused = true;

	var frame_interval;
	function toggle_paused()
	{
		paused = !paused;
		if (paused)
		{
			render_paused(screen_ctx, w, h);
			clearInterval(frame_interval);
			last_frame_time = null;
		}
		else
		{
			frame_interval = setInterval(tick, editor_enabled ? 100 : 0);
		}
	}

	$('pause').onclick = toggle_paused;

	//////

	// Set up input handlers

	if (dctx)
	{
		$('dc').onmousemove = function(e)
		{
			var x = e.clientX-this.offsetLeft;
			var y = e.clientY-this.offsetTop;
			x -= player.x*map_scale + map_shift_x + dctx.canvas.width/2;
			y -= player.y*map_scale + map_shift_y + dctx.canvas.height/2;
			var mag = Math.sqrt(x*x + y*y);
			x /= mag;
			y /= mag;
			player.dx = x;
			player.dy = y;
		};
	
		$('dc').onclick = function(e)
		{
			var x = e.clientX-this.offsetLeft;
			var y = e.clientY-this.offsetTop;
			move_camera((x - map_shift_x - dctx.canvas.width/2) / map_scale-player.x,
			            (y - map_shift_y - dctx.canvas.height/2) / map_scale-player.y);
		};
	}
	
	var keys = {};
	document.addEventListener('keydown', function(e)
	{
		keys[e.keyCode] = true;
	},
	false);

	document.addEventListener('keyup', function(e)
	{
		keys[e.keyCode] = false;
	},
	false);
	
	document.addEventListener('keypress', function(e)
	{
		// TODO: the keycode values are completely nonstandard - is
		// there a more reliable way of handling them?

		var handled = true;
		switch (e.keyCode)
		{
		case DOM_VK.LEFT: case DOM_VK.RIGHT:
		case DOM_VK.UP: case DOM_VK.DOWN:
		case DOM_VK.PAGE_UP: case DOM_VK.PAGE_DOWN:
		case DOM_VK.COMMA: case DOM_VK.PERIOD:
		case DOM_VK.DELETE:
			// Browsers might want to do something with these keys
			// (especially Opera) - but we want to use them instead,
			// so prevent the default action
			handled = false; // don't want to stop propagation to game's key handlers
			e.preventDefault(); // do want to stop the browser's default
			break;

		case DOM_VK.PAUSE:
			toggle_paused();
			break;

		case DOM_VK.HOME: case DOM_VK.END:
			player.dh = 0;
			break;

		default:
			switch (e.which)
			{
			case 116: // T
				if (e.ctrlKey)
				{
					// let people do ctrl+t to open tabs
					handled = false;
				}
				else
				{
					fpsgraph_enable(true);
				}
				break;

			case 32: // SPACE
			case 44: case 46: // comma, period
			case 120: case 99: // x, c
				handled = false;
				e.preventDefault();
				break;

			default:
				handled = false;
				break;
			}
		}

		if (handled)
		{
			e.preventDefault();
			e.stopPropagation();
		}
	},
	false);

	//////

	if (level)
	{
		on_map_loaded(render_ctx, h);
	}
	else
	{
		load_from_file_store_async('map_test0',
			function (obj)
			{
				level = obj;
				on_map_loaded(render_ctx, h);
			}
		);
	}

	//////
	
	if (ui_enabled)
	{
		try
		{
			ui.init();
		}
		catch (e)
		{
			alert('UI initialisation failure: ' + e);
		}
	}

	//////

	// Start the game
	toggle_paused();

}, false); // addEventListener










var socket = new io.Socket(null, {port: 8080, rememberTransport: false});
socket.connect();
socket.on('connect', function(){ console.log('connected'); }) 
socket.on('message', function(message){ console.log('message: ' + message); }) 
socket.on('disconnect', function(){ console.log('disconnected'); }) 

window.setInterval(function() {
 socket.send({x: player.x, y: player.y, z: player.z});
}, 500);








})(); // [end private]
