import unitBase from './unitBase';

class Scout extends unitBase {
    constructor(maxHealth, currentHealth, speed, cooldown, range, attack, unitSize, AOE, energyCost, moneyCost, unitType, player, x, y) {
        super(maxHealth, currentHealth, speed, cooldown, range, attack, unitSize, AOE, energyCost, moneyCost, unitType, player, x, y);
    }
}

export default Scout;