Backbone.View.prototype.close = function () {
    console.log('Closing view ' + this);
    if (this.beforeClose) {
        this.beforeClose();
    }
    this.remove();
    this.unbind();
};

var app;

var AppRouter = Backbone.Router.extend({

    initialize: function () {

    },
    sessionList: null,
    sessionView: null,
    industryList: null,
    assessmentSectionsView: null,
    assessmentView: null,
    resultsView: null,
    newAssessmentView: null,
    currentSession: null,
    scrollWidths: 24,
    desktopWidth: 1300,
    phoneWidth: 800,
    int: null,
    routes: {
        "": "index"
    },
    states: [],
    currentState: null,
    index: function () {
        this.begin();
    },
    setState: function (state) {
        if (state != this.currentState) {
            if (this.currentState != null) {
                this.currentState.onExit();
                TweenLite.to(this.currentState.$el, .4, {css: {autoAlpha: 0}});
            }
            this.currentState = state;
            this.currentState.onEnter();
        }
    },

    begin: function (callback) {
        app.header = new HeaderView().render().$el.appendTo("#main");
        if (ww <= app.phoneWidth && app.header.find(".application_title").html() != "Unified Workspace Tool") {
            app.header.find(".application_title").html("Unified Workspace Tool");
        } else if (ww > app.phoneWidth && app.header.find(".application_title").html() != "Unified Workspace Assessment Tool") {
            app.header.find(".application_title").html("Unified Workspace Assessment Tool");
        }
        if (isIE9()) {
            this.scrollWidths = -4;
        }
        if (this.sessionList) {
            this.sessionList.fetch({success: function () {
                if (callback) callback();
            }});
        } else {
            this.industryList = new IndustryCollection();
            this.industryList.fetch({success: function () {
                // success
            }});
            this.sessionList = new SessionCollection();
            this.sessionView = new SessionsView({model: app.sessionList});
            this.sessionList.fetch({success: function () {

                app.sessionView.render();
                app.setState(app.sessionView);
                if (callback) callback();
            }, error: function (e) {
                console.log(e);
            }});
            this.assessmentList = new AssessmentCollection();
        }
    },
    startInterval: function () {
        try {
            clearInterval(int);
        } catch (e) {

        }
        int = self.setInterval("$(window).resize()", 50);
    },
    stopInterval: function () {
        clearInterval(int);
        int = self.setInterval("$(window).resize()", 1000);
        TweenLite.to($(this.currentState.$el), .5, {css: {autoAlpha: 1}});
    }
});

tpl.loadTemplates([
    'header',
    'sessions',
    'form-view',
    'session-edit-view',
    'session-list-item',
    'accordion-header',
    'assessment',
    'assessment-sections',
    'category',
    'question_ss',
    'question_ms',
    'question_mss',
    'question_lk',
    'question_te',
    'question_ps',
    'answer_ss',
    'answer_ms',
    'answer_ms_te',
    'answer_mss',
    'answer_lk',
    'answer_te',
    'answer_ps',
    'list-category-item',
    'interviewees',
    'results',
    'results_overview',
    'narrow_results_overview',
    'phone_results_overview',
    'results_security',
    'narrow_results_security',
    'phone_results_security',
    'results_opportunities',
    'narrow_results_opportunities',
    'phone_results_opportunities',
    'results_device_support',
    'narrow_results_device_support',
    'phone_results_device_support',
    'results_access',
    'narrow_results_access',
    'phone_results_access',
    'results_data_protection',
    'narrow_results_data_protection',
    'phone_results_data_protection',
    'results_applications',
    'narrow_results_applications',
    'phone_results_applications'
], function () {
    app = new AppRouter();
    Backbone.history.start();
});

var wh = $(window).height();
var ww = $(window).width();

