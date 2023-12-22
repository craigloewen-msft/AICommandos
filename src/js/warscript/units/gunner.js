import unitBase from './unitBase';

class Gunner extends unitBase {
    constructor(maxHealth, currentHealth, speed, cooldown, range, attack, unitSize, AOE, energyCost, moneyCost, unitType, player, x, y) {
        super(maxHealth, currentHealth, speed, cooldown, range, attack, unitSize, AOE, energyCost, moneyCost, unitType, player, x, y);
    }

    initMainRenderObject() {
        this.loadModel("/src/assets/models/hover.obj");
        this.angleOffset = Math.PI / 2;
    }
}

export default Gunner;