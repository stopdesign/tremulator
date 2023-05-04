import { Order } from "../components/models.js"


export default class TraderController {

    constructor (app_state) {

        this.app_state = app_state

        // Подписка на новые торговые данные
        app_state.data.subscribe((value) => this.onNewData(value))

    }

    closePositionMkt () {
        /*
            Закрытие текущей позиции прямо сейчас по last close.
         */

        const new_bars = this.app_state.data.value
        const last_bar_close = new_bars.slice(-1)[0][4]

        const trades = this.app_state.trades.value
        const active_trade = trades.slice(-1)[0]

        const executions = []
        
        // создать и сразу же исполнить MKT ордер закрытия позиции

        let filled_quantity = 0
        for (const order of active_trade.orders) {
            if (order.role !== "entry" && order.filled) {
                filled_quantity += order.quantity 
            }
        }

        let q_left = (active_trade.entryOrder.quantity - filled_quantity)

        if (q_left > 0) {
            const side = active_trade.entryOrder.side == "buy" ? "sell" : "buy"

            const order = new Order({
                type: "market",
                side: side, 
                price: last_bar_close,
                quantity: q_left,
                role: "close",
            })
            order.filled = true
            order.fill_price = order.price

            // отменить остальные ордеры, которые еще не исполнены
            for (const o of active_trade.orders) {
                if (!o.filled) {
                    o.canceled = true
                }
            }
            
            active_trade.orders.push(order)

            executions.push(side)
        }

        this.updateStats(executions) 
    }

    onNewData (bars) {
        // console.warn("NEW DATA in Trader", bars.length)

        // TODO: выбрать новые
        const new_bars = bars.slice(-1)

        const trades = this.app_state.trades.value
    
        if (!trades.length) return

        // в старых trades не может быть открытых ордеров,
        // поэтому смотрю только последний    
        const active_trade = trades.slice(-1)[0]

        if (active_trade.entryOrder.canceled) {
            return
        }

        const executions = []
    
        for (const bar of new_bars) {
            for (const order of active_trade.orders) {
                
                if (order.filled || !order.active || order.canceled) continue

                // Исполнение LIMIT-ордера
                const h = bar[2], l = bar[3]
                console.log("CHECK ORDER", order, h, l)

                if (order["type"] == "limit") {
                    if (order["side"] == "buy" && l <= order["price"]) {
                        order.filled = true
                        order.fill_price = order.price
                        executions.push("buy")
                        // TODO: посчитать цену из order.price и bar
                    }
                    if (order["side"] == "sell" && h >= order["price"]) {
                        order.filled = true
                        order.fill_price = order.price
                        executions.push("sell")
                        // TODO: посчитать цену из order.price и bar
                    }
                }

                // Исполнение STOP-ордера
                if (order["type"] == "stop") {
                    if (order["side"] == "buy" && h >= order["price"]) {
                        order.filled = true
                        order.fill_price = order.price
                        executions.push("buy")
                        // TODO: посчитать цену из order.price и bar
                    }
                    if (order["side"] == "sell" && l <= order["price"]) {
                        order.filled = true
                        order.fill_price = order.price
                        executions.push("sell")
                        // TODO: посчитать цену из order.price и bar
                    }
                }

                // Если был исполнен основной ордер - включить все дополнительные
                if (order.role === "entry" && order.filled) {
                    console.warn("исполнен основной ордер")
                    for (const o of active_trade.orders) {
                        if (["tp", "sl"].includes(o.role) && !o.filled && !o.canceled) {
                            o.active = true
                        }
                    }
                }
                
                // Если был исполнен доп. ордер - закрыть сделку и выключить остальное
                if (["tp", "sl"].includes(order.role) && order.filled) {
                    console.warn("исполнен доп. ордер")
                    for (const o of active_trade.orders) {
                        if (!o.filled) {
                            o.canceled = true
                        }
                    }
                }
                
            }
        }

       this.updateStats(executions)
    
    }

    updateStats(executions) {

        const new_bars = this.app_state.data.value
        const last_bar_close = new_bars.slice(-1)[0][4]

        const trades = this.app_state.trades.value
        const active_trade = trades.slice(-1)[0]

        let q_left = 0

        // Пересчитать PnL для active_trade
        if (active_trade.entryOrder.filled) {
            let filled_quantity = 0
            let filled_money = 0
            for (const order of active_trade.orders) {
                if (order.role !== "entry" && order.filled) {
                    filled_quantity += order.quantity 
                    filled_money += order.quantity * order.fill_price
                }
            }
            const side = active_trade.entryOrder.side === "buy" ? 1 : -1
            if (filled_quantity > 0) {
                let av_close_price = filled_money / filled_quantity
                active_trade.closed_pnl = side * (av_close_price - active_trade.entryOrder.fill_price) * filled_quantity
            } else {
                active_trade.closed_pnl = 0
            }
            q_left = (active_trade.entryOrder.quantity - filled_quantity)
            active_trade.open_pnl = side * (last_bar_close - active_trade.entryOrder.fill_price) * q_left

            // Не совсем корректный подсчет DD, но пока сойдет
            active_trade.max_drawdown = Math.min(active_trade.max_drawdown, active_trade.open_pnl + active_trade.closed_pnl)
        }

        this.app_state.trades.value = [...this.app_state.trades.value]

        if (executions.length) {
            this.app_state.executions.value = [...this.app_state.executions.value, ...executions]

            // Position
            if (q_left > 0) {
                this.app_state.positions.value = [{
                    quantity: q_left,
                    price: active_trade.entryOrder.fill_price,
                }]
            } else {
                this.app_state.positions.value = []
            }
        }
    }

}

