/**
 * Created with JetBrains PhpStorm.
 * User: KSonger
 * Date: 8/21/12
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
window.MainContentBorderView = Backbone.View.extend({
    initialize:function () {

    },

    render:function () {
        this.$el.html('');
        this.template = _.template(tpl.get("main-content-border"));
        this.$el.html(this.template()).appendTo("#main");
        return this;
    }
});
