window.betterAppImages = {
  observer: null,
  appliedImages: new Map(),
  init() {
    console.log("[+] Better App Images");
    function domainStrip(url) {
      try {
        return new URL(url).hostname;
      } catch {
        return url;
      }
    }
    const applyPatch = () => {
      const root = [...document.querySelectorAll("span.MuiTypography-root")]
        .find((el) => el.textContent.trim() === "Logins")
        ?.closest(".MuiCard-root")
        ?.querySelector(":scope > div:nth-of-type(2) .MuiGrid-root");
      if (!root) return;

      root.querySelectorAll("img").forEach((img) => {
        let href = img.parentElement?.href;
        if (!href) return;
        if (!this.appliedImages.has(img)) {
          this.appliedImages.set(img, img.src);
        }
        if (href === "https://moodle.berea.edu/login/index.php") {
          href = "https://moodle.org";
        } else if (
          href ===
          "https://berea.campuslabs.com/engage/account/login?returnUrl=/engage/"
        ) {
          href = "https://campuslabs.com/engage/";
        }
        if (href === "https://outlook.office.com/") {
          img.src =
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Microsoft_Outlook_Icon_%282025%E2%80%93present%29.svg/512px-Microsoft_Outlook_Icon_%282025%E2%80%93present%29.svg.png?20251003204701";
        } else {
          img.src = `https://www.google.com/s2/favicons?domain=${domainStrip(
            href,
          )}&sz=64`;
        }
        img.width = 64;
        img.height = 64;
      });
    };
    applyPatch();
    this.observer = new MutationObserver(() => {
      applyPatch();
    });
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  },
  cleanup() {
    console.log("[-] Better App Images");
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.appliedImages.forEach((data, img) => {
      if (img) {
        img.src = data;
        img.removeAttribute("width");
        img.removeAttribute("height");
      }
    });
    this.appliedImages = new Map();
  },
};
