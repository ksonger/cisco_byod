/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
window.SessionsView = Backbone.View.extend({

    tagName:'div',
    assessmentID:1,
    openSessions:null,
    closedSessions:null,
    activeList:null,
    newForm:null,
    appState:"sessions",
    active:"inactive",

    initialize:function () {
        this.template = _.template(tpl.get('sessions'));

        this.model.bind("change", function (session) {
            //self.render();
        });
        this.$el = jQuery('<div/>', {
            id:"sessions"
        }).appendTo("#main");
    },

    events: {
        "click #new_button":"newAssessment"
    },

    onEnter:function()  {
        try {
            $("#accordion-1").find("#session_list").getNiceScroll().show();
            $("#accordion-2").find("#session_list").getNiceScroll().hide();
        } catch(e)  {

        }
    },

    onExit:function()  {
        $("#accordion-1").find("#session_list").getNiceScroll().hide();
        $("#accordion-2").find("#session_list").getNiceScroll().hide();
    },

    render:function () {
        this.$el.html('');
        TweenLite.to(this.$el, .01, {css:{autoAlpha:0}});
        this.$el.html(this.template());

        this.openSessions = new AccordionView({model:this.model, filter:"open"});
        this.openSessions.$el.appendTo(this.$el.find("#accordion-1").find("#session_list"));

        this.closedSessions = new AccordionView({model:this.model, filter:"closed"});
        this.closedSessions.$el.appendTo(this.$el.find("#accordion-2").find("#session_list"));

        this.closedSessions.$el.css({"visibility":"hidden"});

        if(this.activeList == null) {
            this.activeList = this.openSessions;
        }
        var sess = this;

        this.$el.find("#active_button").click(function()    {

            var acc1 = $("#accordion-1"),
                list1 = acc1.find("#session_list"),
                acc2 = $("#accordion-2");

            $(this).find(".btn_left").attr("class", "btn_left_selected");
            $(this).find(".btn_middle").attr("class", "btn_middle_selected");
            $(this).find("#active_assessments_button").attr("class", "selected_font");
            $(this).find(".btn_right").attr("class", "btn_right_selected");

            sess.$el.find("#closed_button .btn_left_selected").attr("class", "btn_left");
            sess.$el.find("#closed_button .btn_middle_selected").attr("class", "btn_middle");
            sess.$el.find("#closed_assessments_button").attr("class", "unselected_font");
            sess.$el.find("#closed_button .btn_right_selected").attr("class", "btn_right");


            //sess.$el.find("#new_button").attr("class", "active_closed_new");

            TweenLite.to(sess.closedSessions.$el, .01, {css:{autoAlpha:0}});
            TweenLite.to(sess.openSessions.$el, .01, {css:{autoAlpha:1}});
            sess.activeList = sess.openSessions;
            list1.getNiceScroll().show();
            list1.getNiceScroll().hide();
            acc1.css({"z-index":5000});
            acc2.css({"z-index":4000});
        });
        this.$el.find("#closed_button").click(function()    {
            $(this).find(".btn_left").attr("class", "btn_left_selected");
            $(this).find(".btn_middle").attr("class", "btn_middle_selected");
            $(this).find("#closed_assessments_button").attr("class", "selected_font");
            $(this).find(".btn_right").attr("class", "btn_right_selected");


            sess.$el.find("#active_button .btn_left_selected").attr("class", "btn_left");
            sess.$el.find("#active_button .btn_middle_selected").attr("class", "btn_middle");
            sess.$el.find("#active_assessments_button").attr("class", "unselected_font");
            sess.$el.find("#active_button .btn_right_selected").attr("class", "btn_right");

            //sess.$el.find("#new_button").attr("class", "active_closed_new");
            TweenLite.to(sess.closedSessions.$el, .01, {css:{autoAlpha:1}});
            TweenLite.to(sess.openSessions.$el, .01, {css:{autoAlpha:0}});
            sess.activeList = sess.closedSessions;
            list1.getNiceScroll().hide();
            list2.getNiceScroll().show();
            acc2.css({"z-index":5000});
            acc1.css({"z-index":4000});
        });

        this.addEventHandlers();
        try{
            list1.niceScroll({cursorcolor:"#c1c1c1", cursorborder:"1px solid #c1c1c1", cursorwidth:"10px", cursoropacitymax:.8, cursorborderradius: "6px"});
            list2.niceScroll({cursorcolor:"#c1c1c1", cursorborder:"1px solid #c1c1c1", cursorwidth:"10px", cursoropacitymax:.8, cursorborderradius: "6px"});
            $("#accordion-1").css({"z-index":5000});
        }   catch(e)    {

        }

        sess.$el.find("#active_button .btn_left").attr("class", "btn_left_selected");
        sess.$el.find("#active_button .btn_middle").attr("class", "btn_middle_selected");
        sess.$el.find("#active_assessments_button").attr("class", "selected_font");
        sess.$el.find("#active_button .btn_right").attr("class", "btn_right_selected");

        app.startInterval();
        return this;
    },

    addEventHandlers:function () {
        var sess = this;
        sess.$el.each(function () {
            $(this).find('.company_sort').click(function (e) {
                e.preventDefault();
                if(app.sessionList.comparatorKey == "company")  {
                    if(app.sessionList.sortOrder == "forward")  {
                        app.sessionList.sortOrder = "reverse";
                    }
                    else if(app.sessionList.sortOrder == "reverse")  {
                        app.sessionList.sortOrder = "forward";
                    }
                }   else    {
                    app.sessionList.sortOrder = "forward";
                    app.sessionList.comparatorKey = "company";
                }
                app.sessionList.sort();
                sess.activeList.render();
            });
            $(this).find('.contact_sort').click(function (e) {
                e.preventDefault();
                if(app.sessionList.comparatorKey == "main_contact_fname")  {
                    if(app.sessionList.sortOrder == "forward")  {
                        app.sessionList.sortOrder = "reverse";
                    }
                    else if(app.sessionList.sortOrder == "reverse")  {
                        app.sessionList.sortOrder = "forward";
                    }
                }   else    {
                    app.sessionList.sortOrder = "forward";
                    app.sessionList.comparatorKey = "main_contact_fname";
                }
                app.sessionList.sort();
                sess.activeList.render();
            });
            $(this).find('.date_sort').click(function (e) {
                e.preventDefault();
                if(app.sessionList.comparatorKey == "modified")  {
                    if(app.sessionList.sortOrder == "forward")  {
                        app.sessionList.sortOrder = "reverse";
                    }
                    else if(app.sessionList.sortOrder == "reverse")  {
                        app.sessionList.sortOrder = "forward";
                    }
                }   else    {
                    app.sessionList.sortOrder = "forward";
                    app.sessionList.comparatorKey = "modified";
                }
                app.sessionList.sort();
                sess.activeList.render();
            });
        });
    },

    newAssessment:function()    {
        if (app.newAssessmentView != null) {
            app.newAssessmentView.close();
        }
        app.newAssessmentView = new FormView({model:new Session(), industries:app.industryList});
        app.newAssessmentView.render();
        app.setState(app.newAssessmentView);
    }
});