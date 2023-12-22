import * as THREE from 'three';
import gameConstants from './gameConstants';

class WarBase {
    constructor(x, y, player, scene) {
        this.player = player;
        this.scene = scene;

        this.id = this.player.simulation.getEntityID();

        this.maxHealth = 500;
        this.currentHealth = 500;
        this.energyProduction = 0.5;
        this.moneyProduction = 0.5;
        this.buildCooldown = 1000;
        this.lastBuildAction = (new Date()).getTime() - this.buildCooldown;
        this.team = this.player.team;
        this.position = new THREE.Vector3(x, y, 0);
        this.isAlive = true;

        this.size = 30;

        this.cooldown = 1000;
        this.range = 150;
        this.attack = 5;
        this.lastAction = 0;

        this.unitDistances = {};

        this.closestEnemyUnit = null;
        this.closestAllyUnit = null;

        this.color = this.player.color;

        this.renderObject = null;
        this.healthBarRenderObject = null;

        this.initRender();
    }

    getUnitDistances(unitList) {
        this.unitDistances = {};
        this.closestEnemyUnit = null;
        this.closestAllyUnit = null;
        let closestEnemyDistance = 9999999;
        let closestAllyDistance = 9999999;

        for (let unit of Object.values(unitList)) {
            let distance = this.position.distanceTo(unit.position);
            this.unitDistances[unit.id] = distance;

            if (unit.player.team === this.player.team) {
                if (distance < closestAllyDistance) {
                    closestAllyDistance = distance;
                    this.closestAllyUnit = unit;
                }
            } else {
                if (distance < closestEnemyDistance) {
                    closestEnemyDistance = distance;
                    this.closestEnemyUnit = unit;
                }
            }
        }
    }

    checkUnitAvailable() {
        // TODO: Change to player logic not base logic
        if (this.player.canMakeUnits()) {
            let current = (new Date()).getTime();
            if (current - this.lastBuildAction > this.buildCooldown) {
                this.lastBuildAction = current;
                return true;
            }
        }
        return false;
    }

    spawnUnit(unitType, skipValidation) {
        if (this.checkUnitAvailable() || skipValidation) {
            let prospectiveUnit = gameConstants.UnitList[unitType].createUnit(this.position.x, this.position.y, this.player);
            if ((this.player.energy > prospectiveUnit.energyCost && this.player.money > prospectiveUnit.moneyCost) || skipValidation) {
                this.player.addUnit(prospectiveUnit);
                if (!skipValidation) {
                    this.player.energy -= prospectiveUnit.energyCost;
                    this.player.money -= prospectiveUnit.moneyCost;
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

    generateResources() {
        this.player.money += this.moneyProduction;
        this.player.energy += this.energyProduction;
    }

    update(command, unitList) {
        this.currentTime = new Date().getTime();
        let actionDescription = command.action;
        let params = command.params;

        this.getUnitDistances(unitList);

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
        this.attackNearEnemies();
        this.generateResources();

        if (this.renderObject) {
            this.healthBarRenderObject.position.x = this.position.x;
            this.healthBarRenderObject.position.y = this.position.y + this.size / 2 + 5;
            this.healthBarRenderObject.scale.x = this.currentHealth / this.maxHealth;
        }
    }

    attackNearEnemies() {
        if (this.closestEnemyUnit && this.unitDistances[this.closestEnemyUnit.id] < this.range) {
            this.performUnitAttack(this.closestEnemyUnit);
        }
    }

    performUnitAttack(unit) {
        let delay = this.cooldown * 0.10 * Math.random();
        if (this.currentTime - this.lastAction > this.cooldown) {
            this.commandLocation = unit.position;
            unit.receiveDamage(this.attack);
            this.lastAction = this.currentTime + delay;

            // Render a laser for 1 frame to show attack
            var geometry = new THREE.BufferGeometry().setFromPoints([this.position, unit.position]);
            var material = new THREE.LineBasicMaterial({ color: this.color });
            var line = new THREE.Line(geometry, material);
            this.scene.add(line);
            setTimeout(() => {
                this.scene.remove(line);
            }, 100);
        }
    }

    receiveDamage(damage) {
        this.currentHealth -= damage;
        if (this.currentHealth <= 0) {
            this.player.simulation.endGame();
        }
    }

    initRender() {
        const textureLoader = new THREE.TextureLoader();
        var shape = new THREE.Shape();
        var x = 0, y = 0;
        shape.moveTo(x + this.size * Math.cos(0), y + this.size * Math.sin(0));
        for (let side = 0; side <= 5; side++) {
            shape.lineTo(x + this.size * Math.cos(side * 2 * Math.PI / 5), y + this.size * Math.sin(side * 2 * Math.PI / 5));
        }
        var extrudeSettings = { depth: this.size, bevelEnabled: false };
        var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        var material = new THREE.MeshBasicMaterial({ color: this.color });
        this.renderObject = new THREE.Mesh(geometry, material);
        this.renderObject.position.x = this.position.x;
        this.renderObject.position.y = this.position.y;
        this.scene.add(this.renderObject);

        // Add health bar
        var geometry = new THREE.BoxGeometry(this.size, 5, 5)
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.healthBarRenderObject = new THREE.Mesh(geometry, material);
        this.healthBarRenderObject.position.x = this.position.x;
        this.healthBarRenderObject.position.y = this.position.y + this.size / 2 + 5;
        this.healthBarRenderObject.position.z = this.size;
        this.scene.add(this.healthBarRenderObject);
    }

}

export default WarBase;