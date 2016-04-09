function GameOfLife(canvasId) {
	this.deadCellPlaceholder = '*';
	this.state = [];
	this.newState = [];
	this.width = 240;
	this.height = 120;
	this.playerCount = null;
	this.result = [];
	this.world = new World(canvasId, this.width, this.height, 4);

	this.draw = function () {
		for (var i = 0; i < this.playerCount; i++) {
			this.result[i] = 0;
		}

		this.world.setState(this.newState);

		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				this.state[x][y] = this.newState[x][y];
				if (this.newState[x][y] != this.deadCellPlaceholder) {
					this.result[this.newState[x][y]]++;
				}
			}
		}

		this.updateResult();
	};

	this.placePlayer = function (i, player) {
		for (var row = 0; row < player.initialState.length; row++) {
			for (var col = 0; col < player.initialState[row].length; col++) {
				this.newState[player.x + col][player.y + row] = player.initialState[row][col] ? i : this.deadCellPlaceholder;
			}
		}
	};

	this.init = function () {
		cellLogic.init();
		this.playerCount = players.length;

		for (var x = 0; x < this.width; x++) {
			this.state[x] = [];
			this.newState[x] = [];

			for (var y = 0; y < this.height; y++) {
				this.state[x][y] = this.deadCellPlaceholder;
				this.newState[x][y] = this.deadCellPlaceholder;
			}
		}

		for (var i = 0; i < this.playerCount; i++) {
			this.placePlayer(i, players[i]);
		}

		for (var i = 0; i < this.playerCount; i++) {
			$("#p" + i + " .name").innerHTML = players[i].name;
			$("#p" + i + " .name").css("color", "#" + players[i].trailColor);
			$("#p" + i + " .result").css("color", "#" + players[i].color);
		}

		this.draw();
	};

	this.updateResult = function () {
		for (var i = 0; i < this.playerCount; i++) {
			$("#p" + i + " .result").innerHTML = this.result[i];
		}
	};

	this.getNeighbours = function (x, y) {
		var neighbours = [];
		var value;

		for (var i = 0; i < this.playerCount; i++) {
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
	};

	this.iterateCell = function (x, y) {
		var neighbours = this.getNeighbours(x, y);
		this.newState[x][y] = cellLogic.getNewValue(this.state[x][y], neighbours);
	};

	this.iterate = function () {
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				this.iterateCell(x, y);
			}
		}

		this.draw();
	};

	this.init();
}

$(document).ready(function () {
	var game = new GameOfLife("gameCanvas");

	$("#go").on("click", "",
		function () {
			setInterval(function () {
				game.iterate()
			}, 10)
		}
	);
});