import * as THREE from 'three';
import bgImage from '../../assets/textures/bg.png';

class Background {
	constructor(scene, height) {
		var geometry = new THREE.PlaneGeometry(3000, 3000);

		const textureLoader = new THREE.TextureLoader();
		var material = new THREE.MeshBasicMaterial({
			map: textureLoader.load(bgImage, function(texture) {
				// This will be called when the texture has loaded successfully
			}, undefined, function(error) {
				// This will be called if there was an error during loading
			}),
		});
		var bg = new THREE.Mesh(geometry, material);

		bg.rotation.z = -Math.PI / 2;
		bg.position.z = -900;
		bg.position.y = 1000;

		scene.add(bg);

		this.bg = bg;
	}

	update() {
		// update logic here
	}
}

export default Background;