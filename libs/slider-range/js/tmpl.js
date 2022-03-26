(function() {
    var a = {};
    this.tmpl = function b(e, c) { var d = !/\W/.test(e) ? a[e] = a[e] || b(document.getElementById(e).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + e.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');"); return c ? d(c) : d }
})();