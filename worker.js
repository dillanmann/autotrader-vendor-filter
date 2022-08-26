const VENDORS_TO_HIDE = ["Cazoo", "CarSupermarket.com", "The German Car Group", "Henley Cars Ltd"];
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

function RemoveSpecifiedVendorAdverts() {
    chrome.storage.sync.get("vendorsToHide", ({ vendorsToHide }) => {
        vendorsToHide = vendorsToHide;
        console.log(vendorsToHide);

        const adverts = document.querySelectorAll(".search-page__result article > div > div > div.product-card-seller-info > div.product-card-seller-info__details > div > h3");
        console.log(`found ${adverts.length} total adverts`);
        
        const advertsToRemove = Array.prototype.filter.call(adverts, elem => vendorsToHide.some(vendor => elem.innerText.includes(vendor)));
        console.log(`found ${advertsToRemove.length} adverts to remove`);

        Array.prototype.forEach.call(advertsToRemove, elem => elem.closest('.search-page__result').remove());
    });
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ vendorsToHide: VENDORS_TO_HIDE });
});

chrome.webNavigation.onCompleted.addListener(data => {
    chrome.scripting.executeScript({
        target: { tabId: data.tabId },
        function: RemoveSpecifiedVendorAdverts
    });

}, navigationFilters);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    // check for a URL in the changeInfo parameter (url is only added when it is changed)
    if (changeInfo.url && changeInfo.url.includes(AUTOTRADER_URL) && changeInfo.url.includes(CAR_SEARCH_PATH)) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: RemoveSpecifiedVendorAdverts
        });
    }
});
