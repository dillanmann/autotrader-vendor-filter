const VENDORS_TO_HIDE = [
    "Cazoo",
    "CarSupermarket.com",
    "The German Car Group",
    "Henley Cars Ltd",
    "Driven of York",
    "Sherwoods Town Centre Citroen and Suzuki",
    "Vanstar Wakefield",
    "Pine Lodge Cars",
    "AMT Auto Leeds",
    "Parkland Motors",
    "Philip Paul Ltd",
    "JDS Autos",
    "EPS Cars Limited",
    "SR Motor Company Limited",
    "Georgesons Car Sales",
    "German Autocentre",
    "Bridge End Motors Ltd"];

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

function RemoveSpecifiedVendorAdverts() {
    const adverts = document.querySelectorAll(ADVERT_SELECTOR);
    console.log(`found ${adverts.length} total adverts`);

    const advertsToRemove = Array.prototype.filter.call(adverts, elem => VENDORS_TO_HIDE.some(vendor => elem.innerText.includes(vendor)));
    console.log(`found ${advertsToRemove.length} adverts to remove`);

    const advertTexts = Array.prototype.map.call(advertsToRemove, elem => elem.querySelector('div > div > div > div > p > span').innerText);
    console.log("Removing listings with text:");
    console.log(advertTexts);

    Array.prototype.forEach.call(advertsToRemove, elem => elem.closest('section[id]').remove());
}

browser.runtime.onMessage.addListener(() => {
    waitForElm(ADVERT_SELECTOR).then(() => {
        console.log('Element is ready');
        RemoveSpecifiedVendorAdverts();
    })
});