const console = document.querySelector(".console");

export function input(_) {
    const elem = document.createElement("input");
    elem.type = "text";

    console.appendChild(elem);
    elem.focus();

    elem.addEventListener("keyup", e => {
        if (e.key !== "Enter") return;

        const text = elem.value;

        const span = document.createElement("span");
        span.classList.add("input");
        span.innerText = text + "\n";

        elem.remove();
        console.appendChild(span);

        window.ws.send(JSON.stringify({
            key:   window.key,
            text:  text,
            type: "INPUT"
        }));
    });
}

console.addEventListener("click", () => {
    const input = document.querySelector(".console input");
    if (input === null) return;

    input.focus();
});
