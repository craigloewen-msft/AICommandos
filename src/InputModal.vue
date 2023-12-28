<template>
    <div>
        <!-- Modal -->
        <div class="modal fade" id="mainModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Setup Game</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div v-if="!numberOfPlayers" class="modal-body">
                        <div class="d-flex flex-column align-items-center">
                            <p>How many players?</p>
                            <div class="d-flex justify-content-center">
                                <button type="button" class="btn btn-primary me-2" v-on:click="setNumberOfPlayers(1)">1
                                    player</button>
                                <button type="button" class="btn btn-primary" v-on:click="setNumberOfPlayers(2)">2
                                    player</button>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="!player1AIFunction">
                        <div class="d-flex flex-column align-items-center">
                            <p>Choose player 1 AI</p>
                            <div class="d-flex justify-content-center">
                                <input type="text" class="form-control" v-model="textInput">
                                <button type="button" class="btn btn-primary"
                                    v-on:click="setPlayer1AIFunction(textInput)">Set function</button>
                            </div>
                        </div>
                        <h1>Hello</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, reactive, onMounted, defineEmits } from 'vue'
import { useAppInfoStore } from '@/stores/appInfo'
import { storeToRefs } from 'pinia'
import { Modal } from 'bootstrap'

const store = useAppInfoStore();
const { numberOfPlayers, player1AIFunction } = storeToRefs(store);

let textInput = null;

store.numberOfPlayers = 1;
store.player1AIFunction = `if (this.warState.playerUnitTypeCounts[this.gameConstants.UnitList.SCOUT.unitType] < 1) {
            return { action: this.gameConstants.ActionEnum.SPAWN, params: this.gameConstants.UnitList.SCOUT.unitType };
        } else if (this.warState.playerUnitTypeCounts[this.gameConstants.UnitList.GUNNER.unitType] < 2) {
            return { action: this.gameConstants.ActionEnum.SPAWN, params: this.gameConstants.UnitList.GUNNER.unitType };
        } else {
            return { action: this.gameConstants.ActionEnum.SPAWN, params: this.gameConstants.UnitList.TANK.unitType };
        }`;

// App data
const inputText = ref('')

const state = reactive({
    modal: null,
})

// App set up

const emit = defineEmits(["finish"])

onMounted(() => {
    state.modal = new Modal('#mainModal', {})
    if (!numberOfPlayers.value || !player1AIFunction.value) {
        state.modal.show();
    } else {
        nextTick(finishModal);
    }
})

// Methods 
function closeModal() {
    state.modal.hide()
}

function setNumberOfPlayers(number) {
    store.numberOfPlayers = number;
}

function setPlayer1AIFunction(functionText) {
    store.player1AIFunction = functionText;
}

function finishModal() {
    // emit event to parent
    emit('finish');
    closeModal();
}

</script>