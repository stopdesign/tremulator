import htm from '../vendor/htm.module.js'
import { h, Component } from '../vendor/preact.module.js'
import { TradeComponent } from "./trade.js"
import { ReplayComponent } from "./replay.js"
import { TradeListComponent } from "./trade_list.js"
import { StatsComponent } from "./stats.js"

import { Order, Trade } from "./models.js"

const html = htm.bind(h)


class AppComponent extends Component {

    constructor({ app }) {
        super()

        this.app = app
        this.tv = app.tv

        this.app_state = app.app_state

        setTimeout(() => {
            this.tv.chart().getTimeScale()._timeScale._options.rightBarStaysOnScroll = false
        }, 1000)

        const publish_btn = document.getElementById("header-toolbar-publish-desktop")
        if (publish_btn) {
            publish_btn.style.display = 'none'
        }
        // $("#header-toolbar-replay").hide()

        // tv.showNoticeDialog("asdf")
        // tv.mainSeriesPriceFormatter().format(10.21)

        // effect(() => console.log("EFFECT current_ts", this.app_state.current_ts.value))
        // this.app_state.trades.subscribe((v) => console.log("trades:", v))
    }

    onReplay = () => this.app.replay.onReplay()

    onNextStep = () => this.app.replay.onNextStep()

    onPointSelectMode = () => this.app.replay.onPointSelectMode()

    onTest = () => {
        console.log("TEST")
        this.app.replay.onNextBigStep()
    }

    onSaveOrder = (data) => {
        /*
            TODO перенести в trader?
            Создание нового ордера или группы ордеров.
        */

        const order = new Order({
            type: "limit",
            side: data.side,
            price: data.price,
            quantity: data.quantity,
            role: "entry",
        })
        const trade = new Trade({ symbol: "URA", entryOrder: order })
        if (data.side == "buy") {
            if (data.tp) {
                const order_tp = new Order({
                    type: "limit",
                    side: "sell", 
                    price: data.price * 1.02, 
                    quantity: data.quantity,
                    role: "tp",
                })
                trade.orders.push(order_tp)
            }
            if (data.sl) {
                const order_sl = new Order({
                    type: "stop",
                    side: "sell",
                    price: data.price * 0.99,
                    quantity: data.quantity,
                    role: "sl",
                })
                trade.orders.push(order_sl)
            }
        } else {
            if (data.tp) {
                const order_tp = new Order({
                    type: "limit",
                    side: "buy",
                    price: data.price * 0.98,
                    quantity: data.quantity,
                    role: "tp",
                })
                trade.orders.push(order_tp)
            }
            if (data.sl) {
                const order_sl = new Order({ 
                    type: "stop",
                    side: "buy",
                    price: data.price * 1.01,
                    quantity: data.quantity,
                    role: "sl",
                })
                trade.orders.push(order_sl)
            }
        }
        this.app_state.trades.value = [...this.app_state.trades.value, trade]
    }

    onClosePosition = () => {
        console.log("CLOSE position")

        this.app.trader.closePositionMkt()
    }

    render() {

        return html`

        <style>
            #trrrading {
                width: 380px;
                height: 100%;
                background: #fff;
                position: absolute;
                right: 0;
                top: 0;
                padding: 0;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }

            #trrrading_logo {
                position: absolute;
                right: 16px;
                top: 15px;
                width: 30px;
                height: 30px;
                background-image: url('data:image/png;base64,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');
                background-size: contain;
                opacity: 0.3;
            }
            
            #trrrading button {
                padding: 5px 10px;
                margin: 5px;
                border-radius: 5px;
                border: 1px solid #aaa;
                cursor: pointer;
                box-sizing: border-box;
                height: 34px;
            }
            #trrrading button:hover {
                background-color: #e5e5e5;
            }
            
            #trrrading .box {
                padding: 15px 15px;
                border-bottom: 1px solid #e0e3eb;
            }
            #trrrading .box:last-child {
                border: none;
            }
        </style>

        <div id='trrrading'>

            <div id="trrrading_logo"></div>
        
            <div class="box">
                <${ReplayComponent}
                    app_state=${this.app_state}
                    onReplay=${this.onReplay}
                    onNextStep=${this.onNextStep}
                    onPointSelectMode=${this.onPointSelectMode}
                    onTest=${this.onTest}
                />
            </div>

            <div class="box">
                <${StatsComponent} app_state=${this.app_state} />
            </div>

            <div class="box">
                <${TradeComponent}
                    app_state=${this.app_state}
                    onSave=${this.onSaveOrder}
                    onClose=${this.onClosePosition}
                />
            </div>
            
            <div class="box" style="overflow: hidden">
                <${TradeListComponent} app_state=${this.app_state} />
            </div>

        </div>
        `
    }

}

export { AppComponent }
