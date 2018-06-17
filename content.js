function get(callback) {
    chrome.storage.sync.get(["data"], function (result) {
        console.log(result)
        if (!result.hasOwnProperty("data")) {
            chrome.storage.sync.set({ "data": {} }, function () {
                chrome.storage.sync.get(["data"], function (result1) { console.log(result1); return callback(result1) });
            });
        } else return callback(result)
    });
}

function log(string) {
    console.log("[YtTrack] " + string)
}

function parseURL(url) {
    var video_id = url.split('v=').length != -1 ? url.split('v=')[1] : null;
    if (!video_id) return null
    var ampersandPosition = video_id.indexOf('&');
    if (ampersandPosition != -1) {
        video_id = video_id.substring(0, ampersandPosition);
        return video_id
    } else return video_id
}

function append(item, callback) {
    get(function (d) {
        var views = 1;
        if (d.data.hasOwnProperty(item)) views = d.data[item].views + 1
        d.data[item] = { "title": $('#container > h1 > yt-formatted-string').text(), "views": views, "last": Date.parse(Date()) }
        chrome.storage.sync.set({ "data": d.data }, function () {});
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
$(function () {
    get(function (d) {
        if (!d.hasOwnProperty("data")) {}
    })
    lastColour = $("html").attr("dark") ? "black" : "white";
    id = parseURL(window.location.search)
    if (id) {
        get(function (data) {
            views = "<div style='color:red'>0</div>"
            last = "Never";
            if (data.data.hasOwnProperty(id)) {
                views = "<div style='color:green'>" + data.data[id].views + "</div>"
                last = secondsToString((Date.parse(Date()) - data.data[id].last) / 1000)
            }
            $("#info yt-view-count-renderer").append("<ytTrackContainer><a>" + views + "</a><div class='ytTrackCountdown'>" + last + "</div></ytTrackContainer")
            append(id, function () {});
        })
    }
    console.log($("#items"))
});
document.addEventListener("yt-navigate-finish", function (e) {
    append(parseURL(e.srcElement.baseURI), function () {});
});
$("ytd-watch-next-secondary-results-renderer").on("yt-load-next-continuation", function (e) {
    display_views()
})
$("ytd-watch-next-secondary-results-renderer").on("shown-items-changed", function (e) {
    display_views()
})

function display_views() {
    lastColour = $("html").attr("dark") ? "black" : "white";
    get(function (data) {
        $("ytd-compact-video-renderer").each(index => {
            that = $("ytd-compact-video-renderer").eq(index).find("a.ytd-compact-video-renderer")
            if (that.find("yttrackcontainer").length != 0) {
                return;
            };
            link = parseURL(that.attr("href"))
            views = "<div style='color:red'>0</div>"
            last = "Never"
            if (data.data.hasOwnProperty(link)) {
                views = "<div style='color:green'>" + data.data[link].views + "</div>"
                last = secondsToString((Date.parse(Date()) - data.data[link].last) / 1000)
            }
            that.append("<ytTrackContainer ><a>" + views + "</a><div class='ytTrackCountdown'>" + last + "</div></ytTrackContainer")
        });
    });
}
// if (parseURL(window.location.search)) {
//     window.addEventListener("yt-navigate-finish", function (e) {
//         get((d) => { console.log(d) })
//         append(parseURL(e.srcElement.baseURI), function () {});
//     });
//     get(function (data) {
//         setTimeout(function () {
//             $("ytd-compact-video-renderer").each(index => {
//                 that = $("ytd-compact-video-renderer").eq(index).find("a.ytd-compact-video-renderer")
//                 link = parseURL(that.attr("href"))
//                 views = "<div style='color:red'>0</div>"
//                 last = "Never"
//                 if (data.data.hasOwnProperty(link)) {
//                     views = "<div style='color:green'>" + data.data[link].views + "</div>"
//                     last = secondsToString((Date.parse(Date()) - data.data[link].last) / 1000)
//                 }
//                 that.append("<ytTrackContainer><a>" + views + "</a><div class='ytTrackCountdown'>" + last + "</div></ytTrackContainer")
//             });
//         }, 2000)
//     });
// }
//add on click more videos
