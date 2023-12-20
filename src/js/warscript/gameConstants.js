import Scout from './units/scout';
import Gunner from './units/gunner';
import Tank from './units/tank';

const gameConstants = {
    ResourceType: {
        MONEY: "Money",
        ENERGY: "Energy"
    },

    ActionEnum: {
        SPAWN: "Spawn",
        ATTACK: "Attack",
        MOVE: "Move",
    },

    UnitList: {
        GUNNER: {
            maxHealth: 50,
            currentHealth: 50,
            speed: 1,
            cooldown: 600,
            range: 3,
            attack: 3,
            unitSize: 14,
            AOE: 0,
            moneyCost: 60,
            energyCost: 10,
            unitType: this,
            createUnit: (x, y, player) => {
                const unitStats = gameConstants.UnitList.GUNNER;
                return new Gunner(
                    unitStats.maxHealth,
                    unitStats.currentHealth,
                    unitStats.speed,
                    unitStats.cooldown,
                    unitStats.range,
                    unitStats.attack,
                    unitStats.unitSize,
                    unitStats.AOE,
                    unitStats.energyCost,
                    unitStats.moneyCost,
                    unitStats.unitType,
                    player,
                    x,
                    y
                );
            }
        },
        SCOUT: {
            maxHealth: 25,
            currentHealth: 25,
            speed: 2,
            cooldown: 800,
            range: 2,
            attack: 1,
            unitSize: 10,
            AOE: 0,
            moneyCost: 0,
            energyCost: 25,
            unitType: this,
            createUnit: (x, y, player) => {
                const unitStats = gameConstants.UnitList.SCOUT;
                return new Scout(
                    unitStats.maxHealth,
                    unitStats.currentHealth,
                    unitStats.speed,
                    unitStats.cooldown,
                    unitStats.range,
                    unitStats.attack,
                    unitStats.unitSize,
                    unitStats.AOE,
                    unitStats.energyCost,
                    unitStats.moneyCost,
                    unitStats.unitType,
                    player,
                    x,
                    y
                );
            }
        },
        TANK: {
            maxHealth: 200,
            currentHealth: 200,
            speed: 0.5,
            cooldown: 1000,
            range: 3,
            attack: 5,
            unitSize: 15,
            AOE: 0,
            moneyCost: 250,
            energyCost: 250,
            unitType: this,
            createUnit: (x, y, player) => {
                const unitStats = gameConstants.UnitList.TANK;
                return new Tank(
                    unitStats.maxHealth,
                    unitStats.currentHealth,
                    unitStats.speed,
                    unitStats.cooldown,
                    unitStats.range,
                    unitStats.attack,
                    unitStats.unitSize,
                    unitStats.AOE,
                    unitStats.energyCost,
                    unitStats.moneyCost,
                    unitStats.unitType,
                    player,
                    x,
                    y
                );
            }
        },
    }
};

for (let unit in gameConstants.UnitList) {
    gameConstants.UnitList[unit].unitType = unit;
}

export default gameConstants;