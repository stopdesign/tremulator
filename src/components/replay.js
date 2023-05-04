import { h } from '../vendor/preact.module.js'
import { useState, useEffect } from '../vendor/hooks.module.js'
import htm from '../vendor/htm.module.js'

const html = htm.bind(h)


export const ReplayComponent = ({ app_state, onReplay, onPointSelectMode, onNextStep, onTest }) => {

    const [timeStr, setTimeStr] = useState(0)

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    useEffect(() => {
        const ts = app_state.current_ts.value

        if (!ts) {
            setTimeStr("--")
            return
        }

        const dt = new Date(ts * 1000)

        const dayOfWeek = daysOfWeek[dt.getDay()]
        const day = dt.getDate()
        const month = months[dt.getMonth()]
        const year = dt.getFullYear()

        const t = dt.toLocaleTimeString([], {
            timeZone: 'Europe/London',
            hourCycle: 'h23',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        const d = dayOfWeek + ", " + day + " " + month + " " + year

        setTimeStr(html`<span class="replay-time">${t}</span><span class="replay-date">${d}</span>`)

    }, [app_state.current_ts.value])

    return html`
    <style>
        .replay-dt {
            height: 30px;
            margin-bottom: 10px;
        }
        .replay-time {
            font-size: 22px;
            font-weight: 600;
        }
        .replay-date {
            font-size: 16px;
            margin-left: 20px;
        }
    </style>
    <div>
        <div class="replay-dt">${timeStr}</div>

        <div>
            <button style='margin-left: 0' onClick=${onReplay}>Replay</button>
            <button style='margin-left: 10px' onClick=${onPointSelectMode}>Move Start</button>
            <button style='margin-left: 10px' onClick=${onNextStep}>Step</button>
            <button style='margin-left: 10px' onClick=${onTest}>Next Day</button>
        </div>
    </div>
    `

}
