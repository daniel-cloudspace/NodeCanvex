var spritedefs = {

player: {
	img: 'player.walk',
	img_w: 47,
	img_h: 59,
	img_off_x: 24,
	img_off_y: 54,
	angles: 8,
	frames: 4,
	speed: 250, // msecs per frame
	
	height: 0.6, // height in world-space
	radius: 0.1 // collision radius; 0 for none
},

barrel: {
	img: 'barrel',
	img_w: 25,
	img_h: 34,
	img_off_x: 13,
	img_off_y: 30,
	angles: 1,
	frames: 2,
	speed: 500,
	
	height: 0.3,
	radius: 0.1
}

};
