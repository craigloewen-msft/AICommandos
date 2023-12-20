import * as THREE from 'three';
import gameConstants from '../gameConstants';

class unitBase {
    constructor(maxHealth, currentHealth, speed, cooldown, range, attack, size, AOE, energyCost, moneyCost, unitType, player, x, y) {
        this.maxHealth = maxHealth;
        this.currentHealth = currentHealth;
        this.speed = speed;
        this.cooldown = cooldown;
        this.range = range;
        this.attack = attack;
        this.size = size;
        this.AOE = AOE;
        this.energyCost = energyCost;
        this.moneyCost = moneyCost;
        this.unitType = unitType;
        this.player = player;
        this.position = new THREE.Vector3(x, y, 0);

        this.lastAction = 0;
        this.renderObject = null;
        this.scene = this.player.scene;
        this.id = null;

        this.unitDistances = {};
        this.resourceDistances = {};

        this.closestUnit = null;
        this.closestResource = null;
    }

    init() {
        this.id = this.player.simulation.getEntityID();
        this.initRender();
    }

    initRender() {
        var geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        this.renderObject = new THREE.Mesh(geometry, material);
        this.renderObject.position.x = this.position.x;
        this.renderObject.position.y = this.position.y;
        this.scene.add(this.renderObject);
    }

    getUnitDistances(unitList) {
        this.unitDistances = {};
        this.closestUnit = null;
        let closestDistance = 9999999;
        for (let unit of Object.values(unitList)) {
            let distance = this.position.distanceTo(unit.position);
            this.unitDistances[unit.id] = distance;
            if (distance < closestDistance) {
                closestDistance = distance;
                this.closestUnit = unit;
            }
        }
    }

    getResourceDistances(resourceList) {
        this.resourceDistances = {};
        let closestDistance = 9999999;
        this.closestResource = null;
        for (let resource of Object.values(resourceList)) {
            let distance = this.position.distanceTo(resource.position);
            this.resourceDistances[resource.id] = distance;
            if (distance < closestDistance) {
                closestDistance = distance;
                this.closestResource = resource;
            }
        }
    }

    update(command, unitList, resourceList) {
        this.currentTime = new Date().getTime();
        // Get distances to all other units
        this.getUnitDistances(unitList);
        this.getResourceDistances(resourceList);

        let tookAction = false;
        if (command != null) {
            this.lastAction = this.currentTime;
            switch (command.action) {
                case (gameConstants.ActionEnum.MOVE):
                    this.moveLocation(command.location);
                    tookAction = true;
                    break;
                default:
                    break;
            }
        }

        // Update render
        this.renderObject.rotation.z -= 0.1;
        this.renderObject.position.x = this.position.x;
        this.renderObject.position.y = this.position.y;
    }

    moveLocation(location) {
        let target = new THREE.Vector3(location.x, location.y, location.z ? location.z : 0);

        let direction = target.sub(this.position);
        direction.normalize();
        direction.multiplyScalar(this.speed);
        this.position.add(direction);
    }

    damage(attack) {
        this.currentHealth -= attack;
        if (this.currentHealth <= 0) {
            this.isAlive = false;
        }
    }

}

export default unitBase;