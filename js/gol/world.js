function World(canvasId, cols, rows, cellSize, border) {
	var worldInstance = this;

	this.cellSize = cellSize;
	this.cols = cols;
	this.rows = rows;
	this.border = border;
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext('2d');
	this.player = null;
	this.neutralState = '*';
	this.forbiddenState = 'x';
	this.colors = {
		neutral:   "#EEEEEE",
		forbidden: "#221100",
		border:    "#AAAAAA",
		placement: "#006666"
	};
	this.grid = [];

	this.enablePlacementForPlayer = function (player) {
		this.player = player;

		$(this.canvas).on("mousedown", this.mouseHandler.mouseDown);
		$(this.canvas).on("mouseup", this.mouseHandler.mouseUp);
		$(this.canvas).on("mousemove", this.mouseHandler.mouseMove);
	};

	this.draw = function () {
		var width = this.cols * (this.cellSize + this.border);
		var height = this.rows * (this.cellSize + this.border);

		this.canvas.setAttribute('height', height);
		this.canvas.setAttribute('width', width);

		this.context.fillStyle = this.colors.border;
		this.context.fillRect(0, 0, width, height);

		for (var i = 0; i < this.cols; i++) {
			for (var j = 0; j < this.cols; j++) {
				if (!(i in this.grid)) {
					this.grid[i] = [];
				}
				this.drawCell(i, j, this.neutralState, false);
			}
		}
	};

	this.drawCell = function (i, j, state, leaveTrail) {
		if (state == this.forbiddenState) {
			this.context.fillStyle = this.colors.forbidden;
		}
		else if (state == this.neutralState) {
			if (leaveTrail && (i in this.grid) && (j in this.grid[i])) {
				this.context.fillStyle = players[this.grid[i][j]].trailColor;
			}
			else {
				this.context.fillStyle = this.colors.neutral;
			}
		}
		else {
			if (state in players) {
				this.context.fillStyle = players[state].color;
			}
			else {
				this.context.fillStyle = this.colors.placement;
			}
		}

		this.context.fillRect(
			(this.cellSize + this.border) * i,
			(this.cellSize + this.border) * j,
			this.cellSize,
			this.cellSize
		);

		this.grid[i][j] = state;
	};

	this.setState = function (newState) {
		for (var i in newState) {
			for (var j in newState[i]) {
				if (newState[i][j] != this.grid[i][j]) {
					this.drawCell(i, j, newState[i][j], true);
				}
			}
		}
	};

	this.processClick = function (col, row) {
		if (this.grid[col][row] == this.player) {
			this.drawCell(col, row, '*', false);
		}
		else {
			this.drawCell(col, row, this.player, false);
		}
	};

	this.mouseHandler = {
		buttonDown: false,

		mouseDown: function (event) {
			var col = worldInstance.mouseHandler.getEventCol(event);
			var row = worldInstance.mouseHandler.getEventRow(event);

			worldInstance.processClick(col, row);
			worldInstance.mouseHandler.lastCol = col;
			worldInstance.mouseHandler.lastRow = row;
			worldInstance.mouseHandler.buttonDown = true;
		},

		mouseUp: function () {
			worldInstance.mouseHandler.buttonDown = false;
		},

		mouseMove: function (event) {
			var col = worldInstance.mouseHandler.getEventCol(event);
			var row = worldInstance.mouseHandler.getEventRow(event);

			if (worldInstance.mouseHandler.buttonDown && (col < worldInstance.cols) && (row < worldInstance.rows)) {
				if ((col !== worldInstance.mouseHandler.lastCol) || row !== worldInstance.mouseHandler.lastRow) {
					worldInstance.processClick(col, row);
					worldInstance.mouseHandler.lastCol = col;
					worldInstance.mouseHandler.lastRow = row;
				}
			}
		},

		getEventCol: function (event) {
			var elementPos = $(event.target).offset();
			return Math.floor((event.pageX - elementPos.left) / worldInstance.cellSize);
		},

		getEventRow: function (event) {
			var elementPos = $(event.target).offset();
			return Math.floor((event.pageY - elementPos.top) / worldInstance.cellSize);
		}
	}

	this.draw();
}