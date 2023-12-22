import * as THREE from 'three';
import gameConstants from '../gameConstants';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

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
        this.healthBarRenderObject = null;
        this.scene = this.player.scene;
        this.id = null;

        this.color = this.player.color;
        this.commandLocation = null;

        this.unitDistances = {};
        this.resourceDistances = {};
        this.buildingDistances = {};

        this.closestResource = null;
        this.closestEnemyUnit = null;
        this.closestAllyUnit = null;
        this.closestEnemyBuilding = null;
        this.closestAllyBuilding = null;
        this.angleOffset = 0;

    }

    init() {
        this.id = this.player.simulation.getEntityID();
        this.initRender();
    }

    initRender() {
        this.initMainRenderObject();

        // Add health bar
        var geometry = new THREE.BoxGeometry(this.size, 5, 5)
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.healthBarRenderObject = new THREE.Mesh(geometry, material);
        this.healthBarRenderObject.position.x = this.position.x;
        this.healthBarRenderObject.position.y = this.position.y + this.size / 2 + 5;
        this.scene.add(this.healthBarRenderObject);
    }

    initMainRenderObject() {
        var geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        var material = new THREE.MeshBasicMaterial({ color: this.color });
        this.renderObject = new THREE.Mesh(geometry, material);
        this.renderObject.position.x = this.position.x;
        this.renderObject.position.y = this.position.y;
        this.scene.add(this.renderObject);
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

    getBuildingDistances(buildingList) {
        this.buildingDistances = {};
        let closestEnemyDistance = 9999999;
        let closestAllyDistance = 9999999;
        this.closestEnemyBuilding = null;
        this.closestAllyBuilding = null;
        for (let building of Object.values(buildingList)) {
            let distance = this.position.distanceTo(building.position);
            this.buildingDistances[building.id] = distance;
            if (building.player.team === this.player.team) {
                if (distance < closestAllyDistance) {
                    closestAllyDistance = distance;
                    this.closestAllyBuilding = building;
                }
            }
            else {
                if (distance < closestEnemyDistance) {
                    closestEnemyDistance = distance;
                    this.closestEnemyBuilding = building;
                }
            }
        }
    }

    update(command, unitList, resourceList, buildingList) {
        this.currentTime = new Date().getTime();
        // Get distances to all other units
        this.getUnitDistances(unitList);
        this.getResourceDistances(resourceList);
        this.getBuildingDistances(buildingList);

        // Get resource if on it 
        this.obtainResource();

        if (command != null) {
            switch (command.action) {
                case (gameConstants.ActionEnum.MOVE):
                    this.moveLocation(command.location);
                    break;
                case (gameConstants.ActionEnum.ATTACKMOVE):
                    this.attackMoveLocation(command.location);
                    break;
                default:
                    break;
            }
        }

        // Update render
        if (this.renderObject) {
            this.renderObject.position.x = this.position.x;
            this.renderObject.position.y = this.position.y;
            // Point in direction of command location
            if (this.commandLocation != null) {
                this.renderObject.rotation.z = Math.atan2(this.commandLocation.y - this.position.y, this.commandLocation.x - this.position.x);
            }

            this.healthBarRenderObject.position.x = this.position.x;
            this.healthBarRenderObject.position.y = this.position.y + this.size / 2 + 5;
            this.healthBarRenderObject.scale.x = this.currentHealth / this.maxHealth;
        }
    }

    obtainResource() {
        if (this.closestResource != null && this.resourceDistances[this.closestResource.id] < this.size) {
            this.closestResource.obtainResource(this);
        }
    }

    moveLocation(location) {
        let target = new THREE.Vector3(location.x, location.y, location.z ? location.z : 0);
        this.commandLocation = target;

        let direction = target.sub(this.position);
        direction.normalize();
        direction.multiplyScalar(this.speed);
        this.position.add(direction);
        this.faceDirection(location);
    }

    attackMoveLocation(location) {
        let target = new THREE.Vector3(location.x, location.y, location.z ? location.z : 0);

        // If closest enemy unit is in range we attack
        if (this.closestEnemyUnit != null && this.unitDistances[this.closestEnemyUnit.id] < this.range) {
            this.performUnitAttack(this.closestEnemyUnit);
            // If closest building is in range we attack that
        } else if (this.closestEnemyBuilding != null && this.buildingDistances[this.closestEnemyBuilding.id] < this.range) {
            this.performUnitBuildingAttack(this.closestEnemyBuilding);
            // Otherwise we move towards the location
        } else {
            this.moveLocation(location);
        }
    }

    faceDirection(position) {
        if (this.renderObject) {
            this.renderObject.lookAt(position);
            this.renderObject.rotation.y += this.angleOffset;
        }
    }

    performUnitAttack(unit) {
        let delay = this.cooldown * 0.10 * Math.random();
        if (this.currentTime - this.lastAction > this.cooldown) {
            this.commandLocation = unit.position;
            unit.receiveDamage(this.attack);
            this.lastAction = this.currentTime + delay;

            this.faceDirection(unit.position);

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

    performUnitBuildingAttack(building) {
        // Adding in case we ever need building specific logic
        this.performUnitAttack(building);
    }

    receiveDamage(amount) {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.scene.remove(this.renderObject);
            this.scene.remove(this.healthBarRenderObject);
            this.player.removeUnit(this.id);
            console.log("Unit " + this.id + " died");
        }
    }

    loadModel(inputModelString) {
        var modelLoader = new OBJLoader();
        var modelMaterial = new THREE.MeshPhongMaterial({ color: this.color, shininess: 10 });
        let model = null;
        modelLoader.load(inputModelString, (obj) => {
            model = obj;
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = modelMaterial;
                }
            });

            model.rotation.x = -Math.PI / 2;

            // Scale object to fit unit size
            var planeBndBox = new THREE.Box3().setFromObject(model);
            var boxSize = new THREE.Vector3();
            planeBndBox.getSize(boxSize);
            var scaleFactor = this.size / boxSize.y;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            this.renderObject = model;
            this.scene.add(this.renderObject);
        });
    }

}

export default unitBase;