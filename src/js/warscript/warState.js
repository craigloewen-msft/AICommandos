import WarBaseDescription from './warBaseDescription.js';
import gameConstants from './gameConstants.js';

class WarState {
    constructor(player, gameSimulation) {
        this.player = player;
        this.enemyPlayers = gameSimulation.players.filter(p => p !== player);

        this.gameSimulation = gameSimulation;
        //this is the object passed back and forth between players and the game
        this.myWarBase = new WarBaseDescription(this.player, this.player.warBase);
        this.enemyWarBases = this.enemyPlayers.map(p => new WarBaseDescription(p, p.warBase));
        this.startTime = this.gameSimulation.startTime;
        this.minx = 0;
        this.miny = 0;
        this.maxx = this.gameSimulation.boardWidth;
        this.maxy = this.gameSimulation.boardHeight;

        this.energy = this.myWarBase.energy;
        this.money = this.myWarBase.money;
        this.team = this.player.team;

        this.resources = this.gameSimulation.resources;

        // Get counts of each unit type from gameConstants.UnitTypeEnum
        this.playerUnitTypeCounts = this.player.getUnitTypeCounts();
        this.enemyUnitTypeCounts = this.enemyPlayers.reduce((acc, p) => {
            const enemyCounts = p.getUnitTypeCounts();
            for (let unitType in enemyCounts) {
                if (!acc[unitType]) {
                    acc[unitType] = 0;
                }
                acc[unitType] += enemyCounts[unitType];
            }
            return acc;
        }, {});


        this.playerUnits = this.player.units;
        this.enemyUnits = this.enemyPlayers.reduce((acc, p) => Object.assign(acc, p.units), {});
    }
}

export default WarState;