/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 12:43 PM
 * To change this template use File | Settings | File Templates.
 */
window.AccordionItemView = Backbone.View.extend({

    tagName:"div",

    initialize:function () {
        this.template = _.template(tpl.get('session-list-item'));
    },
    render:function (eventName) {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});