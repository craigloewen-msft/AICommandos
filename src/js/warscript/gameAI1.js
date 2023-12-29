import gameConstants from "./gameConstants";
import Warplan from "./warPlan";

class gameAI1 {
    constructor(player) {
        this.initialDelay = 30000;
        this.swarmAttacking = false;
        this.player = player;
        this.warState = null;
        this.gameConstants = gameConstants;
    }

    canAfford(unitType) {
        if (this.warplan.energy >= EnergyCost[unitType] && this.warplan.money >= gameConstants.MoneyCost[unitType]) {
            return true;
        }
        return false;
    }

    buildWarplan(inState) {
        this.warState = inState;
        let baseAction = null;
        baseAction = this.chooseBaseAction();
        let unitActions = this.chooseUnitActions();
        this.warplan = new Warplan(this.player, this.warState, baseAction, unitActions);
        return this.warplan;
    }

    setBaseActionFunction(aiFunction) {
        let aiBaseActionFunction = new Function(aiFunction);
        aiBaseActionFunction = aiBaseActionFunction.bind(this);
        this.chooseBaseAction = aiBaseActionFunction;
    }

    setScoutActionFunction(aiFunction, scoutUnitList, unitActionDictionary) {
        let aiScoutActionFunction = new Function('scoutUnitList', 'unitActionDictionary', aiFunction);
        aiScoutActionFunction = aiScoutActionFunction.bind(this);
        this.chooseScoutActions = aiScoutActionFunction;
    }

    setGunnerActionFunction(aiFunction, gunnerUnitList, unitActionDictionary) {
        let aiGunnerActionFunction = new Function('gunnerUnitList', 'unitActionDictionary', aiFunction);
        aiGunnerActionFunction = aiGunnerActionFunction.bind(this);
        this.chooseGunnerActions = aiGunnerActionFunction;
    }

    setTankActionFunction(aiFunction, tankUnitList, unitActionDictionary) {
        let aiTankActionFunction = new Function('tankUnitList', 'unitActionDictionary', aiFunction);
        aiTankActionFunction = aiTankActionFunction.bind(this);
        this.chooseTankActions = aiTankActionFunction;
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
        let scoutUnitList = [];
        let gunnerUnitList = [];
        let tankUnitList = [];

        for (const [unitID, unit] of Object.entries(playerUnits)) {
            if (unit.unitType === gameConstants.UnitList.SCOUT.unitType) {
                scoutUnitList.push(unit);
            } else if (unit.unitType === gameConstants.UnitList.GUNNER.unitType) {
                gunnerUnitList.push(unit);
            } else if (unit.unitType === gameConstants.UnitList.TANK.unitType) {
                tankUnitList.push(unit);
            }
        }

        let unitActionDictionary = {};

        this.chooseScoutActions(scoutUnitList, unitActionDictionary);
        this.chooseGunnerActions(gunnerUnitList, unitActionDictionary);
        this.chooseTankActions(tankUnitList, unitActionDictionary);

        return unitActionDictionary;
    }

    chooseScoutActions(scoutUnitList, unitActionDictionary) {
        let attackMove = this.gameConstants.ActionEnum.ATTACKMOVE;

        for (let i = 0; i < scoutUnitList.length; i++) {
            let unit = scoutUnitList[i];
            unitActionDictionary[unit.id] = { action: attackMove, location: unit.closestResource ? unit.closestResource.position : { x: 500, y: 500 } };
        }
    }

    chooseGunnerActions(gunnerUnitList, unitActionDictionary) {
        let attackMove = gameConstants.ActionEnum.ATTACKMOVE;

        for (let i = 0; i < gunnerUnitList.length; i++) {
            let unit = gunnerUnitList[i];
            if (unit.closestEnemyUnit) {
                unitActionDictionary[unit.id] = { action: attackMove, location: unit.closestEnemyUnit?.position };
            } else {
                unitActionDictionary[unit.id] = { action: attackMove, location: unit.closestEnemyBuilding?.position };
            }
        }
    }

    chooseTankActions(tankUnitList, unitActionDictionary) {
        let attackMove = gameConstants.ActionEnum.ATTACK_MOVE;

        for (let i = 0; i < tankUnitList.length; i++) {
            let unit = tankUnitList[i];
            unitActionDictionary[unit.id] = { action: attackMove, location: unit.closestEnemyBuilding?.position };
        }
    }
}

export default gameAI1;