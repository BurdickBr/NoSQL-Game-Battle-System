class Player {
    constructor(name) {
        this._id = name;
        this.name = name;
        this.maxHP = 50;
        this.curHP = this.maxHP;
        this.damage = 15;
        this.exp = 0;
        this.hiExp = 0;
        this.items = [new Item(), new Item(), new Item()];
        this.isDead = false;
    }

    doAttack() {
        let atkPercent = Math.random() * (1.2 - 0.6) + 0.6;
        return Math.round(this.damage * atkPercent);
    }

    /*
        Can be used for damage or healing
    */
    adjustHP(adjHp) {
        this.curHP += adjHp;
        if(this.curHP > this.maxHP) {
            this.curHP = this.maxHP;
        }
        if(this.curHP < 0) {
            this.curHP = 0;
            this.isDead = true;
        }
    }

    gainExp(xp) {
        this.exp += xp;
        //TODO: Level Up System?
    }

    useItem() {
        if (this.items.length == 0) {
            return false;
        }
        let curItem = this.items.pop();
        this.adjustHP(curItem.heal);
        return true;
    }

    percentHealth() {
        return Math.round(this.curHP / this.maxHP * 100.0);
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
        newPlayer.hiExp = docPlayer.hiExp;
        newPlayer.items = docPlayer.items;
        return newPlayer;
    }
}