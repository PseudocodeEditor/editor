import {toggleShow} from "./show.js";

export function makeConfirm(content, symbol, danger=false) {
  const overlay = document.querySelector(".alert-overlay");
  toggleShow(overlay);

  const alertInner = document.createElement("div");
  alertInner.classList.add("alert-inner");

  const alert = document.createElement("div");
  alert.classList.add("alert");
  if (danger) alert.classList.add("danger");

  let icon;
  if (danger) {
    icon = document.createElement("div");
    icon.classList.add("alert-icon-clear");
  } else {
    icon = document.createElement("p");
    icon.classList.add("alert-icon");
    icon.innerText = symbol;
  }

  const title = document.createElement("h2");
  title.classList.add("alert-title");
  title.innerText = "Are you sure?";

  const description = document.createElement("p");
  description.classList.add("alert-description");
  description.innerText = content;

  const sure = document.createElement("button");
  sure.classList.add("continue-button");
  sure.innerText = "I'm Sure";

  const cancel = document.createElement("h4");
  cancel.classList.add("alert-cancel");
  cancel.innerText = "Cancel";

  alert.appendChild(icon);
  alert.appendChild(title);
  alert.appendChild(description);
  alert.appendChild(sure);
  alert.appendChild(cancel);

  alertInner.appendChild(alert);
  overlay.appendChild(alertInner);

  return new Promise((resolve, reject) => {
    sure.addEventListener("click", () => {
      alertInner.remove();
      toggleShow(overlay);
      resolve(true);
    })

    cancel.addEventListener("click", () => {
      alertInner.remove();
      toggleShow(overlay);
      resolve(false);
    });
  });
}