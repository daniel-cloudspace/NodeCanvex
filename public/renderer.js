/*
 * Copyright 2006 Philip Taylor
 * <philip at zaynar.demon.co.uk> / <excors at gmail.com>
 * Distributed under the terms of the GPL (http://www.gnu.org/licenses/gpl.txt)
 */

var sectors;
var sprites;

const mipmap_bias = -0.5;

const near_clip = 0.01;

// dx, dy, dw, dh: integer
// fills dx,dy (inclusive) -> dx+dw,dy+dh (exclusive)
// u1, sy, u1, sh: float
function draw_texture_strip(ctx, tex, u0,sy,u1,sh, dx,dy,dw,dh)
{
	while (u1 >= texture_u_repeat)
	{
		var d = Math.floor(dw*(1-u0)/(u1-u0));
		ctx.drawImage(tex.img, tex.w*u0, tex.h*sy, tex.w*(1-u0), tex.h*sh, dx, dy, d, dh);
//		ctx.strokeStyle='#ff0000'; ctx.strokeRect(dx,dy,d,dh);

		dx += d;
		dw -= d;
		u0 = 0;
		u1 -= 1;
	}
	ctx.drawImage(tex.img, tex.w*u0, tex.h*sy, tex.w*(u1-u0), tex.h*sh, dx, dy, dw, dh);
//	ctx.strokeStyle='#ff0000'; ctx.strokeRect(dx,dy,dw,dh);
}

function get_mip(tex, s)
{
	var miplevel = Math.ceil(mipmap_bias + Math.log(s)/Math.LN2);
	if (miplevel < mipmap_min)
	{
		miplevel = mipmap_min;
	}
	else if (miplevel >= tex.length)
	{
		miplevel = tex.length-1;
	}
	else if (isNaN(miplevel))
	{
		miplevel = mipmap_min;
	}

	return tex[miplevel];
}

function get_mip_level(tex, s)
{
	var miplevel = Math.ceil(mipmap_bias + Math.log(s)/Math.LN2);
	if (miplevel < mipmap_min)
	{
		miplevel = mipmap_min;
	}
	else if (miplevel >= tex.length)
	{
		miplevel = tex.length-1;
	}
	else if (isNaN(miplevel))
	{
		miplevel = mipmap_min;
	}

	return miplevel;
}

function draw_texture(ctx, h, clip_y0, clip_y1, tex, sx,sy,sw,sh, dx,dy,dw,dh)
{
	var miptex;
	if (sw < 1e-6) { return; }

	if (options_flags.draw_pattern_walls)
	{
		miptex = get_mip(tex, dw/sw);
		try{ // TODO - need to fix default textures here

			ctx.save();
			ctx.fillStyle = miptex.img;

			ctx.scale(dw/(sw*miptex.w), dh/(sh*miptex.h));
			ctx.translate((dx*sw/dw-sx)*miptex.w, (dy*sh/dh-sy)*miptex.h);
			ctx.fillRect(sx*miptex.w, sy*miptex.h, sw*miptex.w, sh*miptex.w);

//	ctx.strokeStyle='#ff0000'; ctx.strokeRect(sx*miptex.w, sy*miptex.h, sw*miptex.w, sh*miptex.w);

			ctx.restore();

		}catch(e){debug(e);}
	}
	else
	{
	
		var u0 = (sx<0 ? 1+sx%1 : sx%1);
		var v0 = (sy<0 ? 1+sy%1 : sy%1);
		var v1 = v0+sh;

		while (v1 >= texture_v_repeat)
		{
			var d = Math.floor(dh*(1-v0)/(v1-v0));
			if (dy < clip_y1 && dy+d >= clip_y0 && d > 0)
			{
				if (! miptex) { miptex = get_mip(tex, dw/sw); }
				draw_texture_strip(ctx, miptex, u0, v0, u0+sw, 1-v0, dx, dy, dw, d);
			}
			dy += d;
			dh -= d;
			v0 = 0;
			v1 -= 1;
		}

		if (dy < clip_y1 && dy+dh >= clip_y0 && dh > 0)
		{
			if (! miptex) { miptex = get_mip(tex, dw/sw); }
			draw_texture_strip(ctx, miptex, u0, v0, u0+sw, v1-v0, dx, dy, dw, dh);
		}
	}
//	ctx.strokeStyle='#ff0000';ctx.strokeRect(dx,dy,dw,dh);
}

