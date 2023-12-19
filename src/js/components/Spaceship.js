import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

class Spaceship {
	constructor(scene) {
		var modelLoader = new OBJLoader();

		const textureLoader = new THREE.TextureLoader();
		var texMap = textureLoader.load("/src/assets/textures/spaceship.png");
		var modelMaterial = new THREE.MeshBasicMaterial({ map: texMap });

		this.model;
		this.height;
		this.width;

		modelLoader.load("/src/assets/models/spaceship.obj", (obj) => {
			this.model = obj;
			this.model.traverse((child) => {
				if (child.isMesh) {
					child.material = modelMaterial;
				}
			});

			this.model.rotation.x = -Math.PI / 2;

			scene.add(this.model);

			var planeBndBox = new THREE.Box3().setFromObject(this.model);
			var boxSize = new THREE.Vector3();
			planeBndBox.getSize(boxSize);
			this.height = boxSize.y;
			this.width = boxSize.x;
		});
	}

	update() {
	}

	handleInput(keyMap, camera) {
		if (keyMap[87] && this.model.position.y + this.height / 2 < camera.position.y + camera.top) {
			this.model.position.y += 5;
		}
		if (keyMap[83] && this.model.position.y - this.height / 2 > camera.position.y + camera.bottom) {
			this.model.position.y -= 5;
		}
		if (keyMap[68] && this.model.position.x + this.width / 2 < camera.right) {
			this.model.position.x += 5;
		}
		if (keyMap[65] && this.model.position.x - this.width / 2 > camera.left) {
			this.model.position.x -= 5;
		}
	}
}

export default Spaceship;