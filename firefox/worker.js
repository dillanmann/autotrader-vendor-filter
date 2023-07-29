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

function loadActiveVendorFilters() {
    return new Promise((resolve, reject) => {
        let storageItem = browser.storage.local.get();
        storageItem.then((res) => {
            let vendorKeys = Object.keys(res);
            let activeSettings = vendorKeys.filter(k => res[k].checked === true).map(v => v.replaceAll('-', ' ').replaceAll('_', '.'));
            resolve(activeSettings);
        });
    });
}

function invokeRemoveAdverts(tabId, activeFilters) {
    browser.tabs
        .sendMessage(tabId, { activeFilters: activeFilters })
        .then()
        .catch(onError);
}

function getActiveTab(){
    return browser.tabs.query({
        active: true,
        currentWindow: true,
    });
}

function onExecuted(activeFilters) {
    let querying = getActiveTab();
    querying.then(tabs => invokeRemoveAdverts(tabs[0].id, activeFilters));
}

function loadContentScript(tabId) {
    let loadScript = browser.scripting.executeScript({
        target: { tabId: tabId },
        files: ['remove_specified_adverts.js']
    });
    return loadScript;
}

browser.webNavigation.onCompleted.addListener(data => {
    let loadActiveFilters = loadActiveVendorFilters();
    loadActiveFilters.then(activeFilters => {
        let loadScript = loadContentScript(data.tabId);
        loadScript.then(() => onExecuted(activeFilters));
    });

}, navigationFilters);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url && changeInfo.url.includes(AUTOTRADER_URL) && changeInfo.url.includes(CAR_SEARCH_PATH)) {
        let loadActiveFilters = loadActiveVendorFilters();
        loadActiveFilters.then(activeFilters => {
            let loadScript = loadContentScript(tabId);
            loadScript.then(() => onExecuted(activeFilters));
        });
    }
});