// Helper function to sort sprites by depth
function sprite_sort(a, b)
{
	return (a.w > b.w ? -1 : a.w < b.w ? 1 : 0);
}

// Draw sprites inside sector, clipped to x0 (inclusive) - x1 (exclusive)
function render_sprites(ctx, camera, sector, x0, x1, w, h)
{
	var sorted_sprites = [];
	for (var s in sector.sprites)
	{
		var sprite = sprites[s];
		var depth = point_depth(camera.x, camera.y, camera.dx, camera.dy, sprite.x, sprite.y);
		if (depth > 0)
		{
			sorted_sprites.push({ sprite:sprite, w:depth });
		}
	}

	sorted_sprites.sort(sprite_sort);

	ctx.beginPath(); // XXX hack for FF1.5, 2.0b1

	for (var s = 0; s < sorted_sprites.length; ++s)
	{
		var sprite = sorted_sprites[s].sprite;
		var depth = sorted_sprites[s].w;
		
		var numframes = sprite.spritedef.sprite.frames;
		var numangles = sprite.spritedef.sprite.angles;
		var frame = Math.floor(camera.t*1000 / sprite.spritedef.sprite.speed) % numframes;
		var angle = Math.PI + sprite.a - Math.atan2(sprite.y-camera.y, sprite.x-camera.x);
		angle = (numangles + Math.round(angle * numangles / (2 * Math.PI))) % numangles;
		var tex = sprite.spritedef.images[frame + angle*numframes];

		var x = w*(0.5 + uncast_ray(sprite.x, sprite.y, camera));
		var height = h*(sprite.spritedef.sprite.height / depth);
		var width = height * tex.w / tex.h;
		
		var clipped_x0 = x-width/2;
		var clipped_x1 = x+width/2;
		if (clipped_x0 < x1 && clipped_x1 > x0)
		{
			var zbase = h*(0.5 - (-camera.z + sprite.z) / depth);
			var u0 = 0, u1 = 1;

			if (clipped_x0 < x0)
			{
				u0 = (x0 - clipped_x0) / width;
				clipped_x0 = x0;
			}
			if (clipped_x1 > x1)
			{
				u1 = 1 - (clipped_x1 - x1) / width;
				clipped_x1 = x1;
			}
			ctx.drawImage(tex.img, u0*tex.w, 0, (u1-u0)*(tex.w-0.01), tex.h, clipped_x0, zbase-height, clipped_x1-clipped_x0, height);
		}
	}
}

function render(w, h, ctx, dctx, camera)
{
	var dh = Math.floor(camera.dh * h); // integer translations are much faster
	if (dh !== 0)
	{
		ctx.save();
		ctx.translate(0, dh);
	}

	render_rays(0, w, -dh, h-dh, camera.s, w, h, ctx, dctx, camera, 0);

	if (dh !== 0)
	{
		ctx.restore();
	}
}

function max_abs(x, y)
{
	x = Math.abs(x);
	y = Math.abs(y);
	return x > y ? x : y;
}

