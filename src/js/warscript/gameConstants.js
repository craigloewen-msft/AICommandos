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
        ATTACKMOVE: "AttackMove",
        MOVE: "Move",
    },

    UnitList: {
        GUNNER: {
            maxHealth: 50,
            currentHealth: 50,
            speed: 6,
            cooldown: 600,
            range: 150,
            attack: 8,
            unitSize: 25,
            AOE: 0,
            moneyCost: 250,
            energyCost: 250,
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
            speed: 9,
            cooldown: 800,
            range: 150,
            attack: 5,
            unitSize: 20,
            AOE: 0,
            moneyCost: 50,
            energyCost: 250,
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
            speed: 4,
            cooldown: 1200,
            range: 180,
            attack: 22,
            unitSize: 40,
            AOE: 0,
            moneyCost: 500,
            energyCost: 500,
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