/**
 * Created with JetBrains PhpStorm.
 * User: KSonger
 * Date: 8/21/12
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
window.QuestionView = Backbone.View.extend({
    initialize:function () {

    },
    events:{

    },
    change:function () {
        var responseObj = [];
        for (var i = 0; i < app.assessmentView.categories.length; i++) {
            for (var j = 0; j < app.assessmentView.categories[i].questions.length; j++) {
                for (var k = 0; k < app.assessmentView.categories[i].questions[j].selectedAnswers.length; k++) {
                    responseObj.push(app.assessmentView.categories[i].questions[j].selectedAnswers[k])
                }
            }
        }
        app.currentSession.save("responses", JSON.stringify(responseObj), {success:function () {
        }, error:function (e) {
        }});
       app.assessmentView.updateBar();
       app.assessmentView.assessmentAccordion.setQuestionClass(this.model.id, this.selectedAnswers.length);
    },
    answers:[],
    selectedAnswers:[],
    selectedInterviewee:null,
    setSelected:function () {
        var selections = jQuery.parseJSON(app.currentSession.get("responses"));
        if (selections != null) {
            for (var i = 0; i < selections.length; i++) {
                if (selections[i].question_id == this.model.id) {
                    this.selectedAnswers.push(selections[i]);
                    for (var j = 0; j < this.answers.length; j++) {
                        var actual_id = selections[i].id.replace("answer_", "");
                        if (parseInt(this.answers[j].model.id) == parseInt(actual_id)) {
                            this.answers[j].setValue(selections[i]);
                        }
                    }
                    if(this.selectedInterviewee == null && selections[i].answered_by != null)   {
                        this.selectedInterviewee = selections[i].answered_by;
                    }
                }
            }
        }
    },
    render:function (eventName) {
        this.selectedAnswers = [];
        this.$el.html('');
        this.template = _.template(tpl.get("question_" + this.model.type.toLowerCase()));
        this.$el.html(this.template(this.model));
        for (var i = 0; i < this.model.answers.length; i++) {
            var ans = new AnswerView({model:this.model.answers[i], question:this});
            ans.render().$el.appendTo(this.$el.find("#answers"));
            this.answers.push(ans);
        }
        this.$el.attr({"class":"question"});
        this.setSelected();

        return this;
    }
});
