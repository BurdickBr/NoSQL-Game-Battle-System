class Enemy {
    /*
        enemy argument will be a mongodb document
    */
    constructor(enemy) {
        this._id = enemy._id;
        this.name = enemy.name;
        this.maxHP = enemy.maxHP;
        this.curHP = enemy.curHP;
        this.damage = enemy.damage;
        this.exp = enemy.exp;
        this.isDead = false;
        this.img = enemy.img;
    }

    doAttack() {
        atkPercent = Math.random() * (1.2 - 0.6) + 0.6;
        return this.damage * atkPercent;
    }

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
}