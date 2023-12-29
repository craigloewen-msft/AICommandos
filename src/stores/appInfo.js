import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppInfoStore = defineStore('appInfo', () => {
  const numberOfPlayers = ref(null);
  const player1AIBaseFunction = ref(null);
  const player1AIScoutFunction = ref(null);
  const player1AIGunnerFunction = ref(null);
  const player1AITankFunction = ref(null);

  return { numberOfPlayers, player1AIBaseFunction, player1AIScoutFunction, player1AIGunnerFunction, player1AITankFunction }
})
