/*
 * Copyright 2006 Philip Taylor
 * <philip at zaynar.demon.co.uk> / <excors at gmail.com>
 * Distributed under the terms of the GPL (http://www.gnu.org/licenses/gpl.txt)
 */

function ray_vs_line(ray_x, ray_y, ray_dx, ray_dy, line_x0, line_y0, line_x1, line_y1)
{
	var abx = line_x0-line_x1;
	var aby = line_y0-line_y1;

	var acx = line_x0-ray_x;
	var acy = line_y0-ray_y;

	var t = (acx*ray_dy - acy*ray_dx) / (abx*ray_dy - aby*ray_dx);

	return t;
}

function line_vs_line(line0_x0, line0_y0, line0_x1, line0_y1, line1_x0, line1_y0, line1_x1, line1_y1)
{
	var x_00_10 = line0_x0 - line1_x0;
	var y_00_10 = line0_y0 - line1_y0;
	var x_11_10 = line1_x1 - line1_x0;
	var y_11_10 = line1_y1 - line1_y0;
	var x_01_10 = line0_x1 - line1_x0;
	var y_01_10 = line0_y1 - line1_y0;
	var x_11_00 = line1_x1 - line0_x0;
	var y_11_00 = line1_y1 - line0_y0;
	var x_00_01 = line0_x0 - line0_x1;
	var y_00_01 = line0_y0 - line0_y1;
	
	if ( (x_00_10*y_11_10 - y_00_10*x_11_10) *
	     (x_01_10*y_11_10 - y_01_10*x_11_10) <= 0 &&
	     (x_00_10*y_00_01 - y_00_10*x_00_01) *
	     (x_11_00*y_00_01 - y_11_00*x_00_01) >= 0 )
	{
		return true;
	}
	else
	{
		return false;
	}
}

function line_depth(ray_x, ray_y, ray_dx, ray_dy, line_x0, line_y0, line_x1, line_y1, t)
{
	var abx = line_x0-line_x1;
	var aby = line_y0-line_y1;

	var acx = line_x0-ray_x;
	var acy = line_y0-ray_y;
	
	var dist = (acx - t*abx)*ray_dx + (acy - t*aby)*ray_dy;
	
	return dist;
}

function point_depth(x0, y0, dx, dy, x1, y1)
{
	return (x1-x0)*dx + (y1-y0)*dy;
}

function point_distance(x0, y0, x1, y1)
{
	return Math.sqrt((x0-x1)*(x0-x1) + (y0-y1)*(y0-y1));
}

function line_distance(ray_x, ray_y, line_x0, line_y0, line_x1, line_y1, t)
{
	var dx = line_x0 + t*(line_x1-line_x0) - ray_x;
	var dy = line_y0 + t*(line_y1-line_y0) - ray_y;
	
	return Math.sqrt(dx*dx + dy*dy);
}


function ray_line_distance(ray_x, ray_y, ray_dx, ray_dy, line_x0, line_y0, line_x1, line_y1)
{
	var abx = line_x0-line_x1;
	var aby = line_y0-line_y1;

	var acx = line_x0-ray_x;
	var acy = line_y0-ray_y;

	var t = (acx*ray_dy - acy*ray_dx) / (abx*ray_dy - aby*ray_dx);
	
	if (t < 0 || t >= 1)
	{
		return Infinity;
	}
	
	return ((acx - t*abx)*ray_dx + (acy - t*aby)*ray_dy);
}

// Returns min d such that the point is within the rectangle surrounding the line
// at distance d (i.e. returning the distance to the line but considering only
// parallel and perpendicular distances)
function point_line_distance_rect(x, y, x0, y0, x1, y1)
{
	var len = point_distance(x0, y0, x1, y1);
	var xn = (x1-x0) / len;
	var yn = (y1-y0) / len;
	var dist_perp = Math.abs((x - x0)*yn - (y - y0)*xn);
	var dist_para = Math.abs((x - x0)*xn + (y - y0)*yn - len/2) - len/2;
	return (dist_perp > dist_para ? dist_perp : dist_para);
}

// Returns min distance of point x,y from any point on the line x0,y0-x1,y1
function point_line_distance_circle(x, y, x0, y0, x1, y1)
{
	var len = point_distance(x0, y0, x1, y1);
	var xn = (x1-x0) / len;
	var yn = (y1-y0) / len;
	var pos_para = (x - x0)*xn + (y - y0)*yn; // parallel position along line
	if (pos_para < 0)
	{
		return point_distance(x, y, x0, y0); // distance from first end
	}
	else if (pos_para > len)
	{
		return point_distance(x, y, x1, y1); // distance from second end
	}
	else
	{
		return Math.abs((x - x0)*yn - (y - y0)*xn); // perpendicular distance
	}
}

// Returns perpendicular distance of point from line, or Infinity if the
// perpendicular projection falls off the ends of the line.
function point_line_distance_perp(x, y, x0, y0, x1, y1)
{
	var len = point_distance(x0, y0, x1, y1);
	var xn = (x1-x0) / len;
	var yn = (y1-y0) / len;
	var pos_para = (x - x0)*xn + (y - y0)*yn; // parallel position along line
	if (pos_para < 0 || pos_para > len)
	{
		return Infinity;
	}

	return Math.abs((x - x0)*yn - (y - y0)*xn);
}

function point_is_in_polygon(x, y, sector)
{
	var isctns = 0;
	for (var e = 0; e < sector.edges.length; ++e)
	{
		var edge = sector.edges[e];
		
		var t = ray_vs_line(x, y, 1, 0, edge.x0, edge.y0, edge.x1, edge.y1);
		if (t >= 0 && t < 1)
		{
			var depth = line_depth(x, y, 1, 0, edge.x0, edge.y0, edge.x1, edge.y1, t);
			if (depth > 0)
			{
				++isctns;
			}
		}
	}
	return (isctns % 2 ? true : false);
}

// Average the x and y coords to get something near the middle
function polygon_centre(sector)
{
	var xs = 0, ys = 0;
	for (var e = 0; e < sector.edges.length; ++e)
	{
		var edge = sector.edges[e];
		xs += edge.x0;
		ys += edge.y0;
	}
	return { x: xs/sector.edges.length, y: ys/sector.edges.length };
}
