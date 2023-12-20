import gameConstants from "./gameConstants";
import Warplan from "./warPlan";

class gameAI1 {
    constructor(player) {
        this.initialDelay = 30000;
        this.swarmAttacking = false;
        this.player = player;
        this.warState = null;
    }

    canAfford(unitType) {
        if (this.warplan.energy >= EnergyCost[unitType] && this.warplan.money >= gameConstants.MoneyCost[unitType]) {
            return true;
        }
        return false;
    }

    buildWarplan(inState) {
        this.warState = inState;
        let baseAction = this.chooseBaseAction();
        let unitActions = this.chooseUnitActions();
        this.warplan = new Warplan(this.player, this.warState, baseAction, unitActions);
        return this.warplan;
    }

    // Returns an object of {action, params} for the base
    chooseBaseAction() {
        return { action: gameConstants.ActionEnum.SPAWN, params: gameConstants.UnitList.SCOUT.unitType };
        //TODO add in rest of AI logic
    }

    chooseUnitActions() {
        let playerUnits = this.warState.playerUnits;
        let enemyUnits = this.warState.enemyUnits;

        let unitActionDictionary = {};

        for (const [unitID, unit] of Object.entries(playerUnits)) {
            unitActionDictionary[unit.id] = {};

            unitActionDictionary[unit.id].action = gameConstants.ActionEnum.MOVE;
            if (unit.unitType === gameConstants.UnitList.SCOUT.unitType) {
                unitActionDictionary[unit.id].location = unit.closestResource ? unit.closestResource.position : this.warState.player.warBase.position;
            } else {
                unitActionDictionary[unit.id].location = unit.closestUnit ? unit.closestUnit.position : this.warState.enemyPlayers[0].warBase.position;
            }
        }

        return unitActionDictionary;
    }
}

export default gameAI1;