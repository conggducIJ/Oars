if (typeof Object.create !== "function") {
    Object.create = function(b) {
        function a() {}
        a.prototype = b;
        return new a()
    }
}(function(a, e, b, d) {
    var c = {
        init: function(g, f) {
            var h = this;
            h.elem = f;
            h.$elem = a(f);
            h.imageSrc = h.$elem.data("zoom-image") ? h.$elem.data("zoom-image") : h.$elem.attr("src");
            h.options = a.extend({}, a.fn.elevateZoom.options, g);
            if (h.options.tint) { h.options.lensColour = "none", h.options.lensOpacity = "1" }
            if (h.options.zoomType == "inner") { h.options.showLens = false }
            h.$elem.parent().removeAttr("title").removeAttr("alt");
            h.zoomImage = h.imageSrc;
            h.refresh(1);
            a("#" + h.options.gallery + " a").click(function(i) {
                if (h.options.galleryActiveClass) {
                    a("#" + h.options.gallery + " a").removeClass(h.options.galleryActiveClass);
                    a(this).addClass(h.options.galleryActiveClass)
                }
                i.preventDefault();
                if (a(this).data("zoom-image")) { h.zoomImagePre = a(this).data("zoom-image") } else { h.zoomImagePre = a(this).data("image") }
                h.swaptheimage(a(this).data("image"), h.zoomImagePre);
                return false
            })
        },
        refresh: function(f) {
            var g = this;
            setTimeout(function() { g.fetch(g.imageSrc) }, f || g.options.refresh)
        },
        fetch: function(f) {
            var h = this;
            var g = new Image();
            g.onload = function() {
                h.largeWidth = g.width;
                h.largeHeight = g.height;
                h.startZoom();
                h.currentImage = h.imageSrc;
                h.options.onZoomedImageLoaded(h.$elem)
            };
            g.src = f;
            return
        },
        startZoom: function() {
            var g = this;
            g.nzWidth = g.$elem.width();
            g.nzHeight = g.$elem.height();
            g.isWindowActive = false;
            g.isLensActive = false;
            g.isTintActive = false;
            g.overWindow = false;
            if (g.options.imageCrossfade) {
                g.zoomWrap = g.$elem.wrap('<div style="height:' + g.nzHeight + "px;width:" + g.nzWidth + 'px;" class="zoomWrapper" />');
                g.$elem.css("position", "absolute")
            }
            g.zoomLock = 1;
            g.scrollingLock = false;
            g.changeBgSize = false;
            g.currentZoomLevel = g.options.zoomLevel;
            g.nzOffset = g.$elem.offset();
            g.widthRatio = (g.largeWidth / g.currentZoomLevel) / g.nzWidth;
            g.heightRatio = (g.largeHeight / g.currentZoomLevel) / g.nzHeight;
            if (g.options.zoomType == "window") { g.zoomWindowStyle = "overflow: hidden;background-position: 0px 0px;text-align:center;background-color: " + String(g.options.zoomWindowBgColour) + ";width: " + String(g.options.zoomWindowWidth) + "px;height: " + String(g.options.zoomWindowHeight) + "px;float: left;background-size: " + g.largeWidth / g.currentZoomLevel + "px " + g.largeHeight / g.currentZoomLevel + "px;display: none;z-index:100;border: " + String(g.options.borderSize) + "px solid " + g.options.borderColour + ";background-repeat: no-repeat;position: absolute;" }
            if (g.options.zoomType == "inner") {
                var f = g.$elem.css("border-left-width");
                g.zoomWindowStyle = "overflow: hidden;margin-left: " + String(f) + ";margin-top: " + String(f) + ";background-position: 0px 0px;width: " + String(g.nzWidth) + "px;height: " + String(g.nzHeight) + "px;px;float: left;display: none;cursor:" + (g.options.cursor) + ";px solid " + g.options.borderColour + ";background-repeat: no-repeat;position: absolute;"
            }
            if (g.options.zoomType == "window") {
                if (g.nzHeight < g.options.zoomWindowWidth / g.widthRatio) { lensHeight = g.nzHeight } else { lensHeight = String((g.options.zoomWindowHeight / g.heightRatio)) }
                if (g.largeWidth < g.options.zoomWindowWidth) { lensWidth = g.nzWidth } else { lensWidth = (g.options.zoomWindowWidth / g.widthRatio) }
                g.lensStyle = "background-position: 0px 0px;width: " + String((g.options.zoomWindowWidth) / g.widthRatio) + "px;height: " + String((g.options.zoomWindowHeight) / g.heightRatio) + "px;float: right;display: none;overflow: hidden;z-index: 999;-webkit-transform: translateZ(0);opacity:" + (g.options.lensOpacity) + ";filter: alpha(opacity = " + (g.options.lensOpacity * 100) + "); zoom:1;width:" + lensWidth + "px;height:" + lensHeight + "px;background-color:" + (g.options.lensColour) + ";cursor:" + (g.options.cursor) + ";border: " + (g.options.lensBorderSize) + "px solid " + (g.options.lensBorderColour) + ";background-repeat: no-repeat;position: absolute;"
            }
            g.tintStyle = "display: block;position: absolute;background-color: " + g.options.tintColour + ";filter:alpha(opacity=0);opacity: 0;width: " + g.nzWidth + "px;height: " + g.nzHeight + "px;";
            g.lensRound = "";
            if (g.options.zoomType == "lens") { g.lensStyle = "background-position: 0px 0px;float: left;display: none;border: " + String(g.options.borderSize) + "px solid " + g.options.borderColour + ";width:" + String(g.options.lensSize) + "px;height:" + String(g.options.lensSize) + "px;background-repeat: no-repeat;position: absolute;" }
            if (g.options.lensShape == "round") { g.lensRound = "border-top-left-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;border-top-right-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;border-bottom-left-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;border-bottom-right-radius: " + String(g.options.lensSize / 2 + g.options.borderSize) + "px;" }
            g.zoomContainer = a('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:' + g.nzOffset.left + "px;top:" + g.nzOffset.top + "px;height:" + g.nzHeight + "px;width:" + g.nzWidth + 'px;"></div>');
            a("body").append(g.zoomContainer);
            if (g.options.containLensZoom && g.options.zoomType == "lens") { g.zoomContainer.css("overflow", "hidden") }
            if (g.options.zoomType != "inner") {
                g.zoomLens = a("<div class='zoomLens' style='" + g.lensStyle + g.lensRound + "'>&nbsp;</div>").appendTo(g.zoomContainer).click(function() { g.$elem.trigger("click") });
                if (g.options.tint) {
                    g.tintContainer = a("<div/>").addClass("tintContainer");
                    g.zoomTint = a("<div class='zoomTint' style='" + g.tintStyle + "'></div>");
                    g.zoomLens.wrap(g.tintContainer);
                    g.zoomTintcss = g.zoomLens.after(g.zoomTint);
                    g.zoomTintImage = a('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: ' + g.nzWidth + "px; height: " + g.nzHeight + 'px;" src="' + g.imageSrc + '">').appendTo(g.zoomLens).click(function() { g.$elem.trigger("click") })
                }
            }
            if (isNaN(g.options.zoomWindowPosition)) { g.zoomWindow = a("<div style='z-index:999;left:" + (g.windowOffsetLeft) + "px;top:" + (g.windowOffsetTop) + "px;" + g.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo("body").click(function() { g.$elem.trigger("click") }) } else { g.zoomWindow = a("<div style='z-index:999;left:" + (g.windowOffsetLeft) + "px;top:" + (g.windowOffsetTop) + "px;" + g.zoomWindowStyle + "' class='zoomWindow'>&nbsp;</div>").appendTo(g.zoomContainer).click(function() { g.$elem.trigger("click") }) }
            g.zoomWindowContainer = a("<div/>").addClass("zoomWindowContainer").css("width", g.options.zoomWindowWidth);
            g.zoomWindow.wrap(g.zoomWindowContainer);
            if (g.options.zoomType == "lens") { g.zoomLens.css({ backgroundImage: "url('" + g.imageSrc + "')" }) }
            if (g.options.zoomType == "window") { g.zoomWindow.css({ backgroundImage: "url('" + g.imageSrc + "')" }) }
            if (g.options.zoomType == "inner") { g.zoomWindow.css({ backgroundImage: "url('" + g.imageSrc + "')" }) }
            g.$elem.bind("touchmove", function(h) {
                h.preventDefault();
                var i = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0];
                g.setPosition(i)
            });
            g.zoomContainer.bind("touchmove", function(h) {
                if (g.options.zoomType == "inner") { g.showHideWindow("show") }
                h.preventDefault();
                var i = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0];
                g.setPosition(i)
            });
            g.zoomContainer.bind("touchend", function(h) { g.showHideWindow("hide"); if (g.options.showLens) { g.showHideLens("hide") } if (g.options.tint && g.options.zoomType != "inner") { g.showHideTint("hide") } });
            g.$elem.bind("touchend", function(h) { g.showHideWindow("hide"); if (g.options.showLens) { g.showHideLens("hide") } if (g.options.tint && g.options.zoomType != "inner") { g.showHideTint("hide") } });
            if (g.options.showLens) {
                g.zoomLens.bind("touchmove", function(h) {
                    h.preventDefault();
                    var i = h.originalEvent.touches[0] || h.originalEvent.changedTouches[0];
                    g.setPosition(i)
                });
                g.zoomLens.bind("touchend", function(h) { g.showHideWindow("hide"); if (g.options.showLens) { g.showHideLens("hide") } if (g.options.tint && g.options.zoomType != "inner") { g.showHideTint("hide") } })
            }
            g.$elem.bind("mousemove", function(h) {
                if (g.overWindow == false) { g.setElements("show") }
                if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
                    g.setPosition(h);
                    g.currentLoc = h
                }
                g.lastX = h.clientX;
                g.lastY = h.clientY
            });
            g.zoomContainer.bind("mousemove", function(h) {
                if (g.overWindow == false) { g.setElements("show") }
                if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
                    g.setPosition(h);
                    g.currentLoc = h
                }
                g.lastX = h.clientX;
                g.lastY = h.clientY
            });
            if (g.options.zoomType != "inner") {
                g.zoomLens.bind("mousemove", function(h) {
                    if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
                        g.setPosition(h);
                        g.currentLoc = h
                    }
                    g.lastX = h.clientX;
                    g.lastY = h.clientY
                })
            }
            if (g.options.tint && g.options.zoomType != "inner") {
                g.zoomTint.bind("mousemove", function(h) {
                    if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
                        g.setPosition(h);
                        g.currentLoc = h
                    }
                    g.lastX = h.clientX;
                    g.lastY = h.clientY
                })
            }
            if (g.options.zoomType == "inner") {
                g.zoomWindow.bind("mousemove", function(h) {
                    if (g.lastX !== h.clientX || g.lastY !== h.clientY) {
                        g.setPosition(h);
                        g.currentLoc = h
                    }
                    g.lastX = h.clientX;
                    g.lastY = h.clientY
                })
            }
            g.zoomContainer.add(g.$elem).mouseenter(function() { if (g.overWindow == false) { g.setElements("show") } }).mouseleave(function() {
                if (!g.scrollLock) {
                    g.setElements("hide");
                    g.options.onDestroy(g.$elem)
                }
            });
            if (g.options.zoomType != "inner") {
                g.zoomWindow.mouseenter(function() {
                    g.overWindow = true;
                    g.setElements("hide")
                }).mouseleave(function() { g.overWindow = false })
            }
            if (g.options.zoomLevel != 1) {}
            if (g.options.minZoomLevel) { g.minZoomLevel = g.options.minZoomLevel } else { g.minZoomLevel = g.options.scrollZoomIncrement * 2 }
            if (g.options.scrollZoom) {
                g.zoomContainer.add(g.$elem).bind("mousewheel DOMMouseScroll MozMousePixelScroll", function(h) {
                    g.scrollLock = true;
                    clearTimeout(a.data(this, "timer"));
                    a.data(this, "timer", setTimeout(function() { g.scrollLock = false }, 250));
                    var i = h.originalEvent.wheelDelta || h.originalEvent.detail * -1;
                    h.stopImmediatePropagation();
                    h.stopPropagation();
                    h.preventDefault();
                    if (i / 120 > 0) { if (g.currentZoomLevel >= g.minZoomLevel) { g.changeZoomLevel(g.currentZoomLevel - g.options.scrollZoomIncrement) } } else { if (g.options.maxZoomLevel) { if (g.currentZoomLevel <= g.options.maxZoomLevel) { g.changeZoomLevel(parseFloat(g.currentZoomLevel) + g.options.scrollZoomIncrement) } } else { g.changeZoomLevel(parseFloat(g.currentZoomLevel) + g.options.scrollZoomIncrement) } }
                    return false
                })
            }
        },
        setElements: function(g) { var f = this; if (!f.options.zoomEnabled) { return false } if (g == "show") { if (f.isWindowSet) { if (f.options.zoomType == "inner") { f.showHideWindow("show") } if (f.options.zoomType == "window") { f.showHideWindow("show") } if (f.options.showLens) { f.showHideLens("show") } if (f.options.tint && f.options.zoomType != "inner") { f.showHideTint("show") } } } if (g == "hide") { if (f.options.zoomType == "window") { f.showHideWindow("hide") } if (!f.options.tint) { f.showHideWindow("hide") } if (f.options.showLens) { f.showHideLens("hide") } if (f.options.tint) { f.showHideTint("hide") } } },
        setPosition: function(f) {
            var g = this;
            if (!g.options.zoomEnabled) { return false }
            g.nzHeight = g.$elem.height();
            g.nzWidth = g.$elem.width();
            g.nzOffset = g.$elem.offset();
            if (g.options.tint && g.options.zoomType != "inner") {
                g.zoomTint.css({ top: 0 });
                g.zoomTint.css({ left: 0 })
            }
            if (g.options.responsive && !g.options.scrollZoom) {
                if (g.options.showLens) {
                    if (g.nzHeight < g.options.zoomWindowWidth / g.widthRatio) { lensHeight = g.nzHeight } else { lensHeight = String((g.options.zoomWindowHeight / g.heightRatio)) }
                    if (g.largeWidth < g.options.zoomWindowWidth) { lensWidth = g.nzWidth } else { lensWidth = (g.options.zoomWindowWidth / g.widthRatio) }
                    g.widthRatio = g.largeWidth / g.nzWidth;
                    g.heightRatio = g.largeHeight / g.nzHeight;
                    if (g.options.zoomType != "lens") {
                        if (g.nzHeight < g.options.zoomWindowWidth / g.widthRatio) { lensHeight = g.nzHeight } else { lensHeight = String((g.options.zoomWindowHeight / g.heightRatio)) }
                        if (g.nzWidth < g.options.zoomWindowHeight / g.heightRatio) { lensWidth = g.nzWidth } else { lensWidth = String((g.options.zoomWindowWidth / g.widthRatio)) }
                        g.zoomLens.css("width", lensWidth);
                        g.zoomLens.css("height", lensHeight);
                        if (g.options.tint) {
                            g.zoomTintImage.css("width", g.nzWidth);
                            g.zoomTintImage.css("height", g.nzHeight)
                        }
                    }
                    if (g.options.zoomType == "lens") { g.zoomLens.css({ width: String(g.options.lensSize) + "px", height: String(g.options.lensSize) + "px" }) }
                }
            }
            g.zoomContainer.css({ top: g.nzOffset.top });
            g.zoomContainer.css({ left: g.nzOffset.left });
            g.mouseLeft = parseInt(f.pageX - g.nzOffset.left);
            g.mouseTop = parseInt(f.pageY - g.nzOffset.top);
            if (g.options.zoomType == "window") {
                g.Etoppos = (g.mouseTop < (g.zoomLens.height() / 2));
                g.Eboppos = (g.mouseTop > g.nzHeight - (g.zoomLens.height() / 2) - (g.options.lensBorderSize * 2));
                g.Eloppos = (g.mouseLeft < 0 + ((g.zoomLens.width() / 2)));
                g.Eroppos = (g.mouseLeft > (g.nzWidth - (g.zoomLens.width() / 2) - (g.options.lensBorderSize * 2)))
            }
            if (g.options.zoomType == "inner") {
                g.Etoppos = (g.mouseTop < ((g.nzHeight / 2) / g.heightRatio));
                g.Eboppos = (g.mouseTop > (g.nzHeight - ((g.nzHeight / 2) / g.heightRatio)));
                g.Eloppos = (g.mouseLeft < 0 + (((g.nzWidth / 2) / g.widthRatio)));
                g.Eroppos = (g.mouseLeft > (g.nzWidth - (g.nzWidth / 2) / g.widthRatio - (g.options.lensBorderSize * 2)))
            }
            if (g.mouseLeft < 0 || g.mouseTop < 0 || g.mouseLeft > g.nzWidth || g.mouseTop > g.nzHeight) { g.setElements("hide"); return } else {
                if (g.options.showLens) {
                    g.lensLeftPos = String(Math.floor(g.mouseLeft - g.zoomLens.width() / 2));
                    g.lensTopPos = String(Math.floor(g.mouseTop - g.zoomLens.height() / 2))
                }
                if (g.Etoppos) { g.lensTopPos = 0 }
                if (g.Eloppos) {
                    g.windowLeftPos = 0;
                    g.lensLeftPos = 0;
                    g.tintpos = 0
                }
                if (g.options.zoomType == "window") { if (g.Eboppos) { g.lensTopPos = Math.max((g.nzHeight) - g.zoomLens.height() - (g.options.lensBorderSize * 2), 0) } if (g.Eroppos) { g.lensLeftPos = (g.nzWidth - (g.zoomLens.width()) - (g.options.lensBorderSize * 2)) } }
                if (g.options.zoomType == "inner") { if (g.Eboppos) { g.lensTopPos = Math.max(((g.nzHeight) - (g.options.lensBorderSize * 2)), 0) } if (g.Eroppos) { g.lensLeftPos = (g.nzWidth - (g.nzWidth) - (g.options.lensBorderSize * 2)) } }
                if (g.options.zoomType == "lens") {
                    g.windowLeftPos = String(((f.pageX - g.nzOffset.left) * g.widthRatio - g.zoomLens.width() / 2) * (-1));
                    g.windowTopPos = String(((f.pageY - g.nzOffset.top) * g.heightRatio - g.zoomLens.height() / 2) * (-1));
                    g.zoomLens.css({ backgroundPosition: g.windowLeftPos + "px " + g.windowTopPos + "px" });
                    if (g.changeBgSize) {
                        if (g.nzHeight > g.nzWidth) {
                            if (g.options.zoomType == "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" }) }
                            g.zoomWindow.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" })
                        } else {
                            if (g.options.zoomType == "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px" }) }
                            g.zoomWindow.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px" })
                        }
                        g.changeBgSize = false
                    }
                    g.setWindowPostition(f)
                }
                if (g.options.tint && g.options.zoomType != "inner") { g.setTintPosition(f) }
                if (g.options.zoomType == "window") { g.setWindowPostition(f) }
                if (g.options.zoomType == "inner") { g.setWindowPostition(f) }
                if (g.options.showLens) {
                    if (g.fullwidth && g.options.zoomType != "lens") { g.lensLeftPos = 0 }
                    g.zoomLens.css({ left: g.lensLeftPos + "px", top: g.lensTopPos + "px" })
                }
            }
        },
        showHideWindow: function(f) {
            var g = this;
            if (f == "show") {
                if (!g.isWindowActive) {
                    if (g.options.zoomWindowFadeIn) { g.zoomWindow.stop(true, true, false).fadeIn(g.options.zoomWindowFadeIn) } else { g.zoomWindow.show() }
                    g.isWindowActive = true
                }
            }
            if (f == "hide") {
                if (g.isWindowActive) {
                    if (g.options.zoomWindowFadeOut) {
                        g.zoomWindow.stop(true, true).fadeOut(g.options.zoomWindowFadeOut, function() {
                            if (g.loop) {
                                clearInterval(g.loop);
                                g.loop = false
                            }
                        })
                    } else { g.zoomWindow.hide() }
                    g.isWindowActive = false
                }
            }
        },
        showHideLens: function(f) {
            var g = this;
            if (f == "show") {
                if (!g.isLensActive) {
                    if (g.options.lensFadeIn) { g.zoomLens.stop(true, true, false).fadeIn(g.options.lensFadeIn) } else { g.zoomLens.show() }
                    g.isLensActive = true
                }
            }
            if (f == "hide") {
                if (g.isLensActive) {
                    if (g.options.lensFadeOut) { g.zoomLens.stop(true, true).fadeOut(g.options.lensFadeOut) } else { g.zoomLens.hide() }
                    g.isLensActive = false
                }
            }
        },
        showHideTint: function(f) {
            var g = this;
            if (f == "show") {
                if (!g.isTintActive) {
                    if (g.options.zoomTintFadeIn) { g.zoomTint.css({ opacity: g.options.tintOpacity }).animate().stop(true, true).fadeIn("slow") } else {
                        g.zoomTint.css({ opacity: g.options.tintOpacity }).animate();
                        g.zoomTint.show()
                    }
                    g.isTintActive = true
                }
            }
            if (f == "hide") {
                if (g.isTintActive) {
                    if (g.options.zoomTintFadeOut) { g.zoomTint.stop(true, true).fadeOut(g.options.zoomTintFadeOut) } else { g.zoomTint.hide() }
                    g.isTintActive = false
                }
            }
        },
        setLensPostition: function(f) {},
        setWindowPostition: function(f) {
            var g = this;
            if (!isNaN(g.options.zoomWindowPosition)) {
                switch (g.options.zoomWindowPosition) {
                    case 1:
                        g.windowOffsetTop = (g.options.zoomWindowOffety);
                        g.windowOffsetLeft = (+g.nzWidth);
                        break;
                    case 2:
                        if (g.options.zoomWindowHeight > g.nzHeight) {
                            g.windowOffsetTop = ((g.options.zoomWindowHeight / 2) - (g.nzHeight / 2)) * (-1);
                            g.windowOffsetLeft = (g.nzWidth)
                        } else {}
                        break;
                    case 3:
                        g.windowOffsetTop = (g.nzHeight - g.zoomWindow.height() - (g.options.borderSize * 2));
                        g.windowOffsetLeft = (g.nzWidth);
                        break;
                    case 4:
                        g.windowOffsetTop = (g.nzHeight);
                        g.windowOffsetLeft = (g.nzWidth);
                        break;
                    case 5:
                        g.windowOffsetTop = (g.nzHeight);
                        g.windowOffsetLeft = (g.nzWidth - g.zoomWindow.width() - (g.options.borderSize * 2));
                        break;
                    case 6:
                        if (g.options.zoomWindowHeight > g.nzHeight) {
                            g.windowOffsetTop = (g.nzHeight);
                            g.windowOffsetLeft = ((g.options.zoomWindowWidth / 2) - (g.nzWidth / 2) + (g.options.borderSize * 2)) * (-1)
                        } else {}
                        break;
                    case 7:
                        g.windowOffsetTop = (g.nzHeight);
                        g.windowOffsetLeft = 0;
                        break;
                    case 8:
                        g.windowOffsetTop = (g.nzHeight);
                        g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
                        break;
                    case 9:
                        g.windowOffsetTop = (g.nzHeight - g.zoomWindow.height() - (g.options.borderSize * 2));
                        g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
                        break;
                    case 10:
                        if (g.options.zoomWindowHeight > g.nzHeight) {
                            g.windowOffsetTop = ((g.options.zoomWindowHeight / 2) - (g.nzHeight / 2)) * (-1);
                            g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1)
                        } else {}
                        break;
                    case 11:
                        g.windowOffsetTop = (g.options.zoomWindowOffety);
                        g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
                        break;
                    case 12:
                        g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);
                        g.windowOffsetLeft = (g.zoomWindow.width() + (g.options.borderSize * 2)) * (-1);
                        break;
                    case 13:
                        g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);
                        g.windowOffsetLeft = (0);
                        break;
                    case 14:
                        if (g.options.zoomWindowHeight > g.nzHeight) {
                            g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);
                            g.windowOffsetLeft = ((g.options.zoomWindowWidth / 2) - (g.nzWidth / 2) + (g.options.borderSize * 2)) * (-1)
                        } else {}
                        break;
                    case 15:
                        g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);
                        g.windowOffsetLeft = (g.nzWidth - g.zoomWindow.width() - (g.options.borderSize * 2));
                        break;
                    case 16:
                        g.windowOffsetTop = (g.zoomWindow.height() + (g.options.borderSize * 2)) * (-1);
                        g.windowOffsetLeft = (g.nzWidth);
                        break;
                    default:
                        g.windowOffsetTop = (g.options.zoomWindowOffety);
                        g.windowOffsetLeft = (g.nzWidth)
                }
            } else {
                g.externalContainer = a("#" + g.options.zoomWindowPosition);
                g.externalContainerWidth = g.externalContainer.width();
                g.externalContainerHeight = g.externalContainer.height();
                g.externalContainerOffset = g.externalContainer.offset();
                g.windowOffsetTop = g.externalContainerOffset.top;
                g.windowOffsetLeft = g.externalContainerOffset.left
            }
            g.isWindowSet = true;
            g.windowOffsetTop = g.windowOffsetTop + g.options.zoomWindowOffety;
            g.windowOffsetLeft = g.windowOffsetLeft + g.options.zoomWindowOffetx;
            g.zoomWindow.css({ top: g.windowOffsetTop });
            g.zoomWindow.css({ left: g.windowOffsetLeft });
            if (g.options.zoomType == "inner") {
                g.zoomWindow.css({ top: 0 });
                g.zoomWindow.css({ left: 0 })
            }
            g.windowLeftPos = String(((f.pageX - g.nzOffset.left) * g.widthRatio - g.zoomWindow.width() / 2) * (-1));
            g.windowTopPos = String(((f.pageY - g.nzOffset.top) * g.heightRatio - g.zoomWindow.height() / 2) * (-1));
            if (g.Etoppos) { g.windowTopPos = 0 }
            if (g.Eloppos) { g.windowLeftPos = 0 }
            if (g.Eboppos) { g.windowTopPos = (g.largeHeight / g.currentZoomLevel - g.zoomWindow.height()) * (-1) }
            if (g.Eroppos) { g.windowLeftPos = ((g.largeWidth / g.currentZoomLevel - g.zoomWindow.width()) * (-1)) }
            if (g.fullheight) { g.windowTopPos = 0 }
            if (g.fullwidth) { g.windowLeftPos = 0 }
            if (g.options.zoomType == "window" || g.options.zoomType == "inner") {
                if (g.zoomLock == 1) { if (g.widthRatio <= 1) { g.windowLeftPos = 0 } if (g.heightRatio <= 1) { g.windowTopPos = 0 } }
                if (g.options.zoomType == "window") { if (g.largeHeight < g.options.zoomWindowHeight) { g.windowTopPos = 0 } if (g.largeWidth < g.options.zoomWindowWidth) { g.windowLeftPos = 0 } }
                if (g.options.easing) {
                    if (!g.xp) { g.xp = 0 }
                    if (!g.yp) { g.yp = 0 }
                    if (!g.loop) {
                        g.loop = setInterval(function() {
                            g.xp += (g.windowLeftPos - g.xp) / g.options.easingAmount;
                            g.yp += (g.windowTopPos - g.yp) / g.options.easingAmount;
                            if (g.scrollingLock) {
                                clearInterval(g.loop);
                                g.xp = g.windowLeftPos;
                                g.yp = g.windowTopPos;
                                g.xp = ((f.pageX - g.nzOffset.left) * g.widthRatio - g.zoomWindow.width() / 2) * (-1);
                                g.yp = (((f.pageY - g.nzOffset.top) * g.heightRatio - g.zoomWindow.height() / 2) * (-1));
                                if (g.changeBgSize) {
                                    if (g.nzHeight > g.nzWidth) {
                                        if (g.options.zoomType == "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" }) }
                                        g.zoomWindow.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" })
                                    } else {
                                        if (g.options.zoomType != "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvalueheight + "px" }) }
                                        g.zoomWindow.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px" })
                                    }
                                    g.changeBgSize = false
                                }
                                g.zoomWindow.css({ backgroundPosition: g.windowLeftPos + "px " + g.windowTopPos + "px" });
                                g.scrollingLock = false;
                                g.loop = false
                            } else {
                                if (Math.round(Math.abs(g.xp - g.windowLeftPos) + Math.abs(g.yp - g.windowTopPos)) < 1) {
                                    clearInterval(g.loop);
                                    g.zoomWindow.css({ backgroundPosition: g.windowLeftPos + "px " + g.windowTopPos + "px" });
                                    g.loop = false
                                } else {
                                    if (g.changeBgSize) {
                                        if (g.nzHeight > g.nzWidth) {
                                            if (g.options.zoomType == "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" }) }
                                            g.zoomWindow.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" })
                                        } else {
                                            if (g.options.zoomType != "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px" }) }
                                            g.zoomWindow.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px" })
                                        }
                                        g.changeBgSize = false
                                    }
                                    g.zoomWindow.css({ backgroundPosition: g.xp + "px " + g.yp + "px" })
                                }
                            }
                        }, 16)
                    }
                } else {
                    if (g.changeBgSize) {
                        if (g.nzHeight > g.nzWidth) {
                            if (g.options.zoomType == "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" }) }
                            g.zoomWindow.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" })
                        } else { if (g.options.zoomType == "lens") { g.zoomLens.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px" }) } if ((g.largeHeight / g.newvaluewidth) < g.options.zoomWindowHeight) { g.zoomWindow.css({ "background-size": g.largeWidth / g.newvaluewidth + "px " + g.largeHeight / g.newvaluewidth + "px" }) } else { g.zoomWindow.css({ "background-size": g.largeWidth / g.newvalueheight + "px " + g.largeHeight / g.newvalueheight + "px" }) } }
                        g.changeBgSize = false
                    }
                    g.zoomWindow.css({ backgroundPosition: g.windowLeftPos + "px " + g.windowTopPos + "px" })
                }
            }
        },
        setTintPosition: function(f) {
            var g = this;
            g.nzOffset = g.$elem.offset();
            g.tintpos = String(((f.pageX - g.nzOffset.left) - (g.zoomLens.width() / 2)) * (-1));
            g.tintposy = String(((f.pageY - g.nzOffset.top) - g.zoomLens.height() / 2) * (-1));
            if (g.Etoppos) { g.tintposy = 0 }
            if (g.Eloppos) { g.tintpos = 0 }
            if (g.Eboppos) { g.tintposy = (g.nzHeight - g.zoomLens.height() - (g.options.lensBorderSize * 2)) * (-1) }
            if (g.Eroppos) { g.tintpos = ((g.nzWidth - g.zoomLens.width() - (g.options.lensBorderSize * 2)) * (-1)) }
            if (g.options.tint) {
                if (g.fullheight) { g.tintposy = 0 }
                if (g.fullwidth) { g.tintpos = 0 }
                g.zoomTintImage.css({ left: g.tintpos + "px" });
                g.zoomTintImage.css({ top: g.tintposy + "px" })
            }
        },
        swaptheimage: function(i, f) {
            var h = this;
            var g = new Image();
            if (h.options.loadingIcon) {
                h.spinner = a("<div style=\"background: url('" + h.options.loadingIcon + "') no-repeat center;height:" + h.nzHeight + "px;width:" + h.nzWidth + 'px;z-index: 2000;position: absolute; background-position: center center;"></div>');
                h.$elem.after(h.spinner)
            }
            h.options.onImageSwap(h.$elem);
            g.onload = function() {
                h.largeWidth = g.width;
                h.largeHeight = g.height;
                h.zoomImage = f;
                h.zoomWindow.css({ "background-size": h.largeWidth + "px " + h.largeHeight + "px" });
                h.swapAction(i, f);
                return
            };
            g.src = f
        },
        swapAction: function(m, f) {
            var l = this;
            var h = new Image();
            h.onload = function() {
                l.nzHeight = h.height;
                l.nzWidth = h.width;
                l.options.onImageSwapComplete(l.$elem);
                l.doneCallback();
                return
            };
            h.src = m;
            l.currentZoomLevel = l.options.zoomLevel;
            l.options.maxZoomLevel = false;
            if (l.options.zoomType == "lens") { l.zoomLens.css({ backgroundImage: "url('" + f + "')" }) }
            if (l.options.zoomType == "window") { l.zoomWindow.css({ backgroundImage: "url('" + f + "')" }) }
            if (l.options.zoomType == "inner") { l.zoomWindow.css({ backgroundImage: "url('" + f + "')" }) }
            l.currentImage = f;
            if (l.options.imageCrossfade) {
                var j = l.$elem;
                var g = j.clone();
                l.$elem.attr("src", m);
                l.$elem.after(g);
                g.stop(true).fadeOut(l.options.imageCrossfade, function() { a(this).remove() });
                l.$elem.width("auto").removeAttr("width");
                l.$elem.height("auto").removeAttr("height");
                j.fadeIn(l.options.imageCrossfade);
                if (l.options.tint && l.options.zoomType != "inner") {
                    var k = l.zoomTintImage;
                    var i = k.clone();
                    l.zoomTintImage.attr("src", f);
                    l.zoomTintImage.after(i);
                    i.stop(true).fadeOut(l.options.imageCrossfade, function() { a(this).remove() });
                    k.fadeIn(l.options.imageCrossfade);
                    l.zoomTint.css({ height: l.$elem.height() });
                    l.zoomTint.css({ width: l.$elem.width() })
                }
                l.zoomContainer.css("height", l.$elem.height());
                l.zoomContainer.css("width", l.$elem.width());
                if (l.options.zoomType == "inner") {
                    if (!l.options.constrainType) {
                        l.zoomWrap.parent().css("height", l.$elem.height());
                        l.zoomWrap.parent().css("width", l.$elem.width());
                        l.zoomWindow.css("height", l.$elem.height());
                        l.zoomWindow.css("width", l.$elem.width())
                    }
                }
                if (l.options.imageCrossfade) {
                    l.zoomWrap.css("height", l.$elem.height());
                    l.zoomWrap.css("width", l.$elem.width())
                }
            } else {
                l.$elem.attr("src", m);
                if (l.options.tint) {
                    l.zoomTintImage.attr("src", f);
                    l.zoomTintImage.attr("height", l.$elem.height());
                    l.zoomTintImage.css({ height: l.$elem.height() });
                    l.zoomTint.css({ height: l.$elem.height() })
                }
                l.zoomContainer.css("height", l.$elem.height());
                l.zoomContainer.css("width", l.$elem.width());
                if (l.options.imageCrossfade) {
                    l.zoomWrap.css("height", l.$elem.height());
                    l.zoomWrap.css("width", l.$elem.width())
                }
            }
            if (l.options.constrainType) {
                if (l.options.constrainType == "height") {
                    l.zoomContainer.css("height", l.options.constrainSize);
                    l.zoomContainer.css("width", "auto");
                    if (l.options.imageCrossfade) {
                        l.zoomWrap.css("height", l.options.constrainSize);
                        l.zoomWrap.css("width", "auto");
                        l.constwidth = l.zoomWrap.width()
                    } else {
                        l.$elem.css("height", l.options.constrainSize);
                        l.$elem.css("width", "auto");
                        l.constwidth = l.$elem.width()
                    }
                    if (l.options.zoomType == "inner") {
                        l.zoomWrap.parent().css("height", l.options.constrainSize);
                        l.zoomWrap.parent().css("width", l.constwidth);
                        l.zoomWindow.css("height", l.options.constrainSize);
                        l.zoomWindow.css("width", l.constwidth)
                    }
                    if (l.options.tint) {
                        l.tintContainer.css("height", l.options.constrainSize);
                        l.tintContainer.css("width", l.constwidth);
                        l.zoomTint.css("height", l.options.constrainSize);
                        l.zoomTint.css("width", l.constwidth);
                        l.zoomTintImage.css("height", l.options.constrainSize);
                        l.zoomTintImage.css("width", l.constwidth)
                    }
                }
                if (l.options.constrainType == "width") {
                    l.zoomContainer.css("height", "auto");
                    l.zoomContainer.css("width", l.options.constrainSize);
                    if (l.options.imageCrossfade) {
                        l.zoomWrap.css("height", "auto");
                        l.zoomWrap.css("width", l.options.constrainSize);
                        l.constheight = l.zoomWrap.height()
                    } else {
                        l.$elem.css("height", "auto");
                        l.$elem.css("width", l.options.constrainSize);
                        l.constheight = l.$elem.height()
                    }
                    if (l.options.zoomType == "inner") {
                        l.zoomWrap.parent().css("height", l.constheight);
                        l.zoomWrap.parent().css("width", l.options.constrainSize);
                        l.zoomWindow.css("height", l.constheight);
                        l.zoomWindow.css("width", l.options.constrainSize)
                    }
                    if (l.options.tint) {
                        l.tintContainer.css("height", l.constheight);
                        l.tintContainer.css("width", l.options.constrainSize);
                        l.zoomTint.css("height", l.constheight);
                        l.zoomTint.css("width", l.options.constrainSize);
                        l.zoomTintImage.css("height", l.constheight);
                        l.zoomTintImage.css("width", l.options.constrainSize)
                    }
                }
            }
        },
        doneCallback: function() {
            var f = this;
            if (f.options.loadingIcon) { f.spinner.hide() }
            f.nzOffset = f.$elem.offset();
            f.nzWidth = f.$elem.width();
            f.nzHeight = f.$elem.height();
            f.currentZoomLevel = f.options.zoomLevel;
            f.widthRatio = f.largeWidth / f.nzWidth;
            f.heightRatio = f.largeHeight / f.nzHeight;
            if (f.options.zoomType == "window") {
                if (f.nzHeight < f.options.zoomWindowWidth / f.widthRatio) { lensHeight = f.nzHeight } else { lensHeight = String((f.options.zoomWindowHeight / f.heightRatio)) }
                if (f.options.zoomWindowWidth < f.options.zoomWindowWidth) { lensWidth = f.nzWidth } else { lensWidth = (f.options.zoomWindowWidth / f.widthRatio) }
                if (f.zoomLens) {
                    f.zoomLens.css("width", lensWidth);
                    f.zoomLens.css("height", lensHeight)
                }
            }
        },
        getCurrentImage: function() { var f = this; return f.zoomImage },
        getGalleryList: function() {
            var f = this;
            f.gallerylist = [];
            if (f.options.gallery) { a("#" + f.options.gallery + " a").each(function() { var g = ""; if (a(this).data("zoom-image")) { g = a(this).data("zoom-image") } else { if (a(this).data("image")) { g = a(this).data("image") } } if (g == f.zoomImage) { f.gallerylist.unshift({ href: "" + g + "", title: a(this).find("img").attr("title") }) } else { f.gallerylist.push({ href: "" + g + "", title: a(this).find("img").attr("title") }) } }) } else { f.gallerylist.push({ href: "" + f.zoomImage + "", title: a(this).find("img").attr("title") }) }
            return f.gallerylist
        },
        changeZoomLevel: function(g) {
            var f = this;
            f.scrollingLock = true;
            f.newvalue = parseFloat(g).toFixed(2);
            newvalue = parseFloat(g).toFixed(2);
            maxheightnewvalue = f.largeHeight / ((f.options.zoomWindowHeight / f.nzHeight) * f.nzHeight);
            maxwidthtnewvalue = f.largeWidth / ((f.options.zoomWindowWidth / f.nzWidth) * f.nzWidth);
            if (f.options.zoomType != "inner") {
                if (maxheightnewvalue <= newvalue) {
                    f.heightRatio = (f.largeHeight / maxheightnewvalue) / f.nzHeight;
                    f.newvalueheight = maxheightnewvalue;
                    f.fullheight = true
                } else {
                    f.heightRatio = (f.largeHeight / newvalue) / f.nzHeight;
                    f.newvalueheight = newvalue;
                    f.fullheight = false
                }
                if (maxwidthtnewvalue <= newvalue) {
                    f.widthRatio = (f.largeWidth / maxwidthtnewvalue) / f.nzWidth;
                    f.newvaluewidth = maxwidthtnewvalue;
                    f.fullwidth = true
                } else {
                    f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
                    f.newvaluewidth = newvalue;
                    f.fullwidth = false
                }
                if (f.options.zoomType == "lens") {
                    if (maxheightnewvalue <= newvalue) {
                        f.fullwidth = true;
                        f.newvaluewidth = maxheightnewvalue
                    } else {
                        f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
                        f.newvaluewidth = newvalue;
                        f.fullwidth = false
                    }
                }
            }
            if (f.options.zoomType == "inner") {
                maxheightnewvalue = parseFloat(f.largeHeight / f.nzHeight).toFixed(2);
                maxwidthtnewvalue = parseFloat(f.largeWidth / f.nzWidth).toFixed(2);
                if (newvalue > maxheightnewvalue) { newvalue = maxheightnewvalue }
                if (newvalue > maxwidthtnewvalue) { newvalue = maxwidthtnewvalue }
                if (maxheightnewvalue <= newvalue) {
                    f.heightRatio = (f.largeHeight / newvalue) / f.nzHeight;
                    if (newvalue > maxheightnewvalue) { f.newvalueheight = maxheightnewvalue } else { f.newvalueheight = newvalue }
                    f.fullheight = true
                } else {
                    f.heightRatio = (f.largeHeight / newvalue) / f.nzHeight;
                    if (newvalue > maxheightnewvalue) { f.newvalueheight = maxheightnewvalue } else { f.newvalueheight = newvalue }
                    f.fullheight = false
                }
                if (maxwidthtnewvalue <= newvalue) {
                    f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
                    if (newvalue > maxwidthtnewvalue) { f.newvaluewidth = maxwidthtnewvalue } else { f.newvaluewidth = newvalue }
                    f.fullwidth = true
                } else {
                    f.widthRatio = (f.largeWidth / newvalue) / f.nzWidth;
                    f.newvaluewidth = newvalue;
                    f.fullwidth = false
                }
            }
            scrcontinue = false;
            if (f.options.zoomType == "inner") {
                if (f.nzWidth >= f.nzHeight) {
                    if (f.newvaluewidth <= maxwidthtnewvalue) { scrcontinue = true } else {
                        scrcontinue = false;
                        f.fullheight = true;
                        f.fullwidth = true
                    }
                }
                if (f.nzHeight > f.nzWidth) {
                    if (f.newvaluewidth <= maxwidthtnewvalue) { scrcontinue = true } else {
                        scrcontinue = false;
                        f.fullheight = true;
                        f.fullwidth = true
                    }
                }
            }
            if (f.options.zoomType != "inner") { scrcontinue = true }
            if (scrcontinue) {
                f.zoomLock = 0;
                f.changeZoom = true;
                if (((f.options.zoomWindowHeight) / f.heightRatio) <= f.nzHeight) {
                    f.currentZoomLevel = f.newvalueheight;
                    if (f.options.zoomType != "lens" && f.options.zoomType != "inner") {
                        f.changeBgSize = true;
                        f.zoomLens.css({ height: String((f.options.zoomWindowHeight) / f.heightRatio) + "px" })
                    }
                    if (f.options.zoomType == "lens" || f.options.zoomType == "inner") { f.changeBgSize = true }
                }
                if ((f.options.zoomWindowWidth / f.widthRatio) <= f.nzWidth) {
                    if (f.options.zoomType != "inner") { if (f.newvaluewidth > f.newvalueheight) { f.currentZoomLevel = f.newvaluewidth } }
                    if (f.options.zoomType != "lens" && f.options.zoomType != "inner") {
                        f.changeBgSize = true;
                        f.zoomLens.css({ width: String((f.options.zoomWindowWidth) / f.widthRatio) + "px" })
                    }
                    if (f.options.zoomType == "lens" || f.options.zoomType == "inner") { f.changeBgSize = true }
                }
                if (f.options.zoomType == "inner") { f.changeBgSize = true; if (f.nzWidth > f.nzHeight) { f.currentZoomLevel = f.newvaluewidth } if (f.nzHeight > f.nzWidth) { f.currentZoomLevel = f.newvaluewidth } }
            }
            f.setPosition(f.currentLoc)
        },
        closeAll: function() { if (self.zoomWindow) { self.zoomWindow.hide() } if (self.zoomLens) { self.zoomLens.hide() } if (self.zoomTint) { self.zoomTint.hide() } },
        changeState: function(g) { var f = this; if (g == "enable") { f.options.zoomEnabled = true } if (g == "disable") { f.options.zoomEnabled = false } }
    };
    a.fn.elevateZoom = function(f) {
        return this.each(function() {
            var g = Object.create(c);
            g.init(f, this);
            a.data(this, "elevateZoom", g)
        })
    };
    a.fn.elevateZoom.options = { zoomActivation: "hover", zoomEnabled: true, preloading: 1, zoomLevel: 1, scrollZoom: false, scrollZoomIncrement: 0.1, minZoomLevel: false, maxZoomLevel: false, easing: false, easingAmount: 12, lensSize: 200, zoomWindowWidth: 400, zoomWindowHeight: 400, zoomWindowOffetx: 0, zoomWindowOffety: 0, zoomWindowPosition: 1, zoomWindowBgColour: "#fff", lensFadeIn: false, lensFadeOut: false, debug: false, zoomWindowFadeIn: false, zoomWindowFadeOut: false, zoomWindowAlwaysShow: false, zoomTintFadeIn: false, zoomTintFadeOut: false, borderSize: 4, showLens: true, borderColour: "#888", lensBorderSize: 1, lensBorderColour: "#000", lensShape: "square", zoomType: "window", containLensZoom: false, lensColour: "white", lensOpacity: 0.4, lenszoom: false, tint: false, tintColour: "#333", tintOpacity: 0.4, gallery: false, galleryActiveClass: "zoomGalleryActive", imageCrossfade: false, constrainType: false, constrainSize: false, loadingIcon: false, cursor: "default", responsive: true, onComplete: a.noop, onDestroy: function() {}, onZoomedImageLoaded: function() {}, onImageSwap: a.noop, onImageSwapComplete: a.noop }
})(jQuery, window, document);