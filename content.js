function(T) {
    var B = {}

    function C(S) {
        if (B[S]) return B[S].exports
        var E = B[S] = {
            i: S,
            l: !1,
            exports: {}
        }
        return T[S].call(E.exports, E, E.exports, C), E.l = !0, E.exports
    }
    C.m = T, C.c = B, C.d = function (T, B, S) {
        C.o(T, B) || Object.defineProperty(T, B, {
            enumerable: !0,
            get: S
        })
    }, C.r = function (T) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(T, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(T, "__esModule", {
            value: !0
        })
    }, C.t = function (T, B) {
        if (1 & B && (T = C(T)), 8 & B) return T
        if (4 & B && "object" == typeof T && T && T.__esModule) return T
        var S = Object.create(null)
        if (C.r(S), Object.defineProperty(S, "default", {
            enumerable: !0,
            value: T
        }), 2 & B && "string" != typeof T)
            for (var E in T) C.d(S, E, function (B) {
                return T[B]
            }.bind(null, E))
        return S
    }, C.n = function (T) {
        var B = T && T.__esModule ? function () {
            return T.default
        } : function () {
            return T
        }
        return C.d(B, "a", B), B
    }, C.o = function (T, B) {
        return Object.prototype.hasOwnProperty.call(T, B)
    }, C.p = "", C(C.s = 1)
} ([, function (T, B) {
    E = "IS_FIRST_TIME_RUN_KEY", D = T => {
        const [B, E] = T.full_name.split(":")
        if (6 === E.length) {
            const T = E.substring(0, 3),
                S = E.substring(3)
            return B.toLowerCase() === C.BITMEX ? {
                exchange: C[B],
                market: `XBT-${T}${S}`
            } : {
                exchange: C[B],
                market: `${S}-${T}`
            }
        } {
            const T = S[B][E]
            return {
                exchange: C[B],
                market: T
            }
        }
    }, N = (T, B) => {
        const S = Object.entries(C).find(([B, C]) => C === T)[0]
        let E, D
        if (T === C.BITMEX) {
            const [, T] = B.split("-")
            D = T.substring(0, 3), E = T.substring(3)
        } else[E, D] = B.split("-")
        return `${S}:${D}${E}`
    }, U = T => {
        window.TradingViewApi.activeChart().setSymbol(T)
    }, H = {
        MARKET_BUY: "#4596ec",
        MARKET_SELL: "#ef5350",
        LIMIT_BUY: "#4596ec",
        LIMIT_SELL: "#ef5350",
        STOP_BUY: "#4596ec",
        STOP_LOSS: "#ef5350"
    }, A = {
        MARKET_BUY: "Market Buy",
        MARKET_SELL: "Market Sell",
        LIMIT_BUY: "Limit Buy",
        LIMIT_SELL: "Limit Sell",
        STOP_BUY: "Stop Buy",
        STOP_LOSS: "Stop Sell"
    }, O = {
        MARKET_BUY: "rate",
        MARKET_SELL: "rate",
        LIMIT_BUY: "rate",
        LIMIT_SELL: "rate",
        STOP_BUY: "stopRate",
        STOP_LOSS: "stopRate"
    }, R = $('\n<svg xmlns="http://www.w3.org/2000/svg" \n    width="28" height="21" \n    viewBox="0 0 28 21" \n    fill="none">\n    <path fill-rule="evenodd" \n        clip-rule="evenodd" \n        d="M27 9.00579L26.52 8.34663H4.2554L6.58001 5.15574H21.4202L22.3905 6.48763H25.1657L22.3994 2.69038H17.5568V1H15.441V2.69038H13.2982V1H11.1825V2.69038H5.60081L1 9.00563L2.79961 10.812H21.016L14.3504 16.1496L12.7042 14.8218H9.46801L13.2982 18.2204V20H15.4139V18.3096L27 9.00579Z" \n        stroke="#4596EC" \n        stroke-linejoin="round"/>\n</svg>\n'), X = document.currentScript

    function e() {
        if (void 0 === window.TradingViewApi) return
        const T = "superorder-trading-terminal",
            B = "https://trade.superorder.io/order",
            C = "true" === X.getAttribute(E)
        let S = {}
        const e = window.TradingViewApi.activeChart()
        let {
            exchange: t,
            market: M
        } = D({
            full_name: e.symbol()
        })
        const P = T => {
            const B = S[T]
            if (B) try {
                B.remove()
            } catch (T) { }
        },
            L = () => {
                n && n[0] && n[0].contentWindow.postMessage("INITIALIZE_ORDERS", "*")
            }
        const n = $("<iframe />", {
            src: `${B}/${t}/${M}`,
            id: T,
            width: "100%",
            height: "100%",
            frameborder: 0
        }).on("load", () => {
            C && c(), L()
        }),
            r = $("div.layout__area--right > .widgetbar-wrap > .widgetbar-tabs div[data-name=right-toolbar]"),
            G = r.find("> :nth-child(2)"),
            I = $("div.widgetbar-pagescontent"),
            o = $(G).clone(!0).attr("data-name", "superorder-trading").attr("data-role", "superorder-button").attr("title", "Superorder Trading").on("click", (function () {
                i.hasClass("active") ? (V(), G.click()) : c()
            })).insertBefore(G)
        o.find("svg").replaceWith(R)
        const i = I.find("> :first-child").clone().empty().append(n).appendTo(I),
            s = $("div.widgetbar-pages")
        const a = function () {
            const T = r.find('[class*="isActive-"]')
            if (T.length > 0) {
                return T.attr("class").split(/\s+/).find(T => T.startsWith("isActive-"))
            } {
                const T = r.find("> :nth-child(1)")
                if (T.length > 0) {
                    T.click()
                    const B = T.attr("class").split(/\s+/)
                    return T.click(), B.find(T => T.startsWith("isActive-"))
                }
                return "isActive"
            }
        }()

        function V() {
            i.removeClass("active"), o.removeClass(a), o.css("background-color", "unset"), R.find("> path").attr("stroke", "#131722")
        }

        function c() {
            s.hasClass("hidden") && window.widgetbar.setPage("alerts"), $("div.widgetbar-page").removeClass("active"), r.find('> div[data-role="button"]').removeClass(a), i.addClass("active"), o.addClass(a), o.css("background-color", "#ffffff"), R.find("> path").attr("stroke", "#4596EC")
        }
        r.find('> div[data-role="button"]').on("click", V), window.widgetbar.layout.$hider.on("click", V), V(),
            function () {
                const T = /^-?\d+\.?\d*$/
                new MutationObserver((function (B) {
                    const C = B[0].target.text,
                        [, S] = C.split(" ")
                    T.test(S) && n[0].contentWindow.postMessage({
                        type: "CHART_TICK_UPDATE",
                        rate: S
                    }, "*")
                })).observe(window.document.querySelector("title"), {
                    subtree: !0,
                    characterData: !0,
                    childList: !0
                })
            }(), e.onSymbolChanged().subscribe(null, (function (C) {
                const {
                    exchange: S,
                    market: E
                } = D(C)
                window.document.querySelector(`#${T}`).setAttribute("src", `${B}/${S}/${E}`)
            })), window.addEventListener("message", T => {
                const {
                    data: B
                } = T
                switch (B.type) {
                    case "CHANGE_SYMBOL":
                        const {
                            exchange: T, market: C
                        } = B, E = N(T, C)
                        U(E)
                        break
                    case "ADD_ORDER_ON_CHART": {
                        const {
                            id: T,
                            order: C
                        } = B
                        let E
                        E = T in S ? ((T, B) => {
                            const {
                                type: C,
                                payload: S
                            } = B, {
                                exchange: E,
                                market: D
                            } = S, U = N(E, D), R = O[C] in S ? S[O[C]] : null
                            if (e.symbol() !== U) return
                            const X = H[C],
                                t = A[C]
                            return T.setPrice(R).setLineColor(X).setBodyBorderColor(X).setBodyTextColor(X).setQuantity("").setText(t).setCancelButtonBorderColor(X).setCancelButtonIconColor(X)
                        })(S[T], C) : (T => {
                            const {
                                type: B,
                                payload: C
                            } = T, {
                                exchange: S,
                                market: E
                            } = C, D = N(S, E), U = O[B] in C ? C[O[B]] : null
                            if (e.symbol() !== D) return
                            const R = H[B],
                                X = A[B]
                            return e.createOrderLine({}).setLineLength(3).setLineStyle(0).setPrice(U).setLineColor(R).setBodyBorderColor(R).setBodyTextColor(R).setQuantity("").setText(X).setCancelButtonBorderColor(R).setCancelButtonIconColor(R)
                        })(C), S = Object.assign(S, {
                            [T]: E
                        })
                        break
                    }
                    case "REMOVE_ORDER_ON_CHART": {
                        const {
                            id: T
                        } = B
                        P(T)
                        break
                    }
                    case "REQUEST_LAST_RATE":
                        ! function () {
                            const [, T] = window.document.title.split(" ");
                            /^-?\d+\.?\d*$/.test(T) && n[0].contentWindow.postMessage({
                                type: "CHART_TICK_UPDATE",
                                rate: T
                            }, "*")
                        }(), setInterval(() => {
                            L()
                        }, 1e4)
                        break
                    case "INITIAL_ORDERS_LIST": {
                        const {
                            orders: T
                        } = B
                        Object.entries(S).filter(([B]) => !T.some(T => T.id === B)).forEach(([T]) => {
                            P(T), delete S[T]
                        }), T.forEach(({
                            id: T,
                            order: B
                        }) => {
                            window.postMessage({
                                type: "ADD_ORDER_ON_CHART",
                                id: T,
                                order: B
                            }, "*")
                        })
                        break
                    }
                }
            }, !1), window.addEventListener("beforeunload", T => {
                T.preventDefault(), T.stopPropagation()
            }, !0)
    }
    const t = setInterval(function () {
        void 0 !== window.widgetbar && void 0 !== window.TradingViewApi && (clearInterval(t), e())
    }.bind(this), 500)
}])