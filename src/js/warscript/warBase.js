import * as THREE from 'three';
import gameConstants from './gameConstants';

class WarBase {
    constructor(x, y, player, scene) {
        this.player = player;
        this.scene = scene;

        this.id = this.player.simulation.getEntityID();

        this.maxHealth = 1000;
        this.currentHealth = 1000;
        this.money = 400;
        this.energy = 400;
        this.energyRegen = 0.5;
        this.moneyRegen = 0.5;
        this.cooldown = 1000;
        this.lastAction = (new Date()).getTime() - this.cooldown;
        this.team = this.player.team;
        this.position = new THREE.Vector3(x, y, 0);
        this.isAlive = true;

        this.size = 50;

        this.renderObject = null;

        this.initRender();
    }

    checkUnitAvailable() {
        // TODO: Change to player logic not base logic
        if (this.player.canMakeUnits()) {
            let current = (new Date()).getTime();
            if (current - this.lastAction > this.cooldown) {
                this.lastAction = current;
                return true;
            }
        }
        return false;
    }

    spawnUnit(unitType, skipValidation) {
        if (this.checkUnitAvailable() || skipValidation) {
            let prospectiveUnit = gameConstants.UnitList.SCOUT.createUnit(this.position.x, this.position.y, this.player);
            if ((this.energy > prospectiveUnit.energyCost && this.money > prospectiveUnit.moneyCost) || skipValidation) {
                this.player.addUnit(prospectiveUnit);
                if (!skipValidation) {
                    this.energy -= prospectiveUnit.energyCost;
                    this.money -= prospectiveUnit.moneyCost;
                }
                return true;
            }
            else {
                // Remove block??
                return false;
            }
        }
        return false;
    }

    incrementGoods() {
        this.money += this.moneyRegen;
        this.energy += this.energyRegen;
    }

    update(command) {
        let actionDescription = command.action;
        let params = command.params;

        // Take actions block
        if (actionDescription) {
            switch (actionDescription) {
                case (gameConstants.ActionEnum.SPAWN):
                    let result = this.spawnUnit(params, false);
                    break;
                default:
                    break;
            }
        }
        this.incrementGoods()
        this.renderObject.rotation.x += 0.001;
    }

    damage(damage) {
        this.currentHealth -= damage;
        this.checkDeath();
    }

    checkDeath() {
        if (this.currentHealth <= 0) {
            this.isAlive = false;
        }
    }

    initRender() {
        const textureLoader = new THREE.TextureLoader();
        var geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00});
        this.renderObject = new THREE.Mesh(geometry, material);
        this.renderObject.position.x = this.position.x;
        this.renderObject.position.y = this.position.y;
        this.scene.add(this.renderObject);
    }

}

export default WarBase;