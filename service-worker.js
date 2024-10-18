let globalCookies = [];

function getCookiesFromTab(tab) {
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        console.log(`Cookies from tab ${tab.id}:`, cookies);
        globalCookies = globalCookies.concat(cookies);
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (cookies) => {
                if (cookies.length) {
                    cookies.forEach((cookie) => {
                        document.cookie = `${cookie.name}=${cookie.value}; path=/; domain=${cookie.domain}; SameSite=None; Secure;`;
                    });
                }
            },
            args: [cookies] 
        });
    });
}

chrome.action.onClicked.addListener((currentTab) => {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (!tab.active) {
                getCookiesFromTab(tab);
            }
        });
    });
});
