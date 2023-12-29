<template>
    <div>
        <!-- Modal -->
        <div class="modal fade" id="mainModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="staticBackdropLabel">Setup Game</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div v-if="!numberOfPlayers" class="modal-body">
                        <div class="d-flex flex-column align-items-center">
                            <p>How many players?</p>
                            <div class="d-flex justify-content-center">
                                <button type="button" class="btn btn-primary" v-on:click="setNumberOfPlayers(-1)">Watch AIs
                                    play</button>
                                <button type="button" style="margin-left: 5px;" class="btn btn-primary me-2" v-on:click="setNumberOfPlayers(1)">1
                                    player</button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="align-items-center">
                        <h3>Set your strategy for these areas:</h3>
                        <div v-if="!player1AIBaseFunction">
                            <p>Base unit building</p>
                            <textarea class="form-control" v-model="player1AIBaseFunctionTextInput"></textarea>
                        </div>
                        <div v-else>
                            <p>Base code</p>
                            <pre><code v-text="player1AIBaseFunction"></code></pre>
                        </div>

                        <div v-if="!player1AIScoutFunction">
                            <p>Scout units</p>
                            <textarea class="form-control" v-model="player1AIScoutFunctionTextInput"></textarea>
                        </div>
                        <div v-else>
                            <p>Scout code</p>
                            <pre><code v-text="player1AIScoutFunction"></code></pre>
                        </div>

                        <div v-if="!player1AIGunnerFunction">
                            <p>Gunner units</p>
                            <textarea class="form-control" v-model="player1AIGunnerFunctionTextInput"></textarea>
                        </div>
                        <div v-else>
                            <p>Gunner code</p>
                            <pre><code v-text="player1AIGunnerFunction"></code></pre>
                        </div>

                        <div v-if="!player1AITankFunction">
                            <p>Tank units</p>
                            <textarea class="form-control" v-model="player1AITankFunctionTextInput"></textarea>
                        </div>
                        <div v-else>
                            <p>Tank code</p>
                            <pre><code v-text="player1AITankFunction"></code></pre>
                        </div>

                        <div v-if="readyToFinish">
                            <button type="button" class="btn btn-primary" v-on:click="finishModal">Finish</button>
                        </div>
                        <div v-else-if="!loading">
                            <button type="button" class="btn btn-primary" v-on:click="loadAICompletions">Set
                                function</button>
                        </div>
                        <div v-else>
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, nextTick, reactive, onMounted, defineEmits } from 'vue'
import { useAppInfoStore } from '@/stores/appInfo'
import { storeToRefs } from 'pinia'
import { Modal } from 'bootstrap'
import completionHandler from "@/js/ai/completionHandler";

const store = useAppInfoStore();
const { secretKey, numberOfPlayers, player1AIBaseFunction, player1AIScoutFunction, player1AIGunnerFunction, player1AITankFunction } = storeToRefs(store);

let uri = window.location.href.split('?');
if (uri.length > 1) {
    let params = new URLSearchParams(uri[1]);
    secretKey.value = params.get('secretKey');
}

const aiCompletions = new completionHandler(() => console.log("AI completions loaded"), secretKey.value);

// App data
const inputText = ref('');
const player1AIBaseFunctionTextInput = ref('');
const player1AIScoutFunctionTextInput = ref('');
const player1AIGunnerFunctionTextInput = ref('');
const player1AITankFunctionTextInput = ref('');

const loading = ref(false);
const readyToFinish = ref(false);

const state = reactive({
    modal: null,
})

// Pre-add data for testing
let autoClose = false;
// store.numberOfPlayers = 1;
player1AIBaseFunctionTextInput.value = "Maintain 1 scout, 2 gunners and then spawn tanks";
player1AIScoutFunctionTextInput.value = "Move to the closest resource. If an enemy gets within 120 units move to back to the closest unit or the base.";
player1AIGunnerFunctionTextInput.value = "Attack move to the closest enemy. If an enemy doesn't exist go to the base.";
player1AITankFunctionTextInput.value = "Attack move to the enemy base.";

// App set up

const emit = defineEmits(["finish"])

onMounted(() => {
    state.modal = new Modal('#mainModal', {})
    state.modal.show();
})

// Methods 
function closeModal() {
    state.modal.hide()
}

function setNumberOfPlayers(number) {
    store.numberOfPlayers = number;
    if (number === -1) {
        finishModal();
    }
}

function finishModal() {
    // emit event to parent
    closeModal();
    emit('finish');
}

async function loadAICompletions() {
    loading.value = true;
    let player1BaseFunctionPromise = aiCompletions.getBaseFunctionCompletion(player1AIBaseFunctionTextInput.value);
    let player1ScoutFunctionPromise = aiCompletions.getScoutFunctionCompletion(player1AIScoutFunctionTextInput.value);
    let player1AIGunnerFunctionPromise = aiCompletions.getGunnerFunctionCompletion(player1AIGunnerFunctionTextInput.value);
    let player1AITankFunctionPromise = aiCompletions.getTankFunctionCompletion(player1AITankFunctionTextInput.value);

    let [player1AIBaseFunction, player1AIScoutFunction, player1AIGunnerFunction, player1AITankFunction] = await Promise.all([player1BaseFunctionPromise, player1ScoutFunctionPromise, player1AIGunnerFunctionPromise, player1AITankFunctionPromise]);
    store.player1AIBaseFunction = player1AIBaseFunction;
    store.player1AIScoutFunction = player1AIScoutFunction;
    store.player1AIGunnerFunction = player1AIGunnerFunction;
    store.player1AITankFunction = player1AITankFunction;
    loading.value = false;
}

// watchers

// Watch to auto close the modal for testing
watch([numberOfPlayers, player1AIBaseFunction, player1AIScoutFunction, player1AIGunnerFunction, player1AITankFunction], () => {
    if (numberOfPlayers.value && player1AIBaseFunction.value && player1AIScoutFunction.value && player1AIGunnerFunction.value && player1AITankFunction.value) {
        if (autoClose) {
            finishModal();
        } else {
            readyToFinish.value = true;
        }

    }
})

</script>