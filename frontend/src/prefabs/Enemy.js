class Enemy {
    /*
        enemy argument will be a mongodb document
    */
    constructor(enemy) {
        this.name = enemy.name;
        this.maxHP = enemy.maxHP;
        this.curHP = enemy.curHP;
        this.damage = enemy.damage;
        this.img = enemy.img;
    }

    doAttack() {
        atkPercent = Math.random() * (1.2 - 0.6) + 0.6;
        return this.damage * atkPercent;
    }
}