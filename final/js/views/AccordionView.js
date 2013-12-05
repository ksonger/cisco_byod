/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/20/12
 * Time: 9:03 AM
 * To change this template use File | Settings | File Templates.
 */
window.AccordionView = Backbone.View.extend({
    openElement:null,
    initialize:function () {
        this.$el = jQuery('<ul/>', {
            id:"acc"
        });
        this.model.bind("refresh", function (session) {

        });
    },

    addItem:function (session) {
        var acc = this;
        session.attributes.dates_modified_list = session.attributes.modified.split(",");
        session.attributes.interviewees_list = [
            {"fname":session.attributes.main_contact_fname, "lname":session.attributes.main_contact_lname, "role":session.attributes.main_contact_role}
        ];
        var item = new AccordionItemView({model:session});
        acc.$el.append(item.render().el.innerHTML);
        this.model.sort();
        this.render();
        this.addEventHandlers();
        //this.resetForm();
    },

    addEventHandlers:function (lastOpen) {
        var acc = this;
        acc.$el.find('#head').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                if (acc.openElement != null) {
                    var isSameElement = (acc.openElement == this);
                    if (!isSameElement) {
                        $(acc.openElement).attr("class", "head_inactive");
                        TweenLite.to($(acc.openElement).next(".sessionListItemContent"), .3, {css:{height:1, autoAlpha:0}});
                    }
                }
                acc.openElement = this;
                $(this).next(".content").css({"visibility":"visible"});
                $(this).attr("class", "head_active");
                TweenLite.to($(this).next(".sessionListItemContent"), .3, {css:{height:$(this).next(".sessionListItemContent").find("#accordion_details").height(), autoAlpha:1}});
            });
            $(this).hover(
                function () {
                    if ($(this).attr("class") == "head_inactive") {
                        $(this).attr("class", "head_hover");
                    }
                },
                function () {
                    if ($(this).attr("class") == "head_hover") {
                        $(this).attr("class", "head_inactive");
                    }
                }
            );
            if (lastOpen != null) {
                if (lastOpen == $(this).next(".sessionListItemContent").find("#assessment_id").html()) {
                    $(this).next(".content").css({"visibility":"visible"});
                    $(this).attr("class", "head_active");
                    TweenLite.to($(this).next(".sessionListItemContent"), .01, {css:{height:$(this).next(".sessionListItemContent").find("#accordion_details").height(), autoAlpha:1}});
                    acc.openElement = this;
                }
            }
        });
        acc.$el.find('#assessment_continue').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                app.currentSession = app.sessionList.get(parseInt(this.value));

                /*
                 THIS LEADS TO THE CATEGORY SECTIONS PAGE THAT WAS REMOVED FROM THE FLOW
                 if(app.assessmentSectionsView == null)  {
                 app.assessmentSectionsView = new AssessmentSectionsView({model:new Assessment()});
                 app.assessmentSectionsView.model.fetch({success:function () {
                 app.assessmentSectionsView.render();
                 app.setState(app.assessmentSectionsView);
                 }});
                 }   else    {
                 app.setState(app.assessmentSectionsView);
                 }
                 */

                app.assessmentList.currentCategory = 1;
                if (app.assessmentView != null) {
                    app.assessmentView.close();
                }
                app.assessmentView = new AssessmentView({model:new Assessment()});
                app.assessmentView.model.fetch({success:function () {
                    app.assessmentView.render();
                    app.setState(app.assessmentView);
                }});
            });
        });
        acc.$el.find('#assessment_status').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                var new_status = "closed";
                if (acc.options.filter == "closed") {
                    new_status = "open";
                }
                _.each(acc.model.models, function (session) {
                    if (session.get("id") == parseInt(this.value)) {
                        session.set({status:new_status});
                        session.save();
                        app.sessionView.openSessions.render();
                        app.sessionView.closedSessions.render();
                    }
                }, this);
            });
        });
        acc.$el.find('#assessment_edit').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                _.each(acc.model.models, function (session) {
                    if (session.get("id") == parseInt(this.value)) {
                        if (app.newAssessmentView != null) {
                            app.newAssessmentView.close();
                        }
                        app.currentSession = session;
                        app.newAssessmentView = new FormView({model:session, industries:app.industryList});
                        app.newAssessmentView.render();
                        app.setState(app.newAssessmentView);
                    }
                }, this);
            });
        });
        acc.$el.find('#assessment_results').each(function () {
            $(this).click(function (e) {
                e.preventDefault();
                var btn = this;
                app.currentSession = app.sessionList.get(parseInt(this.value));
                app.assessmentList.currentCategory = 1;
                if (app.assessmentView != null) {
                    app.assessmentView.close();
                }
                app.assessmentView = new AssessmentView({model:new Assessment()});
                app.assessmentView.model.fetch({success:function () {
                    app.assessmentView.render();
                    _.each(acc.model.models, function (session) {
                        if (session.get("id") == parseInt(btn.value)) {
                            app.currentSession = session;
                            if (app.resultsView != null) {
                                app.resultsView.close();
                            }
                            app.resultsView = new ResultsView({model:new Results()});
                            app.resultsView.model.fetch({success:function () {
                                app.resultsView.render().$el.appendTo("#main");
                                app.setState(app.resultsView);
                            }});
                        }
                    }, this);
                }});
            });
        });
    },

    render:function (eventName) {
        var acc = this;
        var lastOpen = null;
        if (acc.openElement != null) {
            lastOpen = $(acc.openElement).next(".sessionListItemContent").find("#assessment_id").html();
            acc.openElement = null;
        }

        acc.$el.html('');
        _.each(this.model.models, function (session) {
            if (session.get("status") == acc.options.filter) {
                var item = new AccordionItemView({model:session});
                acc.$el.append(item.render().el.innerHTML);
                TweenLite.to(acc.$el.find(".sessionListItemContent"), .01, {css:{height:1, autoAlpha:0}});
                acc.$el.find(".sessionListItemContent").css({"visibility":"hidden", "overflow":"hidden"});
            }
        }, this);
        this.addEventHandlers(lastOpen);
        return this;
    }
});