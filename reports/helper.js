
function addTime(date, interval) {

    let newDate = new Date(date);
    
    switch(interval) {
    case "hour":
        newDate.setHours(date.getHours() + 1);
        return newDate;
    case "day":
        newDate.setDate(date.getDate() + 1);
        return newDate;
    case "week":
        newDate.setDate(date.getDate() + 7);
        return newDate;
    case "year":
        newDate.setFullYear(date.getFullYear() + 1);
        return newDate;
    default:
        return null;
    }
}

function diffHours(first, second) {
    return Math.abs(first - second) / 36e5;
}


module.exports = {
    addTime,
    diffHours
};
