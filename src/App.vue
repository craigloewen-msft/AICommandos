<template>
  <canvas ref="canvasRef" style="width: 1920px; height: 1080px;"></canvas>
</template>

<script>
import { ref, onMounted } from 'vue'
import SceneManager from './js/SceneManager.js'

export default {
  name: 'App',
  data: () => ({
    canvas: null,
    sceneManager: null,
    gameWidth: 1920,
    gameHeight: 1080,
  }),
  methods: {
    test() {
      console.log("Test");
    },
    onWindowResize() {
      const aspectRatio = this.gameWidth / this.gameHeight;
      const windowAspectRatio = window.innerWidth / window.innerHeight;

      let newWidth, newHeight;

      if (windowAspectRatio > aspectRatio) {
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
      } else {
        newWidth = window.innerWidth;
        newHeight = newWidth / aspectRatio;
      }

      this.canvas.style.width = newWidth + 'px';
      this.canvas.style.height = newHeight + 'px';

      this.canvas.width = newWidth;
      this.canvas.height = newHeight;

      this.sceneManager.onWindowResize(newWidth, newHeight);
    },
    handleKeyUp(event) {
      var keyCode = event.which;
      this.sceneManager.handleInput(keyCode, false);
    },
    handleKeyDown(event) {
      var keyCode = event.which;
      this.sceneManager.handleInput(keyCode, true);
    }
  },
  mounted() {
    this.canvas = this.$refs.canvasRef;
    const sceneManager = new SceneManager(this.gameWidth, this.gameHeight, this.canvas);

    const render = () => {
      requestAnimationFrame(render);
      sceneManager.update();
    }

    this.sceneManager = sceneManager;

    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('keydown', this.handleKeyDown);

    this.onWindowResize();
    render();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('keydown', this.handleKeyDown);
  }
}
</script>

<style></style>