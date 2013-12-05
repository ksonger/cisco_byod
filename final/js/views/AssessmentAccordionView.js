/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/20/12
 * Time: 9:03 AM
 * To change this template use File | Settings | File Templates.
 */
window.AssessmentAccordionView = Backbone.View.extend({

    openElement: null,
    updatingMenu: false,
    savedScroll: 0,

    initialize: function () {
        this.$el = jQuery('<ul/>', {
            id: "assess_acc"
        });
    },

    render: function () {
        var acc = this;
        var lastOpen = null;
        if (acc.openElement != null) {
            lastOpen = $(acc.openElement).next(".categoryListItemContent").find("#category_id").value();
            acc.openElement = null;
        }

        acc.$el.html('');

        _.each(this.model, function (session, index) {
            var item = new ListCategoryItemView({model: session});
            acc.$el.append(item.render().el.innerHTML);
            if (!isIE9()) {
                TweenLite.to(acc.$el.find(".categoryListItemContent"), .01, {css: {height: 1, autoAlpha: 0}});
                acc.$el.find(".categoryListItemContent").css({"visibility": "hidden", "overflow": "hidden"});
            } else {
                if (index > 0) {
                    acc.$el.find(".categoryListItemContent").height(1);
                    acc.$el.find(".categoryListItemContent").css({"visibility": "hidden", "opacity": "0"});

                } else {
                    acc.$el.find(".categoryListItemContent").height(acc.$el.find(".categoryListItemContent").find("#category_details").height());
                    acc.$el.find(".categoryListItemContent").css({"visibility": "visible", "opacity": "1"});
                }
            }
        }, this);
        this.addEventHandlers(lastOpen);
        return this;
    },

    updateMenu: function () {
        var assess_table = $("#assessment_table"),
            tgt_c = (assess_table.height() * .5),
            tgt_q = (assess_table.height() * .5);

        for (var i = app.assessmentView.categories.length - 1; i > -1; i--) {
            if (app.assessmentView.categories[i].$el.offset().top - assess_table.offset().top < tgt_c) {
                var acc = this;
                acc.$el.find('#head').each(function () {
                    if ($(this).find("#category_id").val() === app.assessmentView.categories[i].model.id) {
                        app.assessmentView.currentCategoryObj = app.assessmentView.categories[i];
                        if (acc.openElement != $(this)) {
                            acc.updatingMenu = true;
                            $(this).click();
                            acc.scrollMenu($(this));
                        }
                    }
                });
                for (var j = app.assessmentView.categories[i].questions.length - 1; j > -1; j--) {
                    if (app.assessmentView.categories[i].questions[j].$el.offset().top - assess_table.offset().top < tgt_q) {
                        var tgt = app.assessmentView.categories[i].questions[j];
                        // maybe more than one that fit the criteria?
                        var alternate = null;
                        for (var k = j - 1; k > -1; k--) {
                            if (app.assessmentView.categories[i].questions[k].$el.offset().top - assess_table.offset().top < 0) {
                                break;
                            } else {
                                alternate = app.assessmentView.categories[i].questions[k];
                            }
                        }
                        if (alternate != null) {
                            tgt = alternate;
                        }
                        acc.$el.find('#list_question').each(function () {
                            if ($(this).find("#question_id").val() === tgt.model.id) {
                                app.assessmentView.currentQuestionObj = tgt;
                                if (acc.openQuestion != $(this)) {
                                    acc.updatingMenu = true;
                                    $(this).click();
                                    acc.scrollMenu($(this));
                                }
                            }
                        });
                        break;
                    }
                }
                break;
            }
        }
    },

    updateInterviewee: function (id) {
        var has_interviewee = false,
            assess_main = $("#assessment_main"),
            scroll;
        for (var i = 0; i < app.assessmentView.categories.length; i++) {
            for (var j = 0; j < app.assessmentView.categories[i].questions.length; j++) {
                if (app.assessmentView.categories[i].questions[j].model.id === id) {
                    if (app.assessmentView.categories[i].questions[j].selectedInterviewee != null) {
                        var iArr = app.currentSession.get("interviewees_list");
                        for (var l = 0; l < iArr.length; l++) {
                            if (iArr[l].id === parseInt(app.assessmentView.categories[i].questions[j].selectedInterviewee)) {
                                scroll = assess_main.scrollTop();
                                app.assessmentView.$el.find("#interviewee_button").html("Interviewee: " + iArr[l].role + " " + iArr[l].fname + " " + iArr[l].lname);
                                if (isIE9()) {
                                    assess_main.scrollTop(scroll);
                                }
                                has_interviewee = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (!has_interviewee) {
            scroll = assess_main.scrollTop();
            app.assessmentView.$el.find("#interviewee_button").html("Interviewee: Please select");
            if (isIE9()) {
                assess_main.scrollTop(scroll);
            }
        }
    },

    scrollMenu: function (elem) {
        try {
            var assess_table = $("#assessment_table"),
                assess_nav = $("#assessment_nav"),
                pos;

            if ((elem.offset().top) - assess_table.offset().top < 0) {
                //out of frame above the list
                pos = (assess_nav.find("#list").getNiceScroll()[0].getScrollTop()) + (elem.offset().top - assess_table.offset().top);
                assess_nav.find("#list").getNiceScroll()[0].setScrollTop(pos);
            }
            if (elem.offset().top - assess_table.offset().top > assess_table.height()) {
                //out of frame below the list
                var h = (elem.parent().next().offset().top - elem.offset().top);
                pos = h + (assess_nav.find("#list").getNiceScroll()[0].getScrollTop()) + ((elem.offset().top - assess_table.offset().top) - assess_table.height());
                assess_nav.find("#list").getNiceScroll()[0].setScrollTop(pos);
            }
        } catch (e) {

        }

    },

    setQuestionClass: function (id, len) {
        this.$el.find('#list_question').each(function () {
            if ($(this).find("#question_id").val() === id) {
                if (len > 0) {
                    $(this).css({"color": "#999999"});
                } else {
                    $(this).css({"color": "#0b73ad"});
                }
            }
        });

    },

    resetUpdating: function () {
        app.assessmentView.assessmentAccordion.updatingMenu = false;
    },

    addEventHandlers: function (lastOpen) {
        var acc = this,
            assess = app.assessmentView,
            assess_main = $("#assessment_main");
        acc.$el.find('#head').each(function (index) {
            if (index === 0) {
                acc.openElement = $(this);
            }
            $(this).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                var timing = .3;
                if (!assess.assessmentHidden) {
                    assess.openCategory = $(this);
                    app.assessmentList.currentCategory = parseInt($(this).find("#category_id").val());
                    for (var k = 0; k < assess.categories.length; k++) {
                        if (assess.categories[k].model.id === app.assessmentList.currentCategory) {
                            app.assessmentList.currentQuestion = assess.categories[k].questions[0].model.id;
                        }
                    }
                    var isSameElement = (acc.openElement === this);
                    if (!acc.updatingMenu) {
                        assess.scrollAssessment("category");
                    } else {
                        acc.resetUpdating();
                    }
                    if (acc.openElement != null) {

                        if (!isSameElement) {
                            $(acc.openElement).attr("class", "list_category_inactive");
                            if (!isIE9()) {
                                TweenLite.to($(acc.openElement).next(".categoryListItemContent"), timing, {css: {height: 1, autoAlpha: 0}});
                            } else {
                                scroll = assess_main.scrollTop();
                                $(acc.openElement).next(".categoryListItemContent").height(1);
                                $(acc.openElement).next(".categoryListItemContent").css({"visibility": "hidden", "opacity": "0"});
                                assess_main.scrollTop(scroll);
                            }
                        }
                    }
                    acc.openElement = this;
                    if (!isSameElement) {
                        $(this).next(".content").css({"visibility": "visible"});
                        $(this).attr("class", "list_category_active");
                        if (!isIE9()) {
                            TweenLite.to($(this).next(".categoryListItemContent"), timing, {css: {height: $(this).next(".categoryListItemContent").find("#category_details").height(), autoAlpha: 1}});
                        } else {
                            var scroll = assess_main.scrollTop();
                            $(this).next(".categoryListItemContent").height($(this).next(".categoryListItemContent").find("#category_details").height());
                            $(this).next(".categoryListItemContent").css({"visibility": "visible", "opacity": "1"});
                            assess_main.scrollTop(scroll);
                        }

                    }
                }
                return false;
            });
            $(this).hover(
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!assess.assessmentHidden) {
                        if ($(this).attr("class") === "list_category_inactive") {
                            $(this).attr("class", "list_category_hover");
                        }
                    }
                    return false;
                },
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!assess.assessmentHidden) {
                        if ($(this).attr("class") === "list_category_hover") {
                            $(this).attr("class", "list_category_inactive");
                        }
                    }
                    return false;
                }
            );
            if (lastOpen != null) {
                if (lastOpen === $(this).next(".categoryListItemContent").find("#category_id").value()) {
                    $(this).next(".content").css({"visibility": "visible"});
                    $(this).attr("class", "list_category_active");
                    TweenLite.to($(this).next(".categoryListItemContent"), .3, {css: {height: $(this).next(".categoryListItemContent").find("#category_details").height(), autoAlpha: 1}});
                    acc.openElement = this;
                }
            }
        });

        acc.$el.find('#list_question').each(function (index) {
            if (index === 0 && assess.openQuestion === null) {
                acc.openQuestion = $(this);
            }
            $(this).click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                if (!assess.assessmentHidden) {
                    if (assess.openQuestion != null) {
                        $(assess.openQuestion).attr("class", "list_question_inactive");
                    }
                    $(this).attr("class", "list_question_active");
                    assess.openQuestion = $(this);

                    app.assessmentList.currentQuestion = parseInt($(this).find("#question_id").val());
                    app.assessmentList.currentCategory = parseInt($(this).find("#category_id").val());

                    $("#assessment_nav").find('#head').each(function () {
                        if (app.assessmentList.currentCategory === parseInt($(this).find("#category_id").val())) {
                            $(this).attr("class", "list_category_active");
                        } else {
                            $(this).attr("class", "list_category_inactive");
                        }
                    });
                    if (!acc.updatingMenu) {
                        assess.scrollAssessment("question");
                    } else {
                        acc.resetUpdating();
                    }
                    try {
                        //acc.activeQuestion.$el.find("#question_arrow").attr("class", "question_arrow_inactive");
                    } catch (e) {

                    }

                    for (var i = 0; i < app.assessmentView.categories.length; i++) {
                        for (var j = 0; j < app.assessmentView.categories[i].questions.length; j++) {
                            if (app.assessmentView.categories[i].questions[j].model.id === $(this).find("#question_id").val()) {
                                //app.assessmentView.categories[i].questions[j].$el.find("#question_arrow").attr("class", "question_arrow_active");
                                acc.activeQuestion = assess.categories[i].questions[j];
                                if (j === 0) {
                                    acc.updatingMenu = true;
                                    $(acc.openElement).click();
                                }
                                break;
                            }
                        }
                    }

                    acc.updateInterviewee(app.assessmentList.currentQuestion);


                }
                return false;
            });
            $(this).hover(
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!assess.assessmentHidden) {
                        if ($(this).attr("class") === "list_question_inactive") {
                            $(this).attr("class", "list_question_hover");
                        }
                    }
                    return false;
                },
                function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!assess.assessmentHidden) {
                        if ($(this).attr("class") === "list_question_hover") {
                            $(this).attr("class", "list_question_inactive");
                        }
                    }
                    return false;
                }
            );
        });
        for (var k = 0; k < assess.categories.length; k++) {
            if (assess.categories[k].model.id === app.assessmentList.currentCategory) {
                app.assessmentList.currentQuestion = assess.categories[k].questions[0].model.id;
                $("#assessment_nav").find('#list_question').each(function () {
                    if (parseInt($(this).find("#question_id").val()) === app.assessmentList.currentQuestion) {
                        $(this).attr("class", "list_question_active");
                        if (assess.openQuestion != null) {
                            $(assess.openQuestion).attr("class", "list_question_inactive");
                        }
                        assess.openQuestion = $(this);
                    }
                });
            }
        }
    }
});