// Clips to (x,clip_y0)inclusive -> (edge_end,clip_y1)exclusive (but may overshoot in the vertical direction)
function draw_poly(ctx, h, tex, x, edge_end, clip_y0, clip_y1, bot0, top0, bot1, top1, w0, w1, u0, u1, v0, v1, floor, ceiling, lighting, solid)
{
	if (w0 < near_clip || w1 < near_clip)
	{
		return;
	}
	
/*
ctx.strokeStyle = '#ffffff';
ctx.beginPath();
ctx.moveTo(x, top0);
ctx.lineTo(x, bot0);
ctx.lineTo(edge_end, bot1);
ctx.lineTo(edge_end, top1);
ctx.closePath();
ctx.stroke();

	if (floor && (top0 < clip_y1 || top1 < clip_y1))
	{
		ctx.strokeStyle = '#ff0000';
		ctx.beginPath();
		ctx.moveTo(x, clip_y1-1);
		ctx.lineTo(x, top0);
		ctx.lineTo(edge_end, top1);
		ctx.lineTo(edge_end, clip_y1-1);
		ctx.closePath();
		ctx.stroke();
	}
	if (ceiling && (bot0 >= clip_y0 || bot1 >= clip_y0))
	{
		ctx.strokeStyle = '#00ff00';
		ctx.beginPath();
		ctx.moveTo(x, clip_y0);
		ctx.lineTo(x, bot0);
		ctx.lineTo(edge_end, bot1);
		ctx.lineTo(edge_end, clip_y0);
		ctx.closePath();
		ctx.stroke();
	}
	if (floor || ceiling)
	{
		// TODO: why do I need this?
		ctx.beginPath();
	}

*/
	ctx.beginPath(); // XXX hack for FF1.5, 2.0b1

	// Apply texture offsets
	u0 = u0*tex.uscale + tex.u;
	u1 = u1*tex.uscale + tex.u;
	v0 = v0*tex.vscale + tex.v;
	v1 = v1*tex.vscale + tex.v;

	var u0w = u0 / w0;
	var u1w = u1 / w1;

	var dtop = (top1-top0) / (edge_end-x);
	var dbot = (bot1-bot0) / (edge_end-x);
	var dt = 1 / (edge_end-x);
	var t = 0;
	var top = top0;
	var bot = bot0;
	var xp = x;

	var max_dy = 2;
	var min_dx = 8;
	var max_dx = Infinity;

	// dx*dtop = max_dy
	// dx*dbot = max_dy
	// => dx*max_abs(dtop, dbot) = max_dy
	// => dx = max_dy/max(dtop, dbot)

	var dy = max_abs(dtop, dbot);
	var dx = Math.floor(max_dy / dy);
	if (dx < min_dx) { dx = min_dx; }
	if (dx > max_dx) { dx = max_dx; }
	// Avoid jagged edges by ensuring the rectangles are sized to the outside
	// of the polygon, rather than the inside.
	if (dtop > 0) { top += dtop*dx; }
	if (dbot < 0) { bot += dbot*dx; }

	var alpha_texture = !(solid && !options_flags.no_alpha_texture);

	if (!alpha_texture && lighting < 1)
	{
		ctx.globalAlpha = lighting;
	}

	if (! solid)
	{
		// XXX - workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=347458
		ctx.beginPath();
		ctx.rect(0, 0, 0, 0);
		ctx.stroke();

		ctx.save();
		ctx.beginPath();
		ctx.moveTo(x, bot0);
		ctx.lineTo(edge_end, bot1);
		ctx.lineTo(edge_end, top1);
		ctx.lineTo(x, top0);
		ctx.clip();
	}

	var u = u0;
	while (xp < edge_end)
	{
		profile_count("draw strip");

		if (xp + dx > edge_end) { dx = edge_end - xp; }

		t += dx*dt;

		if (top >= clip_y0 && bot < clip_y1)
		{
			if (v1 > v0)
			{
				var topi = Math.floor(top);
				var boti = Math.floor(bot);
				var ul = u;
				u = ( (1-t)*u0w + t*u1w ) / ( (1-t)/w0 + t/w1 );
				draw_texture(ctx, h, clip_y0, clip_y1, tex.tex, ul, v0, u-ul, v1-v0,  xp, boti, dx, topi-boti+1);

				if (alpha_texture && lighting < 1)
				{
					ctx.fillStyle = '#000000';
					ctx.globalAlpha = 1-lighting;
					ctx.fillRect(xp, boti, dx, topi-boti+1);
					ctx.globalAlpha = 1;
				}
			}
		}
		xp += dx;
		top += dx*dtop;
		bot += dx*dbot;
	}

	if (! solid)
	{
		ctx.restore();
	}

	if (!alpha_texture && lighting < 1)
	{
		ctx.globalAlpha = 1;
	}

	if (floor && (top0 < clip_y1 || top1 < clip_y1))
	{
		if (! options_flags.textured_floors)
		{
			ctx.fillStyle = floor;
			//ctx.fillStyle = 'rgba(255,255,255,0.5)';
			ctx.beginPath();
			ctx.moveTo(x, clip_y1);
			ctx.lineTo(x, top0);
			ctx.lineTo(edge_end, top1);
			ctx.lineTo(edge_end, clip_y1);
			ctx.fill();
		}
	}
	if (ceiling && (bot0 >= clip_y0 || bot1 >= clip_y0))
	{
		ctx.fillStyle = ceiling;
		//ctx.fillStyle = 'rgba(255,255,255,0.5)';
		ctx.beginPath();
		ctx.moveTo(x, clip_y0-1);
		ctx.lineTo(x, bot0);
		ctx.lineTo(edge_end, bot1);
		ctx.lineTo(edge_end, clip_y0-1);
		ctx.fill();
	}

	//*/
}

