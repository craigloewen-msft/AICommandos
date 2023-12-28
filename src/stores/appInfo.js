import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppInfoStore = defineStore('appInfo', () => {
  const numberOfPlayers = ref(null);
  const player1AIFunction = ref(null);

  return { numberOfPlayers, player1AIFunction }
})
