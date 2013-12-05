/**
 * Created with JetBrains PhpStorm.
 * User: KSonger
 * Date: 8/21/12
 * Time: 3:01 PM
 * To change this template use File | Settings | File Templates.
 */
window.CategoryView = Backbone.View.extend({

    initialize:function () {
        this.template = _.template(tpl.get('category'));
    },

    events: {

    },

    render:function () {
        this.questions = [];
        this.currentQuestion = 0;
        this.$el.attr("id", "category_div");
        this.$el.html('');
        this.$el.css({"align":"center", "text-align":"center", "padding-left":"60px", "padding-right":"40px"});
        this.$el.html(this.template(this.model));
        for(var i = 0;i<this.model.questions.length;i++)   {
            if(this.model.questions[i].category == this.model.id)   {
                var ques = new QuestionView({model:this.model.questions[i]});
                ques.render().$el.appendTo(this.$el.find(".category"));
                var ntxt = i+1 + ") ";
                ques.$el.find(".number_text").html(ntxt);
                this.questions.push(ques);
            }
        }
        return this;
    }
});