import gameConstants from "./gameConstants";
import * as THREE from "three";

class Resource {
    constructor(resourceType, resourceAmount, x, y, scene, simulation) {
        this.resourceType = resourceType;
        this.resourceAmount = resourceAmount;
        // Clamp size between 5 and 30
        this.size = Math.max(5, Math.min(30, resourceAmount / 2));

        this.id = simulation.getEntityID();

        switch (this.resourceType) {
            case (gameConstants.ResourceType.MONEY):
                this.colorstring = "gold";
                break;
            case (gameConstants.ResourceType.ENERGY):
                this.colorstring = "lightgreen";
                break;
            default:
                break;
        }

        this.position = new THREE.Vector3(x, y, 0);
        this.isAlive = true;

        this.scene = scene;
        this.renderObject = null;

        this.initRender();
    }

    initRender() {
        const textureLoader = new THREE.TextureLoader();
        var geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
        var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.renderObject = new THREE.Mesh(geometry, material);
        this.renderObject.position.x = this.position.x;
        this.renderObject.position.y = this.position.y;
        this.scene.add(this.renderObject);
    }
}

export default Resource;