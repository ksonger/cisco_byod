/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 9/5/12
 * Time: 3:04 PM
 * To change this template use File | Settings | File Templates.
 */
window.ListCategoryItemView = Backbone.View.extend({
    initialize:function () {
       this.template = _.template(tpl.get('list-category-item'));
    },
    events: {

    },
    render:function (eventName) {
        $(this.el).html(this.template(this.model));
        return this;
    }
});