window.ResultsScreenView = Backbone.View.extend({

    initialize:function () {

    },
    openElement:null,
    size:"desktop",

    onEnter:function()  {

    },
    onExit:function()   {

    },
    render:function () {
        if(this.size === "desktop") {
            this.template = _.template(tpl.get("results_"+(this.model.name.toLowerCase().replace(" ", "_"))));
        }   else if(this.size === "tablet")  {
            this.template = _.template(tpl.get("narrow_results_"+(this.model.name.toLowerCase().replace(" ", "_"))));
        }   else if(this.size === "phone")  {
            this.template = _.template(tpl.get("phone_results_"+(this.model.name.toLowerCase().replace(" ", "_"))));
        }
        $(this.el).attr("class", "results_screen");
        $(this.el).html('');
        $(this.el).html(this.template(this.model));
        $(this.el).find(".results_unanswered_cell").html("<span class='results_unanswered_cell_blue'>" + parseInt(app.assessmentView.model.get("total_questions") - app.assessmentView.model.get("total_answered")) + "</span> unanswered questions >");
        this.applyLogic(this.model.name.toLowerCase());
        this.addEventHandlers(this.model.name.toLowerCase());
        $(this.el).niceScroll({cursorcolor:"#c1c1c1", cursorborder:"1px solid #c1c1c1", cursorwidth:"10px", cursoropacitymax:.8, cursorborderradius: "6px"});
        return this;
    },


    //TODO: This really needs to be broken apart into helper functions

    applyLogic:function(name)   {

        var assess = app.assessmentView,
            screen = this,
            i, j, k, l, pct;

        if(name === "overview")  {
            var goalstr = null;
            for (i = 0; i < assess.categories.length; i++) {
                for(j=0;j<assess.categories[i].questions.length;j++)  {
                    if(assess.categories[i].questions[j].model.id === 9)   {
                        pct = parseInt(assess.categories[i].questions[j].selectedAnswers[0].score)/6;
                        $(this.el).find(".bar_filled").css({"width":Math.round(pct*100)+"%"});
                        $(this.el).find(".bar_unfilled").css({"width":Math.round(1-(pct*100))+"%"});
                    }
                    if(assess.categories[i].questions[j].model.id === 7)   {
                        goalstr = "<ul>";
                        for(k=0;k<assess.categories[i].questions[j].selectedAnswers.length;k++) {
                            for(l=0;l<assess.categories[i].questions[j].model.answers.length;l++) {
                               if(assess.categories[i].questions[j].model.answers[l].id === parseInt(assess.categories[i].questions[j].selectedAnswers[k].id.replace("answer_", "")))   {
                                    goalstr = goalstr + "<li>" + assess.categories[i].questions[j].model.answers[k].text + "</li>"
                               } 
                            }
                        }
                        goalstr = goalstr + "</ul>";
                        $(screen.el).find("#company_goals").html(goalstr);
                    }
                }
            }
            $(screen.el).find("#num_employees").html('');
            _.each(app.industryList.models, function (session) {
                $(screen.el).find("#num_employees").html("(" + session.attributes.company_sizes[parseInt(app.currentSession.get("company_size"))].size + ")");
            }, this);
            $(this.el).find('#readiness_chart_label').html('');
            var data = [$.gchart.series('Readiness', [65.00, 35.00])]; 
            data[0].color = ['adca76', 'F9F9F9'];        
            $(this.el).find('#readiness_chart').gchart({type: 'pie3D', series: data, backgroundColor:"#e9e9ea"});
            var ch_lbl = "<span class='results_screen_chart_label'>" + 65 + "%</span>";
            $(this.el).find('#readiness_chart_label').html(ch_lbl);
        }   else if(name === "security")  {
            var polstr = null;

            for (i = 0; i < assess.categories.length; i++) {
                for(j=0;j<assess.categories[i].questions.length;j++)  {
                    if(assess.categories[i].questions[j].model.id === 34)   {
                        pct = parseInt(assess.categories[i].questions[j].selectedAnswers[0].score)/5;
                        $(this.el).find("#importance_filled").css({"width":Math.round(pct*100)+"%"});
                        $(this.el).find("#importance_unfilled").css({"width":Math.round(1-(pct*100))+"%"});
                    }
                    if(assess.categories[i].questions[j].model.id === 40)   {
                        pct = parseInt(assess.categories[i].questions[j].selectedAnswers[0].score)/5;
                        $(this.el).find("#definition_filled").css({"width":Math.round(pct*100)+"%"});
                        $(this.el).find("#definition_unfilled").css({"width":Math.round(1-(pct*100))+"%"});
                    }
                    if(assess.categories[i].questions[j].model.id === 13)   {
                        for(k=0;k<assess.categories[i].questions[j].selectedAnswers.length;k++) {
                            for(l=0;l<assess.categories[i].questions[j].model.answers.length;l++) {
                               if(assess.categories[i].questions[j].model.answers[l].id === parseInt(assess.categories[i].questions[j].selectedAnswers[k].id.replace("answer_", "")))   {
                                    polstr = assess.categories[i].questions[j].model.answers[k].text;
                               } 
                            }
                        }
                        $(screen.el).find("#security_policy").html(polstr);
                    }
                    if(assess.categories[i].questions[j].model.id === 36)   {
                        var reqstr = "<ul>";
                        for(k=0;k<assess.categories[i].questions[j].selectedAnswers.length;k++) {
                            for(l=0;l<assess.categories[i].questions[j].model.answers.length;l++) {
                               if(assess.categories[i].questions[j].model.answers[l].id === parseInt(assess.categories[i].questions[j].selectedAnswers[k].id.replace("answer_", "")))   {
                                    reqstr = reqstr + "<li>" + assess.categories[i].questions[j].model.answers[k].text + "</li>"
                               } 
                            }
                        }
                        reqstr = reqstr + "</ul>";
                        $(screen.el).find("#security_requirements").html(reqstr);
                    }
                    if(assess.categories[i].questions[j].model.id === 37)   {
                        var constr = "<ul>";
                        for(k=0;k<assess.categories[i].questions[j].selectedAnswers.length;k++) {
                            for(l=0;l<assess.categories[i].questions[j].model.answers.length;l++) {
                               if(assess.categories[i].questions[j].model.answers[l].id === parseInt(assess.categories[i].questions[j].selectedAnswers[k].id.replace("answer_", "")))   {
                                    constr = constr + "<li>" + assess.categories[i].questions[j].model.answers[k].text + "</li>"
                               } 
                            }
                        }
                        constr = constr + "</ul>";
                        $(screen.el).find("#security_concerns").html(constr);
                    }
                }
            }
        }   else if(name === "opportunities")  {
            var feedbacks = [];
            for (i = 0; i < assess.categories.length; i++) {
                for(j=0;j<assess.categories[i].questions.length;j++)  {
                    for(k=0;k<assess.categories[i].questions[j].selectedAnswers.length;k++) {
                        for(l=0;l<assess.categories[i].questions[j].model.answers.length;l++) {
                            if(assess.categories[i].questions[j].model.answers[l].id === parseInt(assess.categories[i].questions[j].selectedAnswers[k].id.replace("answer_", "")))   {
                                for(var m=0;m<app.resultsView.model.attributes.feedback.length;m++)    {
                                    if(parseInt(assess.categories[i].questions[j].model.answers[l].feedback) === parseInt(app.resultsView.model.attributes.feedback[m].id)) {
                                        var dupe = false;
                                        for(var n=0;n<feedbacks.length;n++) {
                                            if(feedbacks[n] === parseInt(app.resultsView.model.attributes.feedback[m].id))    {
                                                dupe = true;
                                                break;
                                            }
                                        }
                                        if(!dupe)   {
                                            feedbacks.push(parseInt(app.resultsView.model.attributes.feedback[m].id));
                                            if(app.resultsView.model.attributes.feedback[m].category === "byod") {
                                                $(screen.el).find("#byod_feedback").append(app.resultsView.model.attributes.feedback[m].text + "<br /><br />");
                                            }   else if(app.resultsView.model.attributes.feedback[m].category === "vxi") {
                                                $(screen.el).find("#bvxi_feedback").append(app.resultsView.model.attributes.feedback[m].text + "<br /><br />");
                                            }   else if(app.resultsView.model.attributes.feedback[m].category === "other") {
                                                $(screen.el).find("#other_feedback").append(app.resultsView.model.attributes.feedback[m].text + "<br /><br />");
                                            }   else if(app.resultsView.model.attributes.feedback[m].category === "vertical") {
                                                $(screen.el).find("#vertical_feedback").append(app.resultsView.model.attributes.feedback[m].text + "<br /><br />");
                                            }
                                        }
                                    }
                                }
                            } 
                        }
                    }
                }
            }
            var unanswered = "No questions have been answered related to this category.";
            if($(screen.el).find("#byod_feedback").html() === '')    {
                $(screen.el).find("#byod_feedback").html(unanswered)
            }
            if($(screen.el).find("#vxi_feedback").html() === '')    {
                $(screen.el).find("#vxi_feedback").html(unanswered)
            }
            if($(screen.el).find("#other_feedback").html() === '')    {
                $(screen.el).find("#other_feedback").html(unanswered)
            }
            if($(screen.el).find("#vertical_feedback").html() === '')    {
                $(screen.el).find("#vertical_feedback").html(unanswered)
            }
        }
    },

    addEventHandlers:function() {
        $(this.el).find(".results_unanswered_cell").click(function(e)    {
            e.preventDefault();
            app.setState(app.assessmentView);
            app.startInterval();
        });
    },
    hideScreen:function()   {
        if(!isIE9())    {
            TweenLite.to(this.$el,.3, {css:{autoAlpha:0}});
        }   else    {
            this.$el.css({"opacity":0, "visibility":"hidden"});
        }
        $(this.el).getNiceScroll().hide();
    },
    showScreen:function()   {
        this.$el.height($("#results_main").height());
        if(!isIE9())    {
            TweenLite.to(this.$el,.3, {css:{autoAlpha:1}, delay:.2});
        }   else    {
            this.$el.css({"opacity":1, "visibility":"visible"});
        }
        $(this.el).getNiceScroll().show();
        app.resultsView.activeScreen = this;
    }
});