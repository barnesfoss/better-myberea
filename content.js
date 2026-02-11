function applyTheme(theme) {
  document.documentElement.setAttribute("data-be-theme", theme);

  const modalEl = document.getElementById("better-myberea-modal");
  if (modalEl) modalEl.setAttribute("data-be-theme", theme);
}
chrome.storage.local.get({ beTheme: "dark" }, ({ beTheme }) => {
  applyTheme(beTheme);
});

(() => {
  if (window.top !== window.self) return;

  const SETTINGS_ID = "better-myberea-settings";

  function findProfileMenu() {
    return [...document.querySelectorAll("div")].find(
      (div) =>
        div.querySelector(
          '[data-pendo-feature="experience-appmenu-signout"]',
        ) && div.textContent.includes("@"),
    );
  }

  function findMenuItemInProfile(text) {
    const menu = findProfileMenu();
    if (!menu) return null;
    return [...menu.querySelectorAll("li")].find((li) =>
      li.textContent.includes(text),
    );
  }

  function injectSettings() {
    if (document.getElementById(SETTINGS_ID)) return;

    const accountItem = findMenuItemInProfile("My Account");
    if (!accountItem) return;

    const clone = accountItem.cloneNode(true);
    const button = clone.querySelector('[role="link"]');
    const text = clone.querySelector("span");
    const use = clone.querySelector("use");

    if (!button || !text) return;

    button.id = SETTINGS_ID;
    button.setAttribute("data-pendo-feature", SETTINGS_ID);
    text.textContent = "BetterBerea";

    if (use) {
      use.setAttribute("xlink:href", "#ds-icon-wrench");
    }

    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      be_settingsModal();
    });

    accountItem.after(clone);
  }

  const observer = new MutationObserver(injectSettings);

  const waitForBody = setInterval(() => {
    if (document.body) {
      clearInterval(waitForBody);
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }, 50);
})();
