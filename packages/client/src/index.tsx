import React from "react"
import ReactDOM from "react-dom"
import VConsole from "vconsole"

import { App } from "./App"

import "./index.css"

const vConsole = new VConsole()
ReactDOM.render(<App />, document.querySelector("#root"))
