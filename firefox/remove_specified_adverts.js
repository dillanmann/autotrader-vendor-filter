const ADVERT_SELECTOR = ".search-results-container article ul li section[id]";

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function RemoveSpecifiedVendorAdverts(vendorNames) {
    const adverts = document.querySelectorAll(ADVERT_SELECTOR);
    const advertsToRemove = Array.prototype.filter.call(adverts, elem => vendorNames.some(vendor => elem.innerText.includes(vendor)));
    Array.prototype.forEach.call(advertsToRemove, elem => elem.closest('section[id]').style.display = 'none');
}

browser.runtime.onMessage.addListener((request) => {
    waitForElm(ADVERT_SELECTOR).then(() => {
        RemoveSpecifiedVendorAdverts(request.activeFilters);
    })
});