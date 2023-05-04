/*

при поступлении новых данных:
сначала еще раз приходит закрытие текущего бара
потом открытие нового бара
потом barReceived
потом hlc в каком-то порядке.

Если пришло много баров сразу (перемотка), 
то всё это происходит последовательно много раз.

1675249200 close     Wed Feb 01 2023 11:00:00 GMT+0000
1675247400 bar time  Wed Feb 01 2023 10:30:00 GMT+0000

*/

const audioCtx = new (window.AudioContext || window["webkitAudioContext"])()


export default class ReplayController {

    constructor(tv, app_state) {
        this.tv = tv
        this.app_state = app_state

        app_state.trades.subscribe((value) => {
            console.log("trades:", value)
        })

        this.replayApi = null
        this.replayUI = null

        setTimeout(() => {
            // События навешиваются на тот виджет, где включается основной Replay
            const model = tv.activeChart()._chartWidget.model().model()
            const data_events = model.mainSeries().dataEvents()

            // здесь приходят данные по мере их просирания из API
            data_events.barReceived().subscribe(this, this.onBarReceived)
            data_events.dataUpdated().subscribe(this, this.onDataUpdated)

            // обновить current_ts, 
            // перемотать все остальные графики на эту точку
            model.onPointSelected().subscribe(this, this.onPointSelected)

            // model.onInReplayStateChanged()

            // data_events.symbolResolved().subscribe(this, (a, b) => console.log("symbolResolved", a, b))
            // data_events.created().subscribe(this, (a, b) => console.log("created", a, b))
            // data_events.completed().subscribe(this, (a, b) => console.log("completed", a, b))
            // data_events.modified().subscribe(this, (a, b) => console.log("modified", a, b))

            this.setDataByLastBar()

        }, 1000)

        // tv.activeChart().onDataLoaded().subscribe(this, (a, b) => console.log("ON DATA LOADED", a, b))
    }

    setDataByLastBar () {
        const model = this.tv.activeChart()._chartWidget.model().model()
        const last_bar = model.mainSeries().data().last().value
        console.log("LAST BAR", last_bar)

        if (last_bar) {
            this.app_state.data.value = [...this.app_state.data.value, last_bar]
            this.app_state.last_bar.value = last_bar
            this.app_state.current_ts.value = last_bar[0]
        }
    }

    onPointSelected(point, pane) {

        // прогрев динамика
        this.beep({ volume: 0.01, duration: 100, frequency: 1000 })

        console.log(">>>>> onPointSelected >>>>>", point, pane)

        const t1 = point["time"]
        const i1 = pane.timeScale().timePointToIndex(t1)
        const t2 = pane.timeScale().indexToTimePoint(i1 - 1)
        // const t3 = pane.timeScale().indexToUserTime(i1 - 1)
        // console.log("pane", t1, i1, t2, t3)
        // yyy._indexToTimeConverter(index)

        // Последний бар еще не соответствует выбранной точке,
        // поэтому придется найти нужные данные по времени.
        const model = this.tv.activeChart()._chartWidget.model().model()
        model.mainSeries().data().bars().each((i, bar) => {
            if (bar[0] === t1) {
                this.app_state.last_bar.value = bar
                this.app_state.current_ts.value = bar[0]
                return
            }
        })

        this.app_state.current_ts.value = t2
    }

    onBarReceived(bar) {
        // console.log(">>>>> barReceived >>>>>", bar)
        if (bar["index"] > 0) {
            this.app_state.current_ts.value = bar.value[0]
        }
    }

    onDataUpdated(meta, init, bar) {
        // console.log(">>>>> dataUpdated >>>>>", meta, init, bar)
        if (!init) {
            this.app_state.data.value = [...this.app_state.data.value, bar.value]
            this.app_state.last_bar.value = bar.value
        }
    }

    onReplayApiCreated(replayApi) {

        this.replayApi = replayApi

        this.replayUI = replayApi._replayUIController

        if (!this.replayUI) {
            replayApi._loadUIController()
        }

        console.log("enableReplayMode", this)

        // хрен его знает как, но это включает реплэй
        this.replayUI._updateManagers()
        this.replayUI._isReplayModeEnabled.setValue(1)
        this.replayUI._notifyAboutPropertiesChanged()

        // Можно скрыть тулбар перемотки
        this.replayUI._toolbar._container.hidden = true

        // Включает возможность рисовать стрелки через _addExecution
        this.replayUI._replayTradingUIController.updateModels()

    }

    onReplay() {
        if (!this.replayApi) {
            console.warn("create replayApi")
            this.tv.replayApi()
                .then(
                    (replayApi) => this.onReplayApiCreated(replayApi)
                )
        }
    }

    onPointSelectMode() {

        console.log("is available:", this.replayUI.replayAvailability().isAvailable)
        console.log("is enabled:", this.replayUI._isReplayModeEnabled.value())

        this.replayUI.toggleJumpToBarMode()
    }

    beep({ volume = 1, duration = 100, frequency = 1000 }) {
        var oscillator = audioCtx.createOscillator()
        var gainNode = audioCtx.createGain()
        var duration = duration

        oscillator.connect(gainNode)
        gainNode.connect(audioCtx.destination)

        gainNode.gain.value = volume
        oscillator.frequency.value = frequency
        oscillator.type = "sawtooth" // sine square sawtooth triangle

        oscillator.start()

        setTimeout(
            function () {
                oscillator.stop()
            },
            duration
        )
    }

    onNextStep() {

        // Активный виджет передвинуть на один бар.
        // Остальные подстроить под него.

        const active_widget = this.replayUI.activeChartWidget()
        this.replayUI._replayManagers[active_widget.id()].doReplayStep()

        // this.beep({ volume: 1, duration: 70, frequency: 800 })

    }
    onNextBigStep() {
        const active_widget = this.replayUI.activeChartWidget()
        this.replayUI._replayManagers[active_widget.id()].doReplayStep(10)
    }

}

