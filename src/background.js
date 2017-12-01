/*global browser, chrome*/
if (browser.menus) {
  console.log("BG script load 1", browser);

  browser.menus.create({
    id: "remove-me",
    title: "RMV me!",
    contexts: ["all"]
  }, () => {});
} else {
  console.log("BG script load 2");

  chrome.contextMenus.create({
    title: "Sign out",
    contexts: ["browser_action"],
    onclick: function() {
      localStorage.removeItem("apiToken");
    }
  });
}
