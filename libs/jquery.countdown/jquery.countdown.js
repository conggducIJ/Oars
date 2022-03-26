/*
 * The Final Countdown for jQuery v2.2.0 (http://hilios.github.io/jQuery.countdown/)
 * Copyright (c) 2016 Edson Hilios
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
(function(a) { if (typeof define === "function" && define.amd) { define(["jquery"], a) } else { a(jQuery) } })(function(a) {
    var f = [],
        g = [],
        c = { precision: 100, elapse: false, defer: false };
    g.push(/^[0-9]*$/.source);
    g.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
    g = new RegExp(g.join("|"));

    function h(k) { if (k instanceof Date) { return k } if (String(k).match(g)) { if (String(k).match(/^[0-9]*$/)) { k = Number(k) } if (String(k).match(/\-/)) { k = String(k).replace(/\-/g, "/") } return new Date(k) } else { throw new Error("Couldn't cast `" + k + "` to a date object.") } }
    var d = { Y: "years", m: "months", n: "daysToMonth", d: "daysToWeek", w: "weeks", W: "weeksToMonth", H: "hours", M: "minutes", S: "seconds", D: "totalDays", I: "totalHours", N: "totalMinutes", T: "totalSeconds" };

    function e(l) { var k = l.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1"); return new RegExp(k) }

    function j(k) {
        return function(n) {
            var m = n.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
            if (m) {
                for (var o = 0, p = m.length; o < p; ++o) {
                    var l = m[o].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),
                        s = e(l[0]),
                        q = l[1] || "",
                        r = l[3] || "",
                        t = null;
                    l = l[2];
                    if (d.hasOwnProperty(l)) {
                        t = d[l];
                        t = Number(k[t])
                    }
                    if (t !== null) {
                        if (q === "!") { t = i(r, t) }
                        if (q === "") { if (t < 10) { t = "0" + t.toString() } }
                        n = n.replace(s, t.toString())
                    }
                }
            }
            n = n.replace(/%%/, "%");
            return n
        }
    }

    function i(l, k) {
        var m = "s",
            n = "";
        if (l) {
            l = l.replace(/(:|;|\s)/gi, "").split(/\,/);
            if (l.length === 1) { m = l[0] } else {
                n = l[0];
                m = l[1]
            }
        }
        if (Math.abs(k) > 1) { return m } else { return n }
    }
    var b = function(k, l, m) {
        this.el = k;
        this.$el = a(k);
        this.interval = null;
        this.offset = {};
        this.options = a.extend({}, c);
        this.instanceNumber = f.length;
        f.push(this);
        this.$el.data("countdown-instance", this.instanceNumber);
        if (m) {
            if (typeof m === "function") {
                this.$el.on("update.countdown", m);
                this.$el.on("stoped.countdown", m);
                this.$el.on("finish.countdown", m)
            } else { this.options = a.extend({}, c, m) }
        }
        this.setFinalDate(l);
        if (this.options.defer === false) { this.start() }
    };
    a.extend(b.prototype, {
        start: function() {
            if (this.interval !== null) { clearInterval(this.interval) }
            var k = this;
            this.update();
            this.interval = setInterval(function() { k.update.call(k) }, this.options.precision)
        },
        stop: function() {
            clearInterval(this.interval);
            this.interval = null;
            this.dispatchEvent("stoped")
        },
        toggle: function() { if (this.interval) { this.stop() } else { this.start() } },
        pause: function() { this.stop() },
        resume: function() { this.start() },
        remove: function() {
            this.stop.call(this);
            f[this.instanceNumber] = null;
            delete this.$el.data().countdownInstance
        },
        setFinalDate: function(k) { this.finalDate = h(k) },
        update: function() {
            if (this.$el.closest("html").length === 0) { this.remove(); return }
            var k = a._data(this.el, "events") !== undefined,
                m = new Date(),
                l;
            l = this.finalDate.getTime() - m.getTime();
            l = Math.ceil(l / 1000);
            l = !this.options.elapse && l < 0 ? 0 : Math.abs(l);
            if (this.totalSecsLeft === l || !k) { return } else { this.totalSecsLeft = l }
            this.elapsed = m >= this.finalDate;
            this.offset = { seconds: this.totalSecsLeft % 60, minutes: Math.floor(this.totalSecsLeft / 60) % 60, hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24, days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7, daysToWeek: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7, daysToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 % 30.4368), weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7), weeksToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7) % 4, months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30.4368), years: Math.abs(this.finalDate.getFullYear() - m.getFullYear()), totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24), totalHours: Math.floor(this.totalSecsLeft / 60 / 60), totalMinutes: Math.floor(this.totalSecsLeft / 60), totalSeconds: this.totalSecsLeft };
            if (!this.options.elapse && this.totalSecsLeft === 0) {
                this.stop();
                this.dispatchEvent("finish")
            } else { this.dispatchEvent("update") }
        },
        dispatchEvent: function(l) {
            var k = a.Event(l + ".countdown");
            k.finalDate = this.finalDate;
            k.elapsed = this.elapsed;
            k.offset = a.extend({}, this.offset);
            k.strftime = j(this.offset);
            this.$el.trigger(k)
        }
    });
    a.fn.countdown = function() {
        var k = Array.prototype.slice.call(arguments, 0);
        return this.each(function() {
            var m = a(this).data("countdown-instance");
            if (m !== undefined) {
                var l = f[m],
                    n = k[0];
                if (b.prototype.hasOwnProperty(n)) { l[n].apply(l, k.slice(1)) } else {
                    if (String(n).match(/^[$A-Z_][0-9A-Z_$]*$/i) === null) {
                        l.setFinalDate.call(l, n);
                        l.start()
                    } else { a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, n)) }
                }
            } else { new b(this, k[0], k[1]) }
        })
    }
});