function draw_floor(dctx, ctx, h, w, camera, isctn0, isctn1, sector, clip_y, x0, x1, y0, y1)
{
	const step = 2;
	const r = 2*32;

	var z = sector.floor_height-camera.z;
	
	// XXX - workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=347458
	ctx.beginPath();
	ctx.rect(0, 0, 0, 0);
	ctx.stroke();

	ctx.save();

	ctx.beginPath();
	ctx.moveTo(x0, y0);
	ctx.lineTo(x1, y1);
	ctx.lineTo(x1, clip_y);
	ctx.lineTo(x0, clip_y);
	ctx.closePath();
	ctx.clip();

	for (var screeny = Math.floor(Math.min(y0, y1)); screeny < clip_y; screeny += step)
	{
		/*
		screeny = h*(0.5 - z/d);
		=> z = d*(0.5 - screeny/h);
		=> d = z/(0.5 - screeny/h);
		*/
		var d = z / (0.5 - screeny/h);
		var c0 = ray_coords(d, x0/w-0.5, camera);
		var c1 = ray_coords(d, x1/w-0.5, camera);

		/*
		if (x0){
			dctx.fillStyle='#000000';
			dctx.fillRect(c0.x, c0.y, 0.15, 0.15);
			dctx.fillRect(c1.x, c1.y, 0.15, 0.15);
		}
		*/
		
		// c0*r = uv0 is UV coords of left point, c1*r of right
		// s0 is [x0, sy], s1 is [x1, sy]
		
		// Need M*uv0*128 = s0, M*uv1*128 = s1
		// => (M*128)*(uv0-uv1) = s0-s1
		
		// M*128 = scale(|s0-s1| / |uv0-uv1|) * rotate(-atan2(v0-v1, u0-u0))
		// M = scale(|s0-s1| / |uv0-uv1| / 128) * rotate(-atan2(v0-v1, u0-u0)) * translate(tx, ty)
		
		// M*uv0*128 = s0
		// => scale(|s0-s1| / |uv0-uv1|) * rotate(-atan2(v0-v1, u0-u0)) * translate(tx, ty) * uv0 = s0
		// => translate(tx, ty) * uv0 = (scale(|s0-s1| / |uv0-uv1|) * rotate(-atan2(v0-v1, u0-u0)))^-1 * s0
		// => translate(tx, ty) * uv0 = scale(|uv0-uv1| / |s0-s1|) * rotate(atan2(v0-v1, u0-u0)) * s0
		// => [tx, ty] = scale(|uv0-uv1| / |s0-s1|) * rotate(atan2(v0-v1, u0-u0)) * s0 - uv0
		
		var s_over_uv = (x1-x0) / (r * point_distance(c0.x, c0.y, c1.x, c1.y));

		var angle = Math.atan2(c0.y-c1.y, c0.x-c1.x);
		var cos_scaled = Math.cos(angle) / s_over_uv;
		var sin_scaled = Math.sin(angle) / s_over_uv;

		var tx = (cos_scaled*x0 - sin_scaled*screeny) + c0.x*r;
		var ty = (sin_scaled*x0 + cos_scaled*screeny) + c0.y*r;

		var y0b = screeny;
		var y1b = screeny+step;
		var x0b = x0;
		var x0c = x0;
		var x1b = x1;
		var x1c = x1;

		var mip = get_mip_level(sector.floor, s_over_uv/48);
		var s = 128 / Math.pow(2, mip);

		ctx.fillStyle = sector.floor[mip].img;

		ctx.save();
		ctx.scale(s_over_uv*s, s_over_uv*s);
		ctx.rotate(-angle);
		ctx.translate(tx/s, ty/s);
		ctx.beginPath();
		ctx.moveTo((x0c*cos_scaled-y1b*sin_scaled-tx)/s, (x0c*sin_scaled+y1b*cos_scaled-ty)/s);
		ctx.lineTo((x0b*cos_scaled-y0b*sin_scaled-tx)/s, (x0b*sin_scaled+y0b*cos_scaled-ty)/s);
		ctx.lineTo((x1b*cos_scaled-y0b*sin_scaled-tx)/s, (x1b*sin_scaled+y0b*cos_scaled-ty)/s);
		ctx.lineTo((x1c*cos_scaled-y1b*sin_scaled-tx)/s, (x1c*sin_scaled+y1b*cos_scaled-ty)/s);
		ctx.fill();
		ctx.restore();
	}

	ctx.restore();
}

