/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/17/12
 * Time: 9:50 AM
 * To change this template use File | Settings | File Templates.
 */
window.FormView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('form-view'));
        this.model.bind("change", this.render, this);
        this.$el = jQuery('<div/>', {
            id:"assessment_form"
        }).appendTo("#main");
    },
    isNew: null,
    onEnter:function () {
        try {
            $("#form_content").getNiceScroll().show();
        } catch (e) {
            console.log(e);
        }
    },
    onExit:function () {
        $("#form_content").getNiceScroll().hide();
    },
    events:{
        "change input":"change",
        "click .form_save":"saveSession"
    },

    change:function (event) {
        var target = event.target;
        // could change the model on the spot, like this:
        // var change = {};
        // change[target.name] = target.value;
        // this.model.set(change);
    },

    saveSession:function () {
        var d = new Date();
        var now = d.getFullYear() + '-' + (('' + d.getMonth()).length < 2 ? '0' : '') + d.getMonth() + '-' + (('' + d.getDate()).length < 2 ? '0' : '') + d.getDate();
        var form = this;

        if (this.isNew) {
            var sModel = new Session();
            sModel.set({
                status:"open",
                company:form.$el.find('#company_name').val(),
                company_size:parseInt(form.$el.find('#company_sizes_select option:selected').val()),
                company_industry:parseInt(form.$el.find('#industries_select option:selected').val()),
                modified:now,
                main_contact_fname:form.$el.find('#first_name').val(),
                main_contact_lname:form.$el.find('#last_name').val(),
                main_contact_role:form.$el.find('#job_role').val(),
                assessment_id:parseInt(form.$el.find('#assessments_select option:selected').val())
            });
            app.sessionList.create(sModel, {
                success:function (response) {
                    app.sessionView.openSessions.addItem(response);
                    app.currentSession = app.sessionList.get(response.id);
                    app.assessmentList.currentCategory = 1;
                    if (app.assessmentView != null) {
                        app.assessmentView.close();
                    }
                    app.assessmentView = new AssessmentView({model:new Assessment()});
                    app.assessmentView.model.fetch({success:function () {
                            app.assessmentView.render();
                            app.setState(app.assessmentView);
                        }
                    });
                }
            });
        }   else    {
            app.currentSession.set({
                status:"open",
                company:form.$el.find('#company_name').val(),
                company_size:parseInt(form.$el.find('#company_sizes_select option:selected').val()),
                company_industry:parseInt(form.$el.find('#industries_select option:selected').val()),
                modified:now,
                main_contact_fname:form.$el.find('#first_name').val(),
                main_contact_lname:form.$el.find('#last_name').val(),
                main_contact_role:form.$el.find('#job_role').val(),
                assessment_id:parseInt(form.$el.find('#assessments_select option:selected').val())
            });
            app.currentSession.save(null, {success:function (response) {
                var obj = (response.attributes);
                for (var key in obj) {
                  if (obj.hasOwnProperty(key)) {
                    //console.log(key + " -> " + obj[key]);
                  }
                }
                var list = app.currentSession.get("interviewees_list");
                for(var i=0;i<list.length;i++)   {
                    if(parseInt(list[i].id) == parseInt(app.currentSession.get("main_contact")))    {
                        list[i].fname = form.$el.find('#first_name').val();
                        list[i].lname = form.$el.find('#last_name').val();
                        list[i].role = form.$el.find('#job_role').val();
                        break;
                    }
                }
                app.currentSession.set("interviewees_list", list);
                app.sessionView.openSessions.render();
                app.sessionView.closedSessions.render();
                app.setState(app.sessionView);
            }, error:function (e) {
                console.log("error: " + e);
            }
        });
        }
        return false;
    },
    render:function (eventName) {
        _.each(this.options.industries.models, function (session) {
            this.$el.html(this.template(session.attributes));
        }, this);
        if(this.model.get("company") != "") {
            this.isNew = false;
            this.$el.find("#company_name").val(this.model.get("company"));
            this.$el.find("#first_name").val(this.model.get("main_contact_fname"));
            this.$el.find("#last_name").val(this.model.get("main_contact_lname"));
            this.$el.find("#job_role").val(this.model.get("main_contact_role"));
            this.$el.find("#company_sizes_select").val(this.model.get("company_size"));
            this.$el.find("#industries_select").val(this.model.get("company_industry"));
        }   else    {
            this.isNew = true;;
        }
        this.addEventHandlers();
        $("#form_content").niceScroll({cursorcolor:"#c1c1c1", cursorborder:"1px solid #c1c1c1", cursorwidth:"11px", cursoropacitymax:.8, cursorborderradius: "6px", cursorminheight: 100});
        return this;
    },
    addEventHandlers:function () {

        this.$el.find("#active_button").click(function(e)    {
            e.preventDefault();
            app.setState(app.sessionView);
            app.sessionView.$el.find("#active_button").click();
            app.startInterval();
        });
        this.$el.find("#closed_button").click(function(e)    {
            e.preventDefault();
            app.sessionView.$el.find("#closed_button").click();
            app.setState(app.sessionView);
            app.startInterval();
        });
        this.$el.find("#close_button").click(function(e)    {
            e.preventDefault();
            app.setState(app.sessionView);
            app.startInterval();
        });

        this.$el.find("#home_button").click(function (e) {
            e.preventDefault();
            app.setState(app.sessionView);
            app.startInterval();
        });

        $(function() {
            var input = $('input[type=text]');
            input.focus(function() {
                var el = $(this);
                if(el.val() == el.attr('data-default'))    {
                    $(this).val('');
                }
            }).blur(function() {
                    var el = $(this);
                    if(el.val() == '')  {
                        el.val(el.attr('data-default'));
                    }
                });
        });
    }
});