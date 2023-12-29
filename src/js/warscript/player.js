import WarBase from "./warBase";
import gameAI1 from "./gameAI1";
import WarState from "./warState";
import gameConstants from "./gameConstants";

class Player {
    constructor(startPosx, startPosy, team, scene, simulation, color) {
        this.units = {};
        this.energy = 225;
        this.money = 50;
        this.team = team;
        this.scene = scene;
        this.simulation = simulation;

        this.id = simulation.getEntityID();

        this.maxUnitCount = 50;

        this.units = {};

        this.enemyPlayers = {};

        this.color = color;

        // Set up AI
        this.ai = new gameAI1(this);
        this.warplan = null;

        // Create initial base and add it to building list
        this.warBase = new WarBase(startPosx, startPosy, this, this.scene);
        this.simulation.buildings[this.warBase.id] = this.warBase;
    }

    finalizeInit() {
        for (const [playerID, player] of Object.entries(this.simulation.players)) {
            if (parseFloat(playerID) !== this.id) {
                this.enemyPlayers[playerID] = player;
            }
        }
    }

    setAIBaseFunction(aiFunction) {
        this.ai.setBaseActionFunction(aiFunction);
    }

    setAIScoutFunction(aiFunction) {
        this.ai.setScoutActionFunction(aiFunction);
    }

    setAIGunnerFunction(aiFunction) {
        this.ai.setGunnerActionFunction(aiFunction);
    }

    setAITankFunction(aiFunction) {
        this.ai.setTankActionFunction(aiFunction);
    }

    update() {
        this.warplan = this.ai.buildWarplan(new WarState(this, this.simulation));
        this.parseWarPlan(this.warplan);
    }

    parseWarPlan(inPlan) {
        // Update all units given orders
        for (const [unitID, unit] of Object.entries(this.units)) {
            unit.update(inPlan.unitCommands[unitID], this.simulation.units, this.simulation.resources, this.simulation.buildings);
        }

        // Update base orders
        this.warBase.update(inPlan.baseCommand, this.simulation.units);
    }

    addUnit(unit) {
        unit.init();
        this.units[unit.id] = unit;
        this.simulation.units[unit.id] = unit;
    }

    getCurrentUnitCount() {
        return Object.entries(this.units).length;
    }

    canMakeUnits() {
        if (this.getCurrentUnitCount() < this.maxUnitCount) {
            return true;
        }
        return false;
    }

    getUnitTypeCounts() {
        let playerUnitCount = {};
        for (let unitType in gameConstants.UnitList) {
            // Get count of objects in this.units where unitType is the same as the current unitType
            playerUnitCount[unitType] = Object.values(this.units).filter(u => u.unitType === unitType).length;
        }
        return playerUnitCount;
    }

    removeUnit(id) {
        delete this.units[id];
        delete this.simulation.units[id];
    }

}

export default Player;