// Draw between pixel coordinates x0 (inclusive), x1 (exclusive)
function render_rays(x0, x1, y0, y1, sector, w, h, ctx, dctx, camera, limit)
{
	var x = x0;

	var isctn0 = cast_ray(sector, x/w-0.5, camera);

	while (x < x1)
	{
		profile_count("cast strip");
		
		if (dctx)
		{
			var px = x/w - 0.5;
			dctx.strokeStyle = '#ff0000';
			dctx.beginPath();
			dctx.moveTo(camera.x, camera.y);
			dctx.lineTo(camera.x+camera.dx-px*camera.dy, camera.y+camera.dy+px*camera.dx);
			dctx.stroke();
		}

		var edge = isctn0.edge;
		if (! edge)
		{
			// TODO: this shouldn't happen, but it does if we're
			// right on the edge of a sector looking outwards
			ctx.fillStyle = '#000000';
			ctx.fillRect(x, 0, 1, h);
			//debug("no edge "+camera.dx+","+camera.dy);
			++x;

			isctn0 = cast_ray(sector, x/w-0.5, camera);
		}
		else
		{
			if (dctx)
			{
				dctx.strokeStyle = '#0000ff';
				dctx.beginPath();
				dctx.moveTo(camera.x, camera.y);
				dctx.lineTo(edge.x1, edge.y1);
				dctx.stroke();
			}

			// edge_end: exclusive pixel coord
			var edge_end = Math.floor(1+w*(0.5 + uncast_ray(edge.x1, edge.y1, camera)));
			
			var isctn1;
			// Clip to viewport rectangle
			if (edge_end > x1)
			{
				edge_end = x1;
				isctn1 = cast_ray_edge(edge, x1/w-0.5, camera);
			}
			else
			{
				isctn1 = { dist: point_depth(camera.x, camera.y, camera.dx, camera.dy, edge.x1, edge.y1), u: edge.len };
			}

			if (edge.dest === null)
			{
				// Solid wall
				
				var bottom0 = h*(0.5 - (-camera.z + sector.ceiling_height)/isctn0.dist);
				var top0    = h*(0.5 - (-camera.z + sector.floor_height)/isctn0.dist);
				var bottom1 = h*(0.5 - (-camera.z + sector.ceiling_height)/isctn1.dist);
				var top1    = h*(0.5 - (-camera.z + sector.floor_height)/isctn1.dist);
				
				var w0 = isctn0.dist;
				var w1 = isctn1.dist;
				var u0 = isctn0.u;
				var u1 = isctn1.u;
				var v0 = -sector.ceiling_height;
				var v1 = -sector.floor_height;

				draw_poly(ctx, h, edge.lower, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, sector.floor, sector.ceiling, sector.light, true);

				if (options_flags.textured_floors)
				{
					draw_floor(dctx, ctx, h, w, camera, isctn0, isctn1, sector, y1, x, edge_end, top0, top1);
				}
			}
			else
			{
				// Portal wall
				
				// Recursively draw what we can see through this hole
				var bottom0 = h*(0.5 - (-camera.z + Math.max(sector.floor_height, edge.dest.floor_height))/isctn0.dist);
				var top0    = h*(0.5 - (-camera.z + Math.min(sector.ceiling_height, edge.dest.ceiling_height))/isctn0.dist);
				var bottom1 = h*(0.5 - (-camera.z + Math.max(sector.floor_height, edge.dest.floor_height))/isctn1.dist);
				var top1    = h*(0.5 - (-camera.z + Math.min(sector.ceiling_height, edge.dest.ceiling_height))/isctn1.dist);

				var y0r = Math.min(top0, top1);
				var y1r = Math.max(bottom0+1, bottom1+1);
				if (y0r <= y1r && y1r >= y0 && y0r < y1)
				{
					// It's possible to do some precise clipping here, to avoid any overdraw,
					// but in practice it seems to be slower than drawing nice rectangles
					/*
					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, top0);
					ctx.lineTo(edge_end, top1);
					ctx.lineTo(edge_end, bottom1);
					ctx.lineTo(x, bottom0);
					ctx.clip();
					*/
					render_rays(x, edge_end, Math.max(y0, y0r), Math.min(y1, y1r), edge.dest, w, h, ctx, dctx, camera, limit);
					/*
					ctx.restore();
					*/
				}

				var w0 = isctn0.dist;
				var w1 = isctn1.dist;
				var u0 = isctn0.u;
				var u1 = isctn1.u;

				if (edge.middle.tex)
				{
					var v0 = -sector.ceiling_height;
					var v1 = -sector.floor_height;

					var bottom0 = h*(0.5 - (-camera.z + sector.ceiling_height)/isctn0.dist);
					var top0    = h*(0.5 - (-camera.z + sector.floor_height)/isctn0.dist);
					var bottom1 = h*(0.5 - (-camera.z + sector.ceiling_height)/isctn1.dist);
					var top1    = h*(0.5 - (-camera.z + sector.floor_height)/isctn1.dist);
					
					draw_poly(ctx, h, edge.middle, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, null, null, sector.light, false);
				}

				// TODO: don't calculate so much redundant stuff when we can't see
				// the floor/ceiling edge-walls

				// Lower parts of portal walls:
				var bottom0 = h*(0.5 - (-camera.z + edge.dest.floor_height)/isctn0.dist);
				var top0    = h*(0.5 - (-camera.z + sector.floor_height)/isctn0.dist);
				var bottom1 = h*(0.5 - (-camera.z + edge.dest.floor_height)/isctn1.dist);
				var top1    = h*(0.5 - (-camera.z + sector.floor_height)/isctn1.dist);

				var v1 = -sector.floor_height;
				var v0 = -edge.dest.floor_height;

				draw_poly(ctx, h, edge.lower, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, sector.floor, null, sector.light, false);
				
				if (options_flags.textured_floors)
				{
					draw_floor(dctx, ctx, h, w, camera, isctn0, isctn1, sector, y1, x, edge_end, top0, top1);
				}
					
				
				// Upper parts of portal walls:
				var bottom0 = h*(0.5 - (-camera.z + sector.ceiling_height)/isctn0.dist);
				var top0    = h*(0.5 - (-camera.z + edge.dest.ceiling_height)/isctn0.dist);
				var bottom1 = h*(0.5 - (-camera.z + sector.ceiling_height)/isctn1.dist);
				var top1    = h*(0.5 - (-camera.z + edge.dest.ceiling_height)/isctn1.dist);
	
				var v1 = -edge.dest.ceiling_height;
				var v0 = -sector.ceiling_height;
	
				draw_poly(ctx, h, edge.upper, x, edge_end, y0, y1, bottom0, top0, bottom1, top1, w0, w1, u0, u1, v0, v1, null, sector.ceiling, sector.light, false);
			}
			
			if (edge_end > x)
			{
				x = edge_end;
				if (x < x1)
				{
					isctn0 = cast_ray(sector, x/w-0.5, camera);
				}
			}
			else
			{
				// This doesn't happen very often, but zero-width walls would cause it
				++x;
				if (x < x1)
				{
					isctn0 = {
						edge: edge.next,
						dist: point_depth(camera.x, camera.y, camera.dx, camera.dy, edge.next.x0, edge.next.y0),
						u: 0
					};
				}
			}
		}
	}

	// XXX - workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=347458
	ctx.beginPath();
	ctx.rect(0, 0, 0, 0);
	ctx.stroke();

	render_sprites(ctx, camera, sector, x0, x1, w, h);
}

