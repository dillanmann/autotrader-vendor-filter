const AUTOTRADER_URL = "autotrader.co.uk"
const CAR_SEARCH_PATH = "car-search";
const navigationFilters = {
    url:
        [
            {
                hostContains: AUTOTRADER_URL,
                pathContains: CAR_SEARCH_PATH
            }
        ]
};

onError = (error) => console.error(`Error: ${error}`);

function invokeRemoveAdverts(tabId) {
    browser.tabs
        .sendMessage(tabId, {})
        .then()
        .catch(onError);
}

function onExecuted(result) {
    let querying = browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    querying.then(tabs => invokeRemoveAdverts(tabs[0].id));
}

function loadContentScript(tabId) {
    let loadScript = browser.scripting.executeScript({
        target: { tabId: tabId },
        files: ['remove_specified_adverts.js']
    });
    return loadScript;
}

browser.webNavigation.onCompleted.addListener(data => {
    let loadScript = loadContentScript(data.tabId);
    loadScript.then(onExecuted);

}, navigationFilters);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url && changeInfo.url.includes(AUTOTRADER_URL) && changeInfo.url.includes(CAR_SEARCH_PATH)) {
        let loadScript = loadContentScript(tabId);
        loadScript.then(onExecuted);
    }
});