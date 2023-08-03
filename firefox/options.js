const ALL_VENDORS = [
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
    "Bridge End Motors Ltd",
    "bravoauto Halifax",
    "Sherwoods Peugeot Gateshead",
    "Redrose Cars"];


const HIDE_ALL_WITHOUT_DISTANCE_CLASS = 'setting-hide-all-without-distance';
const HIDE_ALL_WITHOUT_DISTANCE_SELECTOR = `#${HIDE_ALL_WITHOUT_DISTANCE_CLASS}`
const HIDE_ALL_STORAGE_KEY = 'hide-all-without-distance';

function buildLabelElement(labelText) {
    let labelElem = document.createElement('label');
    labelElem.innerText = labelText;
    return labelElem;
}

function buildCheckboxElement(elementId) {
    let checkboxElem = document.createElement('input');
    checkboxElem.type = 'checkbox';
    checkboxElem.id = elementId;
    checkboxElem.classList.add('setting');
    return checkboxElem;
}

function stripVendorName(vendorName) { return vendorName.replaceAll(' ', '-').replaceAll('.', '_'); }

function restoreOptionIntoCheckboxElement(elementSelector, storageKey){
    let storageItem = browser.storage.local.get(storageKey);
    storageItem.then((res) => {
        let elem = document.querySelector(elementSelector);
        if (!elem) return;
        elem.checked = !res || !res[storageKey] ? false : res[storageKey].checked || false;
    });
}

function saveOptionFromCheckboxElement(elementSelector, storageKey){
    var elem = document.querySelector(elementSelector);
    if (!elem) return;
    browser.storage.local.set({
        [storageKey]: { checked: elem.checked }
    });
}

function restoreOptions() {

    let formElem = document.querySelector('#settings-form');

    // Ensure elements exist in options form
    if (formElem && formElem.querySelectorAll('.setting').length == 0) {
        let filterAllWithoutDistanceDivElem = document.createElement('div');
        filterAllWithoutDistanceDivElem.appendChild(buildLabelElement('Hide any advert without distance shown'));
        filterAllWithoutDistanceDivElem.appendChild(buildCheckboxElement(HIDE_ALL_WITHOUT_DISTANCE_CLASS));
        formElem.appendChild(filterAllWithoutDistanceDivElem);
        ALL_VENDORS.forEach(vendorName => {
            let divElem = document.createElement('div');
            divElem.appendChild(buildLabelElement(vendorName));
            divElem.appendChild(buildCheckboxElement(`setting-${stripVendorName(vendorName)}`));
            formElem.appendChild(divElem);
        });
    }

    restoreOptionIntoCheckboxElement(HIDE_ALL_WITHOUT_DISTANCE_SELECTOR, HIDE_ALL_STORAGE_KEY);

    ALL_VENDORS.forEach(vendorName => {
        let storageKey = stripVendorName(vendorName);
        restoreOptionIntoCheckboxElement(`#setting-${storageKey}`, storageKey);
    });
}

function saveOptions(e) {
    saveOptionFromCheckboxElement(HIDE_ALL_WITHOUT_DISTANCE_SELECTOR, HIDE_ALL_STORAGE_KEY);
    ALL_VENDORS.forEach(vendorName => {
        let storageKey = stripVendorName(vendorName);
        saveOptionFromCheckboxElement(`#setting-${storageKey}`, storageKey);
    });
    e.preventDefault();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);