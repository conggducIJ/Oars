(function(a) {
    function b() { this._init.apply(this, arguments) }
    b.prototype.oninit = function() {};
    b.prototype.events = function() {};
    b.prototype.onmousedown = function() { this.ptr.css({ position: "absolute" }) };
    b.prototype.onmousemove = function(c, d, e) { this.ptr.css({ left: d, top: e }) };
    b.prototype.onmouseup = function() {};
    b.prototype.isDefault = { drag: false, clicked: false, toclick: true, mouseup: false };
    b.prototype._init = function() {
        if (arguments.length > 0) {
            this.ptr = a(arguments[0]);
            this.outer = a(".draggable-outer");
            this.is = {};
            a.extend(this.is, this.isDefault);
            var c = this.ptr.offset();
            this.d = { left: c.left, top: c.top, width: this.ptr.width(), height: this.ptr.height() };
            this.oninit.apply(this, arguments);
            this._events()
        }
    };
    b.prototype._getPageCoords = function(c) { if (c.targetTouches && c.targetTouches[0]) { return { x: c.targetTouches[0].pageX, y: c.targetTouches[0].pageY } } else { return { x: c.pageX, y: c.pageY } } };
    b.prototype._bindEvent = function(e, c, d) { var f = this; if (this.supportTouches_) { e.get(0).addEventListener(this.events_[c], d, false) } else { e.bind(this.events_[c], d) } };
    b.prototype._events = function() {
        var c = this;
        this.supportTouches_ = "ontouchend" in document;
        this.events_ = { click: this.supportTouches_ ? "touchstart" : "click", down: this.supportTouches_ ? "touchstart" : "mousedown", move: this.supportTouches_ ? "touchmove" : "mousemove", up: this.supportTouches_ ? "touchend" : "mouseup" };
        this._bindEvent(a(document), "move", function(d) {
            if (c.is.drag) {
                d.stopPropagation();
                d.preventDefault();
                c._mousemove(d)
            }
        });
        this._bindEvent(a(document), "down", function(d) {
            if (c.is.drag) {
                d.stopPropagation();
                d.preventDefault()
            }
        });
        this._bindEvent(a(document), "up", function(d) { c._mouseup(d) });
        this._bindEvent(this.ptr, "down", function(d) { c._mousedown(d); return false });
        this._bindEvent(this.ptr, "up", function(d) { c._mouseup(d) });
        this.ptr.find("a").click(function() { c.is.clicked = true; if (!c.is.toclick) { c.is.toclick = true; return false } }).mousedown(function(d) { c._mousedown(d); return false });
        this.events()
    };
    b.prototype._mousedown = function(e) {
        this.is.drag = true;
        this.is.clicked = false;
        this.is.mouseup = false;
        var c = this.ptr.offset();
        var d = this._getPageCoords(e);
        this.cx = d.x - c.left;
        this.cy = d.y - c.top;
        a.extend(this.d, { left: c.left, top: c.top, width: this.ptr.width(), height: this.ptr.height() });
        if (this.outer && this.outer.get(0)) { this.outer.css({ height: Math.max(this.outer.height(), a(document.body).height()), overflow: "hidden" }) }
        this.onmousedown(e)
    };
    b.prototype._mousemove = function(d) {
        this.is.toclick = false;
        var c = this._getPageCoords(d);
        this.onmousemove(d, c.x - this.cx, c.y - this.cy)
    };
    b.prototype._mouseup = function(c) {
        var d = this;
        if (this.is.drag) {
            this.is.drag = false;
            if (this.outer && this.outer.get(0)) { if (a.browser.mozilla) { this.outer.css({ overflow: "hidden" }) } else { this.outer.css({ overflow: "visible" }) } if (a.browser.msie && a.browser.version == "6.0") { this.outer.css({ height: "100%" }) } else { this.outer.css({ height: "auto" }) } }
            this.onmouseup(c)
        }
    };
    window.Draggable = b
})(jQuery);