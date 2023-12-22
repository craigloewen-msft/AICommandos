import gameConstants from "./gameConstants";
import * as THREE from "three";

class Resource {
    constructor(resourceType, resourceAmount, x, y, scene, simulation) {
        this.resourceType = resourceType;
        this.resourceAmount = resourceAmount;
        this.simulation = simulation;
        // Clamp size between 5 and 30
        this.size = Math.max(5, Math.min(30, resourceAmount / 2));

        this.id = simulation.getEntityID();

        switch (this.resourceType) {
            case (gameConstants.ResourceType.MONEY):
                this.color = 0xffff00;
                break;
            case (gameConstants.ResourceType.ENERGY):
                this.color = 0x00ffff;
                break;
            default:
                break;
        }

        this.position = new THREE.Vector3(x, y, 0);

        this.scene = scene;
        this.renderObject = null;

        this.initRender();
    }

    initRender() {
        const textureLoader = new THREE.TextureLoader();
        var geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        var material = new THREE.MeshBasicMaterial({ color: this.color });
        this.renderObject = new THREE.Mesh(geometry, material);
        this.renderObject.position.x = this.position.x;
        this.renderObject.position.y = this.position.y;
        this.scene.add(this.renderObject);
    }

    obtainResource(inUnit) {
        switch (this.resourceType) {
            case (gameConstants.ResourceType.MONEY):
                inUnit.player.money += this.resourceAmount;
                break;
            case (gameConstants.ResourceType.ENERGY):
                inUnit.player.energy += this.resourceAmount;
                break;
            default:
                break;
        }

        this.scene.remove(this.renderObject);
        this.simulation.removeResource(this.id);
    }
}

export default Resource;