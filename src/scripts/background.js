chrome.action.onClicked.addListener(function (tab) {

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            const src = chrome.runtime.getURL("src/scripts/index.js")
            const s = document.createElement("script")
            s.type = "module"
            s.src = src;
            (document.head || document.documentElement).appendChild(s)
        },
    })
})
