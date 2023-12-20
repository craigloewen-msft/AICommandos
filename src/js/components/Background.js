import * as THREE from 'three';
import bgImage from '../../assets/textures/bg.png';

class Background {
	constructor(scene, height) {
		const textureLoader = new THREE.TextureLoader();
		scene.background = textureLoader.load(bgImage);
	}

	update() {
		// update logic here
	}
}

export default Background;