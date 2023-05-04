import { h, Component } from '../vendor/preact.module.js'
import { useState, useEffect } from '../vendor/hooks.module.js'
import htm from '../vendor/htm.module.js'


const html = htm.bind(h)


// Order List Component
export const TradeListComponent = ({ app_state }) => {

    // useEffect(() => {
    //     console.log("FIRST render TradeListComponent", app_state.trades.value)
    // }, [app_state.trades.value])

    const formatPnL = (v) => {
        const dec = 2
        let css = ""
        let str = ""
        if (v > 0) {
            css += "positive"
            str = "+" + v.toFixed(dec)
        } else if (v < 0) {
            css += "negative"
            str = "−" + Math.abs(v).toFixed(dec)
        } else {
            str = v.toFixed(dec)
        }
        return html`<span class="${css}">${str}</span>`
    }

    return html`
    <style>
        .trade-list {
            overflow-y: scroll;
            height: 100%;
        }
        .trade-list table {
            width: 100%;
        }
        .trade-list thead {
            position: sticky;
            top: 0;
            background: #fff;
        }
        .trade-list th {
            padding: 8px;
            font-size: 14px;
            font-weight: normal;
            text-align: right;
            color: #6a6d78;
        }
        .trade-list td {
            border-top: 1px solid #eee;
            text-align: right;
            padding: 8px;
        }
        .trade-list th:first-child,
        .trade-list td:first-child {
            text-align: left;
            padding-left: 0;
        }
        .trade-list th:last-child,
        .trade-list td:last-child {
            padding-right: 0;
        }
    </style>
    <div class="trade-list">
        <table>
            <thead>
                <tr>
                    <th>Side</th>
                    <th>Amount</th>
                    <th>Max DD</th>
                    <th>Open PnL</th>
                    <th>PnL</th>
                </tr>
            </thead>
            <tbody>
                ${app_state.trades.value.slice(0).reverse().map(trade => html`
                <tr key=${trade.id}>
                    <td>${trade.entryOrder.side}</td>
                    <td>${trade.entryOrder.quantity}</td>
                    <td>${formatPnL(trade.max_drawdown)}</td>
                    <td>${formatPnL(trade.open_pnl)}</td>
                    <td>${formatPnL(trade.closed_pnl)}</td>
                </tr>
            `)}
            </tbody>
        </table>
    </div>
    `
}
