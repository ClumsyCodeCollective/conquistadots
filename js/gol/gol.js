var gameOfLife = {
	deadCellPlaceholder: '*',
	state: [],
	newState: [],
	width: 300,
	height: 200,
	running: null,

	draw: function() {
		world.setState(this.newState);
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				this.state[x][y] = this.newState[x][y];
			}
		}
	},

	placePlayer: function(i, player) {
		for(var row = 0; row < player.initialState.length; row++) {
			for (var col = 0; col < player.initialState[row].length; col++) {
				this.newState[player.x + col][player.y + row] = player.initialState[row][col] ? i : this.deadCellPlaceholder;
			}
		}
	},

	init: function() {
		for (var x = 0; x < this.width; x++) {
			this.state[x] = [];
			this.newState[x] = [];

			for (var y = 0; y < this.height; y++) {
				this.state[x][y] = this.deadCellPlaceholder;
				this.newState[x][y] = this.deadCellPlaceholder;
			}
		}

		for(var i in players) {
			this.placePlayer(i, players[i]);
		}

		this.draw();
	},

	getNeighbours: function(x, y) {
		var neighbours = [];
		var value;

		for (var i in players) {
			neighbours[i] = 0;
		}

		if (x > 0 && y > 0) {
			value = this.state[x - 1][y - 1];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		if (y > 0) {
			value = this.state[x][y - 1];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		if (x < this.width - 2 && y > 0) {
			value = this.state[x + 1][y - 1];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		if (x > 0) {
			value = this.state[x - 1][y];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		if (x < this.width - 2) {
			value = this.state[x + 1][y];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		if (x > 0 && y < this.height - 2) {
			value = this.state[x - 1][y + 1];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		if (y < this.height - 2) {
			value = this.state[x][y + 1];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		if (x < this.width - 2 && y - this.height - 2) {
			value = this.state[x + 1][y + 1];
			if (value != this.deadCellPlaceholder) {
				neighbours[value]++;
			}
		}

		return neighbours;
	},

	iterateCell: function(x, y) {
		var neighbours = this.getNeighbours(x, y);
		this.newState[x][y] = cellLogic.getNewValue(this.state[x][y], neighbours);
	},

	iterate: function() {
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				this.iterateCell(x, y);
			}
		}

		this.draw();
	},
}

$(document).ready(function () {
	world.init(1, 300, 200, 4);
	gameOfLife.init();
	setInterval(function(){gameOfLife.iterate()},1000);

});