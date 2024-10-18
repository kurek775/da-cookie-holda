let globalCookies = [];

// Funkce na získání cookies z konkrétního tabu
function getCookiesFromTab(tab) {
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
        console.log(`Cookies from tab ${tab.id}:`, cookies);
        globalCookies = globalCookies.concat(cookies); // Uložíme cookies do globální proměnné

        // Nastavíme cookies přímo v záložce
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: (cookies) => {
                if (cookies.length) {
                    cookies.forEach((cookie) => {
                        // Nastavíme každý cookie v dokumentu dané stránky
                        document.cookie = `${cookie.name}=${cookie.value}; path=/; domain=${cookie.domain}; SameSite=None; Secure;`;
                    });
                }
            },
            args: [cookies] // Předáme cookies jako argument
        });
    });
}

// Listener na kliknutí na ikonu rozšíření
chrome.action.onClicked.addListener((currentTab) => {
    // Získáme všechny otevřené záložky
    chrome.tabs.query({}, (tabs) => {
        // Projdeme všechny záložky, které nejsou aktivní
        tabs.forEach((tab) => {
            if (!tab.active) {
                getCookiesFromTab(tab);
            }
        });
    });
});
