function Player(name, color, trailColor, initialState, x, y, reproductionMod, survivalMod, defenseMod, attackMod) {
	this.name = name
	this.color = color;
	this.trailColor = trailColor;
	this.initialState = initialState;
	this.x = x;
	this.y = y;
	this.reproductionMod = reproductionMod;
	this.survivalMod = survivalMod;
	this.defenseMod = defenseMod;
	this.attackMod = attackMod;
}

var players = [
	new Player(
		'pista1',
		'#ff0000',
		'#ff9999',
		[[0, 0, 0, 0, 0, 0, 0, 0],
		 [0, 0, 0, 1, 0, 0, 0, 0],
		 [0, 0, 0, 0, 1, 0, 0, 0],
		 [0, 0, 1, 1, 1, 0, 0, 0],
		 [0, 0, 0, 1, 0, 0, 0, 0],
		 [0, 0, 1, 1, 1, 0, 0, 0],
		 [0, 0, 0, 0, 0, 0, 0, 0],
		 [0, 0, 0, 0, 0, 0, 0, 0]],
		56,
		26,
		0,
		0,
		1,
		1
	),
	new Player(
		'pista2',
		'#00ff00',
		'#99ff99',
		[[0, 0, 0, 0, 0, 0, 0, 0],
		 [0, 0, 0, 1, 0, 0, 0, 0],
		 [0, 0, 0, 0, 1, 0, 0, 0],
		 [0, 0, 1, 1, 1, 0, 0, 0],
		 [0, 0, 0, 1, 0, 0, 0, 0],
		 [0, 0, 1, 1, 1, 0, 0, 0],
		 [0, 0, 0, 0, 0, 0, 0, 0],
		 [0, 0, 0, 0, 0, 0, 0, 0]],
		176,
		26,
		0,
		0,
		1,
		1
	),
	new Player(
		'pista3',
		'#0000ff',
		'#9999ff',
		[[0, 0, 0, 0, 0, 0, 0, 0],
		 [0, 0, 0, 1, 0, 0, 0, 0],
		 [0, 0, 0, 0, 1, 0, 0, 0],
		 [0, 0, 1, 1, 1, 0, 0, 0],
		 [0, 0, 0, 1, 0, 0, 0, 0],
		 [0, 0, 1, 1, 1, 0, 0, 0],
		 [0, 0, 0, 0, 0, 0, 0, 0],
		 [0, 0, 0, 0, 0, 0, 0, 0]],
		116,
		86,
		1,
		1,
		0,
		0
	)
];
