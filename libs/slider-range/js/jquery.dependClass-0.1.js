(function(a) {
    a.baseClass = function(b) { b = a(b); return b.get(0).className.match(/([^ ]+)/)[1] };
    a.fn.addDependClass = function(b, c) { var d = { delimiter: c ? c : "-" }; return this.each(function() { var e = a.baseClass(this); if (e) { a(this).addClass(e + d.delimiter + b) } }) };
    a.fn.removeDependClass = function(b, c) { var d = { delimiter: c ? c : "-" }; return this.each(function() { var e = a.baseClass(this); if (e) { a(this).removeClass(e + d.delimiter + b) } }) };
    a.fn.toggleDependClass = function(b, c) { var d = { delimiter: c ? c : "-" }; return this.each(function() { var e = a.baseClass(this); if (e) { if (a(this).is("." + e + d.delimiter + b)) { a(this).removeClass(e + d.delimiter + b) } else { a(this).addClass(e + d.delimiter + b) } } }) }
})(jQuery);