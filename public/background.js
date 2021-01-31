/*global chrome*/
chrome.contextMenus.create({
  title: "Sign out",
  contexts: ["browser_action"],
  onclick: function () {
    browser.storage.local.clear();
  },
});

/* On tab change update the icons */
chrome.tabs.onActivated.addListener(function (tabInfo) {
  chrome.tabs.get(tabInfo.tabId, function (activeTab) {
    const parser = document.createElement("a");
    if (typeof activeTab.url === "string") {
      parser.href = activeTab.url;
      console.log("Active Tab", parser.hostname);

      browser.storage.local.get("apiToken").then((token) => {
        const url = encodeURIComponent(activeTab.url);

        fetch(`https://api.voidapp.co/api/v1/bookmarks/exists?url=${url}`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
          },
        })
          .then((resp) => {
            if (resp.status === 204) {
              chrome.browserAction.setIcon({
                path: "icons/icon-38.png",
              });
            } else {
              chrome.browserAction.setIcon({
                path: "icons/icon-38-dull.png",
              });
            }
          })
          .catch((err) => console.error("Error checking URL", err));
      });
    } else {
      console.error("Current tab doesn't have a URL", activeTab);
    }
  });
});
