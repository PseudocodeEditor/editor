const projTitle = document.querySelector("#project-title-input")
document.querySelector("#project-title").innerText = projTitle.value;

projTitle.addEventListener("change", () => {
  document.querySelector("#project-title").innerText = projTitle.value;
});
