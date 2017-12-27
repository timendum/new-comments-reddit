let estorage = browser.storage.local;

function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        prefDays: document.querySelector("#days").value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#days").value = result.prefDays || "3";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    var getting = estorage.get("prefDays");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
