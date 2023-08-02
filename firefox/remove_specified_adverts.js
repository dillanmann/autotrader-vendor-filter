const ADVERT_SELECTOR = ".search-results-container article ul li section[id]";
const PAGE_NAVIGATION_SELECTOR = ".search-results-container > article > div:nth-child(2) > div:nth-child(1)";
const REMOVED_ADVERTS_ELEMENT_ID = "removed-adverts-count";

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

function FormatRemovedAdvertsCountText(count){ return `Removed ${count} remote adverts`; }

function CreateRemovedAdvertsElement(count){
    let divElem = document.createElement("div");
    let pElem = document.createElement("p");
    pElem.textContent = FormatRemovedAdvertsCountText(count);
    pElem.id = REMOVED_ADVERTS_ELEMENT_ID;
    divElem.appendChild(pElem);
    let pageNavigationElem = document.querySelector(PAGE_NAVIGATION_SELECTOR);
    pageNavigationElem.after(divElem);
}

function SetRemovedAdvertsElementContent(count){
    let elem = document.querySelector(`#${REMOVED_ADVERTS_ELEMENT_ID}`);
    if (!elem){
        CreateRemovedAdvertsElement(count);
    }
    else {
        elem.textContent = FormatRemovedAdvertsCountText(count);
    }
}

function RemoveSpecifiedVendorAdverts(vendorNames) {
    const adverts = document.querySelectorAll(ADVERT_SELECTOR);
    const advertsToRemove = Array.prototype.filter.call(adverts, elem => vendorNames.some(vendor => elem.innerText.includes(vendor)));
    SetRemovedAdvertsElementContent(advertsToRemove.length);
    Array.prototype.forEach.call(advertsToRemove, elem => elem.closest('section[id]').style.display = 'none');
}

browser.runtime.onMessage.addListener((request) => {
    waitForElm(ADVERT_SELECTOR).then(() => {
        RemoveSpecifiedVendorAdverts(request.activeFilters);
    })
});