const PlayerCollection = {
    NAME: "player_name",
    MAX_HP: "max_health",
    CUR_HP: "current_health",
    DMG: "damage",
    EXP: "experience",
    ITEMS: "items",
    COLLECTION: "Player"
};

const EnemyCollection = {
    NAME: "enemy_name",
    MAX_HP: "max_health",
    CUR_HP: "current_health",
    DMG: "damage",
    COLLECTION: "Enemy"
}

const ItemCollection = {
    NAME: "item_name",
    DESC: "item_description",
    EFF:  "item_effect",
    COLLECTION: "Item"
}

const ActionCollection = {
    NAME: "action_name",
    PERF_ID: "performer_id",
    DMG: "action_damage",
    COLLECTION: "Action"
}

const BattleLogCollection = {
    MSG: "entry_message",
    TIME: "timestamp",
    ACTION: "action_id",
    COLLECTION: "BattleLog"
}

const GameDB = 'GameBattleSystem'

module.exports = { PlayerCollection, EnemyCollection,  ItemCollection,  
                    ActionCollection,  BattleLogCollection, GameDB }