function uncast_ray(x, y, camera)
{
	x -= camera.x;
	y -= camera.y;
	var y2 = x*camera.dx + y*camera.dy;
	if (y2 <= 0) { return Infinity; }
	var x2 = x*camera.dy - y*camera.dx;
	return -x2/y2;
}

function cast_ray(sector, px, camera)
{
	var ray_dx = camera.dx-camera.dy*px;
	var ray_dy = camera.dy+camera.dx*px;
	var mag = Math.sqrt(ray_dx*ray_dx + ray_dy*ray_dy);
	ray_dx /= mag;
	ray_dy /= mag;
	
	var ray_x = camera.x;
	var ray_y = camera.y;

	var closest_edge = null, closest_t, closest_dist2;
	var closest_dist = Infinity;

	for (var e = 0; e < sector.edges.length; ++e)
	{
		var edge = sector.edges[e];

		var t = ray_vs_line(ray_x, ray_y, ray_dx, ray_dy, edge.x0, edge.y0, edge.x1, edge.y1);
		if (t >= 0 && t < 1)
		{
			var side = (camera.x-edge.x0)*(edge.y1-edge.y0) - (camera.y-edge.y0)*(edge.x1-edge.x0);
			if (side < 0)
			{
				var dist = line_depth(camera.x, camera.y, camera.dx, camera.dy, edge.x0, edge.y0, edge.x1, edge.y1, t);
				if (dist > 0 && dist < closest_dist)
				{
					closest_edge = edge;
					closest_t = t;
					closest_dist = dist;
				}
			}
		}
	}

	if (closest_edge)
	{
		var u = closest_t * closest_edge.len;
	}
	return { edge:closest_edge, dist:closest_dist, u:u };
}

