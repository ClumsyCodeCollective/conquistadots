var cellLogic = {
	getNewValueForDeadCell: function(neighbours) {
		var reproductionValue = gameOfLife.deadCellPlaceholder;

		for (var i = 0; i < gameOfLife.playerCount; i++) {
			if (neighbours[i] == 3) {
				if (reproductionValue == gameOfLife.deadCellPlaceholder) {
					reproductionValue = i;
				}
				else {
					return gameOfLife.deadCellPlaceholder
				}
			}
		}
		return reproductionValue;
	},

	getNewValueForLiveCell: function(value, neighbours) {
		var supporters = neighbours[value];
		var attackers = 0;

		for (var i = 0; i < gameOfLife.playerCount; i++) {
			if (i != value) {
				attackers = attackers + neighbours[i];
			}
		}

		var supportvalue = supporters - attackers;

		if (supportvalue < 2 || supportvalue > 3) {
			return gameOfLife.deadCellPlaceholder;
		}
		else {
			return value;
		}

	},

	getNewValue: function(value, neighbours) {
		if (value == gameOfLife.deadCellPlaceholder) {
			return this.getNewValueForDeadCell(neighbours);
		}
		else {
			return this.getNewValueForLiveCell(value, neighbours)
		}
	}
}