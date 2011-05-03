const mipmap_max = 7;
const mipmap_min = 3;
const mipmap_enabled = 1;
const texture_u_repeat = 192/128;
const texture_v_repeat = 144/128;

var options_flags = {
	gradient_surfaces: 1,
	horizontal_scale: 8, // TODO: reimplement
	low_textures: 1, // TODO: reimplement
	map: 1, // TODO: reimplement
	draw_from_canvas: 0,
	draw_pattern_walls: 0, // Opera: no difference; FF1.5: no diff; FF2.0: no diff, or slightly slower?; FF3.0: ~10% slower but fixes black line between textures
	no_alpha_texture: 0,
	opera_context: 0, // doesn't work
	opera_hack: 1, // doesn't work either
	double_buffer: 0,
	textured_floors: 0 // only suitable for testing
};

// Set browser-dependent defaults
if (navigator.userAgent.indexOf("Opera") != -1)
{
	// (Last tested with Opera 9.01)

	// Using drawImage from a canvas is much faster than from an image
	options_flags.draw_from_canvas = 1;
	// Opera doesn't do alpha blending of drawImage
	options_flags.no_alpha_texture = 1;
	// Opera repaints the screen at annoying times (in the middle of a frame),
	// particularly at low framerates. It'd be nice to use opera-2dgame
	// (via the opera_context flag) but that's broken, so use double-buffering
	// instead:
	options_flags.double_buffer = 1;
}
else // assume Firefox - I haven't tested it on anything else.
{
	// Using drawImage from a canvas is much slower than from an image, in FF1.5.
	// (No difference in FF2+)
	options_flags.draw_from_canvas = 0;

	if (options_flags.draw_pattern_walls)
	{
		options_flags.no_alpha_texture = 1; // because they don't seem to work on patterns
	}
}

function $(id)
{
	return document.getElementById(id);
}

function debug(str)
{
	$('status').value = str;
}

