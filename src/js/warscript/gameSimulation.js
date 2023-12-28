import Player from "./player.js";
import gameConstants from "./gameConstants.js";
import Resource from "./resource.js";

class GameSimulation {
    constructor(inWidth, inHeight, scene) {
        this.StartTime = new Date().getTime();
        this.LastResourceTime = this.StartTime;
        this.ResourceSpawnTime = 1500;
        this.MaxResourceAmount = 100;

        this.boardWidth = inWidth;
        this.boardHeight = inHeight;

        this.gridWidthInBlocks = this.boardWidth / this.gridBlockWidth;
        this.gridHeightInBlocks = this.boardHeight / this.gridBlockHeight;

        this.scene = scene;

        this.resources = {};
        this.units = {};
        this.buildings = {};

        this.entityCount = 0;

        let player1 = new Player(this.boardWidth / 5, this.boardHeight / 5, "Team 1", this.scene, this, 0x5f00ff);
        let player2 = new Player(this.boardWidth * 4 / 5, this.boardHeight * 4 / 5, "Team 2", this.scene, this, 0x00ff00);

        this.players = {
            [player1.id]: player1,
            [player2.id]: player2,
        };

        for (const [playerID, player] of Object.entries(this.players)) {
            player.finalizeInit();
        }

        this.isRunning = false;
    }

    generateResources() {
        let currenttime = (new Date()).getTime();
        if (this.LastResourceTime + this.ResourceSpawnTime < currenttime) {
            let type = Math.random() < 0.5 ? gameConstants.ResourceType.MONEY : gameConstants.ResourceType.ENERGY;
            let amount = 10 + Math.random() * this.MaxResourceAmount;
            let x = 14 + Math.random() * (this.boardWidth - 28);
            let y = 14 + Math.random() * (this.boardHeight - 28);
            let newResource = new Resource(type, amount, x, y, this.scene, this);
            this.resources[newResource.id] = newResource;

            this.LastResourceTime = currenttime;
        }
    }

    setPlayerAIFunction(playerNumber, aiFunction) {
        this.players[playerNumber].setAIFunction(aiFunction);
    }

    start() {
        this.isRunning = true;
    }

    removeResource(id) {
        delete this.resources[id];
    }

    update() {
        if (this.isRunning) {
            // Generate resources
            this.generateResources();

            // Progress each player
            for (const [playerID, player] of Object.entries(this.players)) {
                player.update();
            }
        }
    }

    getEntityID() {
        return this.entityCount++;
    }

    getGameStats() {
        let stats = {};
        stats.players = [];
        for (const [playerID, player] of Object.entries(this.players)) {
            let playerStatObject = {
                id: player.id,
                team: player.team,
                money: player.money,
                energy: player.energy,
                baseHealth: player.warBase.currentHealth,
                units: player.getUnitTypeCounts(),
            };
            stats.players.push(playerStatObject);
        }
        return stats;
    }

    endGame() {
        this.isRunning = false;
    }

}

export default GameSimulation;