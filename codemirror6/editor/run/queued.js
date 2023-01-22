export function queued(data) {
    window.key = data.key;
    const position = data.position;

    if (position === 0) return;

    const elem = document.createElement("p");
    elem.id = "queue";

    const pos = document.createElement("span");
    pos.id = "queue-pos";
    pos.innerText = position;

    elem.innerText = "Current queue position: ";
    elem.appendChild(pos);

    document.querySelector(".console").appendChild(elem);
}
