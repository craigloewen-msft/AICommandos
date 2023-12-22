import unitBase from './unitBase';

class Tank extends unitBase {
    constructor(maxHealth, currentHealth, speed, cooldown, range, attack, unitSize, AOE, energyCost, moneyCost, unitType, player, x, y) {
        super(maxHealth, currentHealth, speed, cooldown, range, attack, unitSize, AOE, energyCost, moneyCost, unitType, player, x, y);
    }

    initMainRenderObject() {
        this.loadModel("/src/assets/models/tank.obj");
    }
}

export default Tank;