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

function restoreOptions() {

    let formElem = document.querySelector('#settings-form');

    // Ensure elements exist in options form
    if (formElem && formElem.querySelectorAll('.setting').length == 0) {
        ALL_VENDORS.forEach(vendorName => {
            let divElem = document.createElement('div');
            divElem.appendChild(buildLabelElement(vendorName));
            divElem.appendChild(buildCheckboxElement(`setting-${stripVendorName(vendorName)}`));
            formElem.appendChild(divElem);
        });
    }

    ALL_VENDORS.forEach(vendorName => {
        let storageKey = stripVendorName(vendorName);
        let storageItem = browser.storage.local.get(storageKey);
        storageItem.then((res) => {
            var elem = document.querySelector(`#setting-${storageKey}`);
            if (!elem) return;
            elem.checked = !res || !res[storageKey] ? false : res[storageKey].checked || false;
        });
    });
}

function saveOptions(e) {
    ALL_VENDORS.forEach(vendorName => {
        let storageKey = stripVendorName(vendorName);
        var elem = document.querySelector(`#setting-${storageKey}`);
        if (!elem) return;
        browser.storage.local.set({
            [storageKey]: { checked: elem.checked }
        });
        e.preventDefault();
    });
    e.preventDefault();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);