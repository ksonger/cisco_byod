/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 10/2/12
 * Time: 5:07 PM
 * To change this template use File | Settings | File Templates.
 */
 window.IntervieweesView = Backbone.View.extend({
 	initialize:function () {
 		this.template = _.template(tpl.get('interviewees'));
 	},
 	render:function (eventName) {
        this.$el.html('');
 		this.$el.attr("id", "interviewees_main");
 		this.$el.html(this.template(this.model.attributes));
 		this.addEventListeners();
        if(!isIE9())    {
            TweenLite.to(this.$el,.01, {css:{autoAlpha:0}, ease:Sine.easeOut});
        }   else{
            this.$el.css({"opacity":0, "visibility":"hidden"});
        }
 		return this;
 	},
 	addEventListeners:function()	{
 		this.$el.find("#interviewee_select_button").each(function()	{
 			$(this).click(function()	{
 				if($(this).attr("class") == "current_interviewee")	{
 					app.assessmentView.selectExistingInterviewee($(this).prev("#interviewee_id").val())
 				}
 			});
 		});
 		this.$el.find(".form_save").click(function()	{
 			if($("#interviewees_main").find("#first_name").val() != $("#interviewees_main").find("#first_name").attr('data-default') && $("#interviewees_main").find("#last_name").val() != $("#interviewees_main").find("#last_name").attr('data-default') && $("#interviewees_main").find("#job_role").val() != $("#interviewees_main").find("#job_role").attr('data-default'))	{
 				app.assessmentView.selectNewInterviewee($("#interviewees_main").find("#first_name").val(), $("#interviewees_main").find("#last_name").val(), $("#interviewees_main").find("#job_role").val());
 			}	else{
 				console.log("highlight missing inputs");
 			}
 		});
        this.$el.find("#close_button").click(function() {
            app.assessmentView.hideInterviewees();
            app.assessmentView.interviewees_expanded = false;
        });

 		this.$el.find("#first_name").focus(function() {
            var el = $(this);
            if(el.val() == el.attr('data-default'))    {
                    $(this).val('');
            }
        });
        this.$el.find("#first_name").blur(function() {
            var el = $(this);
            if(el.val() == '')  {
                el.val(el.attr('data-default'));
            }
        });

        this.$el.find("#last_name").focus(function() {
            var el = $(this);
            if(el.val() == el.attr('data-default'))    {
                    $(this).val('');
            }
        });
        this.$el.find("#last_name").blur(function() {
            var el = $(this);
            if(el.val() == '')  {
                el.val(el.attr('data-default'));
            }
        });

        this.$el.find("#job_role").focus(function() {
            var el = $(this);
            if(el.val() == el.attr('data-default'))    {
                    $(this).val('');
            }
        });
        this.$el.find("#job_role").blur(function() {
            var el = $(this);
            if(el.val() == '')  {
                el.val(el.attr('data-default'));
            }
        });
 	}
 });
