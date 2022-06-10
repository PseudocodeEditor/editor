export function toggleShow(elem) {
  if (elem.classList.contains("show")) {
    elem.classList.add("hide");
    setTimeout(() => { elem.classList.remove("show") }, elem.classList.contains("context-menu") ? 0 : 300);
  } else {
    elem.classList.remove("hide");
    elem.classList.add("show");
  }
}
