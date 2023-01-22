export function output(data) {
    const end = data.end;
    const text = data.text;

    const span = document.createElement("span");
    span.classList.add("output");
    span.innerText = text + end;

    document.querySelector(".console").appendChild(span);
}
