class WarBaseDescription {
    constructor(player, base) {
        this.health = base.health;
        this.gold = base.gold;
        this.energy = base.energy;
        this.lastAction = base.lastAction
        this.cooldown = base.cooldown;
        this.maxUnitCount = player.maxUnitCount;
        this.currentUnitCount = player.getCurrentUnitCount();
        this.x = base.x;
        this.y = base.y;

        this.actionDescription = null;
        this.params = null;
    }
}

export default WarBaseDescription;