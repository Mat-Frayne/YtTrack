function get(callback) {
    chrome.storage.sync.get(["data"], function (result) {
        if (!result) {
            chrome.storage.sync.set({ "data": {} }, function () {
                console.log("here1")
                chrome.storage.sync.get(["data"], function (result1) { console.log(result1); return callback(result1) });
            });
        } else return callback(result)
    });
}

function secondsToString(seconds) {
    var numdays = Math.floor(seconds / 86400);
    var numhours = Math.floor((seconds % 86400) / 3600);
    var numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    var numseconds = ((seconds % 86400) % 3600) % 60;
    days = numdays == 0 ? "" : numdays == 1 ? " 1 day, " : numdays + " days, "
    hours = numhours == 0 ? "" : numhours == 1 ? " 1 hour, " : numhours + " hours, "
    mins = numminutes == 0 ? "" : numminutes == 1 ? " 1 minute, " : numminutes + " minutes, "
    secs = numseconds == 1 ? " 1 second, " : numseconds + " seconds ago"
    return (days + hours + mins + secs).replace(/,([^,]*)$/, ' and $1');
}
get(function (data) {
    console.log(data)
    for (key in data.data) {
        element = data.data[key]
        $("body").append("<a>" + element.title + ", " + element.views + (element.views == 1 ? " view" : " views") + ", last viewed: " + secondsToString((Date.parse(Date()) - element.last) / 1000) + "</a><br>")
    }
});
$("button").on("click", function () {
    chrome.storage.sync.set({ "data": {} })
});
