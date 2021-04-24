class Log {
    constructor(actionId) {
        this.msg = ''; //TODO: Figure out best way to form msg
        this.time = new Date().toString();
        this.actionId = actionId;
    }
}