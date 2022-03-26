(function(a) {
    function b(f) { if (typeof f == "undefined") { return false } if (f instanceof Array || (!(f instanceof Object) && (Object.prototype.toString.call((f)) == "[object Array]") || typeof f.length == "number" && typeof f.splice != "undefined" && typeof f.propertyIsEnumerable != "undefined" && !f.propertyIsEnumerable("splice"))) { return true } return false }
    a.slider = function(g, h) { var f = a(g); if (!f.data("jslider")) { f.data("jslider", new c(g, h)) } return f.data("jslider") };
    a.fn.slider = function(f, j) {
        var k, g = arguments;

        function h(l) { return l !== undefined }

        function i(l) { return l != null }
        this.each(function() {
            var n = a.slider(this, f);
            if (typeof f == "string") {
                switch (f) {
                    case "value":
                        if (h(g[1]) && h(g[2])) {
                            var m = n.getPointers();
                            if (i(m[0]) && i(g[1])) {
                                m[0].set(g[1]);
                                m[0].setIndexOver()
                            }
                            if (i(m[1]) && i(g[2])) {
                                m[1].set(g[2]);
                                m[1].setIndexOver()
                            }
                        } else {
                            if (h(g[1])) {
                                var m = n.getPointers();
                                if (i(m[0]) && i(g[1])) {
                                    m[0].set(g[1]);
                                    m[0].setIndexOver()
                                }
                            } else { k = n.getValue() }
                        }
                        break;
                    case "prc":
                        if (h(g[1]) && h(g[2])) {
                            var m = n.getPointers();
                            if (i(m[0]) && i(g[1])) {
                                m[0]._set(g[1]);
                                m[0].setIndexOver()
                            }
                            if (i(m[1]) && i(g[2])) {
                                m[1]._set(g[2]);
                                m[1].setIndexOver()
                            }
                        } else {
                            if (h(g[1])) {
                                var m = n.getPointers();
                                if (i(m[0]) && i(g[1])) {
                                    m[0]._set(g[1]);
                                    m[0].setIndexOver()
                                }
                            } else { k = n.getPrcValue() }
                        }
                        break;
                    case "calculatedValue":
                        var o = n.getValue().split(";");
                        k = "";
                        for (var l = 0; l < o.length; l++) { k += (l > 0 ? ";" : "") + n.nice(o[l]) }
                        break;
                    case "skin":
                        n.setSkin(g[1]);
                        break
                }
            } else {
                if (!f && !j) {
                    if (!b(k)) { k = [] }
                    k.push(n)
                }
            }
        });
        if (b(k) && k.length == 1) { k = k[0] }
        return k || this
    };
    var e = { settings: { from: 1, to: 10, step: 1, smooth: true, limits: true, round: 0, format: { format: "#,##0.##" }, value: "5;7", dimension: "" }, className: "jslider", selector: ".jslider-", template: tmpl('<span class="<%=className%>"><table><tr><td><div class="<%=className%>-bg"><i class="l"></i><i class="f"></i><i class="r"></i><i class="v"></i></div><div class="<%=className%>-pointer"></div><div class="<%=className%>-pointer <%=className%>-pointer-to"></div><div class="<%=className%>-label"><span><%=settings.from%></span></div><div class="<%=className%>-label <%=className%>-label-to"><span><%=settings.to%></span><%=settings.dimension%></div><div class="<%=className%>-value"><span></span><%=settings.dimension%></div><div class="<%=className%>-value <%=className%>-value-to"><span></span><%=settings.dimension%></div><div class="<%=className%>-scale"><%=scale%></div></td></tr></table></span>') };

    function c() { return this.init.apply(this, arguments) }
    c.prototype.init = function(f, g) {
        this.settings = a.extend(true, {}, e.settings, g ? g : {});
        this.inputNode = a(f).hide();
        this.settings.interval = this.settings.to - this.settings.from;
        this.settings.value = this.inputNode.attr("value");
        if (this.settings.calculate && a.isFunction(this.settings.calculate)) { this.nice = this.settings.calculate }
        if (this.settings.onstatechange && a.isFunction(this.settings.onstatechange)) { this.onstatechange = this.settings.onstatechange }
        this.is = { init: false };
        this.o = {};
        this.create()
    };
    c.prototype.onstatechange = function() {};
    c.prototype.create = function() {
        var f = this;
        this.domNode = a(e.template({ className: e.className, settings: { from: this.nice(this.settings.from), to: this.nice(this.settings.to), dimension: this.settings.dimension }, scale: this.generateScale() }));
        this.inputNode.after(this.domNode);
        this.drawScale();
        if (this.settings.skin && this.settings.skin.length > 0) { this.setSkin(this.settings.skin) }
        this.sizes = { domWidth: this.domNode.width(), domOffset: this.domNode.offset() };
        a.extend(this.o, { pointers: {}, labels: { 0: { o: this.domNode.find(e.selector + "value").not(e.selector + "value-to") }, 1: { o: this.domNode.find(e.selector + "value").filter(e.selector + "value-to") } }, limits: { 0: this.domNode.find(e.selector + "label").not(e.selector + "label-to"), 1: this.domNode.find(e.selector + "label").filter(e.selector + "label-to") } });
        a.extend(this.o.labels[0], { value: this.o.labels[0].o.find("span") });
        a.extend(this.o.labels[1], { value: this.o.labels[1].o.find("span") });
        if (!f.settings.value.split(";")[1]) {
            this.settings.single = true;
            this.domNode.addDependClass("single")
        }
        if (!f.settings.limits) { this.domNode.addDependClass("limitless") }
        this.domNode.find(e.selector + "pointer").each(function(g) {
            var j = f.settings.value.split(";")[g];
            if (j) {
                f.o.pointers[g] = new d(this, g, f);
                var h = f.settings.value.split(";")[g - 1];
                if (h && new Number(j) < new Number(h)) { j = h }
                j = j < f.settings.from ? f.settings.from : j;
                j = j > f.settings.to ? f.settings.to : j;
                f.o.pointers[g].set(j, true)
            }
        });
        this.o.value = this.domNode.find(".v");
        this.is.init = true;
        a.each(this.o.pointers, function(g) { f.redraw(this) });
        (function(g) { a(window).resize(function() { g.onresize() }) })(this)
    };
    c.prototype.setSkin = function(f) {
        if (this.skin_) { this.domNode.removeDependClass(this.skin_, "_") }
        this.domNode.addDependClass(this.skin_ = f, "_")
    };
    c.prototype.setPointersIndex = function(f) { a.each(this.getPointers(), function(g) { this.index(g) }) };
    c.prototype.getPointers = function() { return this.o.pointers };
    c.prototype.generateScale = function() { if (this.settings.scale && this.settings.scale.length > 0) { var j = ""; var h = this.settings.scale; var g = Math.round((100 / (h.length - 1)) * 10) / 10; for (var f = 0; f < h.length; f++) { j += '<span style="left: ' + f * g + '%">' + (h[f] != "|" ? "<ins>" + h[f] + "</ins>" : "") + "</span>" } return j } else { return "" } return "" };
    c.prototype.drawScale = function() { this.domNode.find(e.selector + "scale span ins").each(function() { a(this).css({ marginLeft: -a(this).outerWidth() / 2 }) }) };
    c.prototype.onresize = function() {
        var f = this;
        this.sizes = { domWidth: this.domNode.width(), domOffset: this.domNode.offset() };
        a.each(this.o.pointers, function(g) { f.redraw(this) })
    };
    c.prototype.update = function() {
        this.onresize();
        this.drawScale()
    };
    c.prototype.limits = function(i, g) {
        if (!this.settings.smooth) {
            var h = this.settings.step * 100 / (this.settings.interval);
            i = Math.round(i / h) * h
        }
        var f = this.o.pointers[1 - g.uid];
        if (f && g.uid && i < f.value.prc) { i = f.value.prc }
        if (f && !g.uid && i > f.value.prc) { i = f.value.prc }
        if (i < 0) { i = 0 }
        if (i > 100) { i = 100 }
        return Math.round(i * 10) / 10
    };
    c.prototype.redraw = function(f) {
        if (!this.is.init) { return false }
        this.setValue();
        if (this.o.pointers[0] && this.o.pointers[1]) { this.o.value.css({ left: this.o.pointers[0].value.prc + "%", width: (this.o.pointers[1].value.prc - this.o.pointers[0].value.prc) + "%" }) }
        this.o.labels[f.uid].value.html(this.nice(f.value.origin));
        this.redrawLabels(f)
    };
    c.prototype.redrawLabels = function(i) {
        function l(n, p, o) {
            p.margin = -p.label / 2;
            label_left = p.border + p.margin;
            if (label_left < 0) { p.margin -= label_left }
            if (p.border + p.label / 2 > k.sizes.domWidth) {
                p.margin = 0;
                p.right = true
            } else { p.right = false }
            n.o.css({ left: o + "%", marginLeft: p.margin, right: "auto" });
            if (p.right) { n.o.css({ left: "auto", right: 0 }) }
            return p
        }
        var k = this;
        var h = this.o.labels[i.uid];
        var j = i.value.prc;
        var m = { label: h.o.outerWidth(), right: false, border: (j * this.sizes.domWidth) / 100 };
        if (!this.settings.single) {
            var f = this.o.pointers[1 - i.uid];
            var g = this.o.labels[f.uid];
            switch (i.uid) {
                case 0:
                    if (m.border + m.label / 2 > g.o.offset().left - this.sizes.domOffset.left) {
                        g.o.css({ visibility: "hidden" });
                        g.value.html(this.nice(f.value.origin));
                        h.o.css({ visibility: "visible" });
                        j = (f.value.prc - j) / 2 + j;
                        if (f.value.prc != i.value.prc) {
                            h.value.html(this.nice(i.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(f.value.origin));
                            m.label = h.o.outerWidth();
                            m.border = (j * this.sizes.domWidth) / 100
                        }
                    } else { g.o.css({ visibility: "visible" }) }
                    break;
                case 1:
                    if (m.border - m.label / 2 < g.o.offset().left - this.sizes.domOffset.left + g.o.outerWidth()) {
                        g.o.css({ visibility: "hidden" });
                        g.value.html(this.nice(f.value.origin));
                        h.o.css({ visibility: "visible" });
                        j = (j - f.value.prc) / 2 + f.value.prc;
                        if (f.value.prc != i.value.prc) {
                            h.value.html(this.nice(f.value.origin) + "&nbsp;&ndash;&nbsp;" + this.nice(i.value.origin));
                            m.label = h.o.outerWidth();
                            m.border = (j * this.sizes.domWidth) / 100
                        }
                    } else { g.o.css({ visibility: "visible" }) }
                    break
            }
        }
        m = l(h, m, j);
        if (g) {
            var m = { label: g.o.outerWidth(), right: false, border: (f.value.prc * this.sizes.domWidth) / 100 };
            m = l(g, m, f.value.prc)
        }
        this.redrawLimits()
    };
    c.prototype.redrawLimits = function() { if (this.settings.limits) { var k = [true, true]; for (key in this.o.pointers) { if (!this.settings.single || key == 0) { var l = this.o.pointers[key]; var g = this.o.labels[l.uid]; var h = g.o.offset().left - this.sizes.domOffset.left; var j = this.o.limits[0]; if (h < j.outerWidth()) { k[0] = false } var j = this.o.limits[1]; if (h + g.o.outerWidth() > this.sizes.domWidth - j.outerWidth()) { k[1] = false } } } for (var f = 0; f < k.length; f++) { if (k[f]) { this.o.limits[f].fadeIn("fast") } else { this.o.limits[f].fadeOut("fast") } } } };
    c.prototype.setValue = function() {
        var f = this.getValue();
        this.inputNode.attr("value", f);
        this.onstatechange.call(this, f)
    };
    c.prototype.getValue = function() {
        if (!this.is.init) { return false }
        var f = this;
        var g = "";
        a.each(this.o.pointers, function(h) { if (this.value.prc != undefined && !isNaN(this.value.prc)) { g += (h > 0 ? ";" : "") + f.prcToValue(this.value.prc) } });
        return g
    };
    c.prototype.getPrcValue = function() {
        if (!this.is.init) { return false }
        var f = this;
        var g = "";
        a.each(this.o.pointers, function(h) { if (this.value.prc != undefined && !isNaN(this.value.prc)) { g += (h > 0 ? ";" : "") + this.value.prc } });
        return g
    };
    c.prototype.prcToValue = function(l) {
        if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
            var j = this.settings.heterogeneity;
            var g = 0;
            var f = this.settings.from;
            for (var k = 0; k <= j.length; k++) {
                if (j[k]) { var m = j[k].split("/") } else { var m = [100, this.settings.to] }
                m[0] = new Number(m[0]);
                m[1] = new Number(m[1]);
                if (l >= g && l <= m[0]) { var n = f + ((l - g) * (m[1] - f)) / (m[0] - g) }
                g = m[0];
                f = m[1]
            }
        } else { var n = this.settings.from + (l * this.settings.interval) / 100 }
        return this.round(n)
    };
    c.prototype.valueToPrc = function(o, l) {
        if (this.settings.heterogeneity && this.settings.heterogeneity.length > 0) {
            var j = this.settings.heterogeneity;
            var g = 0;
            var f = this.settings.from;
            for (var k = 0; k <= j.length; k++) {
                if (j[k]) { var n = j[k].split("/") } else { var n = [100, this.settings.to] }
                n[0] = new Number(n[0]);
                n[1] = new Number(n[1]);
                if (o >= f && o <= n[1]) { var m = l.limits(g + (o - f) * (n[0] - g) / (n[1] - f)) }
                g = n[0];
                f = n[1]
            }
        } else { var m = l.limits((o - this.settings.from) * 100 / this.settings.interval) }
        return m
    };
    c.prototype.round = function(f) { f = Math.round(f / this.settings.step) * this.settings.step; if (this.settings.round) { f = Math.round(f * Math.pow(10, this.settings.round)) / Math.pow(10, this.settings.round) } else { f = Math.round(f) } return f };
    c.prototype.nice = function(f) { f = f.toString().replace(/,/gi, ".").replace(/ /gi, ""); if (a.formatNumber) { return a.formatNumber(new Number(f), this.settings.format || {}).replace(/-/gi, "&minus;") } else { return new Number(f) } };

    function d() { Draggable.apply(this, arguments) }
    d.prototype = new Draggable();
    d.prototype.oninit = function(h, g, f) {
        this.uid = g;
        this.parent = f;
        this.value = {};
        this.settings = this.parent.settings
    };
    d.prototype.onmousedown = function(f) {
        this._parent = { offset: this.parent.domNode.offset(), width: this.parent.domNode.width() };
        this.ptr.addDependClass("hover");
        this.setIndexOver()
    };
    d.prototype.onmousemove = function(g, h) {
        var f = this._getPageCoords(g);
        this._set(this.calc(f.x))
    };
    d.prototype.onmouseup = function(f) {
        if (this.parent.settings.callback && a.isFunction(this.parent.settings.callback)) { this.parent.settings.callback.call(this.parent, this.parent.getValue()) }
        this.ptr.removeDependClass("hover")
    };
    d.prototype.setIndexOver = function() {
        this.parent.setPointersIndex(1);
        this.index(2)
    };
    d.prototype.index = function(f) { this.ptr.css({ zIndex: f }) };
    d.prototype.limits = function(f) { return this.parent.limits(f, this) };
    d.prototype.calc = function(f) { var g = this.limits(((f - this._parent.offset.left) * 100) / this._parent.width); return g };
    d.prototype.set = function(g, f) {
        this.value.origin = this.parent.round(g);
        this._set(this.parent.valueToPrc(g, this), f)
    };
    d.prototype._set = function(g, f) {
        if (!f) { this.value.origin = this.parent.prcToValue(g) }
        this.value.prc = g;
        this.ptr.css({ left: g + "%" });
        this.parent.redraw(this)
    }
})(jQuery);