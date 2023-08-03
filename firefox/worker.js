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

function loadVendorFilterSettings() {
    return new Promise((resolve, reject) => {
        let storageItem = browser.storage.local.get();
        storageItem.then((res) => {
            let storageKeys = Object.keys(res);
            let vendorNamesToHide = storageKeys.filter(k => res[k].checked === true).map(v => v.replaceAll('-', ' ').replaceAll('_', '.'));
            let hideAll = res['hide-all-without-distance'].checked;
            let settings = { 'vendorsToHide': vendorNamesToHide, 'hideAll': hideAll };
            resolve(settings);
        });
    });
}

function invokeRemoveAdverts(tabId, settings) {
    browser.tabs
        .sendMessage(tabId, settings)
        .then()
        .catch(onError);
}

function getActiveTab(){
    return browser.tabs.query({
        active: true,
        currentWindow: true,
    });
}

function onExecuted(settings) {
    let querying = getActiveTab();
    querying.then(tabs => invokeRemoveAdverts(tabs[0].id, settings));
}

function loadContentScript(tabId) {
    let loadScript = browser.scripting.executeScript({
        target: { tabId: tabId },
        files: ['remove_specified_adverts.js']
    });
    return loadScript;
}

browser.webNavigation.onCompleted.addListener(data => {
    let loadFilterSettings = loadVendorFilterSettings();
    loadFilterSettings.then(settings => {
        let loadScript = loadContentScript(data.tabId);
        loadScript.then(() => onExecuted(settings));
    });

}, navigationFilters);

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url && changeInfo.url.includes(AUTOTRADER_URL) && changeInfo.url.includes(CAR_SEARCH_PATH)) {
        let loadActiveFilters = loadVendorFilterSettings();
        loadActiveFilters.then(activeFilters => {
            let loadScript = loadContentScript(tabId);
            loadScript.then(() => onExecuted(activeFilters));
        });
    }
});