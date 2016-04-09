MAP_VALLEY = [];
for (var i = 0; i < 240; i++) {
	for (var j = 0; j < 120; j++) {
		if (!(i in MAP_VALLEY)) {
			MAP_VALLEY[i] = [];
		}

		if (i > 115 && i < 125 && j>10 && j < 50) {
			MAP_VALLEY[i][j] = "x";
		}
		else if (i > 70 && i < 80 && j>50 && j < 90) {
			MAP_VALLEY[i][j] = "x";
		}
		else if (i > 150 && i < 160 && j>50 && j < 90) {
			MAP_VALLEY[i][j] = "x";
		}
		else {
			MAP_VALLEY[i][j] = "*";
		}
	}
}
