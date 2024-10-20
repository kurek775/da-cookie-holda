function getLtpaToken2(tab, callback) {
    chrome.cookies.get({ url: tab.url, name: 'LtpaToken2' }, (cookie) => {
        if (cookie) {
            console.log('LtpaToken2 found:', cookie);
            if (typeof callback === 'function') {
                callback(cookie); 
            }
        } else {
            console.error('LtpaToken2 not found in current tab.');
        }
    });
}
function setLtpaToken2ForLocalhost(cookie) {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
            if (tab.url && tab.url.includes('http://localhost:4200')) {
                chrome.cookies.set({
                    url: 'http://localhost:4200',
                    name: cookie.name,
                    value: cookie.value,
                    path: cookie.path || '/',
                    domain: 'localhost',
                    secure: cookie.secure || false,
                    httpOnly: cookie.httpOnly || false,
                    expirationDate: cookie.expirationDate || (Date.now() / 1000 + 3600), // Defaults to 1 hour if not set
                    sameSite: cookie.sameSite || 'Lax',
                }, (setCookie) => {
                    if (chrome.runtime.lastError) {
                        console.error(`Error setting LtpaToken2 for localhost:4200: ${chrome.runtime.lastError}`);
                    } else {
                        console.log(`LtpaToken2 set for localhost:4200:`, setCookie);
                    }
                });
            }
        });
    });
}


chrome.action.onClicked.addListener((currentTab) => {
    getLtpaToken2(currentTab, (ltpaToken2Cookie) => {
        setLtpaToken2ForLocalhost(ltpaToken2Cookie);
    });
});
