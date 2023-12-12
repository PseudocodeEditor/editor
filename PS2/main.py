import asyncio

import js
from js import editor
from js import document
from js import setTimeout

from pyscript import when

from pyodide.ffi import to_js
from pyodide.ffi import create_proxy

from ps2.app import PS2 as PS2


async def run_code():
    name = document.querySelector(".active .file-name")
    button = document.querySelector("#run-button")
    if not (button.classList.contains("disabled") or button.innerText == "􀛷" or name is None):
        prepare()

        files = js.files.to_py()
        files[name.innerText] = editor.state.doc.toString()
        js.files = js.Object.fromEntries(to_js(files))

        process = asyncio.create_task(PS2.runCode(files[name.innerText]))

        document.querySelector("#run-button").addEventListener("click", create_proxy(process.cancel))

        while not (process.done() or process.cancelled()):
            await asyncio.sleep(0.1)

        tidy_up()


def prepare():
    file_name = document.querySelector(".active .file-name").innerText
    document.querySelectorAll(".console .prompt")[-1].innerText += " ps2 " + file_name
    document.querySelector("#run-button").innerText = "􀛷"


def tidy_up():
    for inpt in document.querySelectorAll(".console input"):
        inpt.disabled = True

    prompt = document.createElement("p")
    prompt.classList.add("prompt")
    prompt.innerText = "$"
    document.querySelector(".console").appendChild(prompt)
    prompt.scrollIntoView()

    document.querySelector("#run-button").innerText = "􀊄"


@when("click", "#run-button")
def run():
    setTimeout(create_proxy(run_code), 0)

document.querySelector("#run-button").classList.remove("disabled")
