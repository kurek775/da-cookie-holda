document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('removeToken').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                let url = new URL(currentTab.url);
                chrome.cookies.remove({
                    url: url.origin,
                    name: 'LtpaToken2'
                }, function(removed) {
                    if (chrome.runtime.lastError) {
                        document.getElementById('status').textContent = 'Chyba: ' + chrome.runtime.lastError.message;
                    } else if (removed) {
                        document.getElementById('status').textContent = 'LTPA Token byl úspěšně odstraněn.';
                        chrome.tabs.reload(currentTab.id, function() {
                            alert('LTPA Token byl úspěšně odstraněn a stránka byla obnovena.');
                        });
                    } else {
                        document.getElementById('status').textContent = 'LTPA Token nebyl nalezen nebo nemohl být odstraněn.';
                    }
                });
            } else {
                document.getElementById('status').textContent = 'Nelze získat informace o aktuální záložce.';
            }
        });
    });
});
