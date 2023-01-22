export function removeInput() {
    const console = document.querySelector(".console");
    const input   = console.querySelector("input");

    if (input !== null) {
        const inputText = input.value;

        const span = document.createElement("span");
        span.classList.add("input");
        span.innerText = inputText + "\n";

        input.remove();
        console.appendChild(span);
    }
}

export function error(data) {
    removeInput();

    const end = data.end;
    const text = data.text;

    const error = document.createElement("span");
    error.classList.add("error");
    error.innerText = text + end;

    document.querySelector(".console").appendChild(error);
}
