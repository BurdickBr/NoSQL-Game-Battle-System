class Player {
    constructor(name) {
        this.name = name;
        this.maxHP = 50;
        this.curHP = this.maxHP;
        this.damage = 15;
        this.exp = 0;
        this.items = [];
    }

    doAttack() {
        atkPercent = Math.random() * (1.2 - 0.6) + 0.6;
        return this.damage * atkPercent;
    }

    static docToPlayer(player) {
        //TODO: turn MongoDB document into a player object
    }
}