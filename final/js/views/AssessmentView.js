/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
window.AssessmentView = Backbone.View.extend({

    tagName: 'div',
    appState: "assessment",
    nav: null,
    nav_expanded: true,
    interviewees_expanded: false,
    intervieweesScreen: null,
    edit_session_expanded: false,
    animatingMenu: false,
    currentCategoryObj: null,
    currentQuestionObj: null,
    mainScroll: null,
    savedScroll: null,
    categories: [],

    initialize: function () {
        this.template = _.template(tpl.get('assessment'));
        this.$el = jQuery('<div/>', {
            id: "assessment"
        }).appendTo("#main");
    },


    onEnter: function () {
        $("#assessment_nav").find("#list").getNiceScroll().show();
    },

    onExit: function () {
        $("#assessment_nav").find("#list").getNiceScroll().hide();
    },

    scrollAssessment: function (typ) {
        var element,
            assess_table = $("#assessment_table"),
            adj = assess_table.height() * .1;

        if (typ == "category") {
            element = this.openCategory.find("#category_id").val();
        }
        if (typ == "question") {
            element = this.openQuestion.find("#question_id").val();
        }

        for (var i = 0; i < this.categories.length; i++) {
            if (typ == "category" && this.categories[i].model.id == element) {
                try {

                    this.mainScroll.scrollTo(this.categories[i].$el.offset().top - adj + this.mainScroll.nativeScroll.scrollTop() - assess_table.offset().top);
                } catch (e) {

                }
            } else if (typ == "question") {
                for (var j = 0; j < this.categories[i].questions.length; j++) {
                    if (this.categories[i].questions[j].model.id == element) {
                        try {
                            this.mainScroll.scrollTo(this.categories[i].questions[j].$el.offset().top - adj + this.mainScroll.nativeScroll.scrollTop() - assess_table.offset().top);
                        } catch (e) {

                        }
                    }
                }
            }

        }
    },

    render: function () {
        this.$el.html('');
        TweenLite.to(this.$el, .01, {css: {autoAlpha: 0}});
        this.$el.html(this.template(this.model.attributes));
        this.categories = [];

        var i, j,
            assess_nav = $("#assessment_nav");


        for (i = 0; i < this.model.attributes.categories.length; i++) {
            var cat = new CategoryView({model: this.model.attributes.categories[i]});
            cat.render().$el.appendTo($("#assessment_main"));
            this.categories.push(cat);
        }
        this.$el.find("#company_name_button").html("Assessment for " + app.currentSession.get("company"));
        var totalQuestions = 0;
        var totalAnswered = 0;
        for (i = 0; i < this.model.get("categories").length; i++) {
            totalQuestions += this.categories[i].questions.length;
            for (j = 0; j < this.model.attributes.categories[i].questions.length; j++) {
                if (this.categories[i].questions[j].selectedAnswers.length > 0) {
                    totalAnswered++;
                }
            }
        }

        this.model.set({total_questions: totalQuestions});
        this.model.set({total_answered: totalAnswered});
        this.currentQuestionObj = this.categories[0].questions[0];

        $(".completion_bar_text").html(totalAnswered + " of " + totalQuestions);

        this.assessmentAccordion = new AssessmentAccordionView({model: this.categories});
        this.assessmentAccordion.render().$el.appendTo(assess_nav.find("#list"));
        this.assessmentAccordion.openElement.click();
        this.assessmentAccordion.updatingMenu = true;
        this.assessmentAccordion.openQuestion.click();

        for (i = 0; i < this.categories.length; i++) {
            for (j = 0; j < this.categories[i].questions.length; j++) {
                app.assessmentView.assessmentAccordion.setQuestionClass(this.categories[i].questions[j].model.id, this.categories[i].questions[j].selectedAnswers.length);
            }
        }
        this.addEventHandlers();

        assess_nav.find("#list").niceScroll({cursorcolor: "#c1c1c1", cursorborder: "1px solid #c1c1c1", cursorwidth: "10px", cursoropacitymax: .8, cursorborderradius: "6px"});

        // interviewees screen
        this.intervieweesScreen = new IntervieweesView({model: app.currentSession});
        this.intervieweesScreen.render().$el.appendTo("#assessment");

        this.editScreen = new SessionEditView({model: app.currentSession, industries: app.industryList});
        this.editScreen.render().$el.appendTo("#assessment");

        this.addScrolling();
        this.updateBar();
        app.startInterval();
        return this;

    },

    addScrolling: function () {
        if (this.mainScroll == null) {
            this.mainScroll = new ScrollbarView({
                target: "#assessment_main",
                container: "#assessment_table",
                rail_class: "custom_scroll_bar_rail",
                scroll_class: "custom_scroll_bar_handle",
                scroll_id: "main_scroll"
            });
            this.mainScroll.render().$el.appendTo(this.$el);
        }
    },

    addEventHandlers: function () {
        this.$el.find("#home_button_cell").click(function (e) {
            e.preventDefault();
            app.setState(app.sessionView);
            app.startInterval();
        });
        var assess = this,
            assess_nav = $("#assessment_nav"),
            assess_main = $("#assessment_main");

        this.$el.find("#thumb_handle").click(function (e) {
            e.preventDefault();
            var w = 250,
                list = assess_nav.find("#list");

            if (assess.nav_expanded) {
                assess_nav.find("#list").getNiceScroll().hide();
                w = assess_main.width() + 250;
                if (!isIE9()) {
                    TweenLite.to(assess_nav, .35, {css: {width: "1px"}});
                    TweenLite.to(assess_main, .35, {css: {width: w + "px"}});
                    TweenLite.to(list, .1, {css: {autoAlpha: 0, "left": -w + "px"}});
                    $("#thumb_handle").attr('class', 'thumb_expand');
                } else {
                    assess_nav.width(1);
                    assess_main.width(w);
                    list.css({"left": -w + "px"});
                    $("#thumb_handle").attr('class', 'thumb_expand');
                    assess_main.scrollTop(app.assessmentView.savedScroll);
                }
            } else {
                w = assess_main.width() - 250;
                if (!isIE9()) {
                    TweenLite.to(assess_nav, .35, {css: {width: "250px"}});
                    TweenLite.to(assess_main, .35, {css: {width: w + "px"}});
                    TweenLite.to(list, .01, {css: {"left": "1px"}});
                    TweenLite.to(list, .35, {css: {autoAlpha: 1}, delay: .4});
                    $("#thumb_handle").attr('class', 'thumb_contract');
                } else {
                    assess_nav.width(250);
                    assess_main.width(w);
                    list.css({"left": "1px"});
                    $("#thumb_handle").attr('class', 'thumb_contract');
                    assess_main.scrollTop(app.assessmentView.savedScroll);

                }
                window.setTimeout(assess.showScroll, 300);
            }
            assess.nav_expanded = !assess.nav_expanded;
            return false;
        });
        this.$el.find("#interviewees_cell").click(function (e) {
            e.preventDefault();
            if (!assess.interviewees_expanded) {
                assess.showInterviewees();
            } else {
                assess.hideInterviewees();
            }
            assess.interviewees_expanded = !assess.interviewees_expanded;
        });
        this.$el.find("#company_name_cell").click(function (e) {
            e.preventDefault();
            if (!assess.edit_session_expanded) {
                assess.showEdit();
            } else {
                assess.hideEdit();
            }
            assess.edit_session_expanded = !assess.edit_session_expanded;
        });
        this.$el.find("#thumb_handle").bind("selectstart", function () {
            return false;
        });

        this.$el.find('#results_button').click(function (e) {
            e.preventDefault();
            if (app.resultsView != null) {
                app.resultsView.close();
            }
            app.resultsView = new ResultsView({model: new Results()});
            app.resultsView.model.fetch({success: function () {
                app.resultsView.render().$el.appendTo("#main");
                app.setState(app.resultsView);
            }, error: function (e) {
                console.log('e')
            }});
        });
    },

    showScroll: function () {
        $("#assessment_nav").find("#list").getNiceScroll().show();
    },

    hideAssessment: function () {

        var assess_main = $("#assessment_main"),
            assess_nav = $("#assessment_nav");

        assess_nav.find("#list").getNiceScroll().hide();
        if (!isIE9()) {
            TweenLite.to(assess_main, .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
            TweenLite.to(assess_nav, .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
            TweenLite.to(assess_nav.find("#list"), .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
            TweenLite.to($("#thumb_seperator"), .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
        } else {
            assess_main.css({"opacity": 0, "visibility": "hidden"});
            assess_nav.css({"opacity": 0, "visibility": "hidden"});
            assess_nav.find("#list").css({"opacity": 0, "visibility": "hidden"});
            $("#thumb_seperator").css({"opacity": 0, "visibility": "hidden"});
        }
    },

    showAssessment: function () {

        var assess_nav = $("#assessment_nav");

        if (!isIE9()) {
            TweenLite.to(assess_main, .35, {css: {autoAlpha: 1}, ease: Sine.easeOut, delay: .2});
            TweenLite.to(assess_nav, .35, {css: {autoAlpha: 1}, ease: Sine.easeOut, delay: .2});
            TweenLite.to(assess_nav.find("#list"), .35, {css: {autoAlpha: 1}, ease: Sine.easeOut, delay: .2});
            TweenLite.to($("#thumb_seperator"), .35, {css: {autoAlpha: 1}, ease: Sine.easeOut, delay: .2});
        } else {
            $("#assessment_main").css({"opacity": 1, "visibility": "visible"});
            assess_nav.css({"opacity": 1, "visibility": "visible"});
            assess_nav.find("#list").css({"opacity": 1, "visibility": "visible"});
            $("#thumb_seperator").css({"opacity": 1, "visibility": "visible"});
        }
        assess_nav.find("#list").getNiceScroll().show();
    },

    showInterviewees: function () {
        this.intervieweesScreen.render();
        var interviewee_cell = $("#interviewees_cell"),
            interviewee_btn = $("#interviewee_button"),
            name_cell = $("#company_name_cell"),
            interviewee_main = $("#interviewees_main");

        interviewee_cell.find(".btn_left").attr("class", "btn_left_selected");
        interviewee_cell.find(".btn_middle").attr("class", "btn_middle_selected");
        interviewee_btn.attr("class", "selected_font");
        interviewee_cell.find(".btn_right").attr("class", "btn_right_selected");

        if (this.edit_session_expanded) {
            name_cell.find(".btn_left_selected").attr("class", "btn_left");
            name_cell.find(".btn_middle_selected").attr("class", "btn_middle");
            $("#company_name_button").attr("class", "unselected_font");
            name_cell.find(".btn_right_selected").attr("class", "btn_right");
            if (!isIE9()) {
                TweenLite.to($("#session_edit_main"), .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
            } else {
                $("#session_edit_main").css({"opacity": 0, "visibility": "hidden"});
            }

            this.edit_session_expanded = !this.edit_session_expanded;
        }
        this.highlightSelectedInterviewee();
        this.hideAssessment();
        if (!isIE9()) {
            TweenLite.to(interviewee_main, .35, {css: {autoAlpha: 1}, ease: Sine.easeOut, delay: .2});
        } else {
            interviewee_main.css({"opacity": 1, "visibility": "visible"});
            interviewee_main.scrollTop(app.assessmentView.savedScroll);
        }
    },

    hideInterviewees: function () {
        var interviewee_cell = $("#interviewees_cell"),
            interviewee_btn = $("#interviewee_button"),
            interviewee_main = $("#interviewees_main");

        this.showAssessment();
        interviewee_cell.find(".btn_left_selected").attr("class", "btn_left");
        interviewee_cell.find(".btn_middle_selected").attr("class", "btn_middle");
        interviewee_btn.attr("class", "unselected_font");
        interviewee_cell.find(".btn_right_selected").attr("class", "btn_right");
        if (!isIE9()) {
            TweenLite.to(interviewee_main, .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
        } else {
            interviewee_main.css({"opacity": 0, "visibility": "hidden"});
            interviewee_main.scrollTop(app.assessmentView.savedScroll);
        }


    },

    showEdit: function () {

        var interviewee_cell = $("#interviewees_cell"),
            interviewee_btn = $("#interviewee_button"),
            name_cell = $("#company_name_cell");

        if (this.interviewees_expanded) {
            interviewee_cell.find(".btn_left_selected").attr("class", "btn_left");
            interviewee_cell.find(".btn_middle_selected").attr("class", "btn_middle");
            interviewee_btn.attr("class", "unselected_font");
            interviewee_cell.find(".btn_right_selected").attr("class", "btn_right");
            if (!isIE9()) {
                TweenLite.to($("#interviewees_main"), .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
            } else {
                $("#interviewees_main").css({"opacity": 0, "visibility": "hidden"});
            }

            this.interviewees_expanded = !this.interviewees_expanded;
        }
        this.hideAssessment();
        name_cell.find(".btn_left").attr("class", "btn_left_selected");
        name_cell.find(".btn_middle").attr("class", "btn_middle_selected");
        name_cell.attr("class", "selected_font");
        name_cell.find(".btn_right").attr("class", "btn_right_selected");
        if (!isIE9()) {
            TweenLite.to($("#session_edit_main"), .35, {css: {autoAlpha: 1}, ease: Sine.easeOut, delay: .2});
        } else {
            $("#session_edit_main").css({"opacity": 1, "visibility": "visible"});
            $("#assessment_main").scrollTop(app.assessmentView.savedScroll);
        }


    },

    hideEdit: function () {

        var name_cell = $("#company_name_cell"),
            name_btn = $("#interviewee_button");

        this.showAssessment();
        name_cell.find(".btn_left_selected").attr("class", "btn_left");
        name_cell.find(".btn_middle_selected").attr("class", "btn_middle");
        name_btn.attr("class", "unselected_font");
        name_cell.find(".btn_right_selected").attr("class", "btn_right");

        if (!isIE9()) {
            TweenLite.to($("#session_edit_main"), .35, {css: {autoAlpha: 0}, ease: Sine.easeOut});
        } else {
            $("#session_edit_main").css({"opacity": 0, "visibility": "hidden"});
            $("#assessment_main").scrollTop(app.assessmentView.savedScroll);
        }
    },

    highlightSelectedInterviewee: function () {
        if (this.currentQuestionObj.selectedInterviewee != null) {
            var answered_by = this.currentQuestionObj.selectedInterviewee;
            this.$el.find("#interviewees_table").find("#interviewee_id").each(function () {
                if ($(this).val() == answered_by) {
                    $(this).next("button").attr("class", "current_interviewee_selected");
                } else {
                    $(this).next("button").attr("class", "current_interviewee");
                }
            });
        }
    },

    selectExistingInterviewee: function (id) {
        for (var i = 0; i < this.currentQuestionObj.selectedAnswers.length; i++) {
            this.currentQuestionObj.selectedAnswers[i].answered_by = id;
        }
        this.currentQuestionObj.selectedInterviewee = id;
        this.hideInterviewees();
        this.assessmentAccordion.updateInterviewee(this.currentQuestionObj.model.id);
        this.currentQuestionObj.change();
        this.interviewees_expanded = !this.interviewees_expanded;
    },

    selectNewInterviewee: function (fn, ln, r) {
        var cModel = new Contact();
        cModel.set({
            fname: fn,
            lname: ln,
            role: r
        });
        cModel.save(null, {success: function (response) {
            var sess_interviewees = app.currentSession.get("interviewees");
            var obj = (response.attributes);
            var list = app.currentSession.get("interviewees_list");
            list.push(obj);
            app.currentSession.set("interviewees_list", list);
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {

                    if (key == 'id') {
                        sess_interviewees = sess_interviewees + "," + String(obj[key]);
                        app.currentSession.set("interviewees", sess_interviewees);
                        app.currentSession.save(null, {success: function () {
                            //finally, update the view
                            for (var i = 0; i < app.assessmentView.currentQuestionObj.selectedAnswers.length; i++) {
                                if (i === 0) {
                                    app.assessmentView.currentQuestionObj.selectedAnswers[i].answered_by = obj[key];
                                }
                                app.assessmentView.currentQuestionObj.selectedInterviewee = obj[key];
                            }

                            app.assessmentView.hideInterviewees();
                            app.assessmentView.assessmentAccordion.updateInterviewee(app.assessmentView.currentQuestionObj.model.id);
                            app.assessmentView.currentQuestionObj.change();
                            app.sessionView.openSessions.render();
                            app.sessionView.closedSessions.render();
                            app.assessmentView.interviewees_expanded = !app.assessmentView.interviewees_expanded;
                        }, error: function (e) {
                            console.log("sess_error: " + e);
                        }});
                    }
                }
            }
        }, error: function (e) {
            console.log("error: " + e);
        }
        });
    },

    updateBar: function () {
        var totalQuestions = 0;
        var totalAnswered = 0;
        for (var i = 0; i < this.model.get("categories").length; i++) {
            totalQuestions += this.categories[i].questions.length;
            for (var j = 0; j < this.model.attributes.categories[i].questions.length; j++) {
                if (this.categories[i].questions[j].selectedAnswers.length > 0) {
                    totalAnswered++;
                }
            }
        }
        this.model.set({total_questions: totalQuestions});
        this.model.set({total_answered: totalAnswered});
        try {
            $(".completion_bar_text").html(totalAnswered + " of " + totalQuestions);
            if (isIE9()) {
                $("#assessment_main").scrollTop(app.assessmentView.savedScroll);
            }
        } catch (e) {

        }
        var pct = (Math.ceil((totalAnswered / totalQuestions) * 100)) / 100;
        var w = ($("#completion_bar_base").width() + 1) * pct;
        TweenLite.to($("#completion_bar_fill"), .4, {css: {width: w + "px"}, ease: Strong.easeOut});
    }
});