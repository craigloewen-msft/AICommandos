import WarBase from "./warBase";
import gameAI1 from "./gameAI1";
import WarState from "./warState";
import gameConstants from "./gameConstants";

class Player {
    constructor(startPosx, startPosy, team, scene, simulation) {
        this.units = {};
        this.energy = [];
        this.money = [];
        this.team = team;
        this.scene = scene;
        this.simulation = simulation;

        this.id = simulation.getEntityID();

        this.maxUnitCount = 50;

        this.units = {};

        // Set up AI
        this.ai = new gameAI1(this);
        this.warplan = null;

        // Create initial base
        this.warBase = new WarBase(startPosx, startPosy, this, this.scene);
    }

    update() {
        this.warplan = this.ai.buildWarplan(new WarState(this, this.simulation));
        this.parseWarPlan(this.warplan);
    }

    parseWarPlan(inPlan) {
        // Update all units given orders
        for (const [unitID, unit] of Object.entries(this.units)) {
            unit.update(inPlan.unitCommands[unitID], this.simulation.units, this.simulation.resources);
        }

        // Update base orders
        this.warBase.update(inPlan.baseCommand);
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

}

export default Player;