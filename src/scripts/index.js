import "../vendor/debug.module.js ";
import { h, render, createContext } from '../vendor/preact.module.js';

import { AppComponent } from '../components/app.js'
import { ReplayController, ChartsController, TraderController } from "../controllers/index.js"


import { signal, computed, effect, batch } from "../vendor/signals.module.js"


function createAppState() {

    const data = signal([])

    const last_bar = signal([])

    const trades = signal([])

    const executions = signal([])

    const positions = signal([])

    const current_ts = signal(0)

    const current_dt = computed(() => {
        let dt_str = "--"
        if (current_ts.value) {
            const dt = new Date(current_ts.value * 1000)
            dt_str = dt.toISOString().replace("T", " ").slice(0, 19)
        }
        return dt_str
    })

    return { current_ts, current_dt, data, trades, executions, last_bar, positions }
}



class AppController {

    constructor () {
        this.tv = window["TradingViewApi"]

        this.app_state = createAppState()

        // для отладочных целей
        window["tv"] = this.tv
        window["app_state"] = this.app_state

        this.replay = new ReplayController(this.tv, this.app_state)
        this.charts = new ChartsController(this.tv, this.app_state)
        this.trader = new TraderController(this.app_state)
    }

}


if (window["TradingViewApi"] !== undefined) {
    const app = new AppController()

    render(h(AppComponent, { app }), document.body);

    // Создать место для виджета
    const divs = document.getElementsByClassName("js-rootresizer__contents")
    for (const root_div of divs) {
        root_div["style"]["width"] = "auto"
        root_div["style"]["margin-right"] = "385px"
    }
    window.dispatchEvent(new Event("resize"))
} else {
    alert("It works only with TradingView.")
}
