(function(a, p, b, o) {
    var c, n, d;
    c = { start: 0, startX: 0, startY: 0, current: 0, currentX: 0, currentY: 0, offsetX: 0, offsetY: 0, distance: null, startTime: 0, endTime: 0, updatedX: 0, targetEl: null };
    n = { isTouch: false, isScrolling: false, isSwiping: false, direction: false, inMotion: false };
    d = { _onDragStart: null, _onDragMove: null, _onDragEnd: null, _transitionEnd: null, _resizer: null, _responsiveCall: null, _goToLoop: null, _checkVisibile: null };

    function m(e, q) {
        this.settings = null;
        this.options = a.extend({}, m.Defaults, q);
        this.$element = a(e);
        this.drag = a.extend({}, c);
        this.state = a.extend({}, n);
        this.e = a.extend({}, d);
        this._plugins = {};
        this._supress = {};
        this._current = null;
        this._speed = null;
        this._coordinates = [];
        this._breakpoint = null;
        this._width = null;
        this._items = [];
        this._clones = [];
        this._mergers = [];
        this._invalidated = {};
        this._pipe = [];
        a.each(m.Plugins, a.proxy(function(r, s) { this._plugins[r[0].toLowerCase() + r.slice(1)] = new s(this) }, this));
        a.each(m.Pipe, a.proxy(function(r, s) { this._pipe.push({ filter: s.filter, run: a.proxy(s.run, this) }) }, this));
        this.setup();
        this.initialize()
    }
    m.Defaults = { items: 3, loop: false, center: false, mouseDrag: true, touchDrag: true, pullDrag: true, freeDrag: false, margin: 0, stagePadding: 0, merge: false, mergeFit: true, autoWidth: false, startPosition: 0, rtl: false, smartSpeed: 250, fluidSpeed: false, dragEndSpeed: false, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: p, responsiveClass: false, fallbackEasing: "swing", info: false, nestedItemSelector: false, itemElement: "div", stageElement: "div", themeClass: "owl-theme", baseClass: "owl-carousel", itemClass: "owl-item", centerClass: "center", activeClass: "active" };
    m.Width = { Default: "default", Inner: "inner", Outer: "outer" };
    m.Plugins = {};
    m.Pipe = [{ filter: ["width", "items", "settings"], run: function(e) { e.current = this._items && this._items[this.relative(this._current)] } }, {
        filter: ["items", "settings"],
        run: function() {
            var e = this._clones,
                q = this.$stage.children(".cloned");
            if (q.length !== e.length || (!this.settings.loop && e.length > 0)) {
                this.$stage.children(".cloned").remove();
                this._clones = []
            }
        }
    }, {
        filter: ["items", "settings"],
        run: function() {
            var r, t, e = this._clones,
                s = this._items,
                q = this.settings.loop ? e.length - Math.max(this.settings.items * 2, 4) : 0;
            for (r = 0, t = Math.abs(q / 2); r < t; r++) {
                if (q > 0) {
                    this.$stage.children().eq(s.length + e.length - 1).remove();
                    e.pop();
                    this.$stage.children().eq(0).remove();
                    e.pop()
                } else {
                    e.push(e.length / 2);
                    this.$stage.append(s[e[e.length - 1]].clone().addClass("cloned"));
                    e.push(s.length - 1 - (e.length - 1) / 2);
                    this.$stage.prepend(s[e[e.length - 1]].clone().addClass("cloned"))
                }
            }
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            var t = (this.settings.rtl ? 1 : -1),
                u = (this.width() / this.settings.items).toFixed(3),
                e = 0,
                r, q, s;
            this._coordinates = [];
            for (q = 0, s = this._clones.length + this._items.length; q < s; q++) {
                r = this._mergers[this.relative(q)];
                r = (this.settings.mergeFit && Math.min(r, this.settings.items)) || r;
                e += (this.settings.autoWidth ? this._items[this.relative(q)].width() + this.settings.margin : u * r) * t;
                this._coordinates.push(e)
            }
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function() {
            var q, r, s = (this.width() / this.settings.items).toFixed(3),
                e = { width: Math.abs(this._coordinates[this._coordinates.length - 1]) + this.settings.stagePadding * 2, "padding-left": this.settings.stagePadding || "", "padding-right": this.settings.stagePadding || "" };
            this.$stage.css(e);
            e = { width: this.settings.autoWidth ? "auto" : s - this.settings.margin };
            e[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin;
            if (!this.settings.autoWidth && a.grep(this._mergers, function(t) { return t > 1 }).length > 0) {
                for (q = 0, r = this._coordinates.length; q < r; q++) {
                    e.width = Math.abs(this._coordinates[q]) - Math.abs(this._coordinates[q - 1] || 0) - this.settings.margin;
                    this.$stage.children().eq(q).css(e)
                }
            } else { this.$stage.children().css(e) }
        }
    }, { filter: ["width", "items", "settings"], run: function(e) { e.current && this.reset(this.$stage.children().index(e.current)) } }, { filter: ["position"], run: function() { this.animate(this.coordinates(this._current)) } }, {
        filter: ["width", "position", "items", "settings"],
        run: function() {
            var x = this.settings.rtl ? 1 : -1,
                w = this.settings.stagePadding * 2,
                e = this.coordinates(this.current()) + w,
                q = e + this.width() * x,
                s, v, t = [],
                r, u;
            for (r = 0, u = this._coordinates.length; r < u; r++) {
                s = this._coordinates[r - 1] || 0;
                v = Math.abs(this._coordinates[r]) + w * x;
                if ((this.op(s, "<=", e) && (this.op(s, ">", q))) || (this.op(v, "<", e) && this.op(v, ">", q))) { t.push(r) }
            }
            this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass);
            this.$stage.children(":eq(" + t.join("), :eq(") + ")").addClass(this.settings.activeClass);
            if (this.settings.center) {
                this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass);
                this.$stage.children().eq(this.current()).addClass(this.settings.centerClass)
            }
        }
    }];
    m.prototype.initialize = function() {
        this.trigger("initialize");
        this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl);
        this.browserSupport();
        if (this.settings.autoWidth && this.state.imagesLoaded !== true) {
            var e, q, r;
            e = this.$element.find("img");
            q = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : o;
            r = this.$element.children(q).width();
            if (e.length && r <= 0) { this.preloadAutoWidthImages(e); return false }
        }
        this.$element.addClass("owl-loading");
        this.$stage = a("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">');
        this.$element.append(this.$stage.parent());
        this.replace(this.$element.children().not(this.$stage.parent()));
        this._width = this.$element.width();
        this.refresh();
        this.$element.removeClass("owl-loading").addClass("owl-loaded");
        this.eventsCall();
        this.internalEvents();
        this.addTriggerableEvents();
        this.trigger("initialized")
    };
    m.prototype.setup = function() {
        var s = this.viewport(),
            q = this.options.responsive,
            e = -1,
            r = null;
        if (!q) { r = a.extend({}, this.options) } else {
            a.each(q, function(t) { if (t <= s && t > e) { e = Number(t) } });
            r = a.extend({}, this.options, q[e]);
            delete r.responsive;
            if (r.responsiveClass) { this.$element.attr("class", function(u, t) { return t.replace(/\b owl-responsive-\S+/g, "") }).addClass("owl-responsive-" + e) }
        }
        if (this.settings === null || this._breakpoint !== e) {
            this.trigger("change", { property: { name: "settings", value: r } });
            this._breakpoint = e;
            this.settings = r;
            this.invalidate("settings");
            this.trigger("changed", { property: { name: "settings", value: this.settings } })
        }
    };
    m.prototype.optionsLogic = function() {
        this.$element.toggleClass("owl-center", this.settings.center);
        if (this.settings.loop && this._items.length < this.settings.items) { this.settings.loop = false }
        if (this.settings.autoWidth) {
            this.settings.stagePadding = false;
            this.settings.merge = false
        }
    };
    m.prototype.prepare = function(q) {
        var e = this.trigger("prepare", { content: q });
        if (!e.data) { e.data = a("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(q) }
        this.trigger("prepared", { content: e.data });
        return e.data
    };
    m.prototype.update = function() {
        var r = 0,
            s = this._pipe.length,
            q = a.proxy(function(t) { return this[t] }, this._invalidated),
            e = {};
        while (r < s) {
            if (this._invalidated.all || a.grep(this._pipe[r].filter, q).length > 0) { this._pipe[r].run(e) }
            r++
        }
        this._invalidated = {}
    };
    m.prototype.width = function(e) {
        e = e || m.Width.Default;
        switch (e) {
            case m.Width.Inner:
            case m.Width.Outer:
                return this._width;
            default:
                return this._width - this.settings.stagePadding * 2 + this.settings.margin
        }
    };
    m.prototype.refresh = function() {
        if (this._items.length === 0) { return false }
        var e = new Date().getTime();
        this.trigger("refresh");
        this.setup();
        this.optionsLogic();
        this.$stage.addClass("owl-refresh");
        this.update();
        this.$stage.removeClass("owl-refresh");
        this.state.orientation = p.orientation;
        this.watchVisibility();
        this.trigger("refreshed")
    };
    m.prototype.eventsCall = function() {
        this.e._onDragStart = a.proxy(function(q) { this.onDragStart(q) }, this);
        this.e._onDragMove = a.proxy(function(q) { this.onDragMove(q) }, this);
        this.e._onDragEnd = a.proxy(function(q) { this.onDragEnd(q) }, this);
        this.e._onResize = a.proxy(function(q) { this.onResize(q) }, this);
        this.e._transitionEnd = a.proxy(function(q) { this.transitionEnd(q) }, this);
        this.e._preventClick = a.proxy(function(q) { this.preventClick(q) }, this)
    };
    m.prototype.onThrottledResize = function() {
        p.clearTimeout(this.resizeTimer);
        this.resizeTimer = p.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate)
    };
    m.prototype.onResize = function() {
        if (!this._items.length) { return false }
        if (this._width === this.$element.width()) { return false }
        if (this.trigger("resize").isDefaultPrevented()) { return false }
        this._width = this.$element.width();
        this.invalidate("width");
        this.refresh();
        this.trigger("resized")
    };
    m.prototype.eventsRouter = function(e) { var q = e.type; if (q === "mousedown" || q === "touchstart") { this.onDragStart(e) } else { if (q === "mousemove" || q === "touchmove") { this.onDragMove(e) } else { if (q === "mouseup" || q === "touchend") { this.onDragEnd(e) } else { if (q === "touchcancel") { this.onDragEnd(e) } } } } };
    m.prototype.internalEvents = function() {
        var e = i(),
            q = j();
        if (this.settings.mouseDrag) {
            this.$stage.on("mousedown", a.proxy(function(r) { this.eventsRouter(r) }, this));
            this.$stage.on("dragstart", function() { return false });
            this.$stage.get(0).onselectstart = function() { return false }
        } else { this.$element.addClass("owl-text-select-on") }
        if (this.settings.touchDrag && !q) { this.$stage.on("touchstart touchcancel", a.proxy(function(r) { this.eventsRouter(r) }, this)) }
        if (this.transitionEndVendor) { this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, false) }
        if (this.settings.responsive !== false) { this.on(p, "resize", a.proxy(this.onThrottledResize, this)) }
    };
    m.prototype.onDragStart = function(r) {
        var q, s, t, u, e;
        q = r.originalEvent || r || p.event;
        if (q.which === 3 || this.state.isTouch) { return false }
        if (q.type === "mousedown") { this.$stage.addClass("owl-grab") }
        this.trigger("drag");
        this.drag.startTime = new Date().getTime();
        this.speed(0);
        this.state.isTouch = true;
        this.state.isScrolling = false;
        this.state.isSwiping = false;
        this.drag.distance = 0;
        t = f(q).x;
        u = f(q).y;
        this.drag.offsetX = this.$stage.position().left;
        this.drag.offsetY = this.$stage.position().top;
        if (this.settings.rtl) { this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin }
        if (this.state.inMotion && this.support3d) {
            e = this.getTransformProperty();
            this.drag.offsetX = e;
            this.animate(e);
            this.state.inMotion = true
        } else { if (this.state.inMotion && !this.support3d) { this.state.inMotion = false; return false } }
        this.drag.startX = t - this.drag.offsetX;
        this.drag.startY = u - this.drag.offsetY;
        this.drag.start = t - this.drag.startX;
        this.drag.targetEl = q.target || q.srcElement;
        this.drag.updatedX = this.drag.start;
        if (this.drag.targetEl.tagName === "IMG" || this.drag.targetEl.tagName === "A") { this.drag.targetEl.draggable = false }
        a(b).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", a.proxy(function(v) { this.eventsRouter(v) }, this))
    };
    m.prototype.onDragMove = function(q) {
        var e, r, u, v, t, s, w;
        if (!this.state.isTouch) { return }
        if (this.state.isScrolling) { return }
        e = q.originalEvent || q || p.event;
        u = f(e).x;
        v = f(e).y;
        this.drag.currentX = u - this.drag.startX;
        this.drag.currentY = v - this.drag.startY;
        this.drag.distance = this.drag.currentX - this.drag.offsetX;
        if (this.drag.distance < 0) { this.state.direction = this.settings.rtl ? "right" : "left" } else { if (this.drag.distance > 0) { this.state.direction = this.settings.rtl ? "left" : "right" } }
        if (this.settings.loop) { if (this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && this.state.direction === "right") { this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) } else { if (this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && this.state.direction === "left") { this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) } } } else {
            t = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum());
            s = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum());
            w = this.settings.pullDrag ? this.drag.distance / 5 : 0;
            this.drag.currentX = Math.max(Math.min(this.drag.currentX, t + w), s + w)
        }
        if ((this.drag.distance > 8 || this.drag.distance < -8)) {
            if (e.preventDefault !== o) { e.preventDefault() } else { e.returnValue = false }
            this.state.isSwiping = true
        }
        this.drag.updatedX = this.drag.currentX;
        if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) {
            this.state.isScrolling = true;
            this.drag.updatedX = this.drag.start
        }
        this.animate(this.drag.updatedX)
    };
    m.prototype.onDragEnd = function(s) {
        var q, r, e;
        if (!this.state.isTouch) { return }
        if (s.type === "mouseup") { this.$stage.removeClass("owl-grab") }
        this.trigger("dragged");
        this.drag.targetEl.removeAttribute("draggable");
        this.state.isTouch = false;
        this.state.isScrolling = false;
        this.state.isSwiping = false;
        if (this.drag.distance === 0 && this.state.inMotion !== true) { this.state.inMotion = false; return false }
        this.drag.endTime = new Date().getTime();
        q = this.drag.endTime - this.drag.startTime;
        r = Math.abs(this.drag.distance);
        if (r > 3 || q > 300) { this.removeClick(this.drag.targetEl) }
        e = this.closest(this.drag.updatedX);
        this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed);
        this.current(e);
        this.invalidate("position");
        this.update();
        if (!this.settings.pullDrag && this.drag.updatedX === this.coordinates(e)) { this.transitionEnd() }
        this.drag.distance = 0;
        a(b).off(".owl.dragEvents")
    };
    m.prototype.removeClick = function(e) {
        this.drag.targetEl = e;
        a(e).on("click.preventClick", this.e._preventClick);
        p.setTimeout(function() { a(e).off("click.preventClick") }, 300)
    };
    m.prototype.preventClick = function(e) {
        if (e.preventDefault) { e.preventDefault() } else { e.returnValue = false }
        if (e.stopPropagation) { e.stopPropagation() }
        a(e.target).off("click.preventClick")
    };
    m.prototype.getTransformProperty = function() {
        var q, e;
        q = p.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform");
        q = q.replace(/matrix(3d)?\(|\)/g, "").split(",");
        e = q.length === 16;
        return e !== true ? q[4] : q[12]
    };
    m.prototype.closest = function(e) {
        var r = -1,
            s = 30,
            t = this.width(),
            q = this.coordinates();
        if (!this.settings.freeDrag) { a.each(q, a.proxy(function(u, v) { if (e > v - s && e < v + s) { r = u } else { if (this.op(e, "<", v) && this.op(e, ">", q[u + 1] || v - t)) { r = this.state.direction === "left" ? u + 1 : u } } return r === -1 }, this)) }
        if (!this.settings.loop) { if (this.op(e, ">", q[this.minimum()])) { r = e = this.minimum() } else { if (this.op(e, "<", q[this.maximum()])) { r = e = this.maximum() } } }
        return r
    };
    m.prototype.animate = function(e) {
        this.trigger("translate");
        this.state.inMotion = this.speed() > 0;
        if (this.support3d) { this.$stage.css({ transform: "translate3d(" + e + "px,0px, 0px)", transition: (this.speed() / 1000) + "s" }) } else { if (this.state.isTouch) { this.$stage.css({ left: e + "px" }) } else { this.$stage.animate({ left: e }, this.speed() / 1000, this.settings.fallbackEasing, a.proxy(function() { if (this.state.inMotion) { this.transitionEnd() } }, this)) } }
    };
    m.prototype.current = function(q) {
        if (q === o) { return this._current }
        if (this._items.length === 0) { return o }
        q = this.normalize(q);
        if (this._current !== q) {
            var e = this.trigger("change", { property: { name: "position", value: q } });
            if (e.data !== o) { q = this.normalize(e.data) }
            this._current = q;
            this.invalidate("position");
            this.trigger("changed", { property: { name: "position", value: this._current } })
        }
        return this._current
    };
    m.prototype.invalidate = function(e) { this._invalidated[e] = true };
    m.prototype.reset = function(e) {
        e = this.normalize(e);
        if (e === o) { return }
        this._speed = 0;
        this._current = e;
        this.suppress(["translate", "translated"]);
        this.animate(this.coordinates(e));
        this.release(["translate", "translated"])
    };
    m.prototype.normalize = function(q, r) { var e = (r ? this._items.length : this._items.length + this._clones.length); if (!a.isNumeric(q) || e < 1) { return o } if (this._clones.length) { q = ((q % e) + e) % e } else { q = Math.max(this.minimum(r), Math.min(this.maximum(r), q)) } return q };
    m.prototype.relative = function(e) {
        e = this.normalize(e);
        e = e - this._clones.length / 2;
        return this.normalize(e, true)
    };
    m.prototype.maximum = function(s) {
        var r, u, q = 0,
            e, t = this.settings;
        if (s) { return this._items.length - 1 }
        if (!t.loop && t.center) { r = this._items.length - 1 } else {
            if (!t.loop && !t.center) { r = this._items.length - t.items } else {
                if (t.loop || t.center) { r = this._items.length + t.items } else {
                    if (t.autoWidth || t.merge) {
                        revert = t.rtl ? 1 : -1;
                        u = this.$stage.width() - this.$element.width();
                        while (e = this.coordinates(q)) {
                            if (e * revert >= u) { break }
                            r = ++q
                        }
                    } else { throw "Can not detect maximum absolute position." }
                }
            }
        }
        return r
    };
    m.prototype.minimum = function(e) { if (e) { return 0 } return this._clones.length / 2 };
    m.prototype.items = function(e) {
        if (e === o) { return this._items.slice() }
        e = this.normalize(e, true);
        return this._items[e]
    };
    m.prototype.mergers = function(e) {
        if (e === o) { return this._mergers.slice() }
        e = this.normalize(e, true);
        return this._mergers[e]
    };
    m.prototype.clones = function(s) {
        var r = this._clones.length / 2,
            e = r + this._items.length,
            q = function(t) { return t % 2 === 0 ? e + t / 2 : r - (t + 1) / 2 };
        if (s === o) { return a.map(this._clones, function(u, t) { return q(t) }) }
        return a.map(this._clones, function(u, t) { return u === s ? q(t) : null })
    };
    m.prototype.speed = function(e) { if (e !== o) { this._speed = e } return this._speed };
    m.prototype.coordinates = function(q) {
        var e = null;
        if (q === o) { return a.map(this._coordinates, a.proxy(function(r, s) { return this.coordinates(s) }, this)) }
        if (this.settings.center) {
            e = this._coordinates[q];
            e += (this.width() - e + (this._coordinates[q - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)
        } else { e = this._coordinates[q - 1] || 0 }
        return e
    };
    m.prototype.duration = function(q, r, e) { return Math.min(Math.max(Math.abs(r - q), 1), 6) * Math.abs((e || this.settings.smartSpeed)) };
    m.prototype.to = function(u, w) {
        if (this.settings.loop) {
            var s = u - this.relative(this.current()),
                v = this.current(),
                q = this.current(),
                e = this.current() + s,
                r = q - e < 0 ? true : false,
                t = this._clones.length + this._items.length;
            if (e < this.settings.items && r === false) {
                v = q + this._items.length;
                this.reset(v)
            } else {
                if (e >= t - this.settings.items && r === true) {
                    v = q - this._items.length;
                    this.reset(v)
                }
            }
            p.clearTimeout(this.e._goToLoop);
            this.e._goToLoop = p.setTimeout(a.proxy(function() {
                this.speed(this.duration(this.current(), v + s, w));
                this.current(v + s);
                this.update()
            }, this), 30)
        } else {
            this.speed(this.duration(this.current(), u, w));
            this.current(u);
            this.update()
        }
    };
    m.prototype.next = function(e) {
        e = e || false;
        this.to(this.relative(this.current()) + 1, e)
    };
    m.prototype.prev = function(e) {
        e = e || false;
        this.to(this.relative(this.current()) - 1, e)
    };
    m.prototype.transitionEnd = function(e) {
        if (e !== o) { e.stopPropagation(); if ((e.target || e.srcElement || e.originalTarget) !== this.$stage.get(0)) { return false } }
        this.state.inMotion = false;
        this.trigger("translated")
    };
    m.prototype.viewport = function() { var e; if (this.options.responsiveBaseElement !== p) { e = a(this.options.responsiveBaseElement).width() } else { if (p.innerWidth) { e = p.innerWidth } else { if (b.documentElement && b.documentElement.clientWidth) { e = b.documentElement.clientWidth } else { throw "Can not detect viewport width." } } } return e };
    m.prototype.replace = function(e) {
        this.$stage.empty();
        this._items = [];
        if (e) { e = (e instanceof jQuery) ? e : a(e) }
        if (this.settings.nestedItemSelector) { e = e.find("." + this.settings.nestedItemSelector) }
        e.filter(function() { return this.nodeType === 1 }).each(a.proxy(function(q, r) {
            r = this.prepare(r);
            this.$stage.append(r);
            this._items.push(r);
            this._mergers.push(r.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") * 1 || 1)
        }, this));
        this.reset(a.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0);
        this.invalidate("items")
    };
    m.prototype.add = function(e, q) {
        q = q === o ? this._items.length : this.normalize(q, true);
        this.trigger("add", { content: e, position: q });
        if (this._items.length === 0 || q === this._items.length) {
            this.$stage.append(e);
            this._items.push(e);
            this._mergers.push(e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") * 1 || 1)
        } else {
            this._items[q].before(e);
            this._items.splice(q, 0, e);
            this._mergers.splice(q, 0, e.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") * 1 || 1)
        }
        this.invalidate("items");
        this.trigger("added", { content: e, position: q })
    };
    m.prototype.remove = function(e) {
        e = this.normalize(e, true);
        if (e === o) { return }
        this.trigger("remove", { content: this._items[e], position: e });
        this._items[e].remove();
        this._items.splice(e, 1);
        this._mergers.splice(e, 1);
        this.invalidate("items");
        this.trigger("removed", { content: null, position: e })
    };
    m.prototype.addTriggerableEvents = function() {
        var e = a.proxy(function(q, r) {
            return a.proxy(function(s) {
                if (s.relatedTarget !== this) {
                    this.suppress([r]);
                    q.apply(this, [].slice.call(arguments, 1));
                    this.release([r])
                }
            }, this)
        }, this);
        a.each({ next: this.next, prev: this.prev, to: this.to, destroy: this.destroy, refresh: this.refresh, replace: this.replace, add: this.add, remove: this.remove }, a.proxy(function(r, q) { this.$element.on(r + ".owl.carousel", e(q, r + ".owl.carousel")) }, this))
    };
    m.prototype.watchVisibility = function() {
        if (!q(this.$element.get(0))) {
            this.$element.addClass("owl-hidden");
            p.clearInterval(this.e._checkVisibile);
            this.e._checkVisibile = p.setInterval(a.proxy(e, this), 500)
        }

        function q(r) { return r.offsetWidth > 0 && r.offsetHeight > 0 }

        function e() {
            if (q(this.$element.get(0))) {
                this.$element.removeClass("owl-hidden");
                this.refresh();
                p.clearInterval(this.e._checkVisibile)
            }
        }
    };
    m.prototype.preloadAutoWidthImages = function(r) {
        var s, t, e, q;
        s = 0;
        t = this;
        r.each(function(v, u) {
            e = a(u);
            q = new Image();
            q.onload = function() {
                s++;
                e.attr("src", q.src);
                e.css("opacity", 1);
                if (s >= r.length) {
                    t.state.imagesLoaded = true;
                    t.initialize()
                }
            };
            q.src = e.attr("src") || e.attr("data-src") || e.attr("data-src-retina")
        })
    };
    m.prototype.destroy = function() {
        if (this.$element.hasClass(this.settings.themeClass)) { this.$element.removeClass(this.settings.themeClass) }
        if (this.settings.responsive !== false) { a(p).off("resize.owl.carousel") }
        if (this.transitionEndVendor) { this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd) }
        for (var e in this._plugins) { this._plugins[e].destroy() }
        if (this.settings.mouseDrag || this.settings.touchDrag) {
            this.$stage.off("mousedown touchstart touchcancel");
            a(b).off(".owl.dragEvents");
            this.$stage.get(0).onselectstart = function() {};
            this.$stage.off("dragstart", function() { return false })
        }
        this.$element.off(".owl");
        this.$stage.children(".cloned").remove();
        this.e = null;
        this.$element.removeData("owlCarousel");
        this.$stage.children().contents().unwrap();
        this.$stage.children().unwrap();
        this.$stage.unwrap()
    };
    m.prototype.op = function(e, r, q) {
        var s = this.settings.rtl;
        switch (r) {
            case "<":
                return s ? e > q : e < q;
            case ">":
                return s ? e < q : e > q;
            case ">=":
                return s ? e <= q : e >= q;
            case "<=":
                return s ? e >= q : e <= q;
            default:
                break
        }
    };
    m.prototype.on = function(q, r, s, e) { if (q.addEventListener) { q.addEventListener(r, s, e) } else { if (q.attachEvent) { q.attachEvent("on" + r, s) } } };
    m.prototype.off = function(q, r, s, e) { if (q.removeEventListener) { q.removeEventListener(r, s, e) } else { if (q.detachEvent) { q.detachEvent("on" + r, s) } } };
    m.prototype.trigger = function(s, e, t) {
        var u = { item: { count: this._items.length, index: this.current() } },
            r = a.camelCase(a.grep(["on", s, t], function(w) { return w }).join("-").toLowerCase()),
            q = a.Event([s, "owl", t || "carousel"].join(".").toLowerCase(), a.extend({ relatedTarget: this }, u, e));
        if (!this._supress[s]) {
            a.each(this._plugins, function(v, w) { if (w.onTrigger) { w.onTrigger(q) } });
            this.$element.trigger(q);
            if (this.settings && typeof this.settings[r] === "function") { this.settings[r].apply(this, q) }
        }
        return q
    };
    m.prototype.suppress = function(e) { a.each(e, a.proxy(function(r, q) { this._supress[q] = true }, this)) };
    m.prototype.release = function(e) { a.each(e, a.proxy(function(r, q) { delete this._supress[q] }, this)) };
    m.prototype.browserSupport = function() {
        this.support3d = g();
        if (this.support3d) {
            this.transformVendor = k();
            var e = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"];
            this.transitionEndVendor = e[l()];
            this.vendorName = this.transformVendor.replace(/Transform/i, "");
            this.vendorName = this.vendorName !== "" ? "-" + this.vendorName.toLowerCase() + "-" : ""
        }
        this.state.orientation = p.orientation
    };

    function f(e) { if (e.touches !== o) { return { x: e.touches[0].pageX, y: e.touches[0].pageY } } if (e.touches === o) { if (e.pageX !== o) { return { x: e.pageX, y: e.pageY } } if (e.pageX === o) { return { x: e.clientX, y: e.clientY } } } }

    function h(e) {
        var t, u, q = b.createElement("div"),
            r = e;
        for (t in r) { u = r[t]; if (typeof q.style[u] !== "undefined") { q = null; return [u, t] } }
        return [false]
    }

    function l() { return h(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1] }

    function k() { return h(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0] }

    function g() { return h(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0] }

    function i() { return "ontouchstart" in p || !!(navigator.msMaxTouchPoints) }

    function j() { return p.navigator.msPointerEnabled }
    a.fn.owlCarousel = function(e) { return this.each(function() { if (!a(this).data("owlCarousel")) { a(this).data("owlCarousel", new m(this, e)) } }) };
    a.fn.owlCarousel.Constructor = m
})(window.Zepto || window.jQuery, window, document);
(function(a, e, b, d) {
    var c = function(f) {
        this._core = f;
        this._loaded = [];
        this._handlers = {
            "initialized.owl.carousel change.owl.carousel": a.proxy(function(h) {
                if (!h.namespace) { return }
                if (!this._core.settings || !this._core.settings.lazyLoad) { return }
                if ((h.property && h.property.name == "position") || h.type == "initialized") {
                    var o = this._core.settings,
                        l = (o.center && Math.ceil(o.items / 2) || o.items),
                        j = ((o.center && l * -1) || 0),
                        m = ((h.property && h.property.value) || this._core.current()) + j,
                        g = this._core.clones().length,
                        k = a.proxy(function(n, p) { this.load(p) }, this);
                    while (j++ < l) {
                        this.load(g / 2 + this._core.relative(m));
                        g && a.each(this._core.clones(this._core.relative(m++)), k)
                    }
                }
            }, this)
        };
        this._core.options = a.extend({}, c.Defaults, this._core.options);
        this._core.$element.on(this._handlers)
    };
    c.Defaults = { lazyLoad: false };
    c.prototype.load = function(h) {
        var g = this._core.$stage.children().eq(h),
            f = g && g.find(".owl-lazy");
        if (!f || a.inArray(g.get(0), this._loaded) > -1) { return }
        f.each(a.proxy(function(l, j) {
            var i = a(j),
                k, m = (e.devicePixelRatio > 1 && i.attr("data-src-retina")) || i.attr("data-src");
            this._core.trigger("load", { element: i, url: m }, "lazy");
            if (i.is("img")) {
                i.one("load.owl.lazy", a.proxy(function() {
                    i.css("opacity", 1);
                    this._core.trigger("loaded", { element: i, url: m }, "lazy")
                }, this)).attr("src", m)
            } else {
                k = new Image();
                k.onload = a.proxy(function() {
                    i.css({ "background-image": "url(" + m + ")", opacity: "1" });
                    this._core.trigger("loaded", { element: i, url: m }, "lazy")
                }, this);
                k.src = m
            }
        }, this));
        this._loaded.push(g.get(0))
    };
    c.prototype.destroy = function() { var f, g; for (f in this.handlers) { this._core.$element.off(f, this.handlers[f]) } for (g in Object.getOwnPropertyNames(this)) { typeof this[g] != "function" && (this[g] = null) } };
    a.fn.owlCarousel.Constructor.Plugins.Lazy = c
})(window.Zepto || window.jQuery, window, document);
(function(a, e, c, d) {
    var b = function(f) {
        this._core = f;
        this._handlers = { "initialized.owl.carousel": a.proxy(function() { if (this._core.settings.autoHeight) { this.update() } }, this), "changed.owl.carousel": a.proxy(function(g) { if (this._core.settings.autoHeight && g.property.name == "position") { this.update() } }, this), "loaded.owl.lazy": a.proxy(function(g) { if (this._core.settings.autoHeight && g.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current())) { this.update() } }, this) };
        this._core.options = a.extend({}, b.Defaults, this._core.options);
        this._core.$element.on(this._handlers)
    };
    b.Defaults = { autoHeight: false, autoHeightClass: "owl-height" };
    b.prototype.update = function() { this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass) };
    b.prototype.destroy = function() { var f, g; for (f in this._handlers) { this._core.$element.off(f, this._handlers[f]) } for (g in Object.getOwnPropertyNames(this)) { typeof this[g] != "function" && (this[g] = null) } };
    a.fn.owlCarousel.Constructor.Plugins.AutoHeight = b
})(window.Zepto || window.jQuery, window, document);
(function(a, e, b, c) {
    var d = function(f) {
        this._core = f;
        this._videos = {};
        this._playing = null;
        this._fullscreen = false;
        this._handlers = {
            "resize.owl.carousel": a.proxy(function(g) { if (this._core.settings.video && !this.isInFullScreen()) { g.preventDefault() } }, this),
            "refresh.owl.carousel changed.owl.carousel": a.proxy(function(g) { if (this._playing) { this.stop() } }, this),
            "prepared.owl.carousel": a.proxy(function(h) {
                var g = a(h.content).find(".owl-video");
                if (g.length) {
                    g.css("display", "none");
                    this.fetch(g, a(h.content))
                }
            }, this)
        };
        this._core.options = a.extend({}, d.Defaults, this._core.options);
        this._core.$element.on(this._handlers);
        this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function(g) { this.play(g) }, this))
    };
    d.Defaults = { video: false, videoHeight: false, videoWidth: false };
    d.prototype.fetch = function(i, h) {
        var j = i.attr("data-vimeo-id") ? "vimeo" : "youtube",
            g = i.attr("data-vimeo-id") || i.attr("data-youtube-id"),
            l = i.attr("data-width") || this._core.settings.videoWidth,
            f = i.attr("data-height") || this._core.settings.videoHeight,
            k = i.attr("href");
        if (k) {
            g = k.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
            if (g[3].indexOf("youtu") > -1) { j = "youtube" } else { if (g[3].indexOf("vimeo") > -1) { j = "vimeo" } else { throw new Error("Video URL not supported.") } }
            g = g[6]
        } else { throw new Error("Missing video URL.") }
        this._videos[k] = { type: j, id: g, width: l, height: f };
        h.attr("data-video", k);
        this.thumbnail(i, this._videos[k])
    };
    d.prototype.thumbnail = function(n, p) {
        var o, i, k, h = p.width && p.height ? 'style="width:' + p.width + "px;height:" + p.height + 'px;"' : "",
            g = n.find("img"),
            m = "src",
            j = "",
            l = this._core.settings,
            f = function(q) {
                i = '<div class="owl-video-play-icon"></div>';
                if (l.lazyLoad) { o = '<div class="owl-video-tn ' + j + '" ' + m + '="' + q + '"></div>' } else { o = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + q + ')"></div>' }
                n.after(o);
                n.after(i)
            };
        n.wrap('<div class="owl-video-wrapper"' + h + "></div>");
        if (this._core.settings.lazyLoad) {
            m = "data-src";
            j = "owl-lazy"
        }
        if (g.length) {
            f(g.attr(m));
            g.remove();
            return false
        }
        if (p.type === "youtube") {
            k = "http://img.youtube.com/vi/" + p.id + "/hqdefault.jpg";
            f(k)
        } else {
            if (p.type === "vimeo") {
                a.ajax({
                    type: "GET",
                    url: "http://vimeo.com/api/v2/video/" + p.id + ".json",
                    jsonp: "callback",
                    dataType: "jsonp",
                    success: function(q) {
                        k = q[0].thumbnail_large;
                        f(k)
                    }
                })
            }
        }
    };
    d.prototype.stop = function() {
        this._core.trigger("stop", null, "video");
        this._playing.find(".owl-video-frame").remove();
        this._playing.removeClass("owl-video-playing");
        this._playing = null
    };
    d.prototype.play = function(f) {
        this._core.trigger("play", null, "video");
        if (this._playing) { this.stop() }
        var j = a(f.target || f.srcElement),
            i = j.closest("." + this._core.settings.itemClass),
            k = this._videos[i.attr("data-video")],
            l = k.width || "100%",
            g = k.height || this._core.$stage.height(),
            h, m;
        if (k.type === "youtube") { h = '<iframe width="' + l + '" height="' + g + '" src="http://www.youtube.com/embed/' + k.id + "?autoplay=1&v=" + k.id + '" frameborder="0" allowfullscreen></iframe>' } else { if (k.type === "vimeo") { h = '<iframe src="http://player.vimeo.com/video/' + k.id + '?autoplay=1" width="' + l + '" height="' + g + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>' } }
        i.addClass("owl-video-playing");
        this._playing = i;
        m = a('<div style="height:' + g + "px; width:" + l + 'px" class="owl-video-frame">' + h + "</div>");
        j.after(m)
    };
    d.prototype.isInFullScreen = function() {
        var f = b.fullscreenElement || b.mozFullScreenElement || b.webkitFullscreenElement;
        if (f && a(f).parent().hasClass("owl-video-frame")) {
            this._core.speed(0);
            this._fullscreen = true
        }
        if (f && this._fullscreen && this._playing) { return false }
        if (this._fullscreen) { this._fullscreen = false; return false }
        if (this._playing) { if (this._core.state.orientation !== e.orientation) { this._core.state.orientation = e.orientation; return false } }
        return true
    };
    d.prototype.destroy = function() {
        var f, g;
        this._core.$element.off("click.owl.video");
        for (f in this._handlers) { this._core.$element.off(f, this._handlers[f]) }
        for (g in Object.getOwnPropertyNames(this)) { typeof this[g] != "function" && (this[g] = null) }
    };
    a.fn.owlCarousel.Constructor.Plugins.Video = d
})(window.Zepto || window.jQuery, window, document);
(function(a, e, c, d) {
    var b = function(f) {
        this.core = f;
        this.core.options = a.extend({}, b.Defaults, this.core.options);
        this.swapping = true;
        this.previous = d;
        this.next = d;
        this.handlers = {
            "change.owl.carousel": a.proxy(function(g) {
                if (g.property.name == "position") {
                    this.previous = this.core.current();
                    this.next = g.property.value
                }
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function(g) { this.swapping = g.type == "translated" }, this),
            "translate.owl.carousel": a.proxy(function(g) { if (this.swapping && (this.core.options.animateOut || this.core.options.animateIn)) { this.swap() } }, this)
        };
        this.core.$element.on(this.handlers)
    };
    b.Defaults = { animateOut: false, animateIn: false };
    b.prototype.swap = function() {
        if (this.core.settings.items !== 1 || !this.core.support3d) { return }
        this.core.speed(0);
        var h, f = a.proxy(this.clear, this),
            k = this.core.$stage.children().eq(this.previous),
            i = this.core.$stage.children().eq(this.next),
            g = this.core.settings.animateIn,
            j = this.core.settings.animateOut;
        if (this.core.current() === this.previous) { return }
        if (j) {
            h = this.core.coordinates(this.previous) - this.core.coordinates(this.next);
            k.css({ left: h + "px" }).addClass("animated owl-animated-out").addClass(j).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", f)
        }
        if (g) { i.addClass("animated owl-animated-in").addClass(g).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", f) }
    };
    b.prototype.clear = function(f) {
        a(f.target).css({ left: "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut);
        this.core.transitionEnd()
    };
    b.prototype.destroy = function() { var f, g; for (f in this.handlers) { this.core.$element.off(f, this.handlers[f]) } for (g in Object.getOwnPropertyNames(this)) { typeof this[g] != "function" && (this[g] = null) } };
    a.fn.owlCarousel.Constructor.Plugins.Animate = b
})(window.Zepto || window.jQuery, window, document);
(function(a, e, c, d) {
    var b = function(f) {
        this.core = f;
        this.core.options = a.extend({}, b.Defaults, this.core.options);
        this.handlers = { "translated.owl.carousel refreshed.owl.carousel": a.proxy(function() { this.autoplay() }, this), "play.owl.autoplay": a.proxy(function(g, i, h) { this.play(i, h) }, this), "stop.owl.autoplay": a.proxy(function() { this.stop() }, this), "mouseover.owl.autoplay": a.proxy(function() { if (this.core.settings.autoplayHoverPause) { this.pause() } }, this), "mouseleave.owl.autoplay": a.proxy(function() { if (this.core.settings.autoplayHoverPause) { this.autoplay() } }, this) };
        this.core.$element.on(this.handlers)
    };
    b.Defaults = { autoplay: false, autoplayTimeout: 5000, autoplayHoverPause: false, autoplaySpeed: false };
    b.prototype.autoplay = function() {
        if (this.core.settings.autoplay && !this.core.state.videoPlay) {
            e.clearInterval(this.interval);
            this.interval = e.setInterval(a.proxy(function() { this.play() }, this), this.core.settings.autoplayTimeout)
        } else { e.clearInterval(this.interval) }
    };
    b.prototype.play = function(g, f) {
        if (c.hidden === true) { return }
        if (this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion) { return }
        if (this.core.settings.autoplay === false) { e.clearInterval(this.interval); return }
        this.core.next(this.core.settings.autoplaySpeed)
    };
    b.prototype.stop = function() { e.clearInterval(this.interval) };
    b.prototype.pause = function() { e.clearInterval(this.interval) };
    b.prototype.destroy = function() {
        var f, g;
        e.clearInterval(this.interval);
        for (f in this.handlers) { this.core.$element.off(f, this.handlers[f]) }
        for (g in Object.getOwnPropertyNames(this)) { typeof this[g] != "function" && (this[g] = null) }
    };
    a.fn.owlCarousel.Constructor.Plugins.autoplay = b
})(window.Zepto || window.jQuery, window, document);
(function(a, e, b, d) {
    var c = function(f) {
        this._core = f;
        this._initialized = false;
        this._pages = [];
        this._controls = {};
        this._templates = [];
        this.$element = this._core.$element;
        this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to };
        this._handlers = {
            "prepared.owl.carousel": a.proxy(function(g) { if (this._core.settings.dotsData) { this._templates.push(a(g.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot")) } }, this),
            "add.owl.carousel": a.proxy(function(g) { if (this._core.settings.dotsData) { this._templates.splice(g.position, 0, a(g.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot")) } }, this),
            "remove.owl.carousel prepared.owl.carousel": a.proxy(function(g) { if (this._core.settings.dotsData) { this._templates.splice(g.position, 1) } }, this),
            "change.owl.carousel": a.proxy(function(h) {
                if (h.property.name == "position") {
                    if (!this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
                        var g = this._core.current(),
                            i = this._core.maximum(),
                            j = this._core.minimum();
                        h.data = h.property.value > i ? g >= i ? j : i : h.property.value < j ? i : h.property.value
                    }
                }
            }, this),
            "changed.owl.carousel": a.proxy(function(g) { if (g.property.name == "position") { this.draw() } }, this),
            "refreshed.owl.carousel": a.proxy(function() {
                if (!this._initialized) {
                    this.initialize();
                    this._initialized = true
                }
                this._core.trigger("refresh", null, "navigation");
                this.update();
                this.draw();
                this._core.trigger("refreshed", null, "navigation")
            }, this)
        };
        this._core.options = a.extend({}, c.Defaults, this._core.options);
        this.$element.on(this._handlers)
    };
    c.Defaults = { nav: false, navRewind: true, navText: ["prev", "next"], navSpeed: false, navElement: "div", navContainer: false, navContainerClass: "owl-nav", navClass: ["owl-prev", "owl-next"], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: true, dotsEach: false, dotData: false, dotsSpeed: false, dotsContainer: false, controlsClass: "owl-controls" };
    c.prototype.initialize = function() {
        var f, h, g = this._core.settings;
        if (!g.dotsData) { this._templates = [a("<div>").addClass(g.dotClass).append(a("<span>")).prop("outerHTML")] }
        if (!g.navContainer || !g.dotsContainer) { this._controls.$container = a("<div>").addClass(g.controlsClass).appendTo(this.$element) }
        this._controls.$indicators = g.dotsContainer ? a(g.dotsContainer) : a("<div>").hide().addClass(g.dotsClass).appendTo(this._controls.$container);
        this._controls.$indicators.on("click", "div", a.proxy(function(i) {
            var j = a(i.target).parent().is(this._controls.$indicators) ? a(i.target).index() : a(i.target).parent().index();
            i.preventDefault();
            this.to(j, g.dotsSpeed)
        }, this));
        f = g.navContainer ? a(g.navContainer) : a("<div>").addClass(g.navContainerClass).prependTo(this._controls.$container);
        this._controls.$next = a("<" + g.navElement + ">");
        this._controls.$previous = this._controls.$next.clone();
        this._controls.$previous.addClass(g.navClass[0]).html(g.navText[0]).hide().prependTo(f).on("click", a.proxy(function(i) { this.prev(g.navSpeed) }, this));
        this._controls.$next.addClass(g.navClass[1]).html(g.navText[1]).hide().appendTo(f).on("click", a.proxy(function(i) { this.next(g.navSpeed) }, this));
        for (h in this._overrides) { this._core[h] = a.proxy(this[h], this) }
    };
    c.prototype.destroy = function() { var g, f, i, h; for (g in this._handlers) { this.$element.off(g, this._handlers[g]) } for (f in this._controls) { this._controls[f].remove() } for (h in this.overides) { this._core[h] = this._overrides[h] } for (i in Object.getOwnPropertyNames(this)) { typeof this[i] != "function" && (this[i] = null) } };
    c.prototype.update = function() {
        var f, g, h, m = this._core.settings,
            l = this._core.clones().length / 2,
            o = l + this._core.items().length,
            n = m.center || m.autoWidth || m.dotData ? 1 : m.dotsEach || m.items;
        if (m.slideBy !== "page") { m.slideBy = Math.min(m.slideBy, m.items) }
        if (m.dots || m.slideBy == "page") {
            this._pages = [];
            for (f = l, g = 0, h = 0; f < o; f++) {
                if (g >= n || g === 0) {
                    this._pages.push({ start: f - l, end: f - l + n - 1 });
                    g = 0, ++h
                }
                g += this._core.mergers(this._core.relative(f))
            }
        }
    };
    c.prototype.draw = function() {
        var g, j, h = "",
            l = this._core.settings,
            f = this._core.$stage.children(),
            k = this._core.relative(this._core.current());
        if (l.nav && !l.loop && !l.navRewind) {
            this._controls.$previous.toggleClass("disabled", k <= 0);
            this._controls.$next.toggleClass("disabled", k >= this._core.maximum())
        }
        this._controls.$previous.toggle(l.nav);
        this._controls.$next.toggle(l.nav);
        if (l.dots) {
            g = this._pages.length - this._controls.$indicators.children().length;
            if (l.dotData && g !== 0) {
                for (j = 0; j < this._controls.$indicators.children().length; j++) { h += this._templates[this._core.relative(j)] }
                this._controls.$indicators.html(h)
            } else {
                if (g > 0) {
                    h = new Array(g + 1).join(this._templates[0]);
                    this._controls.$indicators.append(h)
                } else { if (g < 0) { this._controls.$indicators.children().slice(g).remove() } }
            }
            this._controls.$indicators.find(".active").removeClass("active");
            this._controls.$indicators.children().eq(a.inArray(this.current(), this._pages)).addClass("active")
        }
        this._controls.$indicators.toggle(l.dots)
    };
    c.prototype.onTrigger = function(f) {
        var g = this._core.settings;
        f.page = { index: a.inArray(this.current(), this._pages), count: this._pages.length, size: g && (g.center || g.autoWidth || g.dotData ? 1 : g.dotsEach || g.items) }
    };
    c.prototype.current = function() { var f = this._core.relative(this._core.current()); return a.grep(this._pages, function(g) { return g.start <= f && g.end >= f }).pop() };
    c.prototype.getPosition = function(i) {
        var h, f, g = this._core.settings;
        if (g.slideBy == "page") {
            h = a.inArray(this.current(), this._pages);
            f = this._pages.length;
            i ? ++h : --h;
            h = this._pages[((h % f) + f) % f].start
        } else {
            h = this._core.relative(this._core.current());
            f = this._core.items().length;
            i ? h += g.slideBy : h -= g.slideBy
        }
        return h
    };
    c.prototype.next = function(f) { a.proxy(this._overrides.to, this._core)(this.getPosition(true), f) };
    c.prototype.prev = function(f) { a.proxy(this._overrides.to, this._core)(this.getPosition(false), f) };
    c.prototype.to = function(g, h, i) {
        var f;
        if (!i) {
            f = this._pages.length;
            a.proxy(this._overrides.to, this._core)(this._pages[((g % f) + f) % f].start, h)
        } else { a.proxy(this._overrides.to, this._core)(g, h) }
    };
    a.fn.owlCarousel.Constructor.Plugins.Navigation = c
})(window.Zepto || window.jQuery, window, document);
(function(a, e, b, d) {
    var c = function(f) {
        this._core = f;
        this._hashes = {};
        this.$element = this._core.$element;
        this._handlers = {
            "initialized.owl.carousel": a.proxy(function() { if (this._core.settings.startPosition == "URLHash") { a(e).trigger("hashchange.owl.navigation") } }, this),
            "prepared.owl.carousel": a.proxy(function(g) {
                var h = a(g.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
                this._hashes[h] = g.content
            }, this)
        };
        this._core.options = a.extend({}, c.Defaults, this._core.options);
        this.$element.on(this._handlers);
        a(e).on("hashchange.owl.navigation", a.proxy(function() {
            var g = e.location.hash.substring(1),
                h = this._core.$stage.children(),
                i = this._hashes[g] && h.index(this._hashes[g]) || 0;
            if (!g) { return false }
            this._core.to(i, false, true)
        }, this))
    };
    c.Defaults = { URLhashListener: false };
    c.prototype.destroy = function() {
        var f, g;
        a(e).off("hashchange.owl.navigation");
        for (f in this._handlers) { this._core.$element.off(f, this._handlers[f]) }
        for (g in Object.getOwnPropertyNames(this)) { typeof this[g] != "function" && (this[g] = null) }
    };
    a.fn.owlCarousel.Constructor.Plugins.Hash = c
})(window.Zepto || window.jQuery, window, document);