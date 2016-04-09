var world = {
    cellSize: null,
    cols: null,
    rows: null,
    canvas: null,
    context: null,
    player: null,
    neutralState: '*',
    grid: [],

    init: function (cols, rows, cellSize) {
        this.cols     = cols;
        this.rows     = rows;
        this.cellSize = cellSize;
        this.canvas   = document.getElementById('canvas');
        this.context  = this.canvas.getContext('2d');

        this.draw();
    },

    enablePlacementForPlayer: function (player) {
        this.player = player;

        $(this.canvas).on("mousedown", this.mouseHandler.mouseDown);
        $(this.canvas).on("mouseup",   this.mouseHandler.mouseUp);
        $(this.canvas).on("mousemove", this.mouseHandler.mouseMove);
    },

    draw: function () {
        var width = this.cols * this.cellSize;
        var height = this.rows * this.cellSize;

        this.canvas.setAttribute('height', height);
        this.canvas.setAttribute('width', width);

        this.context.fillStyle = '#AAAAAA';
        this.context.fillRect(0, 0, width, height);

        for (var i = 0; i < this.cols; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (!(i in this.grid)) {
                    this.grid[i] = [];
                }
                this.drawCell(i, j, this.neutralState);
            }
        }
    },

    drawCell: function (i, j, state) {
        if (state == this.neutralState) {
            if ((i in this.grid) && (j in this.grid[i])) {
                this.context.fillStyle = players[this.grid[i][j]].trailColor;
            }
            else {
                this.context.fillStyle = "#F3F3F3";
            }
        }
        else {
            this.context.fillStyle = players[state].color;
        }

        this.context.fillRect(
            this.cellSize * i,
            this.cellSize * j,
            this.cellSize,
            this.cellSize
        );

        this.grid[i][j] = state;
    },

    setState: function (newState) {
        for (var i in newState) {
            for (var j in newState[i]) {
                if (newState[i][j] != this.grid[i][j]) {
                    this.drawCell(i, j, newState[i][j]);
                }
            }
        }
    },

    processClick: function (x, y) {
        var col = Math.floor(x / (this.cellSize + 1)) - 1;
        var row = Math.floor(y / (this.cellSize + 1)) - 1;

        if (this.grid[col][row] == this.player) {
            this.drawCell(col, row, '*');
        }
        else {
            this.drawCell(col, row, this.player);
        }
    },

    mouseHandler: {
        buttonDown: false,

        mouseDown: function (event) {
            world.processClick(event.pageX, event.pageY);
            world.mouseHandler.lastX      = event.pageX;
            world.mouseHandler.lastY      = event.pageY;
            world.mouseHandler.buttonDown = true;
        },

        mouseUp: function () {
            world.mouseHandler.buttonDown = false;
        },

        mouseMove: function (event) {
            if (world.mouseHandler.buttonDown && (event.pageX < this.width) && (event.pageY < this.height)) {
                if ((event.pageX !== world.mouseHandler.lastX) || event.pageY !== world.mouseHandler.lastY) {
                    world.processClick(event.pageX, event.pageY);
                    world.mouseHandler.lastX = event.pageX;
                    world.mouseHandler.lastY = event.pageY;
                }
            }
        }
    }
}