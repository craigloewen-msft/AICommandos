import * as THREE from 'three';
import Background from './components/Background';
import Spaceship from './components/Spaceship';

class SceneManager {
    constructor(gameWidth, gameHeight, canvas) {
        this.screenDimensions = {
            width: gameWidth,
            height: gameHeight
        };

        this.canvas = canvas;

        this.scene = this.buildScene();
        this.renderer = this.buildRender(this.screenDimensions);
        this.camera = this.buildCamera(this.screenDimensions);

        this.ambientLight = new THREE.AmbientLight('#ffffff', 1.5);
        this.scene.add(this.ambientLight);

        this.dynamicSubjects = [];
        this.createSceneSubjects();

        this.keyMap = [];
    }

    buildScene() {
        const scene = new THREE.Scene();
        return scene;
    }

    buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });

        renderer.setClearColor("#222222");
        renderer.setSize(width, height);

        return renderer;
    }

    buildCamera({ width, height }) {
        const nearPlane = 1;
        const farPlane = 1000;
        const camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, nearPlane, farPlane);

        camera.position.z = 10;

        return camera;
    }

    createSceneSubjects() {
        this.theBackground = new Background(this.scene);
        this.theSpaceship = new Spaceship(this.scene);

        this.dynamicSubjects.push(this.theSpaceship);
    }

    update() {
        for (let i = 0; i < this.dynamicSubjects.length; i++)
            this.dynamicSubjects[i].update();

        this.theSpaceship.handleInput(this.keyMap, this.camera);

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const { clientWidth: width, clientHeight: height } = this.canvas;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }

    handleInput(keyCode, isDown) {
        this.keyMap[keyCode] = isDown;
    }
}

export default SceneManager;