function cast_ray_edge(edge, px, camera)
{
	var ray_dx = camera.dx-camera.dy*px;
	var ray_dy = camera.dy+camera.dx*px;
	var mag = Math.sqrt(ray_dx*ray_dx + ray_dy*ray_dy);
	ray_dx /= mag;
	ray_dy /= mag;
	
	var ray_x = camera.x;
	var ray_y = camera.y;

	var t = ray_vs_line(ray_x, ray_y, ray_dx, ray_dy, edge.x0, edge.y0, edge.x1, edge.y1);
	var dist = line_depth(camera.x, camera.y, camera.dx, camera.dy, edge.x0, edge.y0, edge.x1, edge.y1, t);

	var u = t * edge.len;
	return { edge:edge, dist:dist, u:u };
}

function ray_coords(depth, px, camera)
{
	var ray_dx = camera.dx-camera.dy*px;
	var ray_dy = camera.dy+camera.dx*px;
	depth /= camera.dx*ray_dx + camera.dy*ray_dy;
	
	return { x: camera.x+depth*ray_dx, y: camera.y+depth*ray_dy };
}


function render_frame(ctx, dctx, gctx, w, h, camera)
{
	// Clear the screen to black (necessary for drawing alpha-lit walls)
	ctx.globalAlpha = 1;
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, w, h);

	profile_begin('render');

	render(w, h, ctx, dctx, camera);

	//	ctx.strokeStyle='#ff0000';ctx.strokeRect(1,1,1,1);

	profile_end('render');

	if (gctx)
	{
		// The suggested way:
		if (! options_flags.opera_hack)
		{
			gctx.lockCanvasUpdates(false);
			gctx.updateCanvas();
			gctx.lockCanvasUpdates(true);
		}
		// but that doesn't work (at least for me, with Opera 9 on Windows) - the
		// canvas is never updated.
		// Sometimes it helps to modify the content of an HTML element to force
		// things to be redisplayed. But sometimes it works magically anyway. *shrug*
		else
		{
			//$('opera_hack').innerHTML = '';
			$('c').style.width = ($('c').style.width == '640px' ? '639px' : '640px');
		}
	}
}

var paused_img;
function render_paused(ctx, w, h)
{
	if (! paused_img)
	{
		paused_img = new Image();
		paused_img.src = 'textures/misc/paused.png';
	}
	if (! paused_img.complete)
	{
		// We can't just add an onload event, because there's a chance it could load
		// between the .complete test and the event addition (and so it'd miss the
		// event).
		// So just try again in a short while.
		setTimeout(render_paused, 100, ctx, w, h);
		return;
	}

	var dw = w * 0.8;
	var dh = dw * (paused_img.height / paused_img.width);
	ctx.globalAlpha = 0.3;
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, w, h);
	ctx.globalAlpha = 1;
	ctx.drawImage(paused_img, (w-dw)/2, (h-dh)/2, dw, dh);
}
