class Log {
    constructor(actionId, msg) {
        this.msg = msg; //TODO: Figure out best way to form msg
        let curTime = new Date();
        this.time = curTime.toLocaleDateString() + ' ' + curTime.toLocaleTimeString();
        this.actionId = actionId;
    }
}