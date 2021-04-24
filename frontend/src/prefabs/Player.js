class Player {
    constructor(name) {
        this._id = name;
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

    /*
        Turn MongoDB document into a player object
    */
    static docToPlayer(docPlayer) {
        let newPlayer = new Player(docPlayer.name);
        newPlayer.maxHP = docPlayer.maxHP;
        newPlayer.curHP = docPlayer.curHP;
        newPlayer.damage = docPlayer.damage;
        newPlayer.exp = docPlayer.exp;
        newPlayer.items = docPlayer.items;
        return newPlayer;
    }
}