
function uid(prefix, suffix) {
    const r = Math.round((Date.now() * (Math.random() + 1))).toString(36)
    return (prefix ? prefix : '') + r.substring(0, 5) + (suffix ? suffix : '')
}


export class Trade {
    
    constructor({ symbol, entryOrder }) {
        this.id = uid("trade_")
        this.symbol = symbol
        this.orders = [entryOrder]
        this.open = true
        this.entryOrder = entryOrder
        this.stopLossOrder = null
        this.takeProfitOrder = null
        this.entryPrice = entryOrder.price
        this.quantity = entryOrder.quantity
        this.open_pnl = 0
        this.closed_pnl = 0
        this.max_drawdown = 0
    }

}


export class Order {

    constructor({ type, side, price, quantity, role = "" }) {
        this.id = uid("order_")
        this.type = type
        this.role = role
        this.side = side
        this.price = price
        this.fill_price = null
        this.quantity = quantity
        this.active = (role === "entry")
        this.filled = false
        this.canceled = false
    }

    toString() {
        return `order: ${this.id}`
    }
}


export class Execution {

    constructor({ order, ts }) {
        this.id = uid("execution_")
        this.order = order
        this.ts = ts
    }

    toString() {
        return `execution: ${this.id}`
    }
}

