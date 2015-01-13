_.mixin({

	// given an array, move item from one spot to another
    move: function (array, fromIndex, toIndex) {
	    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0] );
	    return array;
    },

    // get the index of an object matching a value
    getIndexBy: function (array, name, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][name] == value) {
				return i;
			}
		}

		return -1;
	},

	// get a random integer given a maximum value
	getRandomInt: function(max) {
		return Math.floor(Math.random() * (max));
	}
});