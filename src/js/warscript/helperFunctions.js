const helperFunctions = {
    collision(x, y) {
        //returns an array of all the units, bases, and walls that occupy grid coordinate x,y
        //otherwise returns empty array
        results = new Array();

        for (var i = 0; i < window.units.length; i++) {
            // x1  x1 + width
            //  ____  y1
            // |    |
            // |____| ___  y2
            //       |   |
            //       |___|
            //       x2  x2 + width

            if ((x >= window.units[i].gridx && x <= window.units[i].gridx + window.units[i].gridWidth) &&
                (y >= window.units[i].gridy && y <= window.units[i].gridy + window.units[i].gridHeight)) {
                results.push(window.units[i]);
            }
        }

        if ((x >= window.baseOne.gridx && x <= window.baseOne.gridx + window.baseOne.gridWidth) &&
            (y >= window.baseOne.gridy && y <= window.baseOne.gridy + window.baseOne.gridHeight)) {
            results.push(window.baseOne);
        }
        if ((x >= window.baseTwo.gridx && x <= window.baseTwo.gridx + window.baseTwo.gridWidth) &&
            (y >= window.baseTwo.gridy && y <= window.baseTwo.gridy + window.baseTwo.gridHeight)) {
            results.push(window.baseTwo);
        }
        return results;
    }
}

export default helperFunctions;