(function() {
    function a() {
        $(".back-to-top").hide();
        $(window).on("scroll", function() { if ($(this).scrollTop() > 400) { $(".back-to-top").fadeIn() } else { $(".back-to-top").fadeOut() } return false });
        $(".back-to-top a").on("click", function(b) {
            b.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 600);
            return false
        })
    }
    $(document).ready(function() {
        a();
        $(".open-menu-left").on("click", function() { $(".menu-left").addClass("menu-left-0") });
        $(".icon-close").on("click", function() { $(".menu-left").removeClass("menu-left-0") });
        $(".index-bars .popup-title").on("click", function() { $(".menu-right").addClass("active") });
        $(".icon-close").on("click", function() { $(".menu-right").removeClass("active") });
        $(".all").after('<div id="off-mainmenu"><div class="off-mainnav"><div class="off-close"><span class="btn-menu"></span><span class="close-menu float-right"><i class="cs-icon icon-close"></i></span></div></div></div>');
        $(".megamenu").clone().appendTo(".off-mainnav");
        $(".off-mainnav .megamenu li.dropdown, .off-mainnav .megamenu li.dropdown-submenu").each(function() { $(this).find("a").first().after('<span class="icon-down"><i class="fa fa-angle-down"></i></span>') });
        $(".btn-menu").on("click", function(c) {
            c.preventDefault();
            $("body").addClass("mainmenu-active")
        });
        $(".off-close .close-menu").on("click", function(c) {
            c.preventDefault();
            $("body").removeClass("mainmenu-active");
            return false
        });
        $(".icon-down").on("click", function(c) { $(this).closest("li").find(".dropdown-menu").first().toggleClass("tiva-active"); return false });
        $(window).on("resize", function() { var c = $(this); if (c.width() >= 1000) { $("#main-nav").css({ display: "block" }) } return false });
        setTimeout(function() { $("#page-preloader").fadeOut() }, 1500);
        if ($(".product-detail .main-image img").length) { $(".product-detail .main-image img").elevateZoom({ zoomType: "inner", cursor: "crosshair", easing: true, scrollZoom: false }) }
        $(".product-detail .thumb-images img").on("click", function(c) { $(".product-detail .main-image").html('<img class="w-100" src="' + $(this).attr("src") + '" alt="Product Image">').find("img").elevateZoom({ zoomType: "inner", cursor: "crosshair", easing: true, scrollZoom: false }); return false });
        $(".checkmark").on("click", function(c) { $(this).closest(".payment-method-bacs").find(".payment-box").toggleClass("toggle") });
        $(".show-active").on("click", function(c) {
            c.preventDefault();
            $(this).closest(".login-block").find(".form-login").toggleClass("show-toggle")
        });
        $(".video-link a").on("click", function(c) {
            c.preventDefault();
            $(".tiva-video-overlay").toggleClass("open");
            $(".video-link").css("display", "none");
            return false
        });
        $(".video-close a").on("click", function(c) {
            c.preventDefault();
            $(".tiva-video-overlay").toggleClass("open");
            $(".video-link").css("display", "table-cell");
            return false
        });
        $(".product-countdown").each(function(d) {
            var c = (typeof $(this).attr("data-date") != "undefined") ? $(this).attr("data-date") : new Date();
            $(this).countdown(c, function(e) { var f = e.offset.totalDays * 24 + e.offset.hours; if ($(this).closest(".product-tab").attr("class").indexOf("layout-2") != -1) { $(this).html(e.strftime('<div class="item"><div class="number">' + f + '</div><div class="text">Hours</div></div><div class="item"><div class="number">%M</div><div class="text">Minutes</div></div><div class="item"><div class="number">%S</div><div class="text">Seconds</div></div>')) } else { $(this).html(e.strftime('<div class="item"><div class="text">Hours</div><div class="number"><div>' + f + '</div></div></div><div class="item"><div class="text">Mins</div><div class="number"><div>%M</div></div></div><div class="item"><div class="text">Secs</div><div class="number"><div>%S</div></div></div>')) } })
        });
        $(".click1 .show-description").on("click", function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-right");
                $(this).siblings(".show1").slideUp(200)
            } else {
                $(".click1 > .show-description").removeClass("active");
                $(".click1 > .show-description i").removeClass("fa-angle-down").addClass("fa-angle-right");
                $(".show1").slideUp(200);
                $(this).addClass("active");
                $(this).find("i").removeClass("fa-angle-right").addClass("fa-angle-down");
                $(this).siblings(".show1").slideDown(200)
            }
        });
        $("#tiva-slideshow").nivoSlider({ effect: "random", animSpeed: 1000, pauseTime: 4000, pauseOnHover: true });
        if ($("#price-filter").length) { $("#price-filter").slider({ from: 0, to: 100, step: 1, smooth: true, round: 0, dimension: "&nbsp;$", skin: "plastic" }) }
        var b = $(".grid").imagesLoaded(function() { b.masonry({ itemSelector: ".grid-item", percentPosition: true, columnWidth: ".grid-item" }) });
        $(".manufacture-block").owlCarousel({ margin: 40, stopOnHover: false, pagination: false, paginationNumbers: false, responsiveClass: true, responsive: { 0: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"] }, 600: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"] }, 1000: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"] } } });
        $(".home-4 .home-brand-content").owlCarousel({ stopOnHover: false, pagination: false, paginationNumbers: false, responsiveClass: true, responsive: { 0: { items: 1, }, 425: { items: 2, }, 768: { items: 4, }, 1000: { items: 6, }, 1200: { items: 10, } } });
        $(".home-brand-content").owlCarousel({ stopOnHover: false, pagination: false, paginationNumbers: false, responsiveClass: true, responsive: { 0: { items: 1, }, 425: { items: 2, }, 768: { items: 4, }, 1000: { items: 6, } } });
        $(".testimonial-carousel").owlCarousel({ margin: 30, stopOnHover: false, pagination: false, paginationNumbers: false, dots: true, responsiveClass: true, responsive: { 0: { items: 1 }, 600: { items: 1 }, 1000: { items: 1 } } });
        $(".deal-of-day-carousel").owlCarousel({ margin: 0, stopOnHover: false, pagination: false, paginationNumbers: false, responsiveClass: true, dots: true, responsive: { 0: { items: 1, }, 600: { items: 1, }, 1000: { items: 1, } } });
        $(".carousel-home5").owlCarousel({ margin: 40, stopOnHover: false, pagination: false, paginationNumbers: false, responsiveClass: true, responsive: { 0: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"] }, 600: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"] }, 1000: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"] } } });
        $(".slider-history").owlCarousel({ margin: 40, autoplay: true, center: true, loop: true, nav: true, stopOnHover: false, pagination: false, paginationNumbers: false, responsiveClass: true, responsive: { 0: { items: 1, navText: ["<span class='left'></span>", "<span class='right'></span>"] }, 768: { items: 3, navText: ["<span class='left'></span>", "<span class='right'></span>"] } } });
        $(".testimonials-content").owlCarousel({ margin: 40, autoplay: true, center: true, loop: true, nav: false, dots: true, stopOnHover: false, pagination: false, paginationNumbers: false, responsiveClass: true, responsive: { 0: { items: 1, }, 600: { items: 1, }, 1000: { items: 1, } } });
        $(".brand").owlCarousel({ loop: true, margin: 10, nav: true, responsive: { 0: { items: 1 }, 600: { items: 3 }, 1000: { items: 5 } } });
        $(".blog-carousel").owlCarousel({ loop: true, stopOnHover: false, margin: 0, responsiveClass: true, responsive: { 0: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"], }, 600: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"], }, 1000: { items: 1, nav: true, navText: ["<span class='left'></span>", "<span class='right'></span>"], loop: false } } })
    })
})();