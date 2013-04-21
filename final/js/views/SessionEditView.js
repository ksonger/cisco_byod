/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/17/12
 * Time: 9:50 AM
 * To change this template use File | Settings | File Templates.
 */
window.SessionEditView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('session-edit-view'));
    },
    events:{
        "click .form_save":"saveSession"
    },
    render:function (eventName) {
        this.$el.html('');
        this.$el.attr("id", "session_edit_main");
        _.each(this.options.industries.models, function (session) {
            this.$el.html(this.template(session.attributes));
        }, this);
            this.$el.find("#company_name").val(this.model.get("company"));
            this.$el.find("#first_name").val(this.model.get("main_contact_fname"));
            this.$el.find("#last_name").val(this.model.get("main_contact_lname"));
            this.$el.find("#job_role").val(this.model.get("main_contact_role"));
            this.$el.find("#company_sizes_select").val(this.model.get("company_size"));
            this.$el.find("#industries_select").val(this.model.get("company_industry"));
            TweenLite.to(this.$el,.01, {css:{autoAlpha:0}, ease:Sine.easeOut});
        this.addEventHandlers();
        $("#session_edit_main").niceScroll({cursorcolor:"#c1c1c1", cursorborder:"1px solid #c1c1c1", cursorwidth:"11px", cursoropacitymax:.8, cursorborderradius: "6px", cursorminheight: 100});
        return this;
    },
    saveSession:function () {
        var d = new Date();
        var now = d.getFullYear() + '-' + (('' + d.getMonth()).length < 2 ? '0' : '') + d.getMonth() + '-' + (('' + d.getDate()).length < 2 ? '0' : '') + d.getDate();
        var edit = this;
            app.currentSession.set({
                status:"open",
                company:edit.$el.find('#company_name').val(),
                company_size:parseInt(edit.$el.find('#company_sizes_select option:selected').val()),
                company_industry:parseInt(edit.$el.find('#industries_select option:selected').val()),
                modified:now,
                main_contact_fname:edit.$el.find('#first_name').val(),
                main_contact_lname:edit.$el.find('#last_name').val(),
                main_contact_role:edit.$el.find('#job_role').val(),
                assessment_id:parseInt(edit.$el.find('#assessments_select option:selected').val())
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
                        list[i].fname = edit.$el.find('#first_name').val();
                        list[i].lname = edit.$el.find('#last_name').val();
                        list[i].role = edit.$el.find('#job_role').val();
                        break;
                    }
                }
                app.currentSession.set("interviewees_list", list);
                app.sessionView.openSessions.render();
                app.sessionView.closedSessions.render();
                app.assessmentView.hideEdit();
                app.assessmentView.edit_session_expanded = !app.assessmentView.edit_session_expanded;
            }, error:function (e) {
                console.log("error: " + e);
            }
        });
        return false;
    },
    addEventHandlers:function () {
        this.$el.find("#close_button").click(function() {
            app.assessmentView.hideEdit();
            app.assessmentView.edit_session_expanded = false;
        });
    }
});