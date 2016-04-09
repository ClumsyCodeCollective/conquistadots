var gameOfLife = {
	deadCellPlaceholder: '*',
	state: [],
	newState: [],
	width: 800,
	height: 600,
	running: null,

	draw: function() {
		world.setState(this.newState);
		this.state = this.newState;
	},

	placePlayer: function(i, player) {
		for(y = 0; y < player.initialState.length; y++) {
			for (x = 0; x < player.initialState[y].length; x++) {
				this.newState[player.x + x][player.y + y] = player.initialState[x][y] ? i : this.deadCellPlaceholder;
			}
		}
	},

	init: function() {
		for (x = 0; x < this.width; x++) {
            this.state[x] = [];
            this.newState[x] = [];

			for (y = 0; y < this.height; y++) {
                this.state[x][y] = this.deadCellPlaceholder;
				this.newState[x][y] = this.deadCellPlaceholder;
			}
		}

		for(i in players) {
			this.placePlayer(i, players[i]);
		}

		this.draw();
	},

	getNeighbours: function(x, y) {
		var neighbours = [];

		for (i in players) {
			neighbours[i] = 0;
		}

		value = this.state[x-1][y-1];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
		}

		value = this.state[x][y-1];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
		}

		value = this.state[x+1][y-1];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
		}

		value = this.state[x-1][y];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
		}

		value = this.state[x+1][y];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
		}

		value = this.state[x-1][y+1];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
		}

		value = this.state[x][y+1];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
		}

		value = this.state[x+1][y+1];
		if (value != this.deadCellPlaceholder) {
			neighbours[value]++;
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

	run: function() {
		this.running = setInterval(this.iterate, 1000);
	}
}

$(document).ready(function () {
    world.init(1, 800, 600, 1);
    gameOfLife.init();
    gameOfLife.run();
});