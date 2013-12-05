window.HeaderView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('header'));
    },

    events: {
        "click .home_button":"goHome"
    },

    render:function () {
        this.$el.attr("id", "header_div");
        this.$el.html(this.template());
        return this;
    },

    goHome:function(){
        app.setState(app.sessionView);
    }
});