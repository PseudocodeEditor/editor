import {error} from "./error.js";
import {input} from "./input.js";
import {output} from "./output.js";
import {queued} from "./queued.js";
import {success} from "./success.js";
import {running} from "./running.js";
import {queueUpdate} from "./queueUpdate.js";

const typeMap = {
    PING:    () => {},
    ERROR:   error,
    INPUT:   input,
    OUTPUT:  output,
    QUEUED:  queued,
    SUCCESS: success,
    RUNNING: running,
    QUEUE_UPDATE: queueUpdate
}

function connect() {
    window.ws = new WebSocket("wss://eval.pseudonaja.repl.co");
    const button = document.querySelector("#run-button");

    ws.onclose = () => {
        button.classList.add("disabled");

        if (!document.querySelector(".console > :last-child").classList.contains("prompt")) {
            error({text: "Lost connection to server", end: "\n"});
            success({files: files});
        }

        setTimeout(connect, 1000)
    };

    ws.onopen = () => {
        if (button.classList.contains("disabled")) {
            button.classList.remove("disabled");
        }
    };

    ws.onmessage = msg => {
        const data = JSON.parse(msg.data);
        typeMap[data.type](data)
    };
}

connect();
