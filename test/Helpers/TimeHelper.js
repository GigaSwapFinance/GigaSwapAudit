module.exports = { Up, Seconds, Minutes, Hours, Days, Years };

async function Up(miliseconds) {
    await network.provider.send("evm_increaseTime", [miliseconds]);
    await network.provider.send("evm_mine");
}
function Seconds(seconds) {
    //return seconds * 1000;
    return seconds;
}
function Minutes(minutes) {
    return Seconds(minutes * 60);
}
function Hours(hours) {
    return Minutes(hours * 60);
}
function Days(days) {
    return Hours(24 * days);
}
function Years(years) {
    return Days(365 * Days);
}