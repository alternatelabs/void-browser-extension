/*global chrome*/
chrome.contextMenus.create({
  title: "Sign out",
  contexts: ["browser_action"],
  onclick: function() {
    localStorage.removeItem("apiToken");
  }
});
