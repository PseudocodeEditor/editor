import asyncio

from ps2 import statement
from ps2.scan.scanner import Scanner
from ps2.parser.parser import Parser
from ps2.interpret.interpretor import Interpretor

from js import document
from pyodide.ffi import create_proxy


class PS2:

    hadError = False

    async def input(*args, **kwargs):
        elem = document.createElement("input")
        elem.type = "text"

        document.querySelector(".console").appendChild(elem)
        elem.focus()

        def keydown(e):
            if e.key == "Enter":
                elem.disabled = True

        elem.addEventListener("keydown", create_proxy(keydown))

        while not elem.disabled:
            await asyncio.sleep(0.1)

        return elem.value


    async def print(*args, sep=' ', end='\n', file=None, error=False):
        span = document.createElement("span")
        span.classList.add("output")
        span.innerText = " ".join(list(map(str, args))) + end

        if error:
            span.classList.add("error")

        document.querySelector(".console").appendChild(span)


    async def error(message):
        inpt = document.querySelector(".console input")
        if inpt is not None:
            text = inpt.value
            inpt.remove()
            print(text)

        await PS2.print(message, error=True)

    statement.statement.input = input
    statement.statement.print = print

    async def report(line, where, message):
        if line is None:
            await PS2.error(f"{where} error: {message}")
        else:
            await PS2.error(f"[line {line}] {where} error: {message}")

    # Run Interpretor from a file
    async def runCode(code):
        try:
            tokens     = Scanner(code).scanTokens()
            statements = Parser(tokens).parse()
        except SyntaxError as e:
            await PS2.report(e.msg[0], "Syntax", e.msg[1])

        if not PS2.hadError:
            try:
                await Interpretor(statements).interpret()
            except RuntimeError as e:
                await PS2.report(e.args[0][0], "Runtime", e.args[0][1])
                PS2.hadError = False
        else:
            PS2.hadError = False
