chrome.runtime.onInstalled.addListener(function () {
    //write to coneole.log
    chrome.storage.sync.set({ color: '#3aa757' }, function () {
        console.log("The color is green.");
    });
    //tell the browser when to use popup.html.
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'developer.chrome.com' },
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});
document.onload = function () {
    let changeColor = document.getElementById('changeColor');
    changeColor.onclick = function (element) {
        let color = element.target.value;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.executeScript(tabs[0].id, { code: 'document.body.style.backgroundColor = "' + color + '";' });
        });
    };
}
