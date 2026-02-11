class be_SettingsModal extends be_Modal {
  constructor() {
    super({
      id: "better-myberea-modal",
      title: "Better MyBerea Settings",
      contentHTML: "",
    });

    const createField = (labelText, input) => {
      const wrapper = document.createElement("div");
      wrapper.style.marginBottom = "12px";
      const label = document.createElement("label");
      label.textContent = labelText;
      label.style.display = "block";
      label.style.marginBottom = "4px";
      wrapper.appendChild(label);
      wrapper.appendChild(input);
      return wrapper;
    };

    // Theme selector
    this.themeSelect = document.createElement("select");
    this.themeSelect.id = "better-myberea-theme";
    ["dark", "light"].forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t[0].toUpperCase() + t.slice(1);
      this.themeSelect.appendChild(opt);
    });
    this.content.append(createField("Theme", this.themeSelect));

    // Load saved theme
    chrome.storage.local.get({ beTheme: "dark" }, ({ beTheme }) => {
      this.themeSelect.value = beTheme;
      applyTheme(beTheme);
    });

    this.themeSelect.addEventListener("change", () => {
      const theme = this.themeSelect.value;
      applyTheme(theme);
      chrome.storage.local.set({ beTheme: theme });
    });

    window.be_patches.forEach((p) => {
      const row = document.createElement("div");
      row.className = "patch-row";
      const labelContainer = document.createElement("div");
      labelContainer.className = "patch-label-container";
      const nameDiv = document.createElement("div");
      nameDiv.className = "patch-name";
      nameDiv.textContent = p.name;
      const descDiv = document.createElement("div");
      descDiv.className = "patch-desc";
      descDiv.textContent = p.description;
      labelContainer.appendChild(nameDiv);
      labelContainer.appendChild(descDiv);
      const authorDiv = document.createElement("div");
      authorDiv.className = "patch-desc";
      authorDiv.textContent = `Author(s): ${p.author}`;
      labelContainer.appendChild(authorDiv);
      const switchLabel = document.createElement("label");
      switchLabel.className = "switch";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      const slider = document.createElement("span");
      slider.className = "slider";
      switchLabel.appendChild(checkbox);
      switchLabel.appendChild(slider);
      row.appendChild(labelContainer);
      row.appendChild(switchLabel);
      this.content.appendChild(row);
      chrome.storage.local.get({ [p.key]: false }, (result) => {
        const enabled = result[p.key];
        checkbox.checked = enabled;
      });
      checkbox.addEventListener("change", () => {
        const enabled = checkbox.checked;

        if (enabled) {
          p.reference?.init?.();
        } else {
          p.reference?.cleanup?.();
        }

        chrome.storage.local.set({ [p.key]: enabled });
      });
    });
  }
}

let settingsModalInstance = null;
function be_settingsModal() {
  if (!settingsModalInstance) settingsModalInstance = new be_SettingsModal();

  const drawerToggle = document.querySelector(
    '[aria-controls="profile_drawer"]',
  );
  if (drawerToggle) {
    drawerToggle.click();
    setTimeout(() => settingsModalInstance.show(), 100);
  } else {
    settingsModalInstance.show();
  }
}
