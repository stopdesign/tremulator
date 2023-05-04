import { h } from '../vendor/preact.module.js'
import { useState, useEffect } from '../vendor/hooks.module.js'
import htm from '../vendor/htm.module.js'

const html = htm.bind(h)


// Order List Component
export const StatsComponent = ({ app_state }) => {

    const [cnt, setCnt] = useState(0)
    const [open_pnl, setOpenPnl] = useState(0)
    const [closed_pnl, setClosedPnl] = useState(0)
    const [total_pnl, setTotalPnl] = useState(0)
    const [win_rate, setWinRate] = useState("--")
    const [max_max_drawdown, setMaxMaxDD] = useState(0)

    useEffect(() => {
        const trades = app_state.trades.value

        setCnt(trades.length)

        let p_cnt = 0
        let l_cnt = 0

        let max_max_drawdown = 0
        let open_pnl = 0
        let closed_pnl = 0
        for (const trade of trades) {
            open_pnl += trade.open_pnl
            closed_pnl += trade.closed_pnl

            if (trade.max_drawdown < max_max_drawdown) {
                max_max_drawdown = trade.max_drawdown
            }

            if (trade.open_pnl + trade.closed_pnl > 0) {
                p_cnt += 1
            } else {
                l_cnt += 1
            }
        }
        setOpenPnl(open_pnl)
        setClosedPnl(closed_pnl)
        setTotalPnl(open_pnl + closed_pnl)
        setMaxMaxDD(max_max_drawdown)

        if (p_cnt + l_cnt > 0) {
            const wr = (100 * p_cnt / (p_cnt + l_cnt)).toFixed(0) + "%"
            setWinRate(wr)
        } else {
            setWinRate("--")
        }

    }, [app_state.trades.value])

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
    <div>
        <style>
            .trades-info {
                display: flex;
            }
            .trades-info__item {
                text-align: right;
                flex-grow: 1;
            }
            .trades-info__item:first-child {
                flex-grow: 0;
            }
            .trades-info__label {
                font-size: 12px;
                color: gray;
                line-height: 1.6;
            }
            .trades-info__value {
                font-size: 17px;
                font-weight: 600;
                line-height: 1.6;
            }
            .positive {
                color: #080;  /* #22ab94; */
            }
            .negative {
                color: #f23645;
            }
        </style>
        <div class="trades-info">
            <div class="trades-info__item">
                <div class="trades-info__label">Trades</div>
                <div class="trades-info__value">${cnt}</div>
            </div>
            <div class="trades-info__item">
                <div class="trades-info__label">Win Rate</div>
                <div class="trades-info__value">${win_rate}</div>
            </div>
            <div class="trades-info__item">
                <div class="trades-info__label">Max DD</div>
                <div class="trades-info__value">${formatPnL(max_max_drawdown)}</div>
            </div>
            <div class="trades-info__item trades-info__item--total-pnl">
                <div class="trades-info__label">Total PnL</div>
                <div class="trades-info__value">${formatPnL(total_pnl)}</div>
            </div>
        </div>
    </div>
    `
}

