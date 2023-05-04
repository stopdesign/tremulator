export default class ChartsController {

    constructor (tv, app_state) {
        
        this.tv = tv
        this.app_state = app_state

        this.visible_orders = {}

        this.position_lines = []

        // Подписка на обновление app_state
        this.app_state.trades.subscribe(v => {
            console.log("TVChartView, on trades update", v)
            this.updateOrders(v)
        })

        this.app_state.executions.subscribe(v => {
            console.log("TVChartView, on executions update", v)
            this.updateExecutions(v)
        })

        this.app_state.positions.subscribe(v => {
            console.log("TVChartView, on positions update", v)
            this.updatePositions(v)
        })

    }

    updatePositions = (positions) => {
        for (const pl of this.position_lines) {
            pl.remove()
        }
        this.position_lines = []

        for (const position of positions) {
            const position_line = this.tv.chart().createPositionLine()
                .onClose(this, function(a) {
                    console.log("CLOSE ME", this, a)
                })
                .setText("Position")
                .setQuantity(position.quantity)
                .setPrice(position.price)
                .setProfitState("positive")  // negative, neutral, positive
                .setBodyFont("13px -apple-system,Trebuchet MS,Roboto,Ubuntu,sans-serif")
                .setQuantityFont("bold 13px -apple-system,Trebuchet MS,Roboto,Ubuntu,sans-serif")    

            this.position_lines.push(position_line)
        }
    }

    updateExecutions = (executions) => {

        // TODO: определять, каких именно нет на графике
        const new_executions = executions.slice(-1)

        this.tv.replayApi().then((replayApi) => {
            const widget = replayApi._replayUIController.activeChartWidget()
            const rtc = replayApi._replayUIController._replayTradingUIController
            let trading_model = rtc._tradingModelMap.get(widget.id())

            for (const execution of new_executions) {
                // добавить ордер на график (в последний бар)
                const side = execution == "buy" ? 1 : -1
                trading_model._addExecution({ side: side, qty: 1 })
            }
        })
        
    }

    createOrderLine = (order) => {

        // Нарисовать ордер на графике
        const order_line = this.tv.chart().createOrderLine({disableUndo: true})
            .onMove(this.app_state, function(app_state) {
                console.log("onMove", this, app_state)
                order.price = this.getPrice()
                app_state.trades.value = [...app_state.trades.value]
            })
            .onModify(this, function (chart) {
                console.log("onModify", this, chart)
            })
            .onCancel(this, function (chart) {
                console.log("onCancel", this, chart, order)
                order.canceled = true
                // Если отменили вход, отменяется и всё остальное
                if (order.role === "entry") {
                    const trades = chart.app_state.trades.value
                    const active_trade = trades.slice(-1)[0]
                    for (const o of active_trade.orders) {
                        o.canceled = true
                        o.active = false
                    }
                }
                chart.app_state.trades.value = [...chart.app_state.trades.value]
            })
            // .setTooltip("Asdfasd lkjlkvba askiikjkdfj")
            .setBodyFont("13px -apple-system,Trebuchet MS,Roboto,Ubuntu,sans-serif")
            .setQuantityFont("bold 13px -apple-system,Trebuchet MS,Roboto,Ubuntu,sans-serif")
            .setText((order.type + " " + order.side).toUpperCase())
            .setQuantity(order.quantity)
            .setDirection(order.side)
            .setPrice(order.price)
            .setActive(!!order.active)
            .setLineStyle(2)
                
        order_line._data.id = order.id
        
        return order_line
    }

    // пока перерисовываются все активные ордеры
    // будет медленно - сделаю события
    updateOrders(trades) {

        for (const trade of trades) {
            for (const order of trade.orders) {

                if (!(order.id in this.visible_orders)) {
                    if (!order.filled && !order.canceled) {
                        // Нарисовать полоску на графике
                        this.visible_orders[order.id] = this.createOrderLine(order)
                    }
                } else {
                    const order_line = this.visible_orders[order.id]

                    if (order_line === undefined) {
                        delete this.visible_orders[order.id]
                        continue
                    }

                    // Обновить ордер
                    if (order.filled || order.canceled) {
                        // удалить полоску с графика
                        order_line.remove()

                        // удалить штуку из visible_orders
                        delete this.visible_orders[order.id]
                    } else {
                        order_line.setActive(!!order.active)
                    }
                }

            }
        }

    }

}

