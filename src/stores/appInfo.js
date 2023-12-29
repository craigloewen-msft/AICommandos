import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppInfoStore = defineStore('appInfo', () => {
  const secretKey = ref(null);
  const numberOfPlayers = ref(null);
  const player1AIBaseFunction = ref(null);
  const player1AIScoutFunction = ref(null);
  const player1AIGunnerFunction = ref(null);
  const player1AITankFunction = ref(null);

  return { secretKey, numberOfPlayers, player1AIBaseFunction, player1AIScoutFunction, player1AIGunnerFunction, player1AITankFunction }
})
