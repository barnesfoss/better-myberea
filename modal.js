class be_Modal {
  constructor({ id, title = "", width = 400, contentHTML = "" }) {
    this.id = id;
    this.title = title;
    this.width = width;
    this.contentHTML = contentHTML;

    this.overlay = document.getElementById(this.id);
    if (!this.overlay) this.createModal();
  }

  createModal() {
    this.overlay = document.createElement("div");
    this.overlay.id = this.id;
    this.overlay.classList.add("be-modal-overlay");

    this.overlay.addEventListener("click", (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    });

    this.modalBox = document.createElement("div");
    this.modalBox.classList.add("be-modal-box");
    this.modalBox.style.width = `${this.width}px`;

    this.closeBtn = document.createElement("span");
    this.closeBtn.classList.add("be-modal-close");
    this.closeBtn.innerHTML = "&times;";
    this.closeBtn.addEventListener("click", () => this.hide());

    this.content = document.createElement("div");
    this.content.classList.add("be-modal-content");
    this.content.innerHTML = this.contentHTML;

    this.modalBox.appendChild(this.closeBtn);
    this.modalBox.appendChild(this.content);
    this.overlay.appendChild(this.modalBox);
    document.body.appendChild(this.overlay);

    this.updateTheme();
  }

  show() {
    this.updateTheme();
    this.overlay.style.display = "flex";

    document.body.style.overflow = "hidden";
  }

  hide() {
    this.overlay.style.display = "none";

    document.body.style.overflow = "";
  }

  setContent(html) {
    this.content.innerHTML = html;
  }

  updateTheme() {
    const theme =
      document.documentElement.getAttribute("data-be-theme") || "light";
    this.overlay.setAttribute("data-be-theme", theme);
  }
}
