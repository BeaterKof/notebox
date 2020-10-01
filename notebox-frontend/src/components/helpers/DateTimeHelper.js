// must use ISO8601 string format for datetime

function currentDate(now) {
    return now.getFullYear() + "-" + (((now.getMonth() + 1) < 10) ? "0" : "") + (now.getMonth() + 1) + "-" + ((now.getDate() < 10) ? "0" : "") + now.getDate();
}

function currentTime(now) {
    return ((now.getHours() < 10) ? "0" : "") + now.getHours() + ":" + ((now.getMinutes() < 10) ? "0" : "") + now.getMinutes() + ":" + ((now.getSeconds() < 10) ? "0" : "") + now.getSeconds();
}

export function currentTimestamp() {
    var now = new Date();
    var timestamp = currentDate(now) + " " + currentTime(now)
    return timestamp;
}