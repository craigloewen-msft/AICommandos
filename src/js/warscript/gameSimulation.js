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

        this.isAlive = true;

        this.gridWidthInBlocks = this.boardWidth / this.gridBlockWidth;
        this.gridHeightInBlocks = this.boardHeight / this.gridBlockHeight;

        this.scene = scene;

        this.resources = {};
        this.units = {};

        this.entityCount = 0; 

        this.players = [
            new Player(this.boardWidth / 5, this.boardHeight / 5, "Team 1", this.scene, this),
            new Player(this.boardWidth * 4 / 5, this.boardHeight * 4 / 5, "Team 2", this.scene, this),
        ];
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

    update() {
        // Generate resources
        this.generateResources();

        // Progress each player
        for (var i = 0; i < this.players.length; i++) {
            this.players[i].update();
        }
    }

    getEntityID() {
        return this.entityCount++;
    }

}

export default GameSimulation;