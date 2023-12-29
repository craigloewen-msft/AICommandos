import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

import CryptoJS from "crypto-js";
import CryptoENC from 'crypto-js/enc-utf8';

class completionHandler {
    constructor(callback, secretKey) {
        this.loadConfig(callback);
        this.client = null;
        this.gameInfo = `\`\`\`
### Game code info
this.gameConstants : { ResourceType: { MONEY, ENERGY }, ActionEnum: { SPAWN, ATTACKMOVE, MOVE }, UnitList: { GUNNER: {unitType}, SCOUT: {unitType}, TANK: {unitType} } }
this.warState : { startTime, energy, money, resources: { [resourceID]: { resourceType, resourceAmount, position } }, playerUnitTypeCounts: { [unitType]: count }, enemyUnitTypeCounts: { [unitType]: count }, playerUnits: { [unitID]: unitClass }, enemyUnits: { [unitID]: unitClass } } }
unitClass: { position, unitType, energyCost, moneyCost, playerID, lastAttackTime, attackCooldown, range, closestResource, closestEnemyUnit, closestAllyUnit, closestEnemyBuilding, closestAllyBuilding, unitDistances: { [unitID]: number}, resourceDistances: { [resourceID]: number}, buildingDistances: { [buildingID]: number}, angleOffset, maxHealth, currentHealth, speed, attack}
position: { x, y } and the position class has the function distanceTo(position) which will get the distance to another position

### Additional notes
The ATTACKMOVE option will make a unit attack towards a position. If it's in range of another unit it will stop and attack. The MOVE option is used to move without attacking or stopping.

\`\`\``;
        this.codeStyleInstructions = "Your output code should be short and concise while delivering all that is asked of you. Use inline functions and variables for repeated tasks or to shorten code if necessary. An unit closestEnemyUnit, closestEnemyBuilding, etc. values can be null, always check before using them.";
        this.maxTokens = 2000;
        this.temperature = 0.01;
        this.secretKey = secretKey;
    }

    async loadConfig(callback) {
        // Unhash the configHashed.js file
        let config = await import('./configHashed.js');
        this.config = config.default;

        for (let key in this.config) {
            const decryptedCipher = CryptoJS.AES.decrypt(this.config[key].toString(), this.secretKey);
            const decryptedData = decryptedCipher.toString(CryptoENC);
            this.config[key] = decryptedData;
        }

        await this.setupAI();
        callback();
    }

    async setupAI() {
        const client = new OpenAIClient(
            this.config.resourceEndpoint,
            new AzureKeyCredential(this.config.key)
        );
        this.client = client;
    }

    async getBaseFunctionCompletion(input) {
        try {
            let inputQuestion = `You are designing a javascript code block to output the action for a strategy game's base. 
You need to return an object with an action value and a params value.
${this.codeStyleInstructions}

You have this info available to you:

${this.gameInfo}

Example Input: Design scouts until you have 2 and then gunners
Example Output:
let spawnAction = this.gameConstants.ActionEnum.SPAWN;
let scoutUnitType = this.gameConstants.UnitList.SCOUT.unitType;
let gunnerUnitType = this.gameConstants.UnitList.GUNNER.unitType;
let unitTypeCounts = this.warState.playerUnitTypeCounts;

if (unitTypeCounts[scoutUnitType] < 2) {
return { action: spawnAction, params: scoutUnitType };
} else {
return { action: spawnAction, params: gunnerUnitType };
}

Input: ${input}
Output: 
`;
            const { id, created, choices, usage } = await this.client.getCompletions(this.config.modelID, [inputQuestion], {
                maxTokens: this.maxTokens,
            });
            return choices[0].text;
        } catch (e) {
            console.log(e);
            return `if (this.warState.playerUnitTypeCounts[this.gameConstants.UnitList.SCOUT.unitType] < 1) {
            return { action: this.gameConstants.ActionEnum.SPAWN, params: this.gameConstants.UnitList.SCOUT.unitType };
        } else if (this.warState.playerUnitTypeCounts[this.gameConstants.UnitList.GUNNER.unitType] < 2) {
            return { action: this.gameConstants.ActionEnum.SPAWN, params: this.gameConstants.UnitList.GUNNER.unitType };
        } else {
            return { action: this.gameConstants.ActionEnum.SPAWN, params: this.gameConstants.UnitList.TANK.unitType };
        }`;
        }
    }

