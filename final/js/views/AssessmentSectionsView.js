/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
window.AssessmentSectionsView = Backbone.View.extend({
    initialize:function () {
        this.template = _.template(tpl.get('assessment-sections'));
        var self = this;
        this.$el = jQuery('<div/>', {
            id:"sections"
        }).appendTo("#main");
    },
    appState:"assessment-sections",
    active:"inactive",
    onEnter:function () {
        $("#sections").getNiceScroll().show();
    },
    onExit:function () {
        $("#sections").getNiceScroll().hide();
    },
    render:function (eventName) {
        this.$el.html('');
        TweenLite.to(this.$el, .01, {css:{autoAlpha:0}});
        this.$el.html(this.template(this.model.attributes));
        this.addEventHandlers();
        $("#sections").niceScroll({cursorcolor:"#0b3e6f", cursorborder:"none", cursorwidth:"9px"});
        return this;
    },
    addEventHandlers:function () {
        var sects = this;
        this.$el.find('.assessment_section_tile').each(function () {
            $(this).click(function (e) {
                app.assessmentList.currentCategory = parseInt(this.id);
                if(app.assessmentView != null)    {
                    app.assessmentView.close();
                }
                app.assessmentView = new AssessmentView({model:new Assessment()});
                app.assessmentView.model.fetch({success:function () {
                    app.assessmentView.render();
                    app.setState(app.assessmentView);
                }});
            });
        });
    }
});