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
        if (this.warState.playerUnitTypeCounts[gameConstants.UnitList.SCOUT.unitType] < 3) {
            return { action: gameConstants.ActionEnum.SPAWN, params: gameConstants.UnitList.SCOUT.unitType };
        } else if (this.warState.playerUnitTypeCounts[gameConstants.UnitList.GUNNER.unitType] < 2) {
            return { action: gameConstants.ActionEnum.SPAWN, params: gameConstants.UnitList.GUNNER.unitType };
        } else {
            return { action: gameConstants.ActionEnum.SPAWN, params: gameConstants.UnitList.TANK.unitType };
        }
    }

    chooseUnitActions() {
        let playerUnits = this.warState.playerUnits;
        let enemyUnits = this.warState.enemyUnits;
        let targetedEnemy = Object.values(this.player.enemyPlayers)[0];

        let unitActionDictionary = {};

        for (const [unitID, unit] of Object.entries(playerUnits)) {
            unitActionDictionary[unit.id] = {};

            unitActionDictionary[unit.id].action = gameConstants.ActionEnum.ATTACKMOVE;
            if (unit.unitType === gameConstants.UnitList.SCOUT.unitType) {
                unitActionDictionary[unit.id].location = unit.closestResource ? unit.closestResource.position : targetedEnemy.warBase.position;
            } else if (unit.unitType === gameConstants.UnitList.GUNNER.unitType) {
                unitActionDictionary[unit.id].location = unit.closestEnemyUnit ? unit.closestEnemyUnit.position : targetedEnemy.warBase.position;
            } else if (unit.unitType === gameConstants.UnitList.TANK.unitType) {
                unitActionDictionary[unit.id].location = targetedEnemy.warBase.position;
            }
        }

        return unitActionDictionary;
    }
}

export default gameAI1;