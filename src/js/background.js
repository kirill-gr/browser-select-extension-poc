let port = null;
let tabsToClose = new Set();
const hostName = "com.grushetski.browser_select_extension_poc";

console.log("Connecting to native messaging host: " + hostName);

port = chrome.runtime.connectNative(hostName);

port.onDisconnect.addListener(() => {
    console.log("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
});

function checkUrl(details) {
    tabsToClose.add(details.tabId);
    port.postMessage({"url": details.url});

    port.onMessage.addListener(response => {
        if (response.handled === true) {
            if (tabsToClose.has(details.tabId)) {
                // console.log(details.tabId);
                chrome.tabs.remove(details.tabId);
                tabsToClose.delete(details.tabId)
            }
        }
    });
}

chrome.webNavigation.onBeforeNavigate.addListener(checkUrl);