    async getScoutFunctionCompletion(input) {
        try {
            let inputQuestion = `You are designing a javascript code block to output the action for a strategy game's unit. 
You don't need to return any value, instead modify the unitActionDictionary object to set the command for each unit. Each command needs an action and a location.
You will have access to two arguments: scoutUnitList (an array of all scout Units to iterate through) and unitActionDictionary (an object with keys of unit IDs and values of their commands).
${this.codeStyleInstructions}

You have this info available to you:

${this.gameInfo}

Example Input: Attack move to the closest resource, if a units is within 120 units run away
Example Output:
let moveAction = this.gameConstants.ActionEnum.MOVE;
let attackMove = this.gameConstants.ActionEnum.ATTACKMOVE;

for (let i = 0; i < scoutUnitList.length; i++) {
    let unit = scoutUnitList[i];
    let action = attackMove;
    let location = unit.closestResource?.position;
    if (unit.closestEnemyUnit && unit.unitDistances[unit.closestEnemyUnit.id] <= 120) {
        action = moveAction;
        if (unit.closestAllyBuilding) {
            location = unit.closestAllyBuilding.position;
        } 
    } 
    unitActionDictionary[unit.id] = { action: action, location: location };
}

Input: ${input}
Output: 
`;
            const { id, created, choices, usage } = await this.client.getCompletions(this.config.modelID, [inputQuestion], {
                maxTokens: this.maxTokens,
                temperature: this.temperature
            });
            return choices[0].text;
        } catch (e) {
            console.log(e);
            return `let moveAction = this.gameConstants.ActionEnum.MOVE;
let attackMove = this.gameConstants.ActionEnum.ATTACKMOVE;

for (let i = 0; i < scoutUnitList.length; i++) {
    let unit = scoutUnitList[i];
    let action = moveAction;
    let location = unit.closestResource?.position;
    if (unit.closestEnemyUnit && unit.unitDistances[unit.closestEnemyUnit.id] <= 120) {
        if (unit.closestAllyBuilding) {
            location = unit.closestAllyBuilding.position;
        } 
    } 
    unitActionDictionary[unit.id] = { action: action, location: location };
}`;
        }
    }

    async getGunnerFunctionCompletion(input) {
        try {
            let inputQuestion = `You are designing a javascript code block to output the action for a strategy game's unit. 
You don't need to return any value, instead modify the unitActionDictionary object to set the command for each unit. Each command needs an action and a location.
You will have access to two arguments: gunnerUnitList (an array of all gunner Units to iterate through) and unitActionDictionary (an object with keys of unit IDs and values of their commands).
${this.codeStyleInstructions}

You have this info available to you:

${this.gameInfo}

Example Input: Attack move to the closest enemy unit, or the enemy base
Example Output:
let attackMove = this.gameConstants.ActionEnum.ATTACKMOVE;

for (let i = 0; i < gunnerUnitList.length; i++) {
    let unit = gunnerUnitList[i];
    let action = attackMove;
    let location = unit.closestEnemyUnit? unit.closestEnemyUnit.position: unit.closestEnemyBuilding?.position;
    unitActionDictionary[unit.id] = { action: action, location: location };
}

Input: ${input}
Output: 
`;
            const { id, created, choices, usage } = await this.client.getCompletions(this.config.modelID, [inputQuestion], {
                maxTokens: this.maxTokens,
                temperature: this.temperature
            });
            return choices[0].text;
        } catch (e) {
            console.log(e);
            return `let attackMove = this.gameConstants.ActionEnum.ATTACKMOVE;

for (let i = 0; i < gunnerUnitList.length; i++) {
    let unit = gunnerUnitList[i];
    let action = attackMove;
    let location = unit.closestEnemyUnit? unit.closestEnemyUnit.position: unit.closestEnemyBuilding?.position;
    unitActionDictionary[unit.id] = { action: action, location: location };
}`;
        }
    }

    async getTankFunctionCompletion(input) {
        try {
            let inputQuestion = `You are designing a javascript code block to output the action for a strategy game's unit. 
You don't need to return any value, instead modify the unitActionDictionary object to set the command for each unit. Each command needs an action and a location.
You will have access to two arguments: tankUnitList (an array of all tank Units to iterate through) and unitActionDictionary (an object with keys of unit IDs and values of their commands).
${this.codeStyleInstructions}

You have this info available to you:

${this.gameInfo}

Example Input: Attack move to the closest enemy unit, or the enemy base
Example Output:
let attackMove = this.gameConstants.ActionEnum.ATTACKMOVE;

for (let i = 0; i < tankUnitList.length; i++) {
    let unit = tankUnitList[i];
    let action = attackMove;
    let location = unit.closestEnemyUnit? unit.closestEnemyUnit.position: unit.closestEnemyBuilding?.position;
    unitActionDictionary[unit.id] = { action: action, location: location };
}

Input: ${input}
Output: 
`;
            const { id, created, choices, usage } = await this.client.getCompletions(this.config.modelID, [inputQuestion], {
                maxTokens: this.maxTokens,
                temperature: this.temperature
            });
            return choices[0].text;
        } catch (e) {
            console.log(e);
            return `let attackMove = this.gameConstants.ActionEnum.ATTACKMOVE;

for (let i = 0; i < tankUnitList.length; i++) {
    let unit = tankUnitList[i];
    let action = attackMove;
    let location = unit.closestEnemyUnit? unit.closestEnemyUnit.position: unit.closestEnemyBuilding?.position;
    unitActionDictionary[unit.id] = { action: action, location: location };
}`;
        }
    }
}

export default completionHandler;