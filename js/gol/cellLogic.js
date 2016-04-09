function CellLogic(deadCellPlaceholder, playerCount) {
	this.deadCellPlaceholder = deadCellPlaceholder;
	this.playerCount = playerCount;
	this.getRandom = getRandomGenerator();

	this.getNewValueForDeadCell = function(neighbours) {
		var neighbour = null;
		var neighbourCount = 0;

		for (var i = 0; i < this.playerCount; i++) {
			if (neighbours[i] != 0) {
				if (neighbourCount != 0) {
					return this.deadCellPlaceholder
				}
				else {
					neighbour = i;
					neighbourCount = neighbours[i];
				}
			}
		}

		if (neighbourCount == 3) {
			return neighbour;
		}
		else if (neighbourCount == 2) {
			var chance = 5 + players[neighbour].reproductionMod * 2;
			var random = this.getRandom(100);
			return chance > random ? neighbour : this.deadCellPlaceholder
		}
		else {
			return this.deadCellPlaceholder
		}
	};

	this.getNewValueForLiveCell = function(playerIndex, neighbours) {
		var supporters = neighbours[playerIndex];
		var attackers = 0;
		var chance = 0;
		var random = 0;

		for (var i = 0; i < this.playerCount; i++) {
			if (i != playerIndex) {
				attackers = attackers + (neighbours[i] ? neighbours[i] + players[i].attackMod : 0);
			}
		}

		if (attackers != 0) {
			var defenders = supporters + players[playerIndex].defenseMod;
			chance = Math.ceil((defenders / (defenders + attackers)) * 100);
			random = this.getRandom(100);

			return chance > random ? playerIndex : this.deadCellPlaceholder;

		}

		if (supporters == 2 || supporters == 3) {
			return playerIndex;
		}

		if (supporters == 1 || 4) {
			chance = 5 + players[playerIndex].survivalMod * 2;
			random = this.getRandom(100);
			return chance > random ? playerIndex : this.deadCellPlaceholder;
		}

		return this.deadCellPlaceholder;
	};

	this.getNewValue = function (value, neighbours) {
		if (value == this.deadCellPlaceholder) {
			return this.getNewValueForDeadCell(neighbours);
		}
		else {
			return this.getNewValueForLiveCell(value, neighbours)
		}
	};
}