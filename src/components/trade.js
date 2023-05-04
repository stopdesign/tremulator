import { h } from '../vendor/preact.module.js'
import { useState } from '../vendor/hooks.module.js'
import htm from '../vendor/htm.module.js'


const html = htm.bind(h)


// Order Component
export const TradeComponent = ({ app_state, onSave, onClose }) => {

    const [side, setSide] = useState("buy")
    const [qty, setQty] = useState(1)
    const [tp, setTp] = useState(1)
    const [sl, setSl] = useState(1)

    const handleSave = () => {
        const order = {
            price: app_state.last_bar.value[4],
            quantity: qty,
            side: side,
            tp: tp,
            sl: sl,
        }
        console.log("order", order)
        onSave(order)
    }

    const handleClose = (e) => {
        onClose()
    }

    // редактирование ордера
    return html`
        <div class="order_form">
            <style>
                .order_form__place,
                .order_form__close {
                    margin: 0 20px 0 0 !important;
                }
                .order_form__side {
                    display: flex;
                    width: 240px;
                    margin: 0 0 20px 0;
                }
                .order_form__side > div {
                    flex-grow: 1;
                }
                .order_form__side input {
                    margin-right: 8px;
                    margin-left: 8px;
                }
                .order_form__side label {
                    display: block;
                    padding: 10px 0;
                    margin-right: 10px;
                    background: #f0f0f0;
                    cursor: pointer;
                    border-radius: 5px;
                    border: 1px solid #aaa;
                }
                .order_form__brackets {
                    display: flex;
                    width: 240px;
                }
                .order_form__tp,
                .order_form__sl {
                    padding: 20px 0;
                    flex-grow: 1;
                }
                .order_form__tp input,
                .order_form__sl input {
                    margin-right: 10px;
                }
                .order_form__amount_input {
                    border: 1px solid #aaa;
                    width: 80px;
                    height: 34px;
                    padding: 0 5px;
                    border-radius: 5px;
                    box-sizing: border-box;
                }
                .order_form__amount_input:focus {
                    border: 2px solid #2962ff;
                    padding: 0 4px;
                }
                .order_form__side-buy .order_form__side__buy label {
                    background: #aea;
                }
                .order_form__side-sell .order_form__side__buy label {
                    background: #eee;
                }
                .order_form__side-buy .order_form__side__sell label {
                    background: #eee;
                }
                .order_form__side-sell .order_form__side__sell label {
                    background: #eaa;
                }
            </style>
            <div class="order_form__side order_form__side-${side}">
                <div class="radio order_form__side__buy">
                    <label>
                    <input
                        type="radio"
                        value="buy"
                        checked=${side === "buy"}
                        onChange=${(e) => setSide(e.target.value)}
                    />
                    Buy
                    </label>
                </div>
                <div class="radio order_form__side__sell">
                    <label>
                    <input
                        type="radio"
                        value="sell"
                        checked=${side === "sell"}
                        onChange=${(e) => setSide(e.target.value)}
                    />
                    Sell
                    </label>
                </div>
            </div>

            <label>
                Amount: <input
                    class="order_form__amount_input"
                    type="number"
                    min="1"
                    value=${qty} 
                    onInput=${e => setQty(e.target.value)}
                />
            </label>

            <div class="order_form__brackets">

                <div class="order_form__tp">
                    <div class="checkbox">
                        <label>
                        <input
                            type="checkbox"
                            checked=${tp}
                            onChange=${() => setTp(!tp)}
                        />
                        Take Profit
                        </label>
                    </div>
                </div>

                <div class="order_form__sl">
                    <div class="checkbox">
                        <label>
                        <input
                            type="checkbox"
                            checked=${sl}
                            onChange=${() => setSl(!sl)}
                        />
                        Stop Loss
                        </label>
                    </div>
                </div>
            
            </div>
            
            <button class="order_form__place" onClick=${handleSave}>Place Trade</button>

            <button class="order_form__close" onClick=${handleClose}>Close by Market</button>
            
        </div>
    `
}