$(window).resize(function () {
    if (app != undefined) {

        try {
            if ($(window).height() != wh || $(window).width() != ww) {

                var title = app.header.find(".application_title");

                if (ww <= app.phoneWidth && title.html() != "Unified Workspace Tool") {
                    title.html("Unified Workspace Tool");
                } else if (ww > app.phoneWidth && title.html() != "Unified Workspace Assessment Tool") {
                    title.html("Unified Workspace Assessment Tool");
                }
            }
            if (app.currentState == app.sessionView) {
                var list1 = $("#accordion-1").find("#session_list"),
                    list2 = $("#accordion-2").find("#session_list");

                if (list1.height() != ($(window).height() - list1.offset().top - 10)) {

                    list1.height($(window).height() - list1.offset().top - 10);
                    list1.getNiceScroll()[0].updateScrollBar();

                    list2.height($(window).height() - list2.offset().top - 10);
                    list2.getNiceScroll()[0].updateScrollBar();

                } else {
                    app.stopInterval();
                }
            }
            if (app.currentState == app.assessmentView) {

                var nav = $("#assessment_nav"),
                    assess_table = $("#assessment_table"),
                    assess_main = $("#assessment_main"),
                    result_table = $("#results_table"),
                    results_main = $("#results_main"),
                    form_content = $("#form_content"),
                    thumb = $("#thumb_seperator");


                nav.find("#list").height($(window).height() - nav.find("#list").offset().top - 86);
                w = assess_table.width() - assess_table.offset().left - nav.width() - thumb.width() + nav.find("#list").offset().left + app.scrollWidths;
                if (!app.assessmentView.nav_expanded) {
                    w += 250;
                }
                if (w > 250) {
                    assess_main.width(w);
                }
                if (assess_main.height() != $(window).height() - assess_main.offset().top - 86) {
                    assess_main.height($(window).height() - assess_main.offset().top - 86);
                    thumb.height($(window).height() - assess_main.offset().top - 86);
                    nav.find("#list").css({"top": (assess_table.offset().top - 83) + "px"});
                    nav.find("#list").getNiceScroll()[0].updateScrollBar();
                } else {
                    app.stopInterval();
                }
                if ($(window).height() != wh || $(window).width() != ww) {

                    try {
                        if (!app.assessmentView.nav_expanded) {
                            var w = 250;
                            TweenLite.to(nav, .01, {css: {width: "1px"}, ease: Sine.easeOut});
                            TweenLite.to(nav.find("#list"), .01, {css: {"left": -w + "px"}, ease: Sine.easeOut});
                        }
                        app.assessmentView.updateBar();
                        app.assessmentView.mainScroll.measure();
                        if (isIE9()) {
                            assess_main.scrollTop(app.assessmentView.savedScroll);
                        }
                    } catch (e) {

                    }
                }
            }
            if (app.currentState == app.resultsView) {

                if (result_main.height() != $(window).height() - result_main.offset().top - 10) {
                    result_main.height($(window).height() - result_main.offset().top - 10);
                    result_table.height($(window).height() - result_table.offset().top - 10);
                    app.resultsView.activeScreen.$el.height($(window).height() - result_main.offset().top - 11);
                } else {
                    app.stopInterval();
                }

                if ($(window).width() != ww || $(window).height() != wh) {

                }
                if ($(window).width() != ww) {

                    var sections = app.resultsView.sections,
                        section;

                    if (ww <= app.desktopWidth && ww > app.phoneWidth) {
                        for (section in sections) {
                            if (sections.hasOwnProperty(section)) {
                                if (sections[section].size != "tablet") {
                                    sections[section].size = "tablet";
                                    sections[section].render();
                                }
                            }
                        }
                    } else if (ww > app.desktopWidth) {
                        for (section in sections) {
                            if (sections.hasOwnProperty(section)) {
                                if (sections[section].size != "desktop") {
                                    sections[section].size = "desktop";
                                    sections[section].render();
                                }
                            }
                        }
                    } else if (ww <= app.phoneWidth) {
                        for (section in sections) {
                            if (sections.hasOwnProperty(section)) {
                                if (sections[section].size != "phone") {
                                    sections[section].size = "phone";
                                    sections[section].render();
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {

        }
        if (app.currentState == app.newAssessmentView) {
            try {
                if (form_content.height() != $(window).height() - form_content.offset().top - 10) {
                    form_content.height($(window).height() - form_content.offset().top - 10);
                }

            } catch (e) {

            }
        }

        wh = $(window).height();
        ww = $(window).width();
    }

});

(function () {

    var special = jQuery.event.special,
        uid1 = 'D' + (+new Date()),
        uid2 = 'D' + (+new Date() + 1);

    special.scrollstart = {
        setup: function () {

            var timer,
                handler = function (evt) {

                    var _self = this;

                    if (timer) {
                        clearTimeout(timer);
                    } else {
                        evt.type = 'scrollstart';
                        jQuery.event.handle.apply(_self, arguments);
                    }

                    timer = setTimeout(function () {
                        timer = null;
                    }, special.scrollstop.latency);

                };

            jQuery(this).bind('scroll', handler).data(uid1, handler);

        },
        teardown: function () {
            jQuery(this).unbind('scroll', jQuery(this).data(uid1));
        }
    };

    special.scrollstop = {
        latency: 100,
        setup: function () {

            var timer,
                handler = function (evt) {

                    var _self = this,
                        _args = arguments;

                    if (timer) {
                        clearTimeout(timer);
                    }

                    timer = setTimeout(function () {

                        timer = null;
                        evt.type = 'scrollstop';
                        jQuery.event.handle.apply(_self, _args);

                    }, special.scrollstop.latency);

                };

            jQuery(this).bind('scroll', handler).data(uid2, handler);

        },
        teardown: function () {
            jQuery(this).unbind('scroll', jQuery(this).data(uid2));
        }
    };

})();

(function ($) {
    $.browserTest = function (a, z) {
        var u = 'unknown', x = 'X', m = function (r, h) {
            for (var i = 0; i < h.length; i = i + 1) {
                r = r.replace(h[i][0], h[i][1]);
            }
            return r;
        }, c = function (i, a, b, c) {
            var r = {
                name: m((a.exec(i) || [u, u])[1], b)
            };

            r[r.name] = true;

            r.version = (c.exec(i) || [x, x, x, x])[3];

            if (r.name.match(/safari/) && r.version > 400) {
                r.version = '2.0';
            }

            if (r.name === 'presto') {
                r.version = ($.browser.version > 9.27) ? 'futhark' : 'linear_b';
            }
            r.versionNumber = parseFloat(r.version, 10) || 0;
            r.versionX = (r.version !== x) ? (r.version + '').substr(0, 1) : x;
            r.className = r.name + r.versionX;

            return r;
        };
        a = (a.match(/Opera|Navigator|Minefield|KHTML|Chrome/) ? m(a, [
            [/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/, ''],
            ['Chrome Safari', 'Chrome'],
            ['KHTML', 'Konqueror'],
            ['Minefield', 'Firefox'],
            ['Navigator', 'Netscape']
        ]) : a).toLowerCase();

        $.browser = $.extend((!z) ? $.browser : {}, c(a, /(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/, [], /(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));

        $.layout = c(a, /(gecko|konqueror|msie|opera|webkit)/, [
            ['konqueror', 'khtml'],
            ['msie', 'trident'],
            ['opera', 'presto']
        ], /(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);

        $.os = {
            name: (/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase()) || [u])[0].replace('sunos', 'solaris')
        };

        if (!z) {
            $('html').addClass([$.os.name, $.browser.name, $.browser.className, $.layout.name, $.layout.className].join(' '));
        }
    };
    $.browserTest(navigator.userAgent);

})(jQuery);

var isIE9 = function () {
    var result = false;
    if ($.browser.name == "msie" && $.browser.version < 10) {
        result = true;
    }
    return result;
};
