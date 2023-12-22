import * as THREE from 'three';
import Background from './components/Background';
import GameSimulation from './warscript/gameSimulation';

class SceneManager {
    constructor(gameWidth, gameHeight, canvas) {
        this.gameDimensions = {
            width: gameWidth,
            height: gameHeight
        };

        this.screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.canvas = canvas;

        this.scene = this.buildScene();
        this.renderer = this.buildRender(this.gameDimensions);
        this.camera = this.buildCamera(this.gameDimensions);

        this.ambientLight = new THREE.AmbientLight('#ffffff', 1.5);
        this.scene.add(this.ambientLight);

        this.dynamicSubjects = [];
        this.createSceneSubjects();

        this.keyMap = [];

        this.simulation = new GameSimulation(this.gameDimensions.width, this.gameDimensions.height, this.scene);
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
        const farPlane = 10000;
        const camera = new THREE.PerspectiveCamera(50, 1, nearPlane, farPlane);

        // camera.rotation.x = (Math.PI / 2) * 0.;
        camera.position.x = this.gameDimensions.width / 2;
        camera.position.y = this.gameDimensions.height / 2;
        camera.position.z = 1400;

        return camera;
    }

    createSceneSubjects() {
        this.theBackground = new Background(this.scene);
    }

    getCanvasRelativePosition(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (clientX - rect.left) * this.canvas.width / rect.width,
            y: (clientY - rect.top) * this.canvas.height / rect.height,
        };
    }

    getPickPosition(clientX, clientY) {
        const pos = this.getCanvasRelativePosition(clientX, clientY);
        let xpos = (pos.x / this.canvas.width) * 2 - 1;
        let ypos = (pos.y / this.canvas.height) * -2 + 1;  // note we flip Y
        let pickVector = new THREE.Vector2(xpos, ypos);
        return pickVector;
    }

    onClick(clientX, clientY) {
        let mouseVector = this.getPickPosition(clientX, clientY);

        let rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(mouseVector, this.camera);

        const intersectedObjects = rayCaster.intersectObjects(this.scene.children);
        if (intersectedObjects.length) {
            // pick the first object. It's the closest one
            this.pickedObject = intersectedObjects[0].object;
            // Double size of picked object
            this.pickedObject.scale.x *= 2;
        }
    }

    update() {
        for (let i = 0; i < this.dynamicSubjects.length; i++)
            this.dynamicSubjects[i].update();

        if (this.theBackground) this.theBackground.update();

        let cameraMoveSpeed = 25;
        
        // W - Forward (Increase Y)
        if (this.keyMap['W'.charCodeAt(0)]) {
            this.camera.position.y += cameraMoveSpeed;
        }

        // S - Backward (Decrease Y)
        if (this.keyMap['S'.charCodeAt(0)]) {
            this.camera.position.y -= cameraMoveSpeed;
        }

        // A - Left (Decrease X)
        if (this.keyMap['A'.charCodeAt(0)]) {
            this.camera.position.x -= cameraMoveSpeed;
        }

        // D - Right (Increase X)
        if (this.keyMap['D'.charCodeAt(0)]) {
            this.camera.position.x += cameraMoveSpeed;
        }

        // Z - Down (Increase Z)
        if (this.keyMap['Z'.charCodeAt(0)]) {
            this.camera.position.z -= cameraMoveSpeed;
        }

        // X - Up (Decrease Z)
        if (this.keyMap['X'.charCodeAt(0)]) {
            this.camera.position.z += cameraMoveSpeed;
        }
        this.simulation.update();

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