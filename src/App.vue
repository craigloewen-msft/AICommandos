<template>
  <InputModal @finish="startGame"></InputModal>
  <canvas ref="canvasRef" v-on:click="onClick" style="width: 1920px; height: 1080px;"></canvas>
  <pre>{{ prettyGameStats }}</pre>
</template>

<script setup>
import { ref, toRef, computed, onMounted, onBeforeUnmount } from 'vue'
import SceneManager from './js/SceneManager.js'
import InputModal from './InputModal.vue'
import { useAppInfoStore } from '@/stores/appInfo'
import { storeToRefs } from 'pinia'

// Data

const store = useAppInfoStore();
const { numberOfPlayers, player1AIFunction } = storeToRefs(store);

const canvasRef = ref(null);
let gameStats = ref(null);

let gameCanvas = null;
let sceneManager = null;
const gameWidth = 2112;
const gameHeight = 1188; // Made these values just a bit bigger than 1920 x 1080 so I can know what's game dimensions and what's screen dimensions

const prettyGameStats = computed(() => {
  if (gameStats.value) {
    return JSON.stringify(gameStats.value, null, 2);
  }
});

// Methods

function getGameStats() {
  gameStats.value = sceneManager.simulation.getGameStats();
}

function onWindowResize() {
  const aspectRatio = gameWidth / gameHeight;
  const windowAspectRatio = window.innerWidth / window.innerHeight;

  let newWidth, newHeight;

  if (windowAspectRatio > aspectRatio) {
    newHeight = window.innerHeight;
    newWidth = newHeight * aspectRatio;
  } else {
    newWidth = window.innerWidth;
    newHeight = newWidth / aspectRatio;
  }

  gameCanvas.style.width = newWidth + 'px';
  gameCanvas.style.height = newHeight + 'px';

  gameCanvas.width = newWidth;
  gameCanvas.height = newHeight;

  sceneManager.onWindowResize(newWidth, newHeight);
}

function handleKeyUp(event) {
  var keyCode = event.which;
  sceneManager.handleInput(keyCode, false);
}
function handleKeyDown(event) {
  var keyCode = event.which;
  sceneManager.handleInput(keyCode, true);
}

function onClick(event) {
  sceneManager.onClick(event.clientX, event.clientY);
}

function startGame() {
  if (store.player1AIFunction) {
    sceneManager.simulation.setPlayerAIFunction(0, store.player1AIFunction);
  }

  sceneManager.startGame();
}

// App set up

onMounted(() => {
  gameCanvas = canvasRef.value;
  sceneManager = new SceneManager(gameWidth, gameHeight, gameCanvas);

  const render = () => {
    requestAnimationFrame(render);
    sceneManager.update();
  }

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('keyup', handleKeyUp);
  window.addEventListener('keydown', handleKeyDown);

  // Refresh game stats every 0.5 seconds
  setInterval(getGameStats, 500);

  onWindowResize();
  render();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('keydown', handleKeyDown);
});

</script>